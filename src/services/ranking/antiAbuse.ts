import type { Professional } from '../../types/talent';

export interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
}

// In-memory cooldown & rate-limiting maps (backed by localStorage on client or Redis in prod)
const impressionCooldowns = new Map<string, number>();
const clickCooldowns = new Map<string, number>();
const searchRateLimits = new Map<string, { count: number; resetAt: number }>();
const contactRateLimits = new Map<string, { count: number; resetAt: number }>();

const COOLDOWN_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Quality Gate & Verification check for Sponsored Placement:
 * 1. Rating >= 4.0 OR reviewCount < 3 (Grace period for new/emerging freelancers)
 * 2. Active disputes === 0 (Zero unresolved disputes/complaints)
 * 3. Account standing !== 'flagged' and !== 'suspended'
 */
export function isSponsoredEligible(profile: Partial<Professional>): EligibilityResult {
  const reasons: string[] = [];

  // 1. Rating & Review Quality Gate
  const reviewCount = profile.reviewCount ?? 0;
  const rating = profile.rating ?? 5.0;

  if (reviewCount >= 3 && rating < 4.0) {
    reasons.push(
      `Your rating (${rating.toFixed(1)}/5.0) needs to be 4.0+ with 3 or more reviews to appear in Sponsored results.`
    );
  }

  // 2. Active Disputes Gate (must be 0)
  const activeDisputes = profile.activeDisputes ?? 0;
  if (activeDisputes > 0) {
    reasons.push(
      `Account has ${activeDisputes} active dispute${activeDisputes > 1 ? 's' : ''} pending resolution.`
    );
  }

  // 3. Account Standing Gate
  if (profile.accountStanding === 'flagged') {
    reasons.push('Account standing is currently flagged for review.');
  } else if (profile.accountStanding === 'suspended') {
    reasons.push('Account standing is currently suspended.');
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
}

/**
 * Verify profile meets all requirements (completeness + quality gate) before $2 promotion can be purchased/activated
 */
export function verifyProfilePromotionEligibility(profile: Partial<Professional>): EligibilityResult {
  const reasons: string[] = [];

  if (!profile.name || profile.name.trim().length === 0) {
    reasons.push('Name is required.');
  }

  if (!profile.title && !profile.gigTitle) {
    reasons.push('Professional headline/title is required.');
  }

  if (!profile.bio || profile.bio.trim().length < 20) {
    reasons.push('A complete bio (at least 20 characters) is required.');
  }

  if (!profile.skills || profile.skills.length < 3) {
    reasons.push('At least 3 skills must be listed.');
  }

  const hasPortfolio = profile.portfolio && profile.portfolio.length > 0;
  const hasExternalLink = profile.externalLinks && Object.values(profile.externalLinks).some(Boolean);

  if (!hasPortfolio && !hasExternalLink) {
    reasons.push('At least 1 portfolio item or external professional link (GitHub, LinkedIn, Upwork) is required.');
  }

  // Combine with Quality Gate
  const qualityGate = isSponsoredEligible(profile);
  if (!qualityGate.isEligible) {
    reasons.push(...qualityGate.reasons);
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
}

/**
 * Validates whether an impression event is unique within the 30-minute cooldown window
 */
export function validateImpressionEvent(visitorHash: string, promotionId: string): boolean {
  const key = `${visitorHash}_${promotionId}`;
  const now = Date.now();
  const lastSeen = impressionCooldowns.get(key);

  if (lastSeen && now - lastSeen < COOLDOWN_WINDOW_MS) {
    return false; // Deduplicated, ignored
  }

  impressionCooldowns.set(key, now);
  return true;
}

/**
 * Validates whether a click event is unique within the 30-minute cooldown window
 */
export function validateClickEvent(visitorHash: string, promotionId: string): boolean {
  const key = `${visitorHash}_${promotionId}`;
  const now = Date.now();
  const lastSeen = clickCooldowns.get(key);

  if (lastSeen && now - lastSeen < COOLDOWN_WINDOW_MS) {
    return false; // Deduplicated, ignored
  }

  clickCooldowns.set(key, now);
  return true;
}

/**
 * Validates search rate limit
 */
export function validateSearchRateLimit(visitorHash: string, isLoggedIn: boolean = false): boolean {
  const limit = isLoggedIn ? 120 : 60; // 60 for anonymous, 120 for logged-in per 10 mins
  const windowMs = 10 * 60 * 1000;
  const now = Date.now();

  const current = searchRateLimits.get(visitorHash);
  if (!current || now > current.resetAt) {
    searchRateLimits.set(visitorHash, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count += 1;
  return true;
}

/**
 * Validates contact inquiry rate limit (5 contacts per hour per anonymous visitor)
 */
export function validateContactRateLimit(visitorHash: string): boolean {
  const limit = 5;
  const windowMs = 60 * 60 * 1000;
  const now = Date.now();

  const current = contactRateLimits.get(visitorHash);
  if (!current || now > current.resetAt) {
    contactRateLimits.set(visitorHash, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count += 1;
  return true;
}
