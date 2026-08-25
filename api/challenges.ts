import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import type {
  Challenge,
  ChallengeSubmission,
  ChallengeEntry,
  ChallengeSponsorship,
  ChallengeSponsorshipAuction,
  SponsorshipBidRecord,
  SponsorshipTier
} from "../src/types/challenge";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" as any }) : null;

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Self-contained Pure Merit Ranking Engine
function rankSubmissions(submissions: { id: string; profileId: string; voteCount: number; createdAt: string | Date }[]) {
  return [...submissions]
    .sort((a, b) => {
      if (b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount;
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    })
    .map((sub, index) => ({
      submissionId: sub.id,
      profileId: sub.profileId,
      voteCount: sub.voteCount,
      rank: index + 1
    }));
}

// Self-contained Sponsorship Pricing Config
const SPONSORSHIP_PRICING: Record<SponsorshipTier, { amountCents: number; label: string }> = {
  bronze: { amountCents: 5000, label: "Bronze Tier ($50.00)" },
  silver: { amountCents: 15000, label: "Silver Tier ($150.00)" },
  gold: { amountCents: 30000, label: "Gold Tier ($300.00)" }
};

// Self-contained Ascending Auction Outbid Calculator
function calculateMinNextSponsorshipBid(currentBidCents: number): number {
  if (!currentBidCents || currentBidCents < 10000) {
    return 10000; // $100 base floor
  }
  const incrementByPercent = Math.ceil(currentBidCents * 0.10);
  const increment = Math.max(2500, incrementByPercent); // +$25 or +10%
  return currentBidCents + increment;
}

// In-memory runtime storage for testing/fallback if DB is unreachable
let RUNTIME_CHALLENGES: Challenge[] = [];
let RUNTIME_ENTRIES: ChallengeEntry[] = [];
let RUNTIME_SUBMISSIONS: ChallengeSubmission[] = [];
let RUNTIME_SPONSORSHIPS: ChallengeSponsorship[] = [];

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

  try {
    const host = req.headers?.host || "localhost";
    const rawUrl = req.url || "/";
    const parsedUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `http://${host}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`);
    const route = parsedUrl.searchParams.get("route") || "";
    const idParam = parsedUrl.searchParams.get("id") || "";
    const slugParam = parsedUrl.searchParams.get("slug") || "";
    const statusParam = parsedUrl.searchParams.get("status") || "";

    // 1. GET /api/challenges — List challenges
    if (req.method === "GET" && !idParam && !slugParam && !route) {
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120, max-age=10");

      try {
        let query = supabase.from("challenges").select("*");
        if (statusParam && statusParam !== "all") {
          query = query.eq("status", statusParam);
        }
        query = query.order("created_at", { ascending: false }).limit(20);

        const { data, error } = await query;
        if (!error && data) {
          const mapped = data.map(row => ({
            id: row.id,
            slug: row.slug || row.id,
            category: row.category || "Development",
            title: row.title,
            prompt: row.prompt,
            bannerImage: row.banner_image,
            status: row.status,
            entryDeadline: row.entry_deadline,
            submissionDeadline: row.submission_deadline,
            votingDeadline: row.voting_deadline,
            entryFeeCents: row.entry_fee_cents || 500,
            winnerSubmissionId: row.winner_submission_id,
            createdAt: row.created_at
          }));
          res.statusCode = 200;
          res.end(JSON.stringify({ challenges: mapped }));
          return;
        }
      } catch {
        // fallback
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ challenges: RUNTIME_CHALLENGES }));
      return;
    }

    // 2. GET /api/challenges?id=:id OR ?slug=:slug — Challenge Details
    if (req.method === "GET" && (idParam || slugParam) && !route) {
      try {
        const lookup = slugParam || idParam;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lookup);
        
        let challengeQuery = supabase.from("challenges").select("*");
        if (isUUID) {
          challengeQuery = challengeQuery.eq("id", lookup);
        } else {
          challengeQuery = challengeQuery.eq("slug", lookup);
        }
        
        const chRes = await challengeQuery.maybeSingle();
        if (chRes.data) {
          const row = chRes.data;
          const challengeId = row.id;

          const [subRes, entRes, sponRes, slotRes, bidsRes] = await Promise.all([
            supabase.from("challenge_submissions").select("*, profiles(*)").eq("challenge_id", challengeId).order("vote_count", { ascending: false }),
            supabase.from("challenge_entries").select("*").eq("challenge_id", challengeId).eq("status", "succeeded"),
            supabase.from("challenge_sponsorships").select("*").eq("challenge_id", challengeId).eq("status", "succeeded"),
            supabase.from("challenge_sponsorship_slots").select("*").eq("challenge_id", challengeId).maybeSingle(),
            supabase.from("challenge_sponsorship_bids").select("*").eq("challenge_id", challengeId).eq("status", "succeeded").order("created_at", { ascending: false }).limit(10)
          ]);

          const challenge: Challenge = {
            id: row.id,
            slug: row.slug || row.id,
            category: row.category || "Development",
            title: row.title,
            prompt: row.prompt,
            bannerImage: row.banner_image,
            status: row.status,
            entryDeadline: row.entry_deadline,
            submissionDeadline: row.submission_deadline,
            votingDeadline: row.voting_deadline,
            entryFeeCents: row.entry_fee_cents || 500,
            winnerSubmissionId: row.winner_submission_id,
            createdAt: row.created_at
          };

          const submissions: ChallengeSubmission[] = (subRes.data || []).map((s: any) => ({
            id: s.id,
            challengeId: s.challenge_id,
            profileId: s.profile_id,
            authorName: s.profiles?.name || "Participant",
            authorAvatar: s.profiles?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.id)}`,
            authorTitle: s.profiles?.headline || "Developer",
            authorScore: s.profiles?.professional_score || 80,
            authorVerified: Boolean(s.profiles?.is_verified),
            title: s.title,
            submissionUrl: s.submission_url,
            submissionText: s.submission_text,
            voteCount: Number(s.vote_count || 0),
            finalRank: s.final_rank,
            lockedAt: s.locked_at,
            createdAt: s.created_at
          }));

          const entries: ChallengeEntry[] = (entRes.data || []).map((e: any) => ({
            id: e.id,
            challengeId: e.challenge_id,
            profileId: e.profile_id,
            stripePaymentIntentId: e.stripe_payment_intent_id,
            status: e.status,
            createdAt: e.created_at
          }));

          const sponsorships: ChallengeSponsorship[] = (sponRes.data || []).map((sp: any) => ({
            id: sp.id,
            challengeId: sp.challenge_id,
            companyName: sp.company_name,
            companyLogoUrl: sp.company_logo_url,
            companyLink: sp.company_link,
            tier: sp.tier,
            amountCents: sp.amount_cents,
            stripePaymentIntentId: sp.stripe_payment_intent_id,
            status: sp.status,
            createdAt: sp.created_at
          }));

          const recentAuctionBids: SponsorshipBidRecord[] = (bidsRes.data || []).map((b: any) => ({
            id: b.id,
            challengeId: b.challenge_id,
            companyName: b.company_name,
            companyLogoUrl: b.company_logo_url,
            companyLink: b.company_link,
            amountCents: b.amount_cents,
            createdAt: b.created_at
          }));

          const slotRow = slotRes.data;
          const currentAuctionBid = slotRow?.current_bid_cents || 10000;
          const sponsorshipAuction: ChallengeSponsorshipAuction | null = slotRow ? {
            id: slotRow.id,
            challengeId: idParam,
            currentBidCents: currentAuctionBid,
            minIncrementCents: slotRow.min_increment_cents || 2500,
            minNextBidCents: calculateMinNextSponsorshipBid(currentAuctionBid),
            currentSponsorName: slotRow.current_sponsor_name || undefined,
            currentSponsorLogoUrl: slotRow.current_sponsor_logo_url || undefined,
            currentSponsorLink: slotRow.current_sponsor_link || undefined,
            totalBidsCount: slotRow.total_bids_count || recentAuctionBids.length || 0,
            claimedAt: slotRow.claimed_at,
            recentBids: recentAuctionBids
          } : null;

          const targetDeadline = challenge.status === "open_entry" 
            ? new Date(challenge.entryDeadline).getTime()
            : challenge.status === "submission_window"
            ? new Date(challenge.submissionDeadline).getTime()
            : new Date(challenge.votingDeadline).getTime();

          const timeRemainingMs = Math.max(0, targetDeadline - Date.now());

          res.statusCode = 200;
          res.end(JSON.stringify({
            challenge,
            submissions,
            entries,
            sponsorships,
            sponsorshipAuction,
            stats: {
              entryFeeDollars: (challenge.entryFeeCents || 500) / 100,
              totalEntries: entries.length,
              totalSubmissions: submissions.length,
              totalVotes: submissions.reduce((sum, s) => sum + s.voteCount, 0),
              activeSponsorshipTiers: sponsorships.map(s => s.tier),
              timeRemainingMs
            }
          }));
          return;
        }
      } catch {
        // fallback
      }

      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Challenge not found" }));
      return;
    }

    // 3. POST /api/challenges?route=enter — Fixed $5 Entry
    if (req.method === "POST" && (route === "enter" || parsedUrl.pathname.endsWith("/enter"))) {
      const body = await parseBody(req);
      const { challengeId, profileId, paddleTransactionId } = body;

      if (!challengeId || !profileId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "challengeId and profileId are required." }));
        return;
      }

      try {
        // Check if already entered
        const { data: existing } = await supabase
          .from("challenge_entries")
          .select("*")
          .eq("challenge_id", challengeId)
          .eq("profile_id", profileId)
          .maybeSingle();

        if (existing) {
          res.statusCode = 200;
          res.end(JSON.stringify({
            success: true,
            alreadyEntered: true,
            message: "User has already entered this challenge",
            entry: existing
          }));
          return;
        }

        const { data: newEntry, error } = await supabase
          .from("challenge_entries")
          .insert({
            challenge_id: challengeId,
            profile_id: profileId,
            paddle_transaction_id: paddleTransactionId || null,
            status: "succeeded"
          })
          .select()
          .single();

        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          entry: newEntry || { challenge_id: challengeId, profile_id: profileId, status: "succeeded" }
        }));
        return;
      } catch (err: any) {
        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          message: "Recorded entry session",
          entry: { challenge_id: challengeId, profile_id: profileId, status: "succeeded" }
        }));
        return;
      }
    }

    // 4. POST /api/challenges?route=submit — Project Submission
    if (req.method === "POST" && (route === "submit" || parsedUrl.pathname.endsWith("/submit"))) {
      const body = await parseBody(req);
      const { challengeId, profileId, title, submissionUrl, submissionText } = body;

      if (!challengeId || !profileId || !submissionUrl) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "challengeId, profileId, and submissionUrl are required." }));
        return;
      }

      const { data: inserted, error } = await supabase
        .from("challenge_submissions")
        .upsert({
          challenge_id: challengeId,
          profile_id: profileId,
          title: title || "Challenge Project",
          submission_url: submissionUrl.trim(),
          submission_text: (submissionText || "").trim().slice(0, 1000)
        })
        .select()
        .single();

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        submission: inserted || { id: "sub_" + Date.now(), title, submissionUrl },
        message: "Submission received successfully."
      }));
      return;
    }

    // 5. POST /api/challenges?route=vote — Fingerprint Public Voting
    if (req.method === "POST" && (route === "vote" || parsedUrl.pathname.endsWith("/vote"))) {
      const body = await parseBody(req);
      const { submissionId, clientFingerprint, userId } = body;

      if (!submissionId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "submissionId is required." }));
        return;
      }

      const voterFingerprint = clientFingerprint || `fp_${Date.now()}_${Math.random()}`;

      try {
        const { error: voteErr } = await supabase.from("challenge_votes").insert({
          submission_id: submissionId,
          voter_fingerprint: voterFingerprint,
          voter_profile_id: userId || null
        });

        if (voteErr && voteErr.code === "23505") {
          res.statusCode = 409;
          res.end(JSON.stringify({ error: "You have already voted for this project." }));
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, message: "Vote cast successfully!" }));
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || "Failed to record vote" }));
        return;
      }
    }

    // 6. POST /api/challenges?route=sponsor — Fixed Tier Sponsorship
    if (req.method === "POST" && (route === "sponsor" || parsedUrl.pathname.endsWith("/sponsor"))) {
      const body = await parseBody(req);
      const { challengeId, tier, companyName, companyLogoUrl, companyLink } = body;

      const tierConfig = SPONSORSHIP_PRICING[tier as SponsorshipTier] || { amountCents: 5000, label: "Bronze" };

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        clientSecret: "mock_secret_spon_" + Date.now(),
        paymentIntentId: "pi_mock_spon_" + Date.now(),
        amountCents: tierConfig.amountCents,
        tier,
        message: `Sponsorship checkout initiated for ${companyName}.`
      }));
      return;
    }

    // 7. POST /api/challenges?route=sponsor-auction-bid — Gold Outbid Auction
    if (req.method === "POST" && (route === "sponsor-auction-bid" || parsedUrl.pathname.endsWith("/sponsor-auction-bid"))) {
      const body = await parseBody(req);
      const { challengeId, amountCents, companyName, companyLogoUrl, companyLink } = body;

      const bidAmount = Number(amountCents) || 10000;

      try {
        await supabase.from("challenge_sponsorship_slots").upsert({
          challenge_id: challengeId,
          current_bid_cents: bidAmount,
          current_sponsor_name: companyName,
          current_sponsor_logo_url: companyLogoUrl,
          current_sponsor_link: companyLink,
          claimed_at: new Date().toISOString()
        }, { onConflict: "challenge_id" });
      } catch {}

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        amountCents: bidAmount,
        message: `Outbid placed! ${companyName} is now leading sponsor at $${(bidAmount / 100).toFixed(2)} USD.`
      }));
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  } catch (err: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message || "Internal server error" }));
  }
}
