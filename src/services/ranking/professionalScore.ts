import type { Professional } from '../../types/talent.js';

/**
 * Professional Score = 40% Skills + 25% Experience + 20% Portfolio + 10% Reviews + 5% Profile Completeness
 * Returns normalized (0.0 - 1.0) and display integer (0 - 100)
 */
export function calculateProfessionalScore(profile: Professional): { normalized: number; displayScore: number } {
  // If score is already preset and valid
  if (profile.score && profile.score > 0) {
    const norm = Math.max(0, Math.min(1, profile.score / 100));
    return { normalized: norm, displayScore: profile.score };
  }

  // 1. Skills (40%)
  const skillsCount = profile.skills?.length || 0;
  const skillsFactor = Math.min(1, skillsCount / 6);

  // 2. Experience (25%)
  const expYears = profile.experienceYears || 1;
  const expFactor = Math.min(1, expYears / 6);

  // 3. Portfolio (20%)
  const portCount = profile.portfolio?.length || 0;
  const portFactor = Math.min(1, portCount / 3);

  // 4. Reviews & Rating (10%)
  const rating = profile.rating || 4.5;
  const reviewsCount = profile.reviewCount || 10;
  const reviewsFactor = Math.min(1, (rating / 5) * (Math.min(reviewsCount, 50) / 50));

  // 5. Profile Completeness (5%)
  const completenessFactor = profile.name && profile.bio && profile.avatar ? 1.0 : 0.7;

  const raw =
    (0.40 * skillsFactor) +
    (0.25 * expFactor) +
    (0.20 * portFactor) +
    (0.10 * reviewsFactor) +
    (0.05 * completenessFactor);

  const normalized = Math.max(0, Math.min(1, Number(raw.toFixed(3))));
  const displayScore = Math.round(normalized * 100);

  return { normalized, displayScore };
}
