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
 * Verify profile meets all requirements before $1 promotion can be purchased
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
