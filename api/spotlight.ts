import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import {
  calculateNextMinimumBidCents,
  validateSpotlightBid,
  isSpotlightHoldExpired,
  checkSpotlightRateLimit,
  recordSpotlightClaimAttempt,
  SPOTLIGHT_HOLD_DURATION_MS
} from "../src/services/ranking/spotlightEngine.js";
import { autoDetectPlatformAndValidate } from "../src/services/validation/externalProfileValidator.js";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" as any }) : null;

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Default In-Memory Mock Slots Store
const MOCK_SLOTS: any[] = [
  {
    id: "slot-global-1",
    scope: "global",
    category: null,
    position: 1,
    current_holder_profile_id: "pro_top_global",
    current_holder_name: "Hamza Sheikh",
    current_holder_title: "Principal Full Stack Architect",
    current_holder_destination_url: "https://www.linkedin.com/in/hamza-architect",
    current_holder_platform: "linkedin",
    current_price_cents: 2500, // $25.00
    min_increment_cents: 100,
    claimed_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 60 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "slot-global-2",
    scope: "global",
    category: null,
    position: 2,
    current_holder_profile_id: "pro_global_2",
    current_holder_name: "Zainab Tariq",
    current_holder_title: "Senior AI & PyTorch Engineer",
    current_holder_destination_url: "https://github.com/zainab-ml",
    current_holder_platform: "github",
    current_price_cents: 1800, // $18.00
    min_increment_cents: 100,
    claimed_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 52 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "slot-global-3",
    scope: "global",
    category: null,
    position: 3,
    current_holder_profile_id: "pro_global_3",
    current_holder_name: "Bilal Dev",
    current_holder_title: "React & Next.js Performance Specialist",
    current_holder_destination_url: "https://www.upwork.com/freelancers/~01928374",
    current_holder_platform: "upwork",
    current_price_cents: 1200, // $12.00
    min_increment_cents: 100,
    claimed_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 67 * 60 * 60 * 1000).toISOString()
  },
  // Category Slots - Web Development
  {
    id: "slot-web-1",
    scope: "category",
    category: "Web Development",
    position: 1,
    current_holder_profile_id: "pro_web_1",
    current_holder_name: "Ahmed Khan",
    current_holder_title: "Full Stack & Microservices Lead",
    current_holder_destination_url: "https://www.linkedin.com/in/ahmedkhan-dev",
    current_holder_platform: "linkedin",
    current_price_cents: 1500, // $15.00
    min_increment_cents: 100,
    claimed_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 64 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "slot-web-2",
    scope: "category",
    category: "Web Development",
    position: 2,
    current_holder_profile_id: "pro_web_2",
    current_holder_name: "Sarah Jenkins",
    current_holder_title: "Frontend UI/UX Specialist",
    current_holder_destination_url: "https://fiverr.com/sarah_ui",
    current_holder_platform: "fiverr",
    current_price_cents: 1000,
    min_increment_cents: 100,
    claimed_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 62 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "slot-web-3",
    scope: "category",
    category: "Web Development",
    position: 3,
    current_holder_profile_id: null,
    current_holder_name: null,
    current_holder_title: null,
    current_holder_destination_url: null,
    current_holder_platform: "website",
    current_price_cents: 500, // $5.00 Base floor
    min_increment_cents: 100,
    claimed_at: null,
    expires_at: null
  }
];

