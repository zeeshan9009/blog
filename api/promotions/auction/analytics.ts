import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";
import { calculateExposureWeights } from "../../../src/services/ranking/auctionExposureEngine.js";

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

  // GET: Fetch Campaign 24H Analytics
  if (req.method === "GET") {
    try {
      const host = req.headers?.host || "localhost";
      const rawUrl = req.url || "/";
      const parsedUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `http://${host}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`);
      const campaignId = parsedUrl.searchParams.get("campaignId") || "";

      if (!campaignId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Missing campaignId parameter" }));
        return;
      }

      // Fetch campaign
      const { data: campaign, error } = await supabase
        .from("promoted_campaigns")
        .select("*")
        .eq("id", campaignId)
        .single();

      if (error || !campaign) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Campaign not found" }));
        return;
      }

      // Fetch all active campaigns to calculate exposure share
      const { data: allActive } = await supabase
        .from("promoted_campaigns")
        .select("*")
        .in("status", ["active", "outbid"])
        .gt("expires_at", new Date().toISOString());

      const exposureMap = calculateExposureWeights(allActive || []);
      const exposureInfo = exposureMap.get(campaignId);

      const impressions = Number(campaign.impressions) || 0;
      const clicks = Number(campaign.clicks) || 0;
      const externalVisits = Number(campaign.external_visits) || 0;

      const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
      const estimatedConversion = clicks > 0 ? Number(((externalVisits / clicks) * 100).toFixed(2)) : (externalVisits > 0 ? 100 : 0);

      const expiresMs = new Date(campaign.expires_at).getTime();
      const timeRemainingSeconds = Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          campaignId,
          title: campaign.title,
          authorName: campaign.author_name,
          destinationUrl: campaign.destination_url,
          destinationType: campaign.destination_type,
          currentPosition: campaign.current_position || 1,
          peakPosition: campaign.peak_position || 1,
          currentBid: Number(campaign.current_bid) || 2.0,
          startingBid: Number(campaign.starting_bid) || 2.0,
          impressions,
          clicks,
          externalVisits,
          ctr,
          estimatedConversion,
          exposureShare: Number(((exposureInfo?.effectiveExposure || 0.25) * 100).toFixed(1)),
          dampingPercentage: exposureInfo?.dampingPercentage || 0,
          isDamped: Boolean(exposureInfo?.isDamped),
          timeRemainingSeconds,
          status: campaign.status,
          updatedAt: new Date().toISOString()
        })
      );
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to fetch analytics" }));
    }
    return;
  }

  // POST: Record Telemetry Event (click, external_visit, impression)
  if (req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      try {
        const data = JSON.parse(body || "{}");
        const { campaignId, eventType } = data;

        if (!campaignId || !eventType) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Missing campaignId or eventType" }));
          return;
        }

        if (eventType === "external_visit") {
          supabase.rpc("increment_external_visits", { p_campaign_id: campaignId }).then(({ error }) => {
            if (error) {
              // Fallback direct increment
              supabase
                .from("promoted_campaigns")
                .select("external_visits")
                .eq("id", campaignId)
                .single()
                .then(({ data: c }) => {
                  if (c) {
                    supabase
                      .from("promoted_campaigns")
                      .update({ external_visits: (c.external_visits || 0) + 1 })
                      .eq("id", campaignId)
                      .then();
                  }
                });
            }
          });
        } else if (eventType === "click") {
          supabase
            .from("promoted_campaigns")
            .select("clicks")
            .eq("id", campaignId)
            .single()
            .then(({ data: c }) => {
              if (c) {
                supabase
                  .from("promoted_campaigns")
                  .update({ clicks: (c.clicks || 0) + 1 })
                  .eq("id", campaignId)
                  .then();
              }
            });
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || "Failed to record telemetry" }));
      }
    });
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: "Method Not Allowed" }));
}
