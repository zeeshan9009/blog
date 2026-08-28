import { supabase } from '../../lib/supabase.js';
import { isSponsoredEligible, type EligibilityResult } from './antiAbuse.js';
import type { Professional } from '../../types/talent.js';

export const RAIL_STEAL_RATE_LIMIT_MS = 10 * 60 * 1000; // 10 minutes rate limit per challenger submission

// In-memory rate limiting map for steal attempts (challengerId:submissionId -> timestamp)
const stealAttemptTimestamps = new Map<string, number>();

export interface RailStealResult {
  success: boolean;
  reason?: string | string[];
  retryAfterSeconds?: number;
  neededVotes?: number;
  nextEligibleAt?: number;
  currentRailVoteCount?: number;
  challengerVoteCount?: number;
  previousHolderId?: string | null;
}

/**
 * Check if the user is rate-limited from attempting a steal on this submission.
 */
export function checkRailStealRateLimit(challengerId: string, submissionId: string): { isAllowed: boolean; retryAfterSeconds?: number; nextEligibleAt?: number } {
  const key = `${challengerId}:${submissionId}`;
  const now = Date.now();
  const lastAttempt = stealAttemptTimestamps.get(key);

  if (lastAttempt && now - lastAttempt < RAIL_STEAL_RATE_LIMIT_MS) {
    const remainingMs = RAIL_STEAL_RATE_LIMIT_MS - (now - lastAttempt);
    const nextEligibleAt = lastAttempt + RAIL_STEAL_RATE_LIMIT_MS;
    return {
      isAllowed: false,
      retryAfterSeconds: Math.ceil(remainingMs / 1000),
      nextEligibleAt
    };
  }

  return { isAllowed: true };
}

/**
 * Get timestamp when user is next eligible to attempt a steal.
 */
export function getNextEligibleTimestamp(challengerId: string, submissionId: string): number | null {
  const check = checkRailStealRateLimit(challengerId, submissionId);
  return check.isAllowed ? null : (check.nextEligibleAt || null);
}

/**
 * Record a rail steal attempt timestamp for rate limiting.
 */
export function recordRailStealAttempt(challengerId: string, submissionId: string): void {
  const key = `${challengerId}:${submissionId}`;
  stealAttemptTimestamps.set(key, Date.now());
}

/**
 * Pure evaluation logic for whether a steal qualifies and succeeds.
 */
export function evaluateRailStealConditions(params: {
  challengerProfile: Partial<Professional>;
  challengerVoteCount: number;
  currentRailVoteCount: number;
}): { canAttempt: boolean; willSucceed: boolean; eligibility: EligibilityResult } {
  const eligibility = isSponsoredEligible(params.challengerProfile);

  if (!eligibility.isEligible) {
    return { canAttempt: false, willSucceed: false, eligibility };
  }

  const willSucceed = params.challengerVoteCount > params.currentRailVoteCount;
  return { canAttempt: true, willSucceed, eligibility };
}

/**
 * Main rail steal execution handler.
 * Connects to Supabase when available, with runtime fallback.
 */
export async function attemptRailSteal(
  challengeId: string,
  challengerSubmissionId: string,
  challengerId: string,
  challengerProfile?: Partial<Professional>
): Promise<RailStealResult> {
  // 1. Check Rate Limit
  const rateLimitCheck = checkRailStealRateLimit(challengerId, challengerSubmissionId);
  if (!rateLimitCheck.isAllowed) {
    const totalSecs = rateLimitCheck.retryAfterSeconds || 0;
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    const nextEligibleAt = rateLimitCheck.nextEligibleAt || (Date.now() + totalSecs * 1000);

    return {
      success: false,
      reason: `Cooldown active: Please wait ${timeStr} before attempting another rail steal on this submission.`,
      retryAfterSeconds: rateLimitCheck.retryAfterSeconds,
      nextEligibleAt
    };
  }

  // 2. Check Quality Gate
  let profile = challengerProfile;
  if (!profile) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', challengerId).maybeSingle();
      profile = (data as Partial<Professional>) || { rating: 5.0, reviewCount: 0, activeDisputes: 0, accountStanding: 'active' };
    } catch {
      profile = { rating: 5.0, reviewCount: 0, activeDisputes: 0, accountStanding: 'active' };
    }
  }

  const qualityGate = isSponsoredEligible(profile);
  if (!qualityGate.isEligible) {
    return { success: false, reason: qualityGate.reasons };
  }

  // Record rate limit attempt
  recordRailStealAttempt(challengerId, challengerSubmissionId);

  // 3. Fetch challenge & challenger submission state
  let currentRailVoteCount = 0;
  let previousHolderId: string | null = null;
  let challengerVoteCount = 0;
  let challengerDisplayName = profile?.name || 'Anonymous Challenger';

  try {
    const { data: challengeData } = await supabase
      .from('challenges')
      .select('current_rail_holder_id, current_rail_vote_count')
      .eq('id', challengeId)
      .maybeSingle();

    if (challengeData) {
      currentRailVoteCount = challengeData.current_rail_vote_count ?? 0;
      previousHolderId = challengeData.current_rail_holder_id ?? null;
    }

    const { data: subData } = await supabase
      .from('challenge_submissions')
      .select('vote_count, author_name')
      .eq('id', challengerSubmissionId)
      .maybeSingle();

    if (subData) {
      challengerVoteCount = subData.vote_count ?? 0;
      if (subData.author_name) challengerDisplayName = subData.author_name;
    }
  } catch (err) {
    console.warn('Supabase read fallback in attemptRailSteal:', err);
  }

  // 4. Determine success: Challenger vote count must strictly exceed current rail holder
  const succeeded = challengerVoteCount > currentRailVoteCount;

  // 5. Record attempt into rail_steal_attempts (for public "X people tried today" counter)
  try {
    await supabase.from('rail_steal_attempts').insert({
      challenge_id: challengeId,
      attempted_by_id: challengerId,
      submission_id: challengerSubmissionId,
      succeeded
    });
  } catch (err) {
    console.warn('Could not insert into rail_steal_attempts:', err);
  }

  // 6. If succeeded, record event, update challenge holder, and broadcast to previous holder
  if (succeeded) {
    try {
      await supabase.from('rail_steal_events').insert({
        challenge_id: challengeId,
        previous_holder_id: previousHolderId,
        new_holder_id: challengerId,
        submission_id: challengerSubmissionId,
        vote_count_at_steal: challengerVoteCount
      });

      await supabase
        .from('challenges')
        .update({
          current_rail_holder_id: challengerId,
          current_rail_vote_count: challengerVoteCount,
          rail_held_since: new Date().toISOString()
        })
        .eq('id', challengeId);

      // Broadcast alert to previous holder if existed
      if (previousHolderId && previousHolderId !== challengerId) {
        supabase.channel(`user:${previousHolderId}`).send({
          type: 'broadcast',
          event: 'rail_stolen',
          payload: {
            stolenBy: challengerDisplayName,
            voteCount: challengerVoteCount,
            challengeId
          }
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('Could not complete rail steal state persistence:', err);
    }
  }

  const neededVotes = Math.max(1, (currentRailVoteCount - challengerVoteCount) + 1);

  return {
    success: succeeded,
    currentRailVoteCount,
    challengerVoteCount,
    previousHolderId,
    neededVotes: succeeded ? undefined : neededVotes,
    reason: succeeded
      ? undefined
      : `Not enough votes yet — you need ${neededVotes} more vote${neededVotes > 1 ? 's' : ''} to take the Rail.`
  };
}
