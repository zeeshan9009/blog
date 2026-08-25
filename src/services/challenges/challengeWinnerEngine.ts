import { supabase } from '../../lib/supabase';
import { triggerSocialPublish } from './socialPublishJob';

export interface RawSubmissionForRanking {
  id: string;
  profileId: string;
  voteCount: number;
  createdAt: string | Date;
}

export interface RankedSubmission {
  submissionId: string;
  profileId: string;
  voteCount: number;
  rank: number;
}

/**
 * Pure Merit Winner Selection Algorithm:
 * 1. Sorts submissions strictly by vote count (highest first).
 * 2. Tie-breaker: earlier submission timestamp wins.
 * 3. ProRank score / payments do NOT affect submission ranking.
 */
export function rankSubmissions(submissions: RawSubmissionForRanking[]): RankedSubmission[] {
  return [...submissions]
    .sort((a, b) => {
      // 1. Primary: Most public votes
      if (b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount;
      }
      // 2. Tie-break: Earlier submission wins
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeA - timeB;
    })
    .map((s, index) => ({
      submissionId: s.id,
      profileId: s.profileId,
      voteCount: s.voteCount,
      rank: index + 1
    }));
}

/**
 * Applies visibility rewards upon challenge close:
 * 1. Updates challenge status to 'closed' and sets winner_submission_id.
 * 2. Inserts top 3 into top_developer_entries with 72h expiration.
 * 3. Awards permanent profile badges to top 3 finishers.
 * 4. Triggers automated social publication queue.
 */
export async function applyChallengeRewards(
  challengeId: string,
  ranked: RankedSubmission[]
): Promise<{ success: boolean; winnerProfileId?: string }> {
  try {
    if (ranked.length === 0) {
      await supabase
        .from('challenges')
        .update({ status: 'closed' })
        .eq('id', challengeId);
      return { success: true };
    }

    const top3 = ranked.slice(0, 3);
    const winner = top3[0];
    const now = new Date();
    const rankExpiry = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hours

    // 1. Update submissions with final ranks
    for (const item of ranked) {
      await supabase
        .from('challenge_submissions')
        .update({ final_rank: item.rank })
        .eq('id', item.submissionId);
    }

    // 2. Update challenge record
    await supabase
      .from('challenges')
      .update({
        status: 'closed',
        winner_submission_id: winner.submissionId
      })
      .eq('id', challengeId);

    // 3. Insert Top 3 into Top Developer Rail (72-hour visibility hold)
    for (const [index, entry] of top3.entries()) {
      await supabase
        .from('top_developer_entries')
        .insert({
          profile_id: entry.profileId,
          challenge_id: challengeId,
          rank_position: index + 1,
          expires_at: rankExpiry.toISOString()
        });

      // 4. Award permanent badges
      const badgeType = index === 0 ? 'challenge_winner' : 'challenge_runner_up';
      await supabase
        .from('challenge_badges')
        .insert({
          profile_id: entry.profileId,
          challenge_id: challengeId,
          badge_type: badgeType
        });
    }

    // 5. Trigger automated social publish
    try {
      await triggerSocialPublish(challengeId, winner.submissionId);
    } catch (socErr) {
      console.warn('Social publish warning (non-blocking):', socErr);
    }

    return { success: true, winnerProfileId: winner.profileId };
  } catch (err) {
    console.error('applyChallengeRewards exception:', err);
    return { success: false };
  }
}
