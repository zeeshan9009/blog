import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";
import { verifyProfilePromotionEligibility } from "../../src/services/ranking/antiAbuse.js";
import { INITIAL_PROFESSIONALS } from "../../src/data/mockTalentData.js";
import {
  SPONSORED_BOOST_PRICE_CENTS,
  SPONSORED_BOOST_PRICE_USD,
  SPONSORED_BOOST_DURATION_HOURS,
  SPONSORED_BOOST_CURRENCY
} from "../../src/config/pricing.js";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2025-02-24.acacia" as any }) : null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");

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
      const { profileId, successUrl, cancelUrl } = data;

      if (!profileId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "profileId is required" }));
        return;
      }

      // Check profile eligibility
      const targetProfile = INITIAL_PROFESSIONALS.find(p => p.id === profileId) || {
        id: profileId,
        name: 'Professional',
        title: 'Developer',
        category: 'Web Development',
        location: 'Global',
        country: 'Global',
        avatar: '',
        bio: 'Professional background',
        hourlyRate: 50,
        experienceYears: 3,
        score: 85,
        rating: 5.0,
        reviewCount: 0,
        skills: ['TypeScript', 'Node.js', 'React'],
        experience: [],
        portfolio: [],
        reviews: [],
        externalLinks: {},
        isVerified: true,
        isPromoted: false,
        viewsCount: 0,
        clicksCount: 0,
        inquiriesCount: 0,
        createdAt: new Date().toISOString()
      };

      const eligibility = verifyProfilePromotionEligibility(targetProfile as any);
      if (!eligibility.isEligible) {
        res.statusCode = 422;
        res.end(JSON.stringify({
          error: "Profile not eligible for promotion",
          reasons: eligibility.reasons,
        }));
        return;
      }

      // Server enforces centralized $2.00 USD (200 cents) and 24h duration
      const host = req.headers.host || "localhost:5173";
      const protocol = host.includes("localhost") ? "http" : "https";

      if (stripe) {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "usd",
                unit_amount: SPONSORED_BOOST_PRICE_CENTS, // Exactly $2.00 USD (200 cents)
                product_data: {
                  name: `ProRank ${SPONSORED_BOOST_DURATION_HOURS}-Hour Sponsored Visibility`,
                  description: `${SPONSORED_BOOST_DURATION_HOURS}-hour sponsored placement across relevant searches on ProRank`,
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            profile_id: profileId,
            duration_hours: String(SPONSORED_BOOST_DURATION_HOURS),
            service: "prorank_promotion"
          },
          success_url: successUrl || `${protocol}://${host}/dashboard/promotion?session_id={CHECKOUT_SESSION_ID}&success=true`,
          cancel_url: cancelUrl || `${protocol}://${host}/dashboard/promotion?cancelled=true`,
        });

        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          session: {
            id: session.id,
            checkout_url: session.url,
            amount_cents: SPONSORED_BOOST_PRICE_CENTS,
            currency: SPONSORED_BOOST_CURRENCY,
            duration_hours: SPONSORED_BOOST_DURATION_HOURS,
            profile_id: profileId,
            created_at: new Date().toISOString()
          },
        }));
        return;
      }

      // Fallback structured sandbox response for local development
      const intentId = "pi_" + Math.random().toString(36).substring(2, 15);
      const checkoutSession = {
        id: "cs_" + Math.random().toString(36).substring(2, 15),
        payment_intent: intentId,
        amount_cents: SPONSORED_BOOST_PRICE_CENTS, // Exactly $2.00 (200 cents)
        currency: SPONSORED_BOOST_CURRENCY,
        duration_hours: SPONSORED_BOOST_DURATION_HOURS,
        profile_id: profileId,
        checkout_url: `${protocol}://${host}/dashboard/promotion?demo_payment=success&profile_id=${profileId}`,
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
