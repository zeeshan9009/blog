import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";

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

  // GET: Fetch System Auction Config & Bid History
  if (req.method === "GET") {
    try {
      const [configRes, bidsRes, campaignsRes] = await Promise.all([
        supabase.from("promotion_admin_config").select("*").limit(1).single(),
        supabase.from("promotion_bids").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("promoted_campaigns").select("*").order("created_at", { ascending: false }).limit(50)
      ]);

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          config: configRes.data || { min_bid: 2.0, default_duration_hours: 24, damping_threshold: 1.2 },
          recentBids: bidsRes.data || [],
          recentCampaigns: campaignsRes.data || []
        })
      );
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to fetch admin data" }));
    }
    return;
  }

  // POST: Admin Moderation Action (pause, resume, cancel, ban)
  if (req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const { action, campaignId, configUpdate } = payload;

        if (configUpdate) {
          await supabase.from("promotion_admin_config").upsert({
            id: configUpdate.id || "00000000-0000-0000-0000-000000000000",
            ...configUpdate,
            updated_at: new Date().toISOString()
          });
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, message: "Config updated" }));
          return;
        }

        if (action === "pause" && campaignId) {
          await supabase.from("promoted_campaigns").update({ status: "paused" }).eq("id", campaignId);
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, message: "Campaign paused" }));
          return;
        }

        if (action === "resume" && campaignId) {
          await supabase.from("promoted_campaigns").update({ status: "active" }).eq("id", campaignId);
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, message: "Campaign resumed" }));
          return;
        }

        if (action === "cancel" && campaignId) {
          await supabase.from("promoted_campaigns").update({ status: "cancelled" }).eq("id", campaignId);
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, message: "Campaign cancelled" }));
          return;
        }

        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid admin action" }));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || "Admin execution error" }));
      }
    });
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: "Method Not Allowed" }));
}
