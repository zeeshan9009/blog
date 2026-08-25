import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { rankSubmissions, applyChallengeRewards } from "../src/services/challenges/challengeWinnerEngine.js";
import { validateChallengeVote } from "../src/services/challenges/challengeVoteService.js";
import { SPONSORSHIP_PRICING, checkSponsorshipAvailability } from "../src/services/challenges/sponsorshipService.js";
import {
  calculateMinNextSponsorshipBid,
  validateSponsorshipAuctionBid,
  recordSponsorshipAuctionBid
} from "../src/services/challenges/sponsorshipAuctionEngine.js";
import { isSponsoredEligible } from "../src/services/ranking/antiAbuse.js";
import type {
  Challenge,
  ChallengeSubmission,
  ChallengeEntry,
  ChallengeSponsorship,
  ChallengeSponsorshipAuction,
  SponsorshipBidRecord,
  SponsorshipTier
} from "../src/types/challenge.js";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" as any }) : null;

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fallback in-memory state for seed challenge when offline
let MOCK_CHALLENGE: Challenge = {
  id: "11111111-1111-1111-1111-111111111111",
  category: "Development",
  title: "Next.js 15 & AI Agent Interface Challenge",
  prompt: "Build a lightning-fast Next.js 15 UI with streaming AI responses, keyboard navigation shortcuts, and zero layout shift. Winner earns 72h site-wide Top Developer Rail placement!",
  bannerImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
  status: "open_entry",
  entryDeadline: new Date(Date.now() + 2 * 86400000).toISOString(),
  submissionDeadline: new Date(Date.now() + 5 * 86400000).toISOString(),
  votingDeadline: new Date(Date.now() + 8 * 86400000).toISOString(),
  entryFeeCents: 500,
  createdAt: new Date().toISOString()
};

