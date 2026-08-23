/**
 * Freshness Score:
 * F = exp(-age_hours / 24)
 * Recently promoted profiles receive a small advantage.
 */
export function calculateFreshnessScore(promotionStartedAt?: string | number | Date): number {
  if (!promotionStartedAt) return 0.5;

  const startTime = new Date(promotionStartedAt).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - startTime);
  const ageHours = diffMs / (1000 * 60 * 60);

  // F = exp(-age_hours / 24)
  const freshness = Math.exp(-ageHours / 24);
  return Math.max(0, Math.min(1, Number(freshness.toFixed(3))));
}
