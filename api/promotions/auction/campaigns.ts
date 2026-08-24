import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";
import { sanitizeDestinationUrl, resolveMicroRotationPlacements } from "../../../src/services/ranking/auctionExposureEngine.js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  // GET: Live Active Promoted Campaigns
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "public, s-maxage=5, stale-while-revalidate=15");

    try {
      const { data: campaigns, error } = await supabase
        .from("promoted_campaigns")
        .select("*")
        .in("status", ["active", "outbid"])
        .gt("expires_at", new Date().toISOString())
        .order("current_bid", { ascending: false });

      if (error) throw error;

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
      const minToEnter = 2.0;
      const minToTakeNumberOne = highestBid > 0 ? highestBid + 1.0 : 2.0;

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          success: true,
          totalActive: rotated.length,
          stats: {
            highestBid,
            minToEnter,
            minToTakeNumberOne
          },
          campaigns: rotated
        })
      );
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to fetch campaigns" }));
    }
    return;
  }

  // POST: Create Promoted Campaign
  if (req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const {
          userId,
          profileId,
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

        // 1. Basic validation
        if (!userId || !title || !destinationUrl || !authorName) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Missing required campaign fields (userId, authorName, title, destinationUrl)" }));
          return;
        }

        // 2. Minimum Bid Validation
        const bidAmount = Math.max(2.0, Number(startingBid) || 2.0);
        if (bidAmount < 2.0) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Minimum bid must be at least $2.00 USD" }));
          return;
        }

        // 3. Destination URL Sanitization
        const urlValidation = sanitizeDestinationUrl(destinationUrl);
        if (!urlValidation.isValid || !urlValidation.sanitizedUrl) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: urlValidation.error || "Invalid destination URL" }));
          return;
        }

        // 4. Insert into database
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        const { data: created, error } = await supabase
          .from("promoted_campaigns")
          .insert([
            {
              user_id: userId,
              profile_id: profileId || userId,
              author_name: authorName,
              avatar_url: avatarUrl || null,
              title: title.trim(),
              description: (description || "").trim(),
              destination_type: destinationType || "website",
              destination_url: urlValidation.sanitizedUrl,
              category: category || "Full Stack",
              skills: Array.isArray(skills) ? skills : [],
              starting_bid: bidAmount,
              current_bid: bidAmount,
              status: "active",
              expires_at: expiresAt
            }
          ])
          .select()
          .single();

        if (error) throw error;

        // Record initial bid in promotion_bids
        if (created?.id) {
          await supabase.from("promotion_bids").insert([
            {
              campaign_id: created.id,
              user_id: userId,
              bidder_name: authorName,
              amount: bidAmount,
              payment_status: "completed",
              is_winning: true
            }
          ]);
        }

        res.statusCode = 201;
        res.end(JSON.stringify({ success: true, campaign: created }));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || "Failed to create campaign" }));
      }
    });
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: "Method Not Allowed" }));
}
