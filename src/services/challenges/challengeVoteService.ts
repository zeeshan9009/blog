/**
 * Challenge Arena Voting Service & Anti-Abuse Rate Limiter
 * 
 * Enforces:
 * - 1 vote per unique fingerprint per submission
 * - Rate limit: maximum 5 votes per minute per IP
 * - Weighted votes: Verified logged-in talent = 2.0x weight, Guest = 1.0x weight
 */

import crypto from 'node:crypto';

// In-Memory sliding-window rate limit store for votes (5 per minute per IP)
const VOTE_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_VOTES_PER_WINDOW = 5;
const ipVoteHistory = new Map<string, number[]>();

export interface VoteValidationResult {
  isValid: boolean;
  weight: number;
  fingerprint: string;
  rejectionReason?: string;
}

/**
 * Generate a consistent, anonymized voter fingerprint from request headers & client token
 */
export function generateVoterFingerprint(params: {
  visitorIp: string;
  userAgent?: string;
  clientProvidedFingerprint?: string;
  userId?: string;
}): string {
  if (params.userId && params.userId.trim().length > 0) {
    return `user_${params.userId.trim()}`;
  }

  const rawString = `${params.visitorIp}_${params.userAgent || 'unknown_ua'}_${params.clientProvidedFingerprint || 'anon'}`;
  return crypto.createHash('sha256').update(rawString).digest('hex').slice(0, 32);
}

/**
 * Validates whether the vote is permitted by IP rate limit and calculates vote weight.
 */
export function validateChallengeVote(params: {
  visitorIp: string;
  userAgent?: string;
  clientProvidedFingerprint?: string;
  userId?: string;
  isVerifiedAccount?: boolean;
}): VoteValidationResult {
  const now = Date.now();
  const ip = params.visitorIp || 'unknown_ip';

  // 1. Sliding window rate limit check
  const timestamps = ipVoteHistory.get(ip) || [];
  const validTimestamps = timestamps.filter(ts => now - ts < VOTE_RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_VOTES_PER_WINDOW) {
    return {
      isValid: false,
      weight: 0,
      fingerprint: '',
      rejectionReason: `Rate limit exceeded: maximum ${MAX_VOTES_PER_WINDOW} votes per minute allowed.`
    };
  }

  // Record this attempt
  validTimestamps.push(now);
  ipVoteHistory.set(ip, validTimestamps);

  // Periodically clean up old IPs
  if (ipVoteHistory.size > 5000) {
    for (const [k, v] of ipVoteHistory.entries()) {
      if (v.length === 0 || now - v[v.length - 1] > VOTE_RATE_LIMIT_WINDOW_MS) {
        ipVoteHistory.delete(k);
      }
    }
  }

  // 2. Generate voter fingerprint
  const fingerprint = generateVoterFingerprint(params);

  // 3. Weight: Verified accounts get 2.0 weight, guests get 1.0 weight
  const weight = params.isVerifiedAccount ? 2.0 : 1.0;

  return {
    isValid: true,
    weight,
    fingerprint
  };
}

/**
 * Reset vote history (for testing purposes)
 */
export function resetVoteRateLimitStore() {
  ipVoteHistory.clear();
}
