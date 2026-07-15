import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { Resend } from "resend";
import { sendMetaPurchaseEvent, getClientIp, META_PIXEL_ID } from "./metaCapi.js";

dotenv.config();

export const app = express();
const PORT = 3000;
const ORDERS_FILE = path.join(process.cwd(), "orders.json");
app.use(express.json());

let orders: any[] = fs.existsSync(ORDERS_FILE)
  ? JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"))
  : [];

const saveOrders = () => fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");

const resendApiKey = process.env.RESEND_API_KEY || "";
const resendFromEmail = process.env.RESEND_FROM_EMAIL || "ventas@xiaomicartech.com.co";
const resendAdminEmail = process.env.RESEND_ADMIN_EMAIL || "ventas@xiaomicartech.com.co";
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;
const wompiPublicKey = process.env.WOMPI_PUBLIC_KEY || "";
const wompiPrivateKey = process.env.WOMPI_PRIVATE_KEY || "";
const wompiIntegritySecret = process.env.WOMPI_INTEGRITY_SECRET || "";
const wompiEventsSecret = process.env.WOMPI_EVENTS_SECRET || "";

// --- Autenticación de administración (server-side) ---
// Antes: las credenciales vivían en el cliente y los endpoints de pedidos no tenían
// ninguna comprobación → cualquiera podía leer los datos de todos los clientes y
// aprobar/borrar pedidos. Ahora se valida un token firmado en el servidor.
const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || "";
// Secreto para firmar tokens de sesión. Si no se define, se genera uno efímero por
// proceso (los tokens se invalidan al reiniciar, pero nunca hay un secreto por defecto).
const adminSecret = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const adminConfigured = Boolean(adminEmail && adminPassword);

const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest();
const safeEqual = (a: string, b: string) => crypto.timingSafeEqual(sha256(a), sha256(b));

const signToken = (payload: Record<string, unknown>) => {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", adminSecret).update(body).digest("base64url");
  return `${body}.${sig}`;
};
const verifyToken = (token: string): Record<string, unknown> | null => {
  const [body, sig] = (token || "").split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", adminSecret).update(body).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
};
const requireAdmin: express.RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!verifyToken(token)) return res.status(401).json({ error: "No autorizado" });
  next();
};

// Login: valida credenciales del servidor (nunca del cliente) y devuelve un token firmado.
app.post("/api/admin/login", (req, res) => {
  if (!adminConfigured) {
    return res.status(503).json({ error: "Administración no configurada en el servidor" });
  }
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!safeEqual(email, adminEmail) || !safeEqual(password, adminPassword)) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }
  const token = signToken({ sub: "admin", exp: Date.now() + 8 * 60 * 60 * 1000 });
  res.json({ token });
});
const appUrl = process.env.APP_URL || "https://xiaomicartech.com.co";

const addBusinessDays = (date: Date, businessDays: number) => {
  const d = new Date(date);
  let added = 0;
  while (added < businessDays) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return d.toISOString();
};

const sendApprovedEmail = async (order: any) => {
  if (!resendClient) {
    console.warn(`[RESEND_SIMULATION] Compra aprobada ${order.id} para ${order.customerEmail}`);
    return { sent: false, simulation: true };
  }

  const response = await resendClient.emails.send({
    from: `Xiaomi CarTech <${resendFromEmail}>`,
    to: [order.customerEmail],
    cc: [resendAdminEmail],
    subject: `Compra aprobada ${order.id} - Xiaomi CarTech`,
    html: `
      <h2>Compra exitosa ✅</h2>
      <p>Tu pago fue aprobado por Wompi.</p>
      <p><strong>Pedido:</strong> ${order.id}</p>
      <p><strong>Total:</strong> $${Number(order.amount).toLocaleString("es-CO")} COP</p>
      <p><strong>Método:</strong> ${order.paymentMethod}</p>
      <p><strong>Fecha esperada de envío:</strong> ${new Date(order.expectedShipDate).toLocaleDateString("es-CO")}</p>
    `
  });

  return { sent: true, simulation: false, response };
};

app.get("/api/config", (req, res) => {
  res.json({
    wompiPublicKey,
    appUrl,
    hasWompiConfig: !!(wompiPublicKey && wompiIntegritySecret),
    emailConfigurationActive: !!resendClient,
    resendFromEmail,
    resendAdminEmail
  });
});

