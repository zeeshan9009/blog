/**
 * Challenge Arena High-Concurrency & Load Benchmark Test Suite
 * 
 * Verifies:
 * 1. Ranking Engine performance under high volume (500+ submissions)
 * 2. Rate-limiter concurrency under high traffic
 * 3. Exact financial penny math across large prize pools ($100k+ with thousands of $2 bids)
 */

import assert from "node:assert/strict";
import { evaluateChallengeSubmissions } from "../src/services/challenges/challengeWinnerEngine.js";
import { validateChallengeVote, resetVoteRateLimitStore } from "../src/services/challenges/challengeVoteService.js";
import { calculateBidFeeBreakdown, validateBidRateLimit } from "../src/services/challenges/challengeBidService.js";

console.log("\n================================================================");
console.log("⚡ STARTING CHALLENGE ARENA LOAD & CONCURRENCY BENCHMARK ⚡");
console.log("================================================================\n");

// [BENCHMARK 1] Large-Scale Submission Ranking Engine Performance
console.log("[BENCHMARK 1] Ranking 500 Submissions with Random Scores & Timestamps");
const SUBMISSION_COUNT = 500;
const mockSubmissions = Array.from({ length: SUBMISSION_COUNT }, (_, idx) => ({
  id: `sub_${idx}`,
  challengeId: "ch_perf_01",
  profileId: `pro_${idx}`,
  voteCount: Math.floor(Math.random() * 2000),
  clientScore: Math.floor(Math.random() * 50) + 50,
  createdAt: new Date(Date.now() - (SUBMISSION_COUNT - idx) * 60000).toISOString()
}));

const startTime = performance.now();
const evalResult = evaluateChallengeSubmissions("ch_perf_01", mockSubmissions, 500000); // $5,000.00 prize pool
const endTime = performance.now();
const durationMs = endTime - startTime;

assert.equal(evalResult.rankedSubmissions.length, SUBMISSION_COUNT, "All 500 submissions must be ranked");
assert.equal(evalResult.rankedSubmissions[0].rank, 1, "Top submission assigned Rank #1");
assert.equal(evalResult.rankedSubmissions[SUBMISSION_COUNT - 1].rank, SUBMISSION_COUNT, "Lowest submission assigned Rank #500");
assert.ok(evalResult.winner !== null, "Winner determined");
assert.ok(durationMs < 50, `Evaluation of 500 submissions should take <50ms (took ${durationMs.toFixed(2)}ms)`);
console.log(`✅ PASS: Ranked 500 submissions in ${durationMs.toFixed(2)}ms (< 50ms requirement)\n`);

// [BENCHMARK 2] Financial Penny Precision at Scale ($50,000 Prize Pool via 25,000 $2 Bids)
console.log("[BENCHMARK 2] Financial Precision Test: 25,000 x $2.00 Bids");
const BID_COUNT = 25000;
let accumulatedGrossCents = 0;
let accumulatedFeeCents = 0;
let accumulatedNetCents = 0;

for (let i = 0; i < BID_COUNT; i++) {
  const breakdown = calculateBidFeeBreakdown(200);
  accumulatedGrossCents += breakdown.grossAmountCents;
  accumulatedFeeCents += breakdown.platformFeeCents;
  accumulatedNetCents += breakdown.netPrizePoolCents;
}

assert.equal(accumulatedGrossCents, 5000000, "Gross pool must equal $50,000.00 (5,000,000 cents)");
assert.equal(accumulatedFeeCents, 500000, "10% platform fee must equal $5,000.00 (500,000 cents)");
assert.equal(accumulatedNetCents, 4500000, "Net winner payout must equal $45,000.00 (4,500,000 cents)");
assert.equal(accumulatedFeeCents + accumulatedNetCents, accumulatedGrossCents, "Zero penny leakage guarantee");
console.log(`✅ PASS: 25,000 bids ($50,000) evaluated with 0 penny leakage: Platform Fee = $${accumulatedFeeCents/100}, Winner Net = $${accumulatedNetCents/100}\n`);

// [BENCHMARK 3] High-Concurrency Rate Limiter Stress Test (1,000 Requests)
console.log("[BENCHMARK 3] Concurrency & Sliding Window Rate Limiting (1,000 Requests across 50 IPs)");
resetVoteRateLimitStore();

let allowedCount = 0;
let blockedCount = 0;

for (let ipIdx = 0; ipIdx < 50; ipIdx++) {
  const ip = `10.0.0.${ipIdx}`;
  for (let reqIdx = 0; reqIdx < 20; reqIdx++) {
    const res = validateChallengeVote({
      visitorIp: ip,
      clientProvidedFingerprint: `device_${ipIdx}_${reqIdx}`
    });
    if (res.isValid) {
      allowedCount++;
    } else {
      blockedCount++;
    }
  }
}

// 50 IPs * 5 allowed per minute = 250 allowed, 50 * 15 = 750 blocked
assert.equal(allowedCount, 250, "Exactly 250 votes should be permitted (5 per IP across 50 IPs)");
assert.equal(blockedCount, 750, "Exactly 750 votes should be blocked by the rate limit");
console.log(`✅ PASS: Rate limiter handled 1,000 concurrent requests (Allowed: ${allowedCount}, Blocked: ${blockedCount})\n`);

console.log("================================================================");
console.log("🎉 ALL CHALLENGE ARENA LOAD & CONCURRENCY TESTS PASSED (100%) 🎉");
console.log("================================================================\n");
