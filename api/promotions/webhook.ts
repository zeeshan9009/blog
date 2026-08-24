import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import {
  SPONSORED_BOOST_PRICE_CENTS,
  SPONSORED_BOOST_CURRENCY,
  SPONSORED_BOOST_DURATION_HOURS
} from "../../src/config/pricing";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2025-02-24.acacia" as any }) : null;

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// In-memory idempotency cache fallback
const processedPaymentIds = new Set<string>();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Stripe-Signature");
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
      let event: Stripe.Event | null = null;

      // 1. Signature Verification if Webhook Secret is present
      const sig = req.headers["stripe-signature"] as string;
      if (stripe && webhookSecret && sig) {
        try {
          event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        } catch (err: any) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: `Webhook Signature Verification Failed: ${err.message}` }));
          return;
        }
      }

      let paymentId: string;
      let profileId: string;
      let amountCents: number = SPONSORED_BOOST_PRICE_CENTS;
      let currency: string = SPONSORED_BOOST_CURRENCY;

      if (event && event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        paymentId = session.payment_intent as string || session.id;
        profileId = session.metadata?.profile_id || "";
        amountCents = session.amount_total || SPONSORED_BOOST_PRICE_CENTS;
        currency = session.currency?.toUpperCase() || SPONSORED_BOOST_CURRENCY;
      } else {
        const payload = JSON.parse(body || "{}");
        paymentId = payload.payment_id;
        profileId = payload.profile_id;
        amountCents = payload.amount_cents || SPONSORED_BOOST_PRICE_CENTS;
        currency = payload.currency?.toUpperCase() || SPONSORED_BOOST_CURRENCY;
      }

      if (!paymentId || !profileId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "payment_id and profile_id are required" }));
        return;
      }

      // 2. Validate payment idempotency
      if (processedPaymentIds.has(paymentId)) {
        res.statusCode = 200;
        res.end(JSON.stringify({ message: "Webhook already processed (idempotent duplicate)" }));
        return;
      }

      // 3. Validate payment amount & currency ($2.00 USD)
      if (amountCents !== SPONSORED_BOOST_PRICE_CENTS || currency !== SPONSORED_BOOST_CURRENCY) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: `Invalid payment amount or currency. Required: ${SPONSORED_BOOST_PRICE_CENTS} cents ${SPONSORED_BOOST_CURRENCY}.` }));
        return;
      }

      // 4. Calculate 24-Hour Promotion Window
      const now = Date.now();
      const startsAt = new Date(now).toISOString();
      const durationMs = SPONSORED_BOOST_DURATION_HOURS * 60 * 60 * 1000;
      const endsAt = new Date(now + durationMs).toISOString();

      processedPaymentIds.add(paymentId);

      // 5. Persist to Supabase Database
      await supabase.from("promotions").insert([{
        profile_id: profileId,
        status: "active",
        amount_cents: SPONSORED_BOOST_PRICE_CENTS,
        currency: SPONSORED_BOOST_CURRENCY,
        starts_at: startsAt,
        ends_at: endsAt,
        payment_id: paymentId,
        payment_method: "stripe"
      }]);

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        promotion: {
          profile_id: profileId,
          payment_id: paymentId,
          status: "active",
          amount_cents: SPONSORED_BOOST_PRICE_CENTS,
          currency: SPONSORED_BOOST_CURRENCY,
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
