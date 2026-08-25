import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";
import { rankSubmissions, applyChallengeRewards } from "../src/services/challenges/challengeWinnerEngine.js";

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

  const host = req.headers?.host || "localhost";
  const rawUrl = req.url || "/";
  const parsedUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `http://${host}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`);
  const action = parsedUrl.searchParams.get("action") || "";

  // 1. Admin Passkey Verification Endpoint
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

  // Verify auth for all other admin routes
  const body = req.method === "POST" ? await parseBody(req) : {};
  if (!verifyAdminAuth(req, body)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Unauthorized. Admin passkey required." }));
    return;
  }

  // =========================================================================
  // 2. GET /api/admin?action=stats — Complete Platform Telemetry
  // =========================================================================
  if (req.method === "GET" && (action === "stats" || !action)) {
    try {
      const [
        chRes,
        entriesRes,
        subsRes,
        votesRes,
        sponsRes,
        auctionSlotsRes,
        spotlightSlotsRes,
        profilesRes
      ] = await Promise.all([
        supabase.from("challenges").select("*").order("created_at", { ascending: false }),
        supabase.from("challenge_entries").select("*").eq("status", "succeeded"),
        supabase.from("challenge_submissions").select("*, profiles(*)").order("created_at", { ascending: false }),
        supabase.from("challenge_votes").select("id", { count: "exact", head: true }),
        supabase.from("challenge_sponsorships").select("*").eq("status", "succeeded"),
        supabase.from("challenge_sponsorship_slots").select("*"),
        supabase.from("promoted_slots").select("*").order("slot_index", { ascending: true }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(50)
      ]);

      const challenges = chRes.data || [];
      const entries = entriesRes.data || [];
      const submissions = subsRes.data || [];
      const totalVotes = votesRes.count || 0;
      const sponsorships = sponsRes.data || [];
      const auctionSlots = auctionSlotsRes.data || [];
      const spotlightSlots = spotlightSlotsRes.data || [];
      const profiles = profilesRes.data || [];

      // Financial Math (Pure Platform Revenue)
      const entryRevenueDollars = entries.length * 5.0; // $5 per entry
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
          totalVotes,
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
      res.end(JSON.stringify({ error: err.message || "Failed to fetch admin stats" }));
      return;
    }
  }

  // =========================================================================
  // 3. POST /api/admin?action=create-challenge — Create New Skill Challenge
  // =========================================================================
  if (req.method === "POST" && action === "create-challenge") {
    const {
      title,
      prompt,
      category,
      bannerImage,
      entryFeeDollars,
      entryDeadline,
      submissionDeadline,
      votingDeadline
    } = body;

    if (!title || !prompt) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Title and Prompt are required" }));
      return;
    }

    try {
      const now = Date.now();
      const defaultEntryDeadline = entryDeadline || new Date(now + 2 * 86400000).toISOString();
      const defaultSubmissionDeadline = submissionDeadline || new Date(now + 5 * 86400000).toISOString();
      const defaultVotingDeadline = votingDeadline || new Date(now + 8 * 86400000).toISOString();

      const { data, error } = await supabase
        .from("challenges")
        .insert({
          title: title.trim(),
          prompt: prompt.trim(),
          category: category || "Development",
          banner_image: bannerImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
          entry_fee_cents: Math.round((Number(entryFeeDollars) || 5) * 100),
          status: "open_entry",
          entry_deadline: defaultEntryDeadline,
          submission_deadline: defaultSubmissionDeadline,
          voting_deadline: defaultVotingDeadline
        })
        .select()
        .single();

      if (error) throw error;

      // Seed auction slot for this challenge
      await supabase.from("challenge_sponsorship_slots").insert({
        challenge_id: data.id,
        current_bid_cents: 10000,
        min_increment_cents: 2500,
        total_bids_count: 0
      });

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, challenge: data, message: "Challenge created successfully!" }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to create challenge" }));
      return;
    }
  }

  // =========================================================================
  // 4. POST /api/admin?action=update-phase — Manually Change Challenge Phase
  // =========================================================================
  if (req.method === "POST" && action === "update-phase") {
    const { challengeId, status } = body;
    if (!challengeId || !["open_entry", "submission_window", "voting_window", "closed"].includes(status)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Valid challengeId and status required" }));
      return;
    }

    try {
      const { data, error } = await supabase
        .from("challenges")
        .update({ status })
        .eq("id", challengeId)
        .select()
        .single();

      if (error) throw error;

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, challenge: data, message: `Challenge phase updated to ${status}` }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to update phase" }));
      return;
    }
  }

  // =========================================================================
  // 5. POST /api/admin?action=resolve-challenge — Force Calculate Winners
  // =========================================================================
  if (req.method === "POST" && action === "resolve-challenge") {
    const { challengeId } = body;
    if (!challengeId) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "challengeId is required" }));
      return;
    }

    try {
      const { data: subs, error: subErr } = await supabase
        .from("challenge_submissions")
        .select("id, profile_id, vote_count, created_at")
        .eq("challenge_id", challengeId);

      if (subErr) throw subErr;

      const ranked = rankSubmissions((subs || []).map((s: any) => ({
        id: s.id,
        profileId: s.profile_id,
        voteCount: Number(s.vote_count || 0),
        createdAt: s.created_at
      })));

      const rewardResult = await applyChallengeRewards(challengeId, ranked);

      await supabase
        .from("challenges")
        .update({
          status: "closed",
          winner_submission_id: ranked[0]?.submissionId || null
        })
        .eq("id", challengeId);

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        rankedSubmissions: ranked.slice(0, 3),
        winnerProfileId: rewardResult.winnerProfileId,
        message: "Winners calculated and 72h Top Developer rewards assigned!"
      }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to resolve challenge" }));
      return;
    }
  }

  // =========================================================================
  // 6. POST /api/admin?action=disqualify-submission — Remove Flagged Submission
  // =========================================================================
  if (req.method === "POST" && action === "disqualify-submission") {
    const { submissionId } = body;
    if (!submissionId) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "submissionId is required" }));
      return;
    }

    try {
      // Delete votes first
      await supabase.from("challenge_votes").delete().eq("submission_id", submissionId);
      const { error } = await supabase.from("challenge_submissions").delete().eq("id", submissionId);
      if (error) throw error;

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, message: "Submission disqualified and removed." }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to remove submission" }));
      return;
    }
  }

  // =========================================================================
  // 7. POST /api/admin?action=toggle-verified — Toggle Profile Verification Check
  // =========================================================================
  if (req.method === "POST" && action === "toggle-verified") {
    const { profileId, isVerified } = body;
    if (!profileId) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "profileId is required" }));
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ is_verified: isVerified })
        .eq("id", profileId)
        .select()
        .single();

      if (error) throw error;

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, profile: data, message: `Verification status updated to ${isVerified}` }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to update profile" }));
      return;
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Action not supported" }));
}
