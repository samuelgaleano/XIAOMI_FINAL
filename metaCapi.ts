import crypto from "crypto";

const META_PIXEL_ID = "1362889325944564";
const META_API_VERSION = "v21.0";
const PRODUCT_CONTENT_ID = "MI-20W-CAR-CHARGER";

const hashValue = (value: string): string =>
  crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

const normalizePhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("57")) return digits;
  return `57${digits.replace(/^0+/, "")}`;
};

export interface MetaPurchaseEventInput {
  eventId: string;
  orderId: string;
  value: number;
  currency: string;
  customerEmail: string;
  customerPhone: string;
  eventSourceUrl?: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
}

/**
 * Sends a server-side Purchase event to Meta's Conversions API.
 * Never throws — a Meta API/network failure must never break order
 * creation or the Wompi webhook response.
 */
export async function sendMetaPurchaseEvent(input: MetaPurchaseEventInput): Promise<void> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn(`[META_CAPI] META_CAPI_ACCESS_TOKEN no configurado, se omite Purchase para el pedido ${input.orderId}`);
    return;
  }

  try {
    const userData: Record<string, unknown> = {
      em: [hashValue(input.customerEmail)],
      ph: [hashValue(normalizePhone(input.customerPhone))],
    };
    if (input.fbp) userData.fbp = input.fbp;
    if (input.fbc) userData.fbc = input.fbc;
    if (input.clientIp) userData.client_ip_address = input.clientIp;
    if (input.userAgent) userData.client_user_agent = input.userAgent;

    const body: Record<string, unknown> = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: input.eventId,
          action_source: "website",
          event_source_url: input.eventSourceUrl || process.env.APP_URL || "https://xiaomicartech.com.co",
          user_data: userData,
          custom_data: {
            currency: input.currency,
            value: input.value,
            order_id: input.orderId,
            content_ids: [PRODUCT_CONTENT_ID],
            content_type: "product",
          },
        },
      ],
    };
    if (process.env.META_TEST_EVENT_CODE) {
      body.test_event_code = process.env.META_TEST_EVENT_CODE;
    }

    const response = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json().catch(() => null);
    if (!response.ok) {
      console.error(`[META_CAPI] error enviando Purchase para pedido ${input.orderId}:`, result);
    } else {
      console.log(`[META_CAPI] Purchase enviado para pedido ${input.orderId} (event_id ${input.eventId}):`, result);
    }
  } catch (error) {
    console.error(`[META_CAPI] excepcion enviando Purchase para pedido ${input.orderId}:`, error);
  }
}

export const getClientIp = (req: { headers: Record<string, unknown>; ip?: string }): string | undefined => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) return forwarded.split(",")[0].trim();
  return req.ip;
};