let MOCK_ENTRIES: ChallengeEntry[] = [];
let MOCK_SUBMISSIONS: ChallengeSubmission[] = [];
let MOCK_SPONSORSHIPS: ChallengeSponsorship[] = [];
let MOCK_AUCTION_SLOT: ChallengeSponsorshipAuction = {
  id: "slot-default",
  challengeId: "11111111-1111-1111-1111-111111111111",
  currentBidCents: 12500, // $125.00
  minIncrementCents: 2500,
  minNextBidCents: 15000,
  currentSponsorName: "Supastack AI",
  currentSponsorLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
  currentSponsorLink: "https://supastack.ai",
  totalBidsCount: 1,
  recentBids: [
    {
      id: "bid-1",
      challengeId: "11111111-1111-1111-1111-111111111111",
      companyName: "Supastack AI",
      companyLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
      companyLink: "https://supastack.ai",
      amountCents: 12500,
      createdAt: new Date().toISOString()
    }
  ]
};

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

  const host = req.headers?.host || "localhost";
  const rawUrl = req.url || "/";
  const parsedUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `http://${host}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`);
  const route = parsedUrl.searchParams.get("route") || "";
  const idParam = parsedUrl.searchParams.get("id") || "";
  const statusParam = parsedUrl.searchParams.get("status") || "";

  const visitorIp = (req.headers?.["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket?.remoteAddress || "anon";

  // =========================================================================
  // 1. GET /api/challenges — List challenges (60s Edge Cached)
  // =========================================================================
  if (req.method === "GET" && !idParam && !route) {
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120, max-age=10");

    try {
      let query = supabase.from("challenges").select("*");
      if (statusParam && statusParam !== "all") {
        query = query.eq("status", statusParam);
      }
      query = query.order("created_at", { ascending: false }).limit(20);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const mapped = data.map(row => ({
          id: row.id,
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
      // Fall back to memory mock
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ challenges: [MOCK_CHALLENGE] }));
    return;
  }

  // =========================================================================
  // 2. GET /api/challenges?id=:id — Challenge Details with Live Auction State
  // =========================================================================
  if (req.method === "GET" && idParam && !route) {
    try {
      const [chRes, subRes, entRes, sponRes, slotRes, bidsRes] = await Promise.all([
        supabase.from("challenges").select("*").eq("id", idParam).single(),
        supabase.from("challenge_submissions").select("*, profiles(*)").eq("challenge_id", idParam).order("vote_count", { ascending: false }),
        supabase.from("challenge_entries").select("*").eq("challenge_id", idParam).eq("status", "succeeded"),
        supabase.from("challenge_sponsorships").select("*").eq("challenge_id", idParam).eq("status", "succeeded"),
        supabase.from("challenge_sponsorship_slots").select("*").eq("challenge_id", idParam).maybeSingle(),
        supabase.from("challenge_sponsorship_bids").select("*").eq("challenge_id", idParam).eq("status", "succeeded").order("created_at", { ascending: false }).limit(10)
      ]);

      if (chRes.data) {
        const row = chRes.data;
        const challenge: Challenge = {
          id: row.id,
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
        const sponsorshipAuction: ChallengeSponsorshipAuction = {
          id: slotRow?.id || "slot_" + idParam,
          challengeId: idParam,
          currentBidCents: currentAuctionBid,
          minIncrementCents: slotRow?.min_increment_cents || 2500,
          minNextBidCents: calculateMinNextSponsorshipBid(currentAuctionBid),
          currentSponsorName: slotRow?.current_sponsor_name || "Supastack AI",
          currentSponsorLogoUrl: slotRow?.current_sponsor_logo_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
          currentSponsorLink: slotRow?.current_sponsor_link || "https://supastack.ai",
          totalBidsCount: slotRow?.total_bids_count || recentAuctionBids.length || 1,
          claimedAt: slotRow?.claimed_at,
          recentBids: recentAuctionBids.length > 0 ? recentAuctionBids : MOCK_AUCTION_SLOT.recentBids
        };

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
      // Fallback
    }

    res.statusCode = 200;
    res.end(JSON.stringify({
      challenge: MOCK_CHALLENGE,
      submissions: MOCK_SUBMISSIONS,
      entries: MOCK_ENTRIES,
      sponsorships: MOCK_SPONSORSHIPS,
      sponsorshipAuction: MOCK_AUCTION_SLOT,
      stats: {
        entryFeeDollars: 5.0,
        totalEntries: MOCK_ENTRIES.length,
        totalSubmissions: MOCK_SUBMISSIONS.length,
        totalVotes: 0,
        activeSponsorshipTiers: [],
        timeRemainingMs: 3 * 86400000
      }
    }));
    return;
  }

  // =========================================================================
  // 3. POST /api/challenges?route=enter — Fixed $5 Challenge Entry Fee
  // =========================================================================
  if (req.method === "POST" && (route === "enter" || parsedUrl.pathname.endsWith("/enter"))) {
    const body = await parseBody(req);
    const { challengeId, profileId } = body;

    if (!challengeId || !profileId) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "challengeId and profileId are required." }));
      return;
    }

    try {
      const { data: challenge } = await supabase
        .from("challenges")
        .select("status, entry_fee_cents")
        .eq("id", challengeId)
        .single();

      if (challenge && challenge.status !== "open_entry") {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: `Entries are closed. Challenge is currently in '${challenge.status}' phase.` }));
        return;
      }

      const { data: existing } = await supabase
        .from("challenge_entries")
        .select("id")
        .eq("challenge_id", challengeId)
        .eq("profile_id", profileId)
        .eq("status", "succeeded")
        .maybeSingle();

      if (existing) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "You have already entered this challenge." }));
        return;
      }

      const entryFeeCents = challenge?.entry_fee_cents || 500;
      let clientSecret = "mock_secret_entry_" + Date.now();
      let paymentIntentId = "pi_mock_entry_" + Date.now();

      if (stripe) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: entryFeeCents,
          currency: "usd",
          automatic_payment_methods: { enabled: true },
          metadata: {
            type: "challenge_entry",
            challengeId,
            profileId
          }
        });
        clientSecret = paymentIntent.client_secret || "";
        paymentIntentId = paymentIntent.id;
      }

      MOCK_ENTRIES.push({
        id: "ent_" + Date.now(),
        challengeId,
        profileId,
        stripePaymentIntentId: paymentIntentId,
        status: "succeeded",
        createdAt: new Date().toISOString()
      });

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        clientSecret,
        paymentIntentId,
        amountCents: entryFeeCents,
        message: "PaymentIntent created for $5.00 fixed entry fee."
      }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to initiate challenge entry" }));
      return;
    }
  }

  // =========================================================================
  // 4. POST /api/challenges?route=submit — Submit Entry (Link + Description)
  // =========================================================================
  if (req.method === "POST" && (route === "submit" || parsedUrl.pathname.endsWith("/submit"))) {
    const body = await parseBody(req);
    const { challengeId, profileId, title, submissionUrl, submissionText } = body;

    if (!challengeId || !profileId || !submissionUrl) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "challengeId, profileId, and submissionUrl are required." }));
      return;
    }

    try {
      new URL(submissionUrl);
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid submission URL. Must be a valid HTTP/HTTPS URL." }));
      return;
    }

    try {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", profileId).single();
      if (profile && !isSponsoredEligible(profile as any)) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: "Account is not eligible to submit. Ensure your account is in good standing." }));
        return;
      }

      const { data: inserted, error: insertErr } = await supabase
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

      if (insertErr) {
        const newSub: ChallengeSubmission = {
          id: "sub_" + Date.now(),
          challengeId,
          profileId,
          authorName: profile?.name || "Participant",
          authorAvatar: profile?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileId)}`,
          authorTitle: profile?.headline || "Developer",
          authorScore: profile?.professional_score || 80,
          authorVerified: true,
          title: title || "Challenge Project",
          submissionUrl: submissionUrl.trim(),
          submissionText: (submissionText || "").trim(),
          voteCount: 0,
          createdAt: new Date().toISOString()
        };
        MOCK_SUBMISSIONS.push(newSub);
      }

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        submission: inserted || MOCK_SUBMISSIONS[MOCK_SUBMISSIONS.length - 1],
        message: "Submission received successfully."
      }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to save submission" }));
      return;
    }
  }

  // =========================================================================
  // 5. POST /api/challenges?route=vote — Public Fingerprint-Verified Voting
  // =========================================================================
  if (req.method === "POST" && (route === "vote" || parsedUrl.pathname.endsWith("/vote"))) {
    const body = await parseBody(req);
    const { submissionId, clientFingerprint, userId } = body;

    if (!submissionId) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "submissionId is required." }));
      return;
    }

    const voteVal = validateChallengeVote({
      visitorIp,
      userAgent: req.headers["user-agent"],
      clientProvidedFingerprint: clientFingerprint,
      userId
    });

    if (!voteVal.isValid) {
      res.statusCode = 429;
      res.end(JSON.stringify({ error: voteVal.rejectionReason || "Vote rejected by rate limiter." }));
      return;
    }

    try {
      const { error: voteErr } = await supabase.from("challenge_votes").insert({
        submission_id: submissionId,
        voter_fingerprint: voteVal.fingerprint,
        voter_profile_id: userId || null
      });

      if (voteErr && voteErr.code === "23505") {
        res.statusCode = 409;
        res.end(JSON.stringify({ error: "You have already voted for this project." }));
        return;
      }

      const foundSub = MOCK_SUBMISSIONS.find(s => s.id === submissionId);
      if (foundSub) {
        foundSub.voteCount += 1;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: "Vote cast successfully!"
      }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to record vote" }));
      return;
    }
  }

  // =========================================================================
  // 6. POST /api/challenges?route=sponsor — Fixed Tier Sponsorship (Bronze/Silver)
  // =========================================================================
  if (req.method === "POST" && (route === "sponsor" || parsedUrl.pathname.endsWith("/sponsor"))) {
    const body = await parseBody(req);
    const { challengeId, tier, companyName, companyLogoUrl, companyLink } = body;

    if (!challengeId || !tier || !companyName) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "challengeId, tier, and companyName are required." }));
      return;
    }

    if (!["bronze", "silver", "gold"].includes(tier)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid tier. Must be 'bronze', 'silver', or 'gold'." }));
      return;
    }

    const avail = await checkSponsorshipAvailability(challengeId, tier as SponsorshipTier);
    if (!avail.available) {
      res.statusCode = 409;
      res.end(JSON.stringify({ error: avail.reason || "Tier is not available." }));
      return;
    }

    const tierConfig = SPONSORSHIP_PRICING[tier as SponsorshipTier];
    let clientSecret = "mock_secret_spon_" + Date.now();
    let paymentIntentId = "pi_mock_spon_" + Date.now();

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: tierConfig.amountCents,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: {
          type: "challenge_sponsorship",
          challengeId,
          tier,
          companyName,
          companyLogoUrl: companyLogoUrl || "",
          companyLink: companyLink || ""
        }
      });
      clientSecret = paymentIntent.client_secret || "";
      paymentIntentId = paymentIntent.id;
    }

    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      clientSecret,
      paymentIntentId,
      amountCents: tierConfig.amountCents,
      tier,
      message: `PaymentIntent created for ${tierConfig.label}.`
    }));
    return;
  }

  // =========================================================================
  // 7. POST /api/challenges?route=sponsor-auction-bid — Ascending Outbid Auction
  // =========================================================================
  if (req.method === "POST" && (route === "sponsor-auction-bid" || parsedUrl.pathname.endsWith("/sponsor-auction-bid"))) {
    const body = await parseBody(req);
    const { challengeId, amountCents, companyName, companyLogoUrl, companyLink } = body;

    if (!challengeId || !amountCents || !companyName) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "challengeId, amountCents, and companyName are required." }));
      return;
    }

    const bidVal = await validateSponsorshipAuctionBid(challengeId, Number(amountCents));
    if (!bidVal.allowed) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: bidVal.reason || "Bid rejected." }));
      return;
    }

    let clientSecret = "mock_secret_auction_" + Date.now();
    let paymentIntentId = "pi_mock_auction_" + Date.now();

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amountCents),
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: {
          type: "challenge_sponsorship_auction",
          challengeId,
          amountCents: String(amountCents),
          companyName,
          companyLogoUrl: companyLogoUrl || "",
          companyLink: companyLink || ""
        }
      });
      clientSecret = paymentIntent.client_secret || "";
      paymentIntentId = paymentIntent.id;
    }

    // Record bid in mock / DB
    await recordSponsorshipAuctionBid({
      challengeId,
      companyName,
      companyLogoUrl,
      companyLink,
      amountCents: Number(amountCents),
      stripePaymentIntentId: paymentIntentId
    });

    MOCK_AUCTION_SLOT.currentBidCents = Number(amountCents);
    MOCK_AUCTION_SLOT.minNextBidCents = calculateMinNextSponsorshipBid(Number(amountCents));
    MOCK_AUCTION_SLOT.currentSponsorName = companyName;
    MOCK_AUCTION_SLOT.currentSponsorLogoUrl = companyLogoUrl;
    MOCK_AUCTION_SLOT.currentSponsorLink = companyLink;
    MOCK_AUCTION_SLOT.totalBidsCount += 1;
    MOCK_AUCTION_SLOT.recentBids = [
      {
        id: "bid_" + Date.now(),
        challengeId,
        companyName,
        companyLogoUrl,
        companyLink,
        amountCents: Number(amountCents),
        createdAt: new Date().toISOString()
      },
      ...(MOCK_AUCTION_SLOT.recentBids || []).slice(0, 9)
    ];

    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      clientSecret,
      paymentIntentId,
      amountCents: Number(amountCents),
      message: `Outbid successfully placed for $${(Number(amountCents) / 100).toFixed(2)} USD!`
    }));
    return;
  }

  // =========================================================================
  // 8. POST /api/challenges?route=cron — Advance State Machine & Rewards
  // =========================================================================
  if (req.method === "POST" && (route === "cron" || parsedUrl.pathname.endsWith("/cron"))) {
    const nowIso = new Date().toISOString();

    try {
      await supabase
        .from("challenges")
        .update({ status: "submission_window" })
        .eq("status", "open_entry")
        .lte("entry_deadline", nowIso);

      await supabase
        .from("challenges")
        .update({ status: "voting_window" })
        .eq("status", "submission_window")
        .lte("submission_deadline", nowIso);

      const { data: expiredVoting } = await supabase
        .from("challenges")
        .select("id")
        .eq("status", "voting_window")
        .lte("voting_deadline", nowIso);

      const resolved = [];
      if (expiredVoting && expiredVoting.length > 0) {
        for (const ch of expiredVoting) {
          const { data: subs } = await supabase
            .from("challenge_submissions")
            .select("id, profile_id, vote_count, created_at")
            .eq("challenge_id", ch.id);

          const ranked = rankSubmissions((subs || []).map((s: any) => ({
            id: s.id,
            profileId: s.profile_id,
            voteCount: Number(s.vote_count || 0),
            createdAt: s.created_at
          })));

          const resu = await applyChallengeRewards(ch.id, ranked);
          resolved.push({ challengeId: ch.id, rankedCount: ranked.length, winner: resu.winnerProfileId });
        }
      }

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        closedChallenges: resolved,
        timestamp: nowIso
      }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Cron job failed" }));
      return;
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Endpoint not found" }));
}
