import type { IncomingMessage, ServerResponse } from "node:http";

// In-memory idempotency cache
const processedPaymentIds = new Set<string>();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Stripe-Signature");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", async () => {
    try {
      const payload = JSON.parse(body || "{}");
      const { payment_id, amount_cents, currency, profile_id, current_expires_at } = payload;

      // 1. Validate payment idempotency
      if (!payment_id) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "payment_id is required" }));
        return;
      }

      if (processedPaymentIds.has(payment_id)) {
        res.statusCode = 200;
        res.end(JSON.stringify({ message: "Webhook already processed (idempotent duplicate)" }));
        return;
      }

      // 2. Validate payment amount & currency ($1.00 USD)
      if (amount_cents !== 100 || currency?.toUpperCase() !== "USD") {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid payment amount or currency. Required: 100 cents USD." }));
        return;
      }

      // 3. Calculate 24-Hour Promotion Window (Extension logic if already active)
      const now = Date.now();
      let startsAt = new Date(now).toISOString();
      let endsAt: string;

      const durationMs = 24 * 60 * 60 * 1000; // 24 hours

      if (current_expires_at && new Date(current_expires_at).getTime() > now) {
        // Extend existing promotion by 24 hours
        const currentEndMs = new Date(current_expires_at).getTime();
        endsAt = new Date(currentEndMs + durationMs).toISOString();
      } else {
        // Fresh 24-hour promotion
        endsAt = new Date(now + durationMs).toISOString();
      }

      processedPaymentIds.add(payment_id);

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        promotion: {
          profile_id,
          payment_id,
          status: "active",
          amount_cents: 100,
          currency: "USD",
          starts_at: startsAt,
          ends_at: endsAt,
          created_at: new Date().toISOString(),
        }
      }));
    } catch (e: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e.message || "Webhook processing error" }));
    }
  });
}
