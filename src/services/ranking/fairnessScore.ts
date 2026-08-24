import type { Professional } from '../../types/talent.js';

/**
 * Fairness System:
 * Tracks exposure to prevent a single profile from dominating #1 all day.
 * 
 * Expected Share = 1 / Number Of Eligible Sponsored Profiles
 * Actual Share = Profile Impressions / Total Sponsored Impressions
 * Exposure Ratio = Actual Share / Expected Share
 * Fairness Score = 1 / sqrt(1 + Exposure Ratio)
 */
export function calculateFairnessScoreFromCounts(
  profileImpressions: number,
  totalImpressions: number,
  totalEligibleCount: number
): number {
  if (totalEligibleCount <= 1) return 1.0;

  const expectedShare = 1 / totalEligibleCount;
  if (totalImpressions === 0) {
    return 1.0;
  }

  const actualShare = profileImpressions / totalImpressions;
  const exposureRatio = actualShare / expectedShare;

  // Fairness Score = 1 / sqrt(1 + Exposure Ratio)
  const rawFairness = 1 / Math.sqrt(1 + exposureRatio);

  return Math.max(0.1, Math.min(1.0, Number(rawFairness.toFixed(3))));
}

export function calculateFairnessScore(
  profile: Professional,
  totalEligibleCount: number,
  allProfiles: Professional[]
): number {
  if (totalEligibleCount <= 1) return 1.0;

  // Calculate total impressions across all eligible sponsored profiles
  const totalImpressions = Array.isArray(allProfiles)
    ? allProfiles.reduce((acc, p) => acc + (p.viewsCount || 0), 0)
    : 0;

  const profileImpressions = profile.viewsCount || 0;

  return calculateFairnessScoreFromCounts(profileImpressions, totalImpressions, totalEligibleCount);
}
