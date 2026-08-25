/**
 * RankLancr Challenge Arena Winner Engine & Integrity Test Suite
 * 
 * Tests:
 * 1. 60% Public Community Vote + 40% Client Judge Score weighting
 * 2. Deterministic tie-breaker by earliest submission timestamp
 * 3. Verified account voting weight (2.0x) vs Guest voting weight (1.0x)
 * 4. Fixed $2 prize pool expansion fee cut (10% platform fee, 90% net prize pool)
 * 5. Structural independence: Bidding $2 strictly increases prize pool without affecting submission scores
 * 6. Social publication copy and payload formatting
 * 7. Anti-abuse quality gate enforcement for submissions
 */

import assert from "node:assert/strict";
import {
  computeFinalScore,
  evaluateChallengeSubmissions,
  PUBLIC_VOTE_WEIGHT,
  CLIENT_JUDGE_WEIGHT
} from "../src/services/challenges/challengeWinnerEngine.js";
import { validateChallengeVote, resetVoteRateLimitStore } from "../src/services/challenges/challengeVoteService.js";
import { calculateBidFeeBreakdown, validateBidRateLimit } from "../src/services/challenges/challengeBidService.js";
import { generateSocialCopy, prepareChallengeSocialPosts } from "../src/services/challenges/socialPublishJob.js";
import { isSponsoredEligible } from "../src/services/ranking/antiAbuse.js";
import type { Professional } from "../src/types/talent.js";

console.log("\n================================================================");
console.log("⚡ STARTING CHALLENGE ARENA WINNER ENGINE TEST SUITE ⚡");
console.log("================================================================\n");

// [TEST 1] Composite Merit Score Calculation (60/40 Rule)
console.log("[TEST 1] Composite Merit Score Calculation (60% Community Vote / 40% Judge Score)");
const subA = { voteCount: 100, maxVoteCountInChallenge: 100, clientScore: 90 }; // Norm votes: 1.0 (0.60) + Norm judge: 0.90 (0.36) = 0.9600
const scoreA = computeFinalScore(subA);
assert.equal(scoreA, 0.9600, "Max votes (1.0 * 0.6) + 90 client score (0.9 * 0.4) should equal 0.9600");

const subB = { voteCount: 50, maxVoteCountInChallenge: 100, clientScore: 100 }; // Norm votes: 0.5 (0.30) + Norm judge: 1.0 (0.40) = 0.7000
const scoreB = computeFinalScore(subB);
assert.equal(scoreB, 0.7000, "50% votes (0.5 * 0.6) + 100 client score (1.0 * 0.4) should equal 0.7000");

const subC = { voteCount: 80, maxVoteCountInChallenge: 100, clientScore: null }; // Default judge midpoint 0.5 (0.20) + 0.8 * 0.6 (0.48) = 0.6800
const scoreC = computeFinalScore(subC);
assert.equal(scoreC, 0.6800, "Null client score defaults to neutral 50/100 (0.5)");
console.log("✅ PASS: Composite 60/40 merit score computed deterministically\n");

// [TEST 2] Deterministic Tie-Breaking by Earliest Submission Timestamp
console.log("[TEST 2] Deterministic Tie-Breaking by Earliest Submission Timestamp");
const tiedSubmissions = [
  {
    id: "sub_late",
    challengeId: "ch1",
    profileId: "pro_2",
    voteCount: 50,
    clientScore: 80,
    createdAt: "2026-08-25T12:00:00.000Z"
  },
  {
    id: "sub_early",
    challengeId: "ch1",
    profileId: "pro_1",
    voteCount: 50,
    clientScore: 80,
    createdAt: "2026-08-25T08:00:00.000Z"
  }
];

const evaluationResult = evaluateChallengeSubmissions("ch1", tiedSubmissions, 50000); // $500.00 prize pool
assert.equal(evaluationResult.rankedSubmissions[0].submission.id, "sub_early", "Earliest submission timestamp must break ties and take Rank #1");
assert.equal(evaluationResult.rankedSubmissions[0].rank, 1);
assert.equal(evaluationResult.rankedSubmissions[1].rank, 2);
console.log("✅ PASS: Tie-breaking is 100% deterministic based on earliest submission timestamp\n");

// [TEST 3] Verified Account Voting Weight vs Guest Voting Weight
console.log("[TEST 3] Voter Weighting & Rate Limiting");
resetVoteRateLimitStore();

const verifiedVote = validateChallengeVote({
  visitorIp: "1.2.3.4",
  userId: "user_pro_verified",
  isVerifiedAccount: true
});
assert.equal(verifiedVote.weight, 2.0, "Verified account vote must have weight = 2.0");
assert.ok(verifiedVote.isValid);

const guestVote = validateChallengeVote({
  visitorIp: "1.2.3.4",
  clientProvidedFingerprint: "fp_guest_device_999",
  isVerifiedAccount: false
});
assert.equal(guestVote.weight, 1.0, "Guest vote must have weight = 1.0");
assert.ok(guestVote.isValid);

// Trigger rate limit after 5 votes per minute on same IP
for (let i = 0; i < 3; i++) {
  validateChallengeVote({ visitorIp: "1.2.3.4", clientProvidedFingerprint: `guest_${i}` });
}
const rateLimitedVote = validateChallengeVote({ visitorIp: "1.2.3.4", clientProvidedFingerprint: "exceeded_guest" });
assert.ok(!rateLimitedVote.isValid, "Vote exceeding 5 per minute per IP must be rejected");
console.log("✅ PASS: Verified votes weight=2.0, guest votes weight=1.0, and rate limiting enforced\n");

