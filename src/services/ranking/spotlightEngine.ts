import type { Professional } from '../../types/talent.js';
import type { SpotlightSlot, SpotlightScope } from '../../types/spotlight.js';
import { isSponsoredEligible, type EligibilityResult } from './antiAbuse.js';

export const SPOTLIGHT_HOLD_DURATION_MS = 72 * 60 * 60 * 1000; // 72-hour hold decay window
export const SPOTLIGHT_CLAIM_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes rate limit per profile/slot
export const DEFAULT_MIN_INCREMENT_CENTS = 100; // $1.00 USD minimum increment floor
export const PERCENT_INCREMENT_RATE = 0.05; // 5% minimum increment

// In-memory rate limiting map for claim attempts (profileId:slotId -> timestamp)
const claimAttemptTimestamps = new Map<string, number>();

/**
 * Calculates the next minimum required bid for an ascending Outbid Spotlight slot.
 * Enforces `+5% or +$1.00`, whichever is higher, to prevent 1-cent griefing.
 */
export function calculateNextMinimumBidCents(currentPriceCents: number, minIncrementCents: number = DEFAULT_MIN_INCREMENT_CENTS): number {
  if (currentPriceCents <= 0) return 500; // Default $5.00 floor
  const percentageIncrement = Math.ceil(currentPriceCents * PERCENT_INCREMENT_RATE);
  const effectiveIncrement = Math.max(minIncrementCents, percentageIncrement);
  return currentPriceCents + effectiveIncrement;
}

/**
 * Validates whether a proposed bid meets or exceeds the required ascending auction price.
 */
export function validateSpotlightBid(
  proposedBidCents: number,
  currentPriceCents: number,
  minIncrementCents: number = DEFAULT_MIN_INCREMENT_CENTS
): { isValid: boolean; requiredMinimumCents: number; error?: string } {
  const requiredMinimumCents = calculateNextMinimumBidCents(currentPriceCents, minIncrementCents);

  if (isNaN(proposedBidCents) || proposedBidCents <= 0) {
    return { isValid: false, requiredMinimumCents, error: 'Bid amount must be a positive integer in cents' };
  }

  if (proposedBidCents < requiredMinimumCents) {
    return {
      isValid: false,
      requiredMinimumCents,
      error: `Proposed bid ($${(proposedBidCents / 100).toFixed(2)}) is below the required minimum of $${(requiredMinimumCents / 100).toFixed(2)}`
    };
  }

  return { isValid: true, requiredMinimumCents };
}

/**
 * Checks if a 72-hour slot hold is expired.
 */
export function isSpotlightHoldExpired(expiresAt?: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= Date.now();
}

/**
 * Calculates decayed price for stale/unclaimed slots.
 * Decays 10% per day toward the base floor price so slots don't stay priced out of reach forever.
 */
export function calculateDecayedSlotPriceCents(
  baseFloorCents: number,
  currentPriceCents: number,
  daysExpired: number
): number {
  if (daysExpired <= 0 || currentPriceCents <= baseFloorCents) {
    return Math.max(baseFloorCents, currentPriceCents);
  }
  const decayFactor = Math.pow(0.90, Math.min(daysExpired, 14)); // 10% decay per day up to 14 days
  const decayed = Math.round(currentPriceCents * decayFactor);
  return Math.max(baseFloorCents, decayed);
}

/**
 * Anti-Abuse Rate Limiter:
 * Prevents bots, self-dealing, or wash bidding against own account by enforcing a 10-minute cooldown per slot.
 */
export function checkSpotlightRateLimit(profileId: string, slotId: string): { isAllowed: boolean; retryAfterSeconds?: number } {
  const key = `${profileId}:${slotId}`;
  const now = Date.now();
  const lastAttempt = claimAttemptTimestamps.get(key);

  if (lastAttempt && now - lastAttempt < SPOTLIGHT_CLAIM_COOLDOWN_MS) {
    const remainingMs = SPOTLIGHT_CLAIM_COOLDOWN_MS - (now - lastAttempt);
    return {
      isAllowed: false,
      retryAfterSeconds: Math.ceil(remainingMs / 1000)
    };
  }

  return { isAllowed: true };
}

/**
 * Record a successful claim timestamp for rate limiting.
 */
export function recordSpotlightClaimAttempt(profileId: string, slotId: string): void {
  const key = `${profileId}:${slotId}`;
  claimAttemptTimestamps.set(key, Date.now());
}

/**
 * Quality Gate Check for Spotlight Placement:
 * Reuses RankLancr's existing `isSponsoredEligible` (rating >= 4.0 or new user grace period, 0 active disputes, active standing).
 * High-risk or flagged profiles can NEVER buy their way to the top.
 */
export function isSpotlightQualityEligible(profile: Partial<Professional>): EligibilityResult {
  return isSponsoredEligible(profile);
}

/**
 * NOTE ON FAIRNESS & PRO-RANK INDEPENDENCE:
 * 1. Spotlight Leaderboard slots are EXPLICITLY EXEMPT from Impression Share Equalization (fairnessScore.ts).
 *    In an ascending public auction, highest paid bidder retains exclusive visibility for their 72h hold.
 * 2. Spotlight claims NEVER modify or feed into organic ProRank scores (relevanceScore, professionalScore, freshnessScore).
 */
export function enrichSpotlightSlot(slot: SpotlightSlot): SpotlightSlot {
  const isExpired = isSpotlightHoldExpired(slot.expiresAt);
  const effectivePrice = isExpired ? 500 : slot.currentPriceCents;
  const nextMinimumBidCents = calculateNextMinimumBidCents(effectivePrice, slot.minIncrementCents);

  return {
    ...slot,
    isExpired,
    nextMinimumBidCents
  };
}