app.get("/api/health/integrations", (req, res) => {
  res.json({
    wompi: {
      publicKeyConfigured: !!wompiPublicKey,
      integritySecretConfigured: !!wompiIntegritySecret,
      eventsSecretConfigured: !!wompiEventsSecret
    },
    resend: {
      apiKeyConfigured: !!resendApiKey,
      fromEmail: resendFromEmail,
      adminEmail: resendAdminEmail
    },
    meta: {
      pixelId: META_PIXEL_ID,
      capiTokenConfigured: !!process.env.META_CAPI_ACCESS_TOKEN,
      testEventCode: process.env.META_TEST_EVENT_CODE || null
    }
  });
});

app.get("/api/orders", requireAdmin, (req, res) => {
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sorted);
});

app.post("/api/orders", async (req, res) => {
  const { customerName, customerEmail, customerPhone, customerAddress, customerCity, amount, items, paymentMethod = "Wompi", fbp, fbc } = req.body;

  if (!customerName || !customerEmail || !customerPhone || !amount || !items?.length) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const id = `XM-${Math.floor(10000 + Math.random() * 90000)}`;
  const reference = `XCT-${id}-${Date.now()}`;
  const signature = crypto
    .createHash("sha256")
    .update(`${reference}${amount}COP${wompiIntegritySecret}`)
    .digest("hex");

  const order = {
    id,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    customerCity,
    paymentMethod,
    amount,
    items,
    status: "PENDING",
    shippingStatus: "PENDING",
    expectedShipDate: addBusinessDays(new Date(), 2),
    createdAt: new Date().toISOString(),
    paymentDetails: { transactionId: reference },
    metaTracking: { fbp, fbc, clientIp: getClientIp(req), userAgent: req.headers["user-agent"] }
  };

  orders.push(order);
  saveOrders();

  if (paymentMethod === "Contra entrega") {
    await sendMetaPurchaseEvent({
      eventId: reference,
      orderId: id,
      value: amount,
      currency: "COP",
      customerEmail,
      customerPhone,
      fbp,
      fbc,
      clientIp: order.metaTracking.clientIp,
      userAgent: order.metaTracking.userAgent
    });
  }

  res.json({
    success: true,
    order,
    wompi: {
      reference,
      amountInCents: amount,
      currency: "COP",
      signature,
      redirectUrl: `${appUrl}/?checkout=success&orderId=${id}`
    }
  });
});

app.post("/api/wompi/webhook", async (req, res) => {
  if (wompiEventsSecret && req.headers["x-event-checksum"] !== wompiEventsSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const event = req.body?.event;
  if (event !== "transaction.updated") return res.json({ ok: true });

  const data = req.body?.data?.transaction;
  const reference = data?.reference;
  const status = data?.status;
  const order = orders.find((o) => o.paymentDetails?.transactionId === reference);

  if (!order) return res.json({ ok: true });

  if (status === "APPROVED") {
    order.status = "APPROVED";
    order.paymentDetails.wompiTransactionId = data.id;
  } else if (["DECLINED", "ERROR", "VOIDED"].includes(status)) {
    order.status = "DECLINED";
  }

  saveOrders();

  if (status === "APPROVED") {
    try {
      const emailResult = await sendApprovedEmail(order);
      console.log("[RESEND] approved order notification result:", emailResult);
    } catch (error) {
      console.error("[RESEND] failed to send approved notification:", error);
    }

    await sendMetaPurchaseEvent({
      eventId: reference,
      orderId: order.id,
      value: order.amount,
      currency: "COP",
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      fbp: order.metaTracking?.fbp,
      fbc: order.metaTracking?.fbc,
      clientIp: order.metaTracking?.clientIp,
      userAgent: order.metaTracking?.userAgent
    });
  }

  res.json({ ok: true });
});

app.put("/api/orders/:id/status", requireAdmin, (req, res) => {
  const order = orders.find((x) => x.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
  if (!["PENDING", "APPROVED", "DECLINED"].includes(req.body.status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  order.status = req.body.status;
  saveOrders();
  res.json({ success: true, order });
});

app.put("/api/orders/:id/shipping", requireAdmin, (req, res) => {
  const order = orders.find((x) => x.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido no encontrado" });

  const { shippingStatus, shippingEvidenceUrl } = req.body;
  if (!["PENDING", "SHIPPED"].includes(shippingStatus)) {
    return res.status(400).json({ error: "Estado de envío inválido" });
  }

  order.shippingStatus = shippingStatus;
  if (shippingStatus === "SHIPPED") {
    order.shippedAt = new Date().toISOString();
    order.shippingEvidenceUrl = shippingEvidenceUrl || "";
  }

  saveOrders();
  res.json({ success: true, order });
});

app.delete("/api/orders/:id", requireAdmin, (req, res) => {
  orders = orders.filter((x) => x.id !== req.params.id);
  saveOrders();
  res.json({ success: true });
});

export async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`listening ${PORT}`));
}

if (!process.env.VERCEL) {
  start();
}