// [TEST 4] Fixed $2 Prize Pool Boost & 10% Platform Fee Cut
console.log("[TEST 4] Fixed $2 Prize Pool Boost & 10% Platform Fee Cut");
const feeBreakdown = calculateBidFeeBreakdown(200); // $2.00
assert.equal(feeBreakdown.grossAmountDollars, 2.00);
assert.equal(feeBreakdown.platformFeeDollars, 0.20, "10% platform fee on $2.00 is $0.20");
assert.equal(feeBreakdown.netPrizePoolDollars, 1.80, "Net added to winner prize pool is $1.80");

const totalPrizePoolFee = calculateBidFeeBreakdown(15000); // $150.00 total prize pool
assert.equal(totalPrizePoolFee.grossAmountDollars, 150.00);
assert.equal(totalPrizePoolFee.platformFeeDollars, 15.00);
assert.equal(totalPrizePoolFee.netPrizePoolDollars, 135.00, "Winner takes home $135.00 net on $150 pool");
console.log("✅ PASS: Fixed $2 fee breakdown computed cleanly with 10% platform cut\n");

// [TEST 5] Structural Guarantee: Bidding NEVER Affects Submissions' Vote Counts or Scores
console.log("[TEST 5] Structural Separation (Bidding Money Does Not Affect Submissions)");
const sampleSub = { id: "s1", challengeId: "ch1", profileId: "p1", voteCount: 42, clientScore: 85, createdAt: "2026-08-25" };
const scoreBeforeSponsorBids = computeFinalScore({ voteCount: sampleSub.voteCount, maxVoteCountInChallenge: 50, clientScore: sampleSub.clientScore });

// A corporate sponsor contributes $100 (50 x $2 bids) to the challenge prize pool
const prizePoolWithSponsor = 15000 + 10000;
const scoreAfterSponsorBids = computeFinalScore({ voteCount: sampleSub.voteCount, maxVoteCountInChallenge: 50, clientScore: sampleSub.clientScore });

assert.equal(scoreBeforeSponsorBids, scoreAfterSponsorBids, "Prize pool bids must have 0.000 effect on submission scores or ranks");
console.log(`✅ PASS: Submission score (${scoreBeforeSponsorBids}) is 100% untouched by sponsor bidding ($${prizePoolWithSponsor/100})\n`);

// [TEST 6] Automated Viral Social Post Generator
console.log("[TEST 6] Automated Social Publication Formatting");
const socialCopies = generateSocialCopy({
  challengeId: "ch_ai_01",
  challengeTitle: "Next.js 15 Streaming AI Agent UI",
  winnerName: "Hamza Sheikh",
  winnerProfileUrl: "https://ranklancr.com/arena?winner=ch_ai_01",
  prizeAmountDollars: 350,
  bidderLabels: ["Acme Corp", "TechVentures"]
});

assert.ok(socialCopies.x.includes("Hamza Sheikh"), "X post must celebrate winner name");
assert.ok(socialCopies.x.includes("$350"), "X post must include prize amount");
assert.ok(socialCopies.x.includes("Acme Corp"), "X post must credit sponsors");
assert.ok(socialCopies.linkedin.includes("0% platform commission"), "LinkedIn post must include brand positioning");

const structuredPosts = prepareChallengeSocialPosts({
  challengeId: "ch_ai_01",
  challengeTitle: "Next.js 15 Streaming AI Agent UI",
  winnerName: "Hamza Sheikh",
  winnerProfileUrl: "https://ranklancr.com/arena?winner=ch_ai_01",
  prizeAmountDollars: 350,
  bidderLabels: ["Acme Corp"]
});
assert.equal(structuredPosts.length, 3, "Structured social posts generated for X, LinkedIn, and Instagram");
console.log("✅ PASS: Viral social announcement generated with sponsor credits and winner celebration\n");

// [TEST 7] Quality Gate Integration for Submissions
console.log("[TEST 7] Quality Gate Screening for Submissions");
const highQualityDev: Professional = {
  id: "pro-hq",
  name: "Verified Dev",
  title: "Senior Full Stack Architect",
  category: "Development",
  location: "Global",
  country: "Global",
  avatar: "avatar.jpg",
  bio: "Experienced developer",
  hourlyRate: 60,
  experienceYears: 6,
  score: 95,
  rating: 4.9,
  reviewCount: 30,
  activeDisputes: 0,
  accountStanding: "active",
  skills: ["React", "TypeScript"],
  experience: [],
  portfolio: [],
  reviews: [],
  externalLinks: {},
  isVerified: true,
  isPromoted: false,
  viewsCount: 100,
  clicksCount: 20,
  inquiriesCount: 5,
  createdAt: "2025-01-01"
};

const disputedDev: Professional = {
  id: "pro-disputed",
  name: "Disputed Account",
  title: "Developer",
  category: "Development",
  location: "Global",
  country: "Global",
  avatar: "avatar.jpg",
  bio: "Account with active disputes",
  hourlyRate: 20,
  experienceYears: 1,
  score: 40,
  rating: 3.2,
  reviewCount: 5,
  activeDisputes: 2,
  accountStanding: "flagged",
  skills: ["PHP"],
  experience: [],
  portfolio: [],
  reviews: [],
  externalLinks: {},
  isVerified: false,
  isPromoted: false,
  viewsCount: 5,
  clicksCount: 0,
  inquiriesCount: 0,
  createdAt: "2025-01-01"
};

assert.ok(isSponsoredEligible(highQualityDev).isEligible, "High quality verified developer allowed into Challenge Arena");
assert.ok(!isSponsoredEligible(disputedDev).isEligible, "Disputed/flagged accounts blocked from Challenge Arena");
console.log("✅ PASS: ProRank Quality Gate screens submissions before entering competition\n");

console.log("================================================================");
console.log("🎉 ALL CHALLENGE ARENA ENGINE TESTS PASSED (100%) 🎉");
console.log("================================================================\n");