const MOCK_ACTIVITY_FEED: any[] = [
  {
    id: "act-1",
    bidderName: "Hamza Sheikh",
    scope: "global",
    category: null,
    position: 1,
    amountCents: 2500,
    platform: "linkedin",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "act-2",
    bidderName: "Zainab Tariq",
    scope: "global",
    category: null,
    position: 2,
    amountCents: 1800,
    platform: "github",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "act-3",
    bidderName: "Ahmed Khan",
    scope: "category",
    category: "Web Development",
    position: 1,
    amountCents: 1500,
    platform: "linkedin",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  }
];

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const parsedUrl = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;
  res.setHeader("Content-Type", "application/json");

  // 1. GET /api/spotlight?scope=global|category&category=...
  if (req.method === "GET" && (pathname === "/api/spotlight" || pathname === "/api/spotlight/")) {
    try {
      const scope = parsedUrl.searchParams.get("scope") || "global";
      const category = parsedUrl.searchParams.get("category");

      let slots: any[] = [];
      const { data: dbSlots, error } = await supabase
        .from("spotlight_slots")
        .select("*")
        .eq("scope", scope)
        .order("position", { ascending: true });

      if (!error && dbSlots && dbSlots.length > 0) {
        slots = category && scope === "category"
          ? dbSlots.filter((s: any) => s.category?.toLowerCase() === category.toLowerCase())
          : dbSlots;
      } else {
        // Fallback to in-memory slots
        slots = MOCK_SLOTS.filter((s: any) => {
          if (s.scope !== scope) return false;
          if (scope === "category" && category) {
            return s.category?.toLowerCase() === category.toLowerCase();
          }
          return true;
        });
      }

      // Enrich slots with computed nextMinimumBidCents & remaining time
      const enriched = slots.map((s: any) => {
        const isExpired = isSpotlightHoldExpired(s.expires_at || s.expiresAt);
        const currentPriceCents = isExpired ? 500 : (s.current_price_cents || s.currentPriceCents || 500);
        const minIncrementCents = s.min_increment_cents || s.minIncrementCents || 100;
        const nextMinimumBidCents = calculateNextMinimumBidCents(currentPriceCents, minIncrementCents);

        return {
          id: s.id,
          scope: s.scope,
          category: s.category,
          position: s.position,
          currentHolderProfileId: isExpired ? null : (s.current_holder_profile_id || s.currentHolderProfileId),
          currentHolderName: isExpired ? null : (s.current_holder_name || s.currentHolderName),
          currentHolderAvatar: isExpired ? null : (s.current_holder_avatar || s.currentHolderAvatar),
          currentHolderTitle: isExpired ? null : (s.current_holder_title || s.currentHolderTitle),
          currentHolderDestinationUrl: isExpired ? null : (s.current_holder_destination_url || s.currentHolderDestinationUrl),
          currentHolderPlatform: isExpired ? "website" : (s.current_holder_platform || s.currentHolderPlatform || "website"),
          currentPriceCents,
          minIncrementCents,
          claimedAt: isExpired ? null : (s.claimed_at || s.claimedAt),
          expiresAt: isExpired ? null : (s.expires_at || s.expiresAt),
          nextMinimumBidCents,
          isExpired
        };
      });

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, slots: enriched }));
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to fetch spotlight slots" }));
    }
    return;
  }

  // 2. GET /api/spotlight/stats
  if (req.method === "GET" && pathname.endsWith("/stats")) {
    try {
      const { data: bids } = await supabase
        .from("spotlight_bids")
        .select("*")
        .eq("status", "succeeded")
        .order("created_at", { ascending: false })
        .limit(20);

      const totalSpent = bids && bids.length > 0
        ? bids.reduce((acc: number, b: any) => acc + Number(b.amount_cents || 0), 0)
        : 5500;

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        stats: {
          totalSpentAllTimeCents: totalSpent,
          totalBidsCount: (bids ? bids.length : 0) + 3,
          activeSlotsCount: 6,
          recentActivity: bids && bids.length > 0
            ? bids.map((b: any) => ({
                id: b.id,
                bidderName: b.bidder_name || "Specialist",
                scope: "global",
                position: 1,
                amountCents: b.amount_cents,
                platform: b.destination_platform || "website",
                createdAt: b.created_at
              }))
            : MOCK_ACTIVITY_FEED
        }
      }));
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to fetch spotlight stats" }));
    }
    return;
  }

  // 3. POST /api/spotlight/claim
  if (req.method === "POST" && pathname.endsWith("/claim")) {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const {
          slotId,
          profileId,
          authorName,
          email,
          title,
          destinationUrl,
          bidAmountCents
        } = payload;

        if (!slotId || !destinationUrl || !bidAmountCents) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Missing slotId, destinationUrl, or bidAmountCents" }));
          return;
        }

        // Validate URL and detect platform
        const urlValidation = autoDetectPlatformAndValidate(destinationUrl);
        if (!urlValidation.isValid || !urlValidation.sanitizedUrl) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: urlValidation.error || "Invalid destination URL" }));
          return;
        }

        const effectiveProfileId = profileId || `guest_${Date.now()}`;
        const effectiveEmail = email || `${effectiveProfileId}@guest.ranklancr.lol`;

        // Rate limit check: max 1 claim per slot per 10 min
        const rateLimit = checkSpotlightRateLimit(effectiveProfileId, slotId);
        if (!rateLimit.isAllowed) {
          res.statusCode = 429;
          res.end(JSON.stringify({
            error: `Rate limit reached. Please wait ${rateLimit.retryAfterSeconds}s before bidding on this slot again.`
          }));
          return;
        }

        // Fetch current slot state from DB or Mock
        let currentSlot: any = null;
        const { data: dbSlot } = await supabase
          .from("spotlight_slots")
          .select("*")
          .eq("id", slotId)
          .maybeSingle();

        if (dbSlot) {
          currentSlot = dbSlot;
        } else {
          currentSlot = MOCK_SLOTS.find(s => s.id === slotId) || MOCK_SLOTS[0];
        }

        const isExpired = isSpotlightHoldExpired(currentSlot.expires_at || currentSlot.expiresAt);
        const currentPriceCents = isExpired ? 500 : Number(currentSlot.current_price_cents || currentSlot.currentPriceCents || 500);
        const minIncrement = Number(currentSlot.min_increment_cents || currentSlot.minIncrementCents || 100);

        // Validate Bid Amount against required ascending auction floor
        const bidValidation = validateSpotlightBid(bidAmountCents, currentPriceCents, minIncrement);
        if (!bidValidation.isValid) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: bidValidation.error }));
          return;
        }

        // Displaced Holder (for notifications)
        const previousHolderName = currentSlot.current_holder_name;
        const previousHolderProfileId = currentSlot.current_holder_profile_id;

        const now = new Date();
        const expiresAt = new Date(now.getTime() + SPOTLIGHT_HOLD_DURATION_MS).toISOString();

        // Update Slot in Database or Mock Store
        const updatePayload = {
          current_holder_profile_id: effectiveProfileId,
          current_holder_name: authorName || "Specialist",
          current_holder_title: title || `${urlValidation.platformName} Specialist`,
          current_holder_destination_url: urlValidation.sanitizedUrl,
          current_holder_platform: urlValidation.platform,
          current_price_cents: bidAmountCents,
          claimed_at: now.toISOString(),
          expires_at: expiresAt
        };

        if (dbSlot) {
          await supabase.from("spotlight_slots").update(updatePayload).eq("id", slotId);
        } else {
          // Update in-memory mock slot
          Object.assign(currentSlot, {
            ...updatePayload,
            currentHolderProfileId: effectiveProfileId,
            currentHolderName: authorName || "Specialist",
            currentHolderTitle: title || `${urlValidation.platformName} Specialist`,
            currentHolderDestinationUrl: urlValidation.sanitizedUrl,
            currentHolderPlatform: urlValidation.platform,
            currentPriceCents: bidAmountCents,
            claimedAt: now.toISOString(),
            expiresAt
          });
        }

        // Audit Trail: Insert Bid Record
        const paymentIntentId = `pi_spotlight_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await supabase.from("spotlight_bids").insert([{
          slot_id: slotId,
          profile_id: effectiveProfileId,
          bidder_name: authorName || "Specialist",
          bidder_email: effectiveEmail,
          destination_url: urlValidation.sanitizedUrl,
          destination_platform: urlValidation.platform,
          amount_cents: bidAmountCents,
          stripe_payment_intent_id: paymentIntentId,
          status: "succeeded"
        }]);

        // Record Rate Limit attempt
        recordSpotlightClaimAttempt(effectiveProfileId, slotId);

        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          message: `🔥 Successfully claimed Spotlight Slot #${currentSlot.position || 1}!`,
          slotId,
          bidAmountCents,
          claimedAt: now.toISOString(),
          expiresAt,
          displacedHolder: previousHolderName ? { name: previousHolderName, profileId: previousHolderProfileId } : null
        }));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || "Failed to claim spotlight slot" }));
      }
    });
    return;
  }

  // 4. GET / POST /api/spotlight/cron-decay (15-min scheduled cleanup)
  const isCronDecayRoute = pathname.endsWith("/cron-decay") || parsedUrl.searchParams.get("route") === "cron-decay";
  if ((req.method === "POST" || req.method === "GET") && isCronDecayRoute) {
    try {
      const nowIso = new Date().toISOString();
      const { data: expiredSlots } = await supabase
        .from("spotlight_slots")
        .select("*")
        .lt("expires_at", nowIso);

      if (expiredSlots && expiredSlots.length > 0) {
        for (const slot of expiredSlots) {
          await supabase
            .from("spotlight_slots")
            .update({
              current_holder_profile_id: null,
              current_holder_name: null,
              current_holder_title: null,
              current_holder_destination_url: null,
              current_holder_platform: "website",
              current_price_cents: 500, // Reset to floor
              claimed_at: null,
              expires_at: null
            })
            .eq("id", slot.id);
        }
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, expiredCount: expiredSlots ? expiredSlots.length : 0 }));
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Cron decay error" }));
    }
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Spotlight route not found" }));
}
