import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      const payload = JSON.parse(body || "{}");
      const { campaignId, userId, bidderName, amount } = payload;

      if (!campaignId || !userId || !amount) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Missing required fields (campaignId, userId, amount)" }));
        return;
      }

      const bidAmount = Number(amount);
      if (isNaN(bidAmount) || bidAmount < 2.0) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Bid amount must be a valid number >= $2.00" }));
        return;
      }

      // Try atomic RPC function first
      const { data: rpcResult, error: rpcError } = await supabase.rpc("place_auction_bid", {
        p_campaign_id: campaignId,
        p_user_id: userId,
        p_bidder_name: bidderName || "Advertiser",
        p_amount: bidAmount
      });

      if (!rpcError && rpcResult) {
        res.statusCode = 200;
        res.end(JSON.stringify(rpcResult));
        return;
      }

      // Client-side fallback if RPC is not yet applied in local DB
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
        res.end(JSON.stringify({ error: `Bid ($${bidAmount}) must be higher than current bid ($${campaign.current_bid})` }));
        return;
      }

      // Update campaign
      const { error: updateErr } = await supabase
        .from("promoted_campaigns")
        .update({
          current_bid: bidAmount,
          status: "active",
          updated_at: new Date().toISOString()
        })
        .eq("id", campaignId);

      if (updateErr) throw updateErr;

      // Insert bid history
      await supabase.from("promotion_bids").insert([
        {
          campaign_id: campaignId,
          user_id: userId,
          bidder_name: bidderName || "Advertiser",
          amount: bidAmount,
          payment_status: "completed",
          is_winning: true,
          previous_highest_bid: campaign.current_bid
        }
      ]);

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          success: true,
          campaignId,
          newBid: bidAmount,
          previousBid: campaign.current_bid,
          message: "Bid successfully placed!"
        })
      );
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to place bid" }));
    }
  });
}
