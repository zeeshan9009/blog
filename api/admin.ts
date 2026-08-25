import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";

const ADMIN_SECRET = process.env.ADMIN_PASSKEY || "ranklancr_admin_2026";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function verifyAdminAuth(req: IncomingMessage, body: any): boolean {
  const authHeader = req.headers["x-admin-key"] || req.headers["authorization"]?.replace("Bearer ", "");
  if (authHeader === ADMIN_SECRET) return true;
  if (body && body.adminKey === ADMIN_SECRET) return true;
  return false;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-key");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    const host = req.headers?.host || "localhost";
    const rawUrl = req.url || "/";
    const parsedUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `http://${host}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`);
    const action = parsedUrl.searchParams.get("action") || "";

    // 1. Passkey Verification Endpoint
    if (req.method === "POST" && action === "auth") {
      const body = await parseBody(req);
      if (body.passkey === ADMIN_SECRET) {
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, token: ADMIN_SECRET, message: "Admin access granted" }));
        return;
      }
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Invalid admin passkey" }));
      return;
    }

    // Verify auth for all other actions
    const body = req.method === "POST" ? await parseBody(req) : {};
    if (!verifyAdminAuth(req, body)) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Unauthorized. Admin passkey required." }));
      return;
    }

    // 2. GET stats
    if (req.method === "GET" && (action === "stats" || !action)) {
      try {
        const [
          chRes,
          entriesRes,
          subsRes,
          sponsRes,
          auctionSlotsRes,
          spotlightSlotsRes,
          profilesRes
        ] = await Promise.all([
          supabase.from("challenges").select("*").order("created_at", { ascending: false }),
          supabase.from("challenge_entries").select("*").eq("status", "succeeded"),
          supabase.from("challenge_submissions").select("*, profiles(*)").order("created_at", { ascending: false }),
          supabase.from("challenge_sponsorships").select("*").eq("status", "succeeded"),
          supabase.from("challenge_sponsorship_slots").select("*"),
          supabase.from("promoted_slots").select("*").order("slot_index", { ascending: true }),
          supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(50)
        ]);

        const challenges = chRes.data || [];
        const entries = entriesRes.data || [];
        const submissions = subsRes.data || [];
        const sponsorships = sponsRes.data || [];
        const auctionSlots = auctionSlotsRes.data || [];
        const spotlightSlots = spotlightSlotsRes.data || [];
        const profiles = profilesRes.data || [];

        const entryRevenueDollars = entries.length * 5.0;
        const fixedSponsorshipDollars = sponsorships.reduce((sum, s) => sum + (s.amount_cents || 0) / 100, 0);
        const auctionSponsorshipDollars = auctionSlots.reduce((sum, s) => sum + ((s.current_bid_cents || 0) / 100), 0);
        const spotlightRevenueDollars = spotlightSlots.reduce((sum, s) => sum + ((s.current_price_cents || 0) / 100), 0);

        const totalRevenueDollars = entryRevenueDollars + fixedSponsorshipDollars + auctionSponsorshipDollars + spotlightRevenueDollars;

        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          financials: {
            totalRevenueDollars,
            entryRevenueDollars,
            sponsorshipRevenueDollars: fixedSponsorshipDollars + auctionSponsorshipDollars,
            spotlightRevenueDollars
          },
          metrics: {
            totalChallenges: challenges.length,
            activeChallenges: challenges.filter(c => c.status !== "closed").length,
            totalEntries: entries.length,
            totalSubmissions: submissions.length,
            totalVotes: submissions.reduce((sum, s) => sum + (s.vote_count || 0), 0),
            totalProfiles: profiles.length
          },
          challenges,
          submissions: submissions.map((s: any) => ({
            id: s.id,
            challengeId: s.challenge_id,
            profileId: s.profile_id,
            title: s.title,
            submissionUrl: s.submission_url,
            submissionText: s.submission_text,
            voteCount: s.vote_count || 0,
            authorName: s.profiles?.name || "Participant",
            authorEmail: s.profiles?.email || "N/A",
            createdAt: s.created_at
          })),
          sponsorships,
          auctionSlots,
          spotlightSlots,
          profiles
        }));
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || "Failed to fetch stats" }));
        return;
      }
    }

    // 3. POST create-challenge
    if (req.method === "POST" && action === "create-challenge") {
      const { title, prompt, category, bannerImage, entryFeeDollars } = body;
      if (!title || !prompt) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "Title and prompt are required" }));
        return;
      }

      const now = Date.now();
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const payload = {
        title: title.trim(),
        slug: baseSlug || `challenge-${now}`,
        prompt: prompt.trim(),
        category: category || "Development",
        banner_image: bannerImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
        entry_fee_cents: Math.round((Number(entryFeeDollars) || 5) * 100),
        status: "open_entry",
        entry_deadline: new Date(now + 2 * 86400000).toISOString(),
        submission_deadline: new Date(now + 5 * 86400000).toISOString(),
        voting_deadline: new Date(now + 8 * 86400000).toISOString()
      };

      const { data, error } = await supabase
        .from("challenges")
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error("Supabase insert challenge error:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({ 
          success: false, 
          error: `Database table not found or query failed (${error.message}). Please make sure Migration 015 has been run in your Supabase SQL Editor.` 
        }));
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, challenge: data }));
      return;
    }

    // 4. POST update-phase
    if (req.method === "POST" && action === "update-phase") {
      const { challengeId, status } = body;
      const { data, error } = await supabase
        .from("challenges")
        .update({ status })
        .eq("id", challengeId)
        .select()
        .single();

      if (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, error: error.message }));
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, challenge: data }));
      return;
    }

    // 5. POST disqualify-submission
    if (req.method === "POST" && action === "disqualify-submission") {
      const { submissionId } = body;
      await supabase.from("challenge_votes").delete().eq("submission_id", submissionId);
      await supabase.from("challenge_submissions").delete().eq("id", submissionId);
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return;
    }

    // 6. POST toggle-verified
    if (req.method === "POST" && action === "toggle-verified") {
      const { profileId, isVerified } = body;
      const { data } = await supabase
        .from("profiles")
        .update({ is_verified: isVerified })
        .eq("id", profileId)
        .select()
        .single();

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, profile: data }));
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Action not supported" }));
  } catch (err: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message || "Admin API internal error" }));
  }
}
