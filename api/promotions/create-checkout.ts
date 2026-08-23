import type { IncomingMessage, ServerResponse } from "node:http";
import { verifyProfilePromotionEligibility } from "../../src/services/ranking/antiAbuse";
import { INITIAL_PROFESSIONALS } from "../../src/data/mockTalentData";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
      const data = JSON.parse(body || "{}");
      const { profileId } = data;

      if (!profileId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "profileId is required" }));
        return;
      }

      // Check profile eligibility
      const targetProfile = INITIAL_PROFESSIONALS.find(p => p.id === profileId);
      if (!targetProfile) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Profile not found" }));
        return;
      }

      const eligibility = verifyProfilePromotionEligibility(targetProfile);
      if (!eligibility.isEligible) {
        res.statusCode = 422;
        res.end(JSON.stringify({
          error: "Profile not eligible for promotion",
          reasons: eligibility.reasons,
        }));
        return;
      }

      // Server enforces fixed $1.00 USD (100 cents) and 24h duration
      const intentId = "pi_" + Math.random().toString(36).substring(2, 15);
      const checkoutSession = {
        id: "cs_" + Math.random().toString(36).substring(2, 15),
        payment_intent: intentId,
        amount_cents: 100, // Exactly $1.00
        currency: "USD",
        duration_hours: 24,
        profile_id: profileId,
        checkout_url: `https://checkout.stripe.com/pay/${intentId}`,
        created_at: new Date().toISOString(),
      };

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        session: checkoutSession,
      }));
    } catch (e: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e.message || "Failed to create checkout" }));
    }
  });
}
