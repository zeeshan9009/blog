import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TrackImpressionItem {
  profileId: string;
  query?: string;
  wasSponsored?: boolean;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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
      const { event } = data;
      const visitorIp = (req.headers?.["x-forwarded-for"] as string) || req.socket?.remoteAddress || "anon";
      const ipHash = visitorIp ? String(Buffer.from(visitorIp).toString("base64").substring(0, 16)) : "anon";

      if (event === "impression_batch" && Array.isArray(data.impressions)) {
        const rows = data.impressions.map((imp: TrackImpressionItem) => ({
          profile_id: imp.profileId,
          search_query: imp.query || null,
          was_sponsored: Boolean(imp.wasSponsored),
          visitor_ip_hash: ipHash,
          created_at: new Date().toISOString()
        }));

        if (rows.length > 0) {
          // Asynchronous insert without blocking
          supabase.from("profile_impressions").insert(rows).then(({ error }) => {
            if (error) console.warn("[TELEMETRY] Impression batch insert failed:", error.message);
          });
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, count: rows.length }));
        return;
      }

      if (event === "click" && data.profileId) {
        supabase.from("profile_clicks").insert([{
          profile_id: data.profileId,
          source: data.source || "search_result",
          visitor_ip_hash: ipHash,
          created_at: new Date().toISOString()
        }]).then(({ error }) => {
          if (error) console.warn("[TELEMETRY] Click insert failed:", error.message);
        });

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
        return;
      }

      if (event === "inquiry" && data.profileId) {
        supabase.from("profile_inquiries").insert([{
          profile_id: data.profileId,
          inquiry_type: data.inquiryType || "contact_form",
          sender_name: data.senderName || null,
          sender_email: data.senderEmail || null,
          budget: data.budget || null,
          created_at: new Date().toISOString()
        }]).then(({ error }) => {
          if (error) console.warn("[TELEMETRY] Inquiry insert failed:", error.message);
        });

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
        return;
      }

      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid telemetry event payload" }));
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err?.message || "Telemetry Ingestion Error" }));
    }
  });
}
