/**
 * Challenge Arena Winner Selection Engine
 * 
 * Computes deterministic, merit-based challenge scores combining:
 * - 60% Normalized Public Community Votes
 * - 40% Weighted Client/Expert Judge Score
 * 
 * Strict separation: Bidding / prize pool size NEVER influences final score or win odds.
 * Tie-breaker: Earliest submission timestamp.
 */

export const PUBLIC_VOTE_WEIGHT = 0.6;
export const CLIENT_JUDGE_WEIGHT = 0.4;
export const DEFAULT_PLATFORM_FEE_BPS = 1000; // 10% (1000 bps)

export interface SubmissionScoreInput {
  id: string;
  challengeId: string;
  profileId: string;
  voteCount: number;
  clientScore?: number | null;
  createdAt: string;
  [key: string]: any;
}

export interface RankedSubmissionResult<T extends SubmissionScoreInput = SubmissionScoreInput> {
  submission: T;
  finalScore: number;
  normalizedVotes: number;
  normalizedClientScore: number;
  rank: number;
  isWinner: boolean;
}

export interface WinnerEvaluationResult<T extends SubmissionScoreInput = SubmissionScoreInput> {
  challengeId: string;
  totalSubmissions: number;
  winner: RankedSubmissionResult<T> | null;
  rankedSubmissions: RankedSubmissionResult<T>[];
  prizeDistribution: {
    totalPrizePoolCents: number;
    platformFeeCents: number;
    winnerPayoutCents: number;
    winnerPayoutDollars: number;
  };
}

/**
 * Compute the composite merit score for an individual submission.
 */
export function computeFinalScore(sub: {
  voteCount: number;
  maxVoteCountInChallenge: number;
  clientScore?: number | null;
}): number {
  const normalizedVotes = sub.maxVoteCountInChallenge > 0
    ? sub.voteCount / sub.maxVoteCountInChallenge
    : 0;

  // If no client judge score is submitted yet, neutral midpoint is 50/100 (0.5)
  const normalizedClientScore = sub.clientScore != null
    ? Math.max(0, Math.min(100, sub.clientScore)) / 100
    : 0.5;

  const finalScore = (normalizedVotes * PUBLIC_VOTE_WEIGHT) + (normalizedClientScore * CLIENT_JUDGE_WEIGHT);
  return Number(finalScore.toFixed(4));
}

/**
 * Evaluate all submissions for a challenge, compute final scores, and rank with deterministic tie-breaking.
 */
export function evaluateChallengeSubmissions<T extends SubmissionScoreInput>(
  challengeId: string,
  submissions: T[],
  prizePoolCents: number = 0,
  platformFeeBps: number = DEFAULT_PLATFORM_FEE_BPS
): WinnerEvaluationResult<T> {
  if (!submissions || submissions.length === 0) {
    const platformFeeCents = Math.round((prizePoolCents * platformFeeBps) / 10000);
    const winnerPayoutCents = prizePoolCents - platformFeeCents;

    return {
      challengeId,
      totalSubmissions: 0,
      winner: null,
      rankedSubmissions: [],
      prizeDistribution: {
        totalPrizePoolCents: prizePoolCents,
        platformFeeCents,
        winnerPayoutCents,
        winnerPayoutDollars: Number((winnerPayoutCents / 100).toFixed(2))
      }
    };
  }

  // 1. Determine max vote count in challenge pool
  const maxVoteCountInChallenge = Math.max(...submissions.map(s => Number(s.voteCount) || 0), 0);

  // 2. Compute score for each submission
  const scored = submissions.map(sub => {
    const voteCount = Number(sub.voteCount) || 0;
    const clientScore = sub.clientScore != null ? Number(sub.clientScore) : null;
    const finalScore = computeFinalScore({
      voteCount,
      maxVoteCountInChallenge,
      clientScore
    });

    const normalizedVotes = maxVoteCountInChallenge > 0 ? voteCount / maxVoteCountInChallenge : 0;
    const normalizedClientScore = clientScore != null ? clientScore / 100 : 0.5;

    return {
      submission: sub,
      finalScore,
      normalizedVotes: Number(normalizedVotes.toFixed(4)),
      normalizedClientScore: Number(normalizedClientScore.toFixed(4)),
      createdAtTs: new Date(sub.createdAt).getTime() || 0
    };
  });

  // 3. Sort by finalScore DESC, then earliest createdAt ASC (deterministic tie-breaker)
  scored.sort((a, b) => {
    if (b.finalScore !== a.finalScore) {
      return b.finalScore - a.finalScore;
    }
    // Tie-breaker: earliest submission wins
    return a.createdAtTs - b.createdAtTs;
  });

  // 4. Assign rank positions
  const rankedSubmissions: RankedSubmissionResult<T>[] = scored.map((item, index) => ({
    submission: item.submission,
    finalScore: item.finalScore,
    normalizedVotes: item.normalizedVotes,
    normalizedClientScore: item.normalizedClientScore,
    rank: index + 1,
    isWinner: index === 0
  }));

  // 5. Calculate prize payouts
  const platformFeeCents = Math.round((prizePoolCents * platformFeeBps) / 10000);
  const winnerPayoutCents = prizePoolCents - platformFeeCents;

  return {
    challengeId,
    totalSubmissions: submissions.length,
    winner: rankedSubmissions[0] || null,
    rankedSubmissions,
    prizeDistribution: {
      totalPrizePoolCents: prizePoolCents,
      platformFeeCents,
      winnerPayoutCents,
      winnerPayoutDollars: Number((winnerPayoutCents / 100).toFixed(2))
    }
  };
}
