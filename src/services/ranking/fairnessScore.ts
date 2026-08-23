import type { Professional } from '../../types/talent';

/**
 * Fairness System:
 * Tracks exposure to prevent a single profile from dominating #1 all day.
 * 
 * Expected Share = 1 / Number Of Eligible Sponsored Profiles
 * Actual Share = Profile Impressions / Total Sponsored Impressions
 * Exposure Ratio = Actual Share / Expected Share
 * Fairness Score = 1 / sqrt(1 + Exposure Ratio)
 */
export function calculateFairnessScore(
  profile: Professional,
  totalEligibleCount: number,
  allProfiles: Professional[]
): number {
  if (totalEligibleCount <= 1) return 1.0;

  const expectedShare = 1 / totalEligibleCount;

  // Calculate total impressions across all eligible sponsored profiles
  const totalImpressions = allProfiles.reduce((acc, p) => acc + (p.viewsCount || 0), 0);

  const profileImpressions = profile.viewsCount || 0;

  // If no impressions have occurred yet, give full baseline fairness
  if (totalImpressions === 0) {
    return 1.0;
  }

  const actualShare = profileImpressions / totalImpressions;
  const exposureRatio = actualShare / expectedShare;

  // Fairness Score = 1 / sqrt(1 + Exposure Ratio)
  const rawFairness = 1 / Math.sqrt(1 + exposureRatio);

  // Normalize between 0.0 and 1.0
  return Math.max(0.1, Math.min(1.0, Number(rawFairness.toFixed(3))));
}
