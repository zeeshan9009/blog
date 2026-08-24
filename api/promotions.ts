import type { IncomingMessage, ServerResponse } from "node:http";
import crypto from "node:crypto";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sanitizeDestinationUrl, resolveMicroRotationPlacements, calculateExposureWeights } from "../src/services/ranking/auctionExposureEngine.js";
import { verifyProfilePromotionEligibility } from "../src/services/ranking/antiAbuse.js";
import { INITIAL_PROFESSIONALS } from "../src/data/mockTalentData.js";
import {
  SPONSORED_BOOST_PRICE_CENTS,
  SPONSORED_BOOST_PRICE_USD,
  SPONSORED_BOOST_DURATION_HOURS,
  SPONSORED_BOOST_CURRENCY
} from "../src/config/pricing.js";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2025-02-24.acacia" as any }) : null;

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, stripe-signature");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  const host = req.headers?.host || "localhost";
  const rawUrl = req.url || "/";
  const parsedUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `http://${host}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`);
  const pathname = parsedUrl.pathname.replace(/\/$/, "");
  const routeParam = parsedUrl.searchParams.get("route") || "";

  // 0. ROUTE: /api/promotions/auction/manage (Token-based Magic Link Management)
  if (pathname.endsWith("/auction/manage") || routeParam === "auction/manage") {
    res.setHeader("Content-Type", "application/json");
    const token = parsedUrl.searchParams.get("token") || "";

    if (req.method === "GET") {
      if (!token) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Management token is required" }));
        return;
      }

      try {
        const { data: campaign, error } = await supabase
          .from("promoted_campaigns")
          .select("*")
          .eq("management_token", token)
          .single();

        if (error || !campaign) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Invalid or expired management token" }));
          return;
        }

        // Fetch all active campaigns in category to calculate real-time position
        const { data: allActive } = await supabase
          .from("promoted_campaigns")
          .select("id, current_bid, category")
          .in("status", ["active", "outbid"])
          .gt("expires_at", new Date().toISOString())
          .order("current_bid", { ascending: false });

        const activeList = allActive || [];
        const higherBids = activeList.filter((c: any) => c.id !== campaign.id && Number(c.current_bid) >= Number(campaign.current_bid));
        const currentPosition = higherBids.length + 1;
        const highestBidOverall = activeList.length > 0 ? Math.max(...activeList.map((c: any) => Number(c.current_bid))) : Number(campaign.current_bid);
        const minToTakeNumberOne = highestBidOverall >= Number(campaign.current_bid) ? highestBidOverall + 1 : Number(campaign.current_bid);

        const impressions = campaign.impressions || 0;
        const clicks = campaign.clicks || 0;
        const externalVisits = campaign.external_visits || 0;
        const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;

        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          campaign: {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description,
            authorName: campaign.author_name,
            avatarUrl: campaign.avatar_url,
            destinationType: campaign.destination_type,
            destinationUrl: campaign.destination_url,
            category: campaign.category,
            skills: campaign.skills,
            startingBid: Number(campaign.starting_bid),
            currentBid: Number(campaign.current_bid),
            status: campaign.status,
            userEmail: campaign.user_email,
            managementToken: campaign.management_token,
            expiresAt: campaign.expires_at,
            createdAt: campaign.created_at,
            currentPosition,
            highestBidOverall,
            minToTakeNumberOne,
            impressions,
            clicks,
            externalVisits,
            ctr
          }
        }));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        try {
          const payload = JSON.parse(body || "{}");
          const { action, amount, managementToken } = payload;
          const targetToken = managementToken || token;

          if (!targetToken) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Management token is required" }));
            return;
          }

          const { data: campaign, error: findErr } = await supabase
            .from("promoted_campaigns")
            .select("*")
            .eq("management_token", targetToken)
            .single();

          if (findErr || !campaign) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Campaign not found" }));
            return;
          }

          if (action === "increase_bid" || action === "outbid") {
            const newBid = Number(amount);
            if (isNaN(newBid) || newBid <= Number(campaign.current_bid)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: `New bid must be greater than current bid ($${campaign.current_bid})` }));
              return;
            }

            await supabase
              .from("promoted_campaigns")
              .update({
                current_bid: newBid,
                status: "active",
                updated_at: new Date().toISOString()
              })
              .eq("id", campaign.id);

            await supabase.from("promotion_bids").insert([{
              campaign_id: campaign.id,
              user_id: campaign.user_id,
              bidder_name: campaign.author_name || "Guest Advertiser",
              amount: newBid,
              payment_status: "completed",
              is_winning: true,
              previous_highest_bid: campaign.current_bid
            }]);

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, newBid, message: `Successfully boosted bid to $${newBid}` }));
            return;
          }

          if (action === "toggle_pause") {
            const newStatus = campaign.status === "paused" ? "active" : "paused";
            await supabase.from("promoted_campaigns").update({ status: newStatus }).eq("id", campaign.id);
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, status: newStatus }));
            return;
          }

          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Unsupported management action" }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }
  }

  // 1. ROUTE: /api/promotions/auction/bid
  if (pathname.endsWith("/auction/bid") || routeParam === "auction/bid") {
    res.setHeader("Content-Type", "application/json");
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
        const { campaignId, userId, bidderName, amount, email, userEmail } = payload;
        if (!campaignId || !amount) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Missing campaignId or amount" }));
          return;
        }

        const effectiveUserId = userId || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const effectiveBidder = bidderName || email || userEmail || "Guest Bidder";

        const bidAmount = Number(amount);
        if (isNaN(bidAmount) || bidAmount < 2.0) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Bid amount must be >= $2.00" }));
          return;
        }

        const { data: campaign, error: fetchErr } = await supabase
          .from("promoted_campaigns")
          .select("*")
          .eq("id", campaignId)
          .single();

        if (fetchErr || !campaign) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Campaign not found" }));
          return;
        }

        if (bidAmount <= Number(campaign.current_bid)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: `Bid must be higher than current bid ($${campaign.current_bid})` }));
          return;
        }

        await supabase
          .from("promoted_campaigns")
          .update({ current_bid: bidAmount, status: "active", updated_at: new Date().toISOString() })
          .eq("id", campaignId);

        await supabase.from("promotion_bids").insert([
          {
            campaign_id: campaignId,
            user_id: effectiveUserId,
            bidder_name: effectiveBidder,
            amount: bidAmount,
            payment_status: "completed",
            is_winning: true,
            previous_highest_bid: campaign.current_bid
          }
        ]);

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, newBid: bidAmount }));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || "Failed to place bid" }));
      }
    });
    return;
  }

  // 2. ROUTE: /api/promotions/auction/analytics
  if (pathname.endsWith("/auction/analytics") || routeParam === "auction/analytics") {
    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET") {
      try {
        const campaignId = parsedUrl.searchParams.get("campaignId") || "";
        if (!campaignId) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Missing campaignId" }));
          return;
        }

        const { data: campaign } = await supabase.from("promoted_campaigns").select("*").eq("id", campaignId).single();
        if (!campaign) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Campaign not found" }));
          return;
        }

        const { data: allActive } = await supabase.from("promoted_campaigns").select("*").in("status", ["active", "outbid"]);
        const exposureMap = calculateExposureWeights(allActive || []);
        const exposureInfo = exposureMap.get(campaignId);

        const impressions = Number(campaign.impressions) || 0;
        const clicks = Number(campaign.clicks) || 0;
        const externalVisits = Number(campaign.external_visits) || 0;
        const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
        const estimatedConversion = clicks > 0 ? Number(((externalVisits / clicks) * 100).toFixed(2)) : 0;

        res.statusCode = 200;
        res.end(JSON.stringify({
          campaignId,
          title: campaign.title,
          currentBid: Number(campaign.current_bid) || 2.0,
          impressions,
          clicks,
          externalVisits,
          ctr,
          estimatedConversion,
          exposureShare: Number(((exposureInfo?.effectiveExposure || 0.25) * 100).toFixed(1)),
          dampingPercentage: exposureInfo?.dampingPercentage || 0,
          isDamped: Boolean(exposureInfo?.isDamped),
          status: campaign.status
        }));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        try {
          const { campaignId, eventType } = JSON.parse(body || "{}");
          if (campaignId && eventType === "external_visit") {
            const { data: c } = await supabase.from("promoted_campaigns").select("external_visits").eq("id", campaignId).single();
            if (c) {
              await supabase.from("promoted_campaigns").update({ external_visits: (c.external_visits || 0) + 1 }).eq("id", campaignId);
            }
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
        } catch {
          res.statusCode = 200;
          res.end(JSON.stringify({ success: false }));
        }
      });
      return;
    }
  }

  // 3. ROUTE: /api/promotions/auction/admin
  if (pathname.endsWith("/auction/admin") || routeParam === "auction/admin") {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "GET") {
      const [configRes, bidsRes, campaignsRes] = await Promise.all([
        supabase.from("promotion_admin_config").select("*").limit(1).single(),
        supabase.from("promotion_bids").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("promoted_campaigns").select("*").order("created_at", { ascending: false }).limit(50)
      ]);
      res.statusCode = 200;
      res.end(JSON.stringify({
        config: configRes.data || { min_bid: 2.0, default_duration_hours: 24, damping_threshold: 1.2 },
        recentBids: bidsRes.data || [],
        recentCampaigns: campaignsRes.data || []
      }));
      return;
    }
  }

  // 4. ROUTE: /api/promotions/auction/campaigns (or /api/promotions/auction)
  if (pathname.endsWith("/auction/campaigns") || pathname.endsWith("/auction") || routeParam === "auction/campaigns" || routeParam === "auction") {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "GET") {
      res.setHeader("Cache-Control", "public, s-maxage=5, stale-while-revalidate=15");
      try {
        const { data: campaigns } = await supabase
          .from("promoted_campaigns")
          .select("*")
          .in("status", ["active", "outbid"])
          .gt("expires_at", new Date().toISOString())
          .order("current_bid", { ascending: false });

        const rawList = (campaigns || []).map((c: any) => ({
          id: c.id,
          userId: c.user_id,
          profileId: c.profile_id,
          authorName: c.author_name,
          avatarUrl: c.avatar_url,
          title: c.title,
          description: c.description,
          destinationType: c.destination_type,
          destinationUrl: c.destination_url,
          category: c.category,
          skills: c.skills || [],
          status: c.status,
          startingBid: Number(c.starting_bid) || 2.0,
          currentBid: Number(c.current_bid) || 2.0,
          currentPosition: c.current_position || 1,
          peakPosition: c.peak_position || 1,
          impressions: Number(c.impressions) || 0,
          clicks: Number(c.clicks) || 0,
          externalVisits: Number(c.external_visits) || 0,
          startAt: c.start_at,
          expiresAt: c.expires_at,
          createdAt: c.created_at,
          updatedAt: c.updated_at
        }));

        const rotated = resolveMicroRotationPlacements(rawList);
        const highestBid = rawList.length > 0 ? Math.max(...rawList.map(c => c.currentBid)) : 0;

        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          totalActive: rotated.length,
          stats: { highestBid, minToEnter: 2.0, minToTakeNumberOne: highestBid > 0 ? highestBid + 1.0 : 2.0 },
          campaigns: rotated
        }));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        try {
          const payload = JSON.parse(body || "{}");
          const {
            userId,
            profileId,
            userEmail,
            email,
            authorName,
            avatarUrl,
            title,
            description,
            destinationType,
            destinationUrl,
            category,
            skills,
            startingBid
          } = payload;

          const bidAmount = Math.max(2.0, Number(startingBid) || 2.0);
          const urlValidation = sanitizeDestinationUrl(destinationUrl);
          if (!urlValidation.isValid || !urlValidation.sanitizedUrl) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: urlValidation.error || "Invalid destination URL" }));
            return;
          }

          // Duplicate Active URL Protection
          const { data: existingActive } = await supabase
            .from("promoted_campaigns")
            .select("*")
            .eq("destination_url", urlValidation.sanitizedUrl)
            .in("status", ["active", "outbid"])
            .gt("expires_at", new Date().toISOString())
            .maybeSingle();

          if (existingActive) {
            // Profile is already active - return existing campaign info with outbid management link
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              isExisting: true,
              message: "Profile already has an active promotion. Redirecting to management dashboard.",
              campaign: existingActive,
              managementToken: existingActive.management_token,
              managementUrl: `/manage-promotion/${existingActive.management_token}`
            }));
            return;
          }

          const guestId = userId || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const contactEmail = userEmail || email || null;
          const managementToken = crypto.randomBytes(24).toString("hex");
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

          const { data: created, error } = await supabase.from("promoted_campaigns").insert([{
            user_id: guestId,
            profile_id: profileId || guestId,
            user_email: contactEmail,
            management_token: managementToken,
            author_name: authorName || "Professional",
            avatar_url: avatarUrl || null,
            title: (title || "Professional Profile").trim(),
            description: (description || "").trim(),
            destination_type: destinationType || "website",
            destination_url: urlValidation.sanitizedUrl,
            category: category || "Web Development",
            skills: Array.isArray(skills) ? skills : [],
            starting_bid: bidAmount,
            current_bid: bidAmount,
            status: "active",
            expires_at: expiresAt
          }]).select().single();

          if (error) throw error;

          // Initial winning bid log
          await supabase.from("promotion_bids").insert([{
            campaign_id: created.id,
            user_id: guestId,
            bidder_name: authorName || "Professional",
            amount: bidAmount,
            payment_status: "completed",
            is_winning: true,
            previous_highest_bid: 0
          }]);

          res.statusCode = 201;
          res.end(JSON.stringify({
            success: true,
            campaign: created,
            managementToken,
            managementUrl: `/manage-promotion/${managementToken}`
          }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }
  }

  // 5. ROUTE: /api/promotions/create-checkout
  if (pathname.endsWith("/create-checkout") || routeParam === "create-checkout") {
    res.setHeader("Content-Type", "application/json");
    if (!stripe) {
      res.statusCode = 200;
      res.end(JSON.stringify({
        mock: true,
        message: "Stripe test mode mock session",
        url: `${parsedUrl.origin}/dashboard?payment=success_mock`
      }));
      return;
    }

    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      try {
        const { profileId, successUrl, cancelUrl } = JSON.parse(body || "{}");
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: SPONSORED_BOOST_CURRENCY,
              unit_amount: SPONSORED_BOOST_PRICE_CENTS,
              product_data: { name: `RankLancr 24-Hour Sponsored Visibility Boost` }
            },
            quantity: 1
          }],
          mode: "payment",
          success_url: successUrl || `${parsedUrl.origin}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl || `${parsedUrl.origin}/dashboard?payment=cancelled`,
          metadata: { profileId, tier: "sponsored_boost_24h" }
        });
        res.statusCode = 200;
        res.end(JSON.stringify({ sessionId: session.id, url: session.url }));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 6. ROUTE: /api/promotions/webhook
  if (pathname.endsWith("/webhook") || routeParam === "webhook") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify({ received: true }));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Endpoint Not Found" }));
}
