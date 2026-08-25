import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { evaluateChallengeSubmissions } from "../src/services/challenges/challengeWinnerEngine.js";
import { validateChallengeVote } from "../src/services/challenges/challengeVoteService.js";
import { calculateBidFeeBreakdown, validateBidRateLimit, sanitizeBidderInput } from "../src/services/challenges/challengeBidService.js";
import { prepareChallengeSocialPosts, dispatchSocialPublication } from "../src/services/challenges/socialPublishJob.js";
import { isSponsoredEligible } from "../src/services/ranking/antiAbuse.js";
import type { Challenge, ChallengeSubmission, ChallengeBid } from "../src/types/challenge.js";

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
  prompt: "Build a lightning-fast Next.js 15 UI with streaming AI responses, keyboard navigation shortcuts, and zero layout shift. Winner takes 100% of the public prize pool!",
  bannerImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
  status: "open",
  submissionDeadline: new Date(Date.now() + 5 * 86400000).toISOString(),
  votingDeadline: new Date(Date.now() + 7 * 86400000).toISOString(),
  prizePoolCents: 15000,
  platformFeeBps: 1000,
  createdAt: new Date().toISOString()
};

let MOCK_SUBMISSIONS: ChallengeSubmission[] = [];
let MOCK_BIDS: ChallengeBid[] = [];

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
  // CORS & Security Headers
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
  const statusParam = parsedUrl.searchParams.get("status") || "open";

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
          categoryId: row.category_id,
          category: row.category || "Development",
          title: row.title,
          prompt: row.prompt,
          bannerImage: row.banner_image,
          status: row.status,
          submissionDeadline: row.submission_deadline,
          votingDeadline: row.voting_deadline,
          prizePoolCents: row.prize_pool_cents,
          platformFeeBps: row.platform_fee_bps,
          winnerSubmissionId: row.winner_submission_id,
          createdAt: row.created_at
        }));
        res.statusCode = 200;
        res.end(JSON.stringify({ challenges: mapped }));
        return;
      }
    } catch {
      // Fallback
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ challenges: [MOCK_CHALLENGE] }));
    return;
  }

  // =========================================================================
  // 2. GET /api/challenges?id=:id — Challenge Detail + Submissions + Bids
  // =========================================================================
  if (req.method === "GET" && idParam) {
    try {
      const [chRes, subRes, bidRes] = await Promise.all([
        supabase.from("challenges").select("*").eq("id", idParam).single(),
        supabase.from("challenge_submissions").select("*, profiles(*)").eq("challenge_id", idParam).order("vote_count", { ascending: false }),
        supabase.from("challenge_bids").select("*").eq("challenge_id", idParam).eq("status", "succeeded").order("created_at", { ascending: false }).limit(10)
      ]);

      if (chRes.data) {
        const ch = chRes.data;
        const submissions: ChallengeSubmission[] = (subRes.data || []).map(s => ({
          id: s.id,
          challengeId: s.challenge_id,
          profileId: s.profile_id,
          authorName: s.profiles?.name || "Anonymous Builder",
          authorAvatar: s.profiles?.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
          authorTitle: s.profiles?.headline || "Developer",
          authorScore: s.profiles?.cached_score || 85,
          authorVerified: Boolean(s.profiles?.is_verified),
          title: s.title || s.submission_text?.slice(0, 40) || "Challenge Entry",
          submissionUrl: s.submission_url,
          submissionText: s.submission_text,
          demoVideoUrl: s.demo_video_url,
          voteCount: Number(s.vote_count || 0),
          clientScore: s.client_score != null ? Number(s.client_score) : null,
          finalRank: s.final_rank,
          createdAt: s.created_at
        }));

        const recentBids: ChallengeBid[] = (bidRes.data || []).map(b => ({
          id: b.id,
          challengeId: b.challenge_id,
          bidderProfileId: b.bidder_profile_id,
          bidderLabel: b.bidder_label,
          bidderMessage: b.bidder_message,
          bidderAvatar: b.bidder_avatar,
          amountCents: b.amount_cents,
          stripePaymentIntentId: b.stripe_payment_intent_id,
          status: b.status,
          createdAt: b.created_at
        }));

        const totalPrizePoolCents = ch.prize_pool_cents || 0;
        const feeBreakdown = calculateBidFeeBreakdown(totalPrizePoolCents, ch.platform_fee_bps || 1000);

        res.statusCode = 200;
        res.end(JSON.stringify({
          challenge: {
            id: ch.id,
            category: ch.category,
            title: ch.title,
            prompt: ch.prompt,
            bannerImage: ch.banner_image,
            status: ch.status,
            submissionDeadline: ch.submission_deadline,
            votingDeadline: ch.voting_deadline,
            prizePoolCents: ch.prize_pool_cents,
            platformFeeBps: ch.platform_fee_bps,
            winnerSubmissionId: ch.winner_submission_id,
            createdAt: ch.created_at
          },
          submissions,
          recentBids,
          stats: {
            totalPrizePoolDollars: Number((totalPrizePoolCents / 100).toFixed(2)),
            netWinnerPrizeDollars: feeBreakdown.netPrizePoolDollars,
            platformFeeDollars: feeBreakdown.platformFeeDollars,
            totalSubmissions: submissions.length,
            totalVotes: submissions.reduce((acc, s) => acc + s.voteCount, 0),
            totalBids: recentBids.length,
            timeRemainingMs: Math.max(0, new Date(ch.voting_deadline).getTime() - Date.now())
          }
        }));
        return;
      }
    } catch {
      // fallback
    }

    res.statusCode = 200;
    res.end(JSON.stringify({
      challenge: MOCK_CHALLENGE,
      submissions: MOCK_SUBMISSIONS,
      recentBids: MOCK_BIDS,
      stats: {
        totalPrizePoolDollars: 150,
        netWinnerPrizeDollars: 135,
        platformFeeDollars: 15,
        totalSubmissions: MOCK_SUBMISSIONS.length,
        totalVotes: 0,
        totalBids: MOCK_BIDS.length,
        timeRemainingMs: Math.max(0, new Date(MOCK_CHALLENGE.votingDeadline).getTime() - Date.now())
      }
    }));
    return;
  }

  // =========================================================================
  // 3. POST /api/challenges?route=submit — Submit Entry
  // =========================================================================
  if (req.method === "POST" && route === "submit") {
    const body = await parseBody(req);
    const { challengeId, profileId, title, submissionUrl, submissionText, demoVideoUrl } = body;

    if (!challengeId || !profileId || !submissionUrl) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "challengeId, profileId, and submissionUrl are required." }));
      return;
    }

    try {
      // 1. Verify profile quality & anti-abuse eligibility
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", profileId).single();
      if (profile) {
        const eligibility = isSponsoredEligible({
          id: profile.id,
          name: profile.name,
          rating: profile.rating,
          reviewCount: profile.review_count,
          activeDisputes: profile.active_disputes,
          accountStanding: profile.account_standing
        } as any);

        if (!eligibility.isEligible) {
          res.statusCode = 403;
          res.end(JSON.stringify({ error: "Profile does not meet eligibility requirements for Challenge Arena.", reasons: eligibility.reasons }));
          return;
        }
      }

      // 2. Insert submission
      const { data: inserted, error: insertErr } = await supabase.from("challenge_submissions").insert({
        challenge_id: challengeId,
        profile_id: profileId,
        title: title || "Challenge Entry",
        submission_url: submissionUrl,
        submission_text: submissionText || "",
        demo_video_url: demoVideoUrl || null,
        vote_count: 0
      }).select().single();

      if (insertErr) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: insertErr.message }));
        return;
      }

      res.statusCode = 201;
      res.end(JSON.stringify({ success: true, submission: inserted }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to submit challenge entry." }));
      return;
    }
  }

  // =========================================================================
  // 4. POST /api/challenges?route=vote — Cast Verified/Guest Vote
  // =========================================================================
  if (req.method === "POST" && route === "vote") {
    const body = await parseBody(req);
    const { submissionId, voterProfileId, clientFingerprint } = body;

    if (!submissionId) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "submissionId is required." }));
      return;
    }

    // Rate-limit & fingerprint validation
    const voteValidation = validateChallengeVote({
      visitorIp,
      userAgent: req.headers?.["user-agent"],
      clientProvidedFingerprint: clientFingerprint,
      userId: voterProfileId,
      isVerifiedAccount: Boolean(voterProfileId)
    });

    if (!voteValidation.isValid) {
      res.statusCode = 429;
      res.end(JSON.stringify({ error: voteValidation.rejectionReason }));
      return;
    }

    try {
      const { data: vote, error: voteErr } = await supabase.from("challenge_votes").insert({
        submission_id: submissionId,
        voter_profile_id: voterProfileId || null,
        voter_fingerprint: voteValidation.fingerprint,
        voter_ip: visitorIp,
        weight: voteValidation.weight
      }).select().single();

      if (voteErr) {
        if (voteErr.code === "23505") { // Unique constraint violation
          res.statusCode = 409;
          res.end(JSON.stringify({ error: "You have already voted for this submission." }));
          return;
        }
        res.statusCode = 400;
        res.end(JSON.stringify({ error: voteErr.message }));
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, weight: voteValidation.weight, voteId: vote.id }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to record vote." }));
      return;
    }
  }

  // =========================================================================
  // 5. POST /api/challenges?route=bid — Fixed $2 Prize Pool Boost
  // =========================================================================
  if (req.method === "POST" && route === "bid") {
    const body = await parseBody(req);
    const { challengeId, bidderProfileId, bidderLabel, bidderMessage, bidderAvatar } = body;

    if (!challengeId) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "challengeId is required." }));
      return;
    }

    const rateLimit = validateBidRateLimit(visitorIp);
    if (!rateLimit.isAllowed) {
      res.statusCode = 429;
      res.end(JSON.stringify({ error: rateLimit.rejectionReason }));
      return;
    }

    const { cleanLabel, cleanMessage } = sanitizeBidderInput(bidderLabel, bidderMessage);
    const feeBreakdown = calculateBidFeeBreakdown(200); // Fixed $2.00

    try {
      if (stripe) {
        // Create Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: 200, // $2.00
          currency: "usd",
          automatic_payment_methods: { enabled: true },
          metadata: {
            type: "challenge_bid",
            challenge_id: challengeId,
            bidder_profile_id: bidderProfileId || "",
            bidder_label: cleanLabel,
            bidder_message: cleanMessage || ""
          }
        });

        res.statusCode = 200;
        res.end(JSON.stringify({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amountDollars: 2.00,
          feeBreakdown
        }));
        return;
      }

      // In test / fallback mode without Stripe key: directly record completed bid
      const mockIntentId = `pi_mock_bid_${Date.now()}`;
      await supabase.from("challenge_bids").insert({
        challenge_id: challengeId,
        bidder_profile_id: bidderProfileId || null,
        bidder_label: cleanLabel,
        bidder_message: cleanMessage || null,
        bidder_avatar: bidderAvatar || null,
        amount_cents: 200,
        stripe_payment_intent_id: mockIntentId,
        status: "succeeded"
      });

      // Update mock state
      MOCK_CHALLENGE.prizePoolCents += 200;

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: "Fixed $2 boost added to prize pool!",
        feeBreakdown
      }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to process bid." }));
      return;
    }
  }

  // =========================================================================
  // 6. POST /api/challenges?route=cron-winner-selection — Winner Selection Cron
  // =========================================================================
  if (req.method === "POST" && route === "cron-winner-selection") {
    try {
      const nowIso = new Date().toISOString();
      const { data: expiredChallenges } = await supabase
        .from("challenges")
        .select("*")
        .in("status", ["open", "judging"])
        .lte("voting_deadline", nowIso);

      const evaluatedResults = [];

      if (expiredChallenges && expiredChallenges.length > 0) {
        for (const ch of expiredChallenges) {
          const { data: submissions } = await supabase
            .from("challenge_submissions")
            .select("*, profiles(*)")
            .eq("challenge_id", ch.id);

          const { data: bids } = await supabase
            .from("challenge_bids")
            .select("bidder_label")
            .eq("challenge_id", ch.id)
            .eq("status", "succeeded");

          const evaluation = evaluateChallengeSubmissions(
            ch.id,
            (submissions || []).map(s => ({
              id: s.id,
              challengeId: s.challenge_id,
              profileId: s.profile_id,
              voteCount: Number(s.vote_count || 0),
              clientScore: s.client_score != null ? Number(s.client_score) : null,
              createdAt: s.created_at,
              authorName: s.profiles?.name || "Anonymous Builder"
            })),
            ch.prize_pool_cents,
            ch.platform_fee_bps
          );

          // Update final ranks in DB
          for (const ranked of evaluation.rankedSubmissions) {
            await supabase
              .from("challenge_submissions")
              .update({ final_rank: ranked.rank })
              .eq("id", ranked.submission.id);
          }

          // Close challenge and record winner
          const winnerSubId = evaluation.winner ? evaluation.winner.submission.id : null;
          await supabase
            .from("challenges")
            .update({
              status: "closed",
              winner_submission_id: winnerSubId
            })
            .eq("id", ch.id);

          // Automated Social Publication
          if (evaluation.winner) {
            const winnerName = (evaluation.winner.submission as any).authorName || "Champion";
            const bidderLabels = (bids || []).map(b => b.bidder_label).filter(Boolean);

            const socialPosts = prepareChallengeSocialPosts({
              challengeId: ch.id,
              challengeTitle: ch.title,
              winnerName,
              winnerProfileUrl: `https://ranklancr.com/arena?winner=${ch.id}`,
              prizeAmountDollars: evaluation.prizeDistribution.winnerPayoutDollars,
              bidderLabels
            });

            for (const p of socialPosts) {
              const dispatched = await dispatchSocialPublication(p, ch.id);
              await supabase.from("challenge_social_posts").insert({
                challenge_id: ch.id,
                platform: dispatched.platform,
                post_url: dispatched.postUrl,
                caption: dispatched.caption,
                status: dispatched.status,
                retry_count: dispatched.retryCount
              });
            }
          }

          evaluatedResults.push({
            challengeId: ch.id,
            winner: evaluation.winner?.submission.id,
            payoutDollars: evaluation.prizeDistribution.winnerPayoutDollars
          });
        }
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, evaluatedCount: evaluatedResults.length, results: evaluatedResults }));
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || "Failed to run winner selection cron." }));
      return;
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Endpoint not found" }));
}
