import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";

const ADMIN_SECRET = process.env.ADMIN_PASSKEY || "ranklancr_admin_2026";
const APP_URL = process.env.VITE_APP_URL || "https://www.ranklancr.lol";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function verifyAdminAuth(req: IncomingMessage): boolean {
  const authHeader = req.headers["x-admin-key"] || req.headers["authorization"]?.replace("Bearer ", "");
  return authHeader === ADMIN_SECRET;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-key");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  // Verify Admin Authorization
  if (!verifyAdminAuth(req)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Unauthorized. Admin passkey required." }));
    return;
  }

  try {
    const host = req.headers?.host || "localhost";
    const rawUrl = req.url || "/";
    const parsedUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `http://${host}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`);
    const filterAll = parsedUrl.searchParams.get("all") === "true";

    let query = supabase.from("challenges").select("*, challenge_entries(count), challenge_submissions(count), challenge_sponsorship_slots(*)");

    if (!filterAll) {
      // By default, only show active challenges (open_entry or submission_window)
      query = query.in("status", ["open_entry", "submission_window"]);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
      return;
    }

    const baseUrl = host.includes("localhost") ? `http://${host}` : APP_URL;

    const challengeLinks = (data || []).map((ch: any) => {
      const slug = ch.slug || ch.id;
      const submissionLink = `${baseUrl}/challenges/${slug}/submit`;
      const directArenaLink = `${baseUrl}/challenges/${slug}`;

      const slot = ch.challenge_sponsorship_slots?.[0] || null;
      const leadingBidDollars = slot?.current_bid_cents ? (slot.current_bid_cents / 100).toFixed(2) : null;
      const leadingSponsorName = slot?.current_sponsor_name || null;

      const targetDeadline = ch.status === "open_entry"
        ? ch.entry_deadline
        : ch.status === "submission_window"
        ? ch.submission_deadline
        : ch.voting_deadline;

      const timeRemainingMs = targetDeadline ? Math.max(0, new Date(targetDeadline).getTime() - Date.now()) : 0;

      return {
        id: ch.id,
        slug,
        title: ch.title,
        status: ch.status,
        submissionLink,
        directArenaLink,
        entriesCount: ch.challenge_entries?.[0]?.count || 0,
        submissionsCount: ch.challenge_submissions?.[0]?.count || 0,
        submissionDeadline: ch.submission_deadline,
        entryDeadline: ch.entry_deadline,
        votingDeadline: ch.voting_deadline,
        timeRemainingMs,
        leadingBidDollars,
        leadingSponsorName,
        createdAt: ch.created_at
      };
    });

    res.statusCode = 200;
    res.end(JSON.stringify({
      totalActive: challengeLinks.length,
      challengeLinks
    }));
  } catch (err: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message || "Failed to load challenge links" }));
  }
}
