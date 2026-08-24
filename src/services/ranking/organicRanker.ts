import type { Professional } from '../../types/talent.js';
import { calculateRelevanceScore, type RelevanceResult } from './relevanceScore.js';
import { calculateProfileQualityScore } from './profileQualityScore.js';
import { calculateProfessionalScore } from './professionalScore.js';

export interface RankedOrganicProfile {
  profile: Professional;
  organicScore: number;
  relevance: RelevanceResult;
  isSponsored: false;
}

/**
 * Ranks organic profiles cleanly without any paid promotion bias
 * Organic Score = 50% Relevance + 25% Profile Quality + 15% Professional Score + 10% Reviews Rating
 */
export function rankOrganicProfiles(
  allProfiles: Professional[],
  query: string,
  filterContext?: { category?: string; location?: string }
): RankedOrganicProfile[] {
  const ranked: RankedOrganicProfile[] = allProfiles.map(profile => {
    const relevance = calculateRelevanceScore(profile, query, filterContext);
    const quality = calculateProfileQualityScore(profile);
    const profScore = calculateProfessionalScore(profile).normalized;
    const ratingNorm = (profile.rating || 4.5) / 5;

    const organicScore =
      (0.50 * relevance.score) +
      (0.25 * quality) +
      (0.15 * profScore) +
      (0.10 * ratingNorm);

    return {
      profile,
      organicScore: Number(organicScore.toFixed(4)),
      relevance,
      isSponsored: false,
    };
  });

  // Sort descending by Organic Score
  ranked.sort((a, b) => b.organicScore - a.organicScore);

  return ranked;
}
