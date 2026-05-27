import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const ORDERS_FILE = "/tmp/orders.json";
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
const wompiIntegritySecret = process.env.WOMPI_INTEGRITY_SECRET || "";
const wompiEventsSecret = process.env.WOMPI_EVENTS_SECRET || "";
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
  if (!resendClient) return { sent: false, simulation: true };
  const response = await resendClient.emails.send({
    from: `Xiaomi CarTech <${resendFromEmail}>`,
    to: [order.customerEmail],
    cc: [resendAdminEmail],
    subject: `Compra aprobada ${order.id} - Xiaomi CarTech`,
    html: `<h2>Compra exitosa ✅</h2><p>Tu pago fue aprobado por Wompi.</p><p><strong>Pedido:</strong> ${order.id}</p><p><strong>Total:</strong> $${Number(order.amount).toLocaleString("es-CO")} COP</p>`
  });
  return { sent: true, response };
};

app.get("/api/config", (req: any, res: any) => {
  res.json({ wompiPublicKey, appUrl, hasWompiConfig: !!(wompiPublicKey && wompiIntegritySecret), emailConfigurationActive: !!resendClient });
});

app.get("/api/orders", (req: any, res: any) => {
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sorted);
});

app.post("/api/orders", (req: any, res: any) => {
  const { customerName, customerEmail, customerPhone, customerAddress, customerCity, amount, items, paymentMethod = "Wompi" } = req.body;
  if (!customerName || !customerEmail || !customerPhone || !amount || !items?.length) {
    return res.status(400).json({ error: "Datos incompletos" });
  }
  const id = `XM-${Math.floor(10000 + Math.random() * 90000)}`;
  const reference = `XCT-${id}-${Date.now()}`;
  const signature = crypto.createHash("sha256").update(`${reference}${amount}COP${wompiIntegritySecret}`).digest("hex");
  const order = {
    id, customerName, customerEmail, customerPhone, customerAddress, customerCity, paymentMethod,
    amount, items, status: "PENDING", shippingStatus: "PENDING",
    expectedShipDate: addBusinessDays(new Date(), 2),
    createdAt: new Date().toISOString(),
    paymentDetails: { transactionId: reference }
  };
  orders.push(order);
  saveOrders();
  const amountInCents = amount * 100;
  const signatureInCents = crypto.createHash("sha256").update("${reference}${amountInCents}COP${wompiIntegritySecret}").digest("hex");
  res.json({ success: true, order, wompi: { reference, amountInCents, currency: "COP", signature: signatureInCents, redirectUrl: "${appUrl}/?checkout=success&orderId=${id}" } });
});

app.post("/api/wompi/webhook", async (req: any, res: any) => {
  if (wompiEventsSecret && req.headers["x-event-checksum"] !== wompiEventsSecret) return res.status(401).json({ error: "Unauthorized" });
  const event = req.body?.event;
  if (event !== "transaction.updated") return res.json({ ok: true });
  const data = req.body?.data?.transaction;
  const order = orders.find((o) => o.paymentDetails?.transactionId === data?.reference);
  if (!order) return res.json({ ok: true });
  if (data?.status === "APPROVED") { order.status = "APPROVED"; order.paymentDetails.wompiTransactionId = data.id; }
  else if (["DECLINED", "ERROR", "VOIDED"].includes(data?.status)) { order.status = "DECLINED"; }
  saveOrders();
  if (data?.status === "APPROVED") { try { await sendApprovedEmail(order); } catch (e) { console.error(e); } }
  res.json({ ok: true });
});

app.put("/api/orders/:id/status", (req: any, res: any) => {
  const order = orders.find((x) => x.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
  order.status = req.body.status;
  saveOrders();
  res.json({ success: true, order });
});

app.put("/api/orders/:id/shipping", (req: any, res: any) => {
  const order = orders.find((x) => x.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
  const { shippingStatus, shippingEvidenceUrl } = req.body;
  order.shippingStatus = shippingStatus;
  if (shippingStatus === "SHIPPED") { order.shippedAt = new Date().toISOString(); order.shippingEvidenceUrl = shippingEvidenceUrl || ""; }
  saveOrders();
  res.json({ success: true, order });
});

app.delete("/api/orders/:id", (req: any, res: any) => {
  orders = orders.filter((x) => x.id !== req.params.id);
  saveOrders();
  res.json({ success: true });
});

export default app;

