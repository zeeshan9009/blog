import assert from "node:assert/strict";
import {
  evaluateRailStealConditions,
  checkRailStealRateLimit,
  recordRailStealAttempt,
  RAIL_STEAL_RATE_LIMIT_MS
} from "../src/services/ranking/railStealEngine.js";
import type { Professional } from "../src/types/talent.js";

console.log("\n================================================================");
console.log("⚡ STARTING STEAL THE RAIL ENGINE TEST SUITE ⚡");
console.log("================================================================\n");

// Sample profiles
const eligibleChallenger: Partial<Professional> = {
  id: "challenger_valid",
  name: "Top Challenger",
  rating: 4.9,
  reviewCount: 12,
  activeDisputes: 0,
  accountStanding: "active"
};

const lowQualityChallenger: Partial<Professional> = {
  id: "challenger_low_rating",
  name: "Low Rating Challenger",
  rating: 3.2,
  reviewCount: 10,
  activeDisputes: 0,
  accountStanding: "active"
};

const disputedChallenger: Partial<Professional> = {
  id: "challenger_disputed",
  name: "Disputed Challenger",
  rating: 4.8,
  reviewCount: 20,
  activeDisputes: 2,
  accountStanding: "active"
};

// [TEST 1] Steal Succeeded: Challenger vote count > current rail holder
console.log("[TEST 1] Steal Succeeded when challenger votes exceed current holder");
const resultExceed = evaluateRailStealConditions({
  challengerProfile: eligibleChallenger,
  challengerVoteCount: 42,
  currentRailVoteCount: 35
});
assert.equal(resultExceed.canAttempt, true, "Eligible profile must be allowed to attempt steal");
assert.equal(resultExceed.willSucceed, true, "42 votes > 35 votes must succeed");
console.log("✅ PASS: Higher vote count successfully overtakes the rail position\n");

// [TEST 2] Steal Failed: Challenger vote count <= current rail holder
console.log("[TEST 2] Steal Failed when challenger votes are lower or tied");
const resultLower = evaluateRailStealConditions({
  challengerProfile: eligibleChallenger,
  challengerVoteCount: 20,
  currentRailVoteCount: 35
});
assert.equal(resultLower.canAttempt, true, "Eligible profile can attempt");
assert.equal(resultLower.willSucceed, false, "20 votes <= 35 votes must fail");

const resultTied = evaluateRailStealConditions({
  challengerProfile: eligibleChallenger,
  challengerVoteCount: 35,
  currentRailVoteCount: 35
});
assert.equal(resultTied.willSucceed, false, "Tied votes must not overtake existing holder without strictly exceeding");
console.log("✅ PASS: Lower and tied vote counts fail as expected\n");

// [TEST 3] Quality Gate: Low-rated or disputed profiles are blocked
console.log("[TEST 3] Quality Gate enforcement on rail steals");
const resultLow = evaluateRailStealConditions({
  challengerProfile: lowQualityChallenger,
  challengerVoteCount: 100,
  currentRailVoteCount: 10
});
assert.equal(resultLow.canAttempt, false, "Low rated profile blocked even with 100 votes");
assert.equal(resultLow.eligibility.isEligible, false, "Eligibility check must fail");

const resultDispute = evaluateRailStealConditions({
  challengerProfile: disputedChallenger,
  challengerVoteCount: 100,
  currentRailVoteCount: 10
});
assert.equal(resultDispute.canAttempt, false, "Disputed account blocked from stealing the rail");
console.log("✅ PASS: Quality gate prevents abusive/disputed accounts from claiming #1 rail\n");

// [TEST 4] Anti-Abuse Rate Limiter (10-minute cooldown per submission)
console.log("[TEST 4] Anti-Abuse Rate Limiter");
const testUserId = "user_test_steal_cooldown";
const testSubId = "sub_test_123";

assert.ok(checkRailStealRateLimit(testUserId, testSubId).isAllowed, "First steal attempt is allowed");
recordRailStealAttempt(testUserId, testSubId);

const rateLimited = checkRailStealRateLimit(testUserId, testSubId);
assert.equal(rateLimited.isAllowed, false, "Immediate repeat steal attempt on same submission is blocked");
assert.ok((rateLimited.retryAfterSeconds || 0) > 0, "Provides positive retry cooldown seconds");
console.log("✅ PASS: 10-minute cooldown prevents spamming steal requests\n");

console.log("================================================================");
console.log("🎉 ALL STEAL THE RAIL ENGINE TESTS PASSED (100%) 🎉");
console.log("================================================================\n");
