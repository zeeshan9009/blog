import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";
import { validateContactRateLimit } from "../src/services/ranking/antiAbuse";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      const { profileId, senderName, senderEmail, message, budget } = data;

      if (!profileId || !senderName || !senderEmail || !message) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Missing required contact inquiry fields" }));
        return;
      }

      const visitorIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "anon";
      const isAllowed = validateContactRateLimit(visitorIp);

      if (!isAllowed) {
        res.statusCode = 429;
        res.end(JSON.stringify({ error: "Too many contact requests. Limit: 5 per hour." }));
        return;
      }

      // Persist to Supabase contact_requests table
      try {
        await supabase.from("contact_requests").insert([{
          profile_id: profileId,
          sender_name: senderName,
          sender_email: senderEmail,
          message,
          budget: budget || "Not specified",
          status: "new"
        }]);
      } catch (dbErr) {
        console.warn("Contact Supabase insert warning:", dbErr);
      }

      const contactRequest = {
        id: "req_" + Math.random().toString(36).substring(2, 12),
        profile_id: profileId,
        sender_name: senderName,
        sender_email: senderEmail,
        message,
        budget: budget || "Not specified",
        status: "new",
        created_at: new Date().toISOString(),
      };

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        contactRequest,
      }));
    } catch (e: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e.message || "Failed to process contact inquiry" }));
    }
  });
}
