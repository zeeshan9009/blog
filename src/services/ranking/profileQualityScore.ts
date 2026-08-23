import type { Professional } from '../../types/talent';

/**
 * Profile Quality Formula:
 * Q = 25% Completeness + 20% Portfolio + 15% Experience + 15% Skills + 10% External Links + 10% Verification + 5% Activity
 */
export function calculateProfileQualityScore(profile: Professional): number {
  // 1. Completeness (25%)
  let completeness = 0;
  if (profile.name) completeness += 0.2;
  if (profile.title || profile.gigTitle) completeness += 0.2;
  if (profile.bio && profile.bio.length > 50) completeness += 0.2;
  if (profile.avatar) completeness += 0.2;
  if (profile.location) completeness += 0.2;

  // 2. Portfolio Items (20%)
  const portfolioCount = profile.portfolio?.length || 0;
  const portfolioScore = Math.min(1, portfolioCount / 3);

  // 3. Experience (15%)
  const experienceYears = profile.experienceYears || 0;
  const experienceScore = Math.min(1, experienceYears / 5);

  // 4. Skills (15%)
  const skillsCount = profile.skills?.length || 0;
  const skillsScore = Math.min(1, skillsCount / 5);

  // 5. External Links (10%)
  const links = profile.externalLinks || {};
  const linkCount = Object.values(links).filter(Boolean).length;
  const linksScore = Math.min(1, linkCount / 2);

  // 6. Verification (10%)
  const verificationScore = profile.isVerified ? 1.0 : 0.5;

  // 7. Activity & Inquiries (5%)
  const activityScore = Math.min(1, (profile.viewsCount + profile.clicksCount * 2) / 500);

  const rawQuality =
    (0.25 * completeness) +
    (0.20 * portfolioScore) +
    (0.15 * experienceScore) +
    (0.15 * skillsScore) +
    (0.10 * linksScore) +
    (0.10 * verificationScore) +
    (0.05 * activityScore);

  return Math.max(0, Math.min(1, Number(rawQuality.toFixed(3))));
}
