import type { Professional } from '../../types/talent';
import { calculateRelevanceScore, MINIMUM_SPONSORED_RELEVANCE_THRESHOLD, type RelevanceResult } from './relevanceScore';
import { calculateProfileQualityScore } from './profileQualityScore';
import { calculateProfessionalScore } from './professionalScore';
import { calculateFreshnessScore } from './freshnessScore';
import { calculateFairnessScore } from './fairnessScore';
import { calculateRotationFactor } from './rotation';
import { isSponsoredEligible } from './antiAbuse';

export interface RankedSponsoredProfile {
  profile: Professional;
  finalScore: number;
  relevance: RelevanceResult;
  profileQuality: number;
  professionalScore: number;
  freshness: number;
  fairness: number;
  rotation: number;
  isSponsored: true;
}

/**
 * Ranks all eligible sponsored profiles according to ProRank's 5-factor mathematical engine
 * P = 45% Relevance + 20% Profile Quality + 10% Professional Score + 5% Freshness + 20% Fairness + Rotation
 */
export function rankSponsoredProfiles(
  allProfiles: Professional[],
  query: string,
  filterContext?: { category?: string; location?: string; isMobile?: boolean }
): RankedSponsoredProfile[] {
  const now = Date.now();

  // 1. Filter only actively promoted profiles that are NOT expired AND pass the Quality Gate
  const activePromotedProfiles = allProfiles.filter(p => {
    if (!p.isPromoted) return false;
    if (p.promotionExpiresAt) {
      const expiresAt = new Date(p.promotionExpiresAt).getTime();
      if (expiresAt <= now) {
        return false; // Expired
      }
    }
    // Quality Gate: rating >= 4.0 OR reviewCount < 3, 0 active disputes, active standing
    const gate = isSponsoredEligible(p);
    if (!gate.isEligible) {
      return false; // Excluded from sponsored ranking due to quality gate violation
    }
    return true;
  });

  if (activePromotedProfiles.length === 0) {
    return [];
  }

  // 2. Calculate relevance for all candidate promoted profiles & filter by minimum relevance threshold (0.35)
  const eligibleWithRelevance: { profile: Professional; relevance: RelevanceResult }[] = [];

  for (const profile of activePromotedProfiles) {
    const relevance = calculateRelevanceScore(profile, query, filterContext);
    // If search query is provided, enforce minimum relevance threshold (0.35)
    if (query.trim().length > 0 && relevance.score < MINIMUM_SPONSORED_RELEVANCE_THRESHOLD) {
      // Excluded from sponsored results due to irrelevance
      continue;
    }
    eligibleWithRelevance.push({ profile, relevance });
  }

  const eligibleCount = eligibleWithRelevance.length;
  if (eligibleCount === 0) {
    return [];
  }

  // 3. Compute final promotion scores
  const rankedSponsored: RankedSponsoredProfile[] = eligibleWithRelevance.map(({ profile, relevance }) => {
    const quality = calculateProfileQualityScore(profile);
    const profScore = calculateProfessionalScore(profile).normalized;
    const freshness = calculateFreshnessScore(profile.promotionExpiresAt);
    const fairness = calculateFairnessScore(profile, eligibleCount, activePromotedProfiles);
    const rotation = calculateRotationFactor(profile.id, now);

    // Formula: P = 0.45R + 0.20Q + 0.10PS + 0.05F + 0.20FR
    const baseScore =
      (0.45 * relevance.score) +
      (0.20 * quality) +
      (0.10 * profScore) +
      (0.05 * freshness) +
      (0.20 * fairness);

    const finalScore = Number((baseScore + rotation).toFixed(4));

    return {
      profile,
      finalScore,
      relevance,
      profileQuality: quality,
      professionalScore: profScore,
      freshness,
      fairness,
      rotation,
      isSponsored: true,
    };
  });

  // 4. Sort descending by Final Score
  rankedSponsored.sort((a, b) => b.finalScore - a.finalScore);

  // 5. Cap to maximum 3 on desktop, 1-2 on mobile
  const maxSponsored = filterContext?.isMobile ? 2 : 3;
  return rankedSponsored.slice(0, maxSponsored);
}
