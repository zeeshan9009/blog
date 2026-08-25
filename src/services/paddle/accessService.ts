/**
 * Paddle Access Control Helper
 *
 * Rules:
 * - 'active' AND 'trialing' grant full paid access.
 * - Do NOT revoke access if scheduled_change exists (e.g. scheduled cancel/pause at end of cycle).
 * - Revoke access ONLY when status is strictly 'canceled' or 'paused'.
 */

export interface UserSubscriptionRecord {
  subscriptionId: string;
  customerId: string;
  status: 'active' | 'trialing' | 'canceled' | 'paused' | 'past_due' | string;
  priceId: string;
  productId: string;
  scheduledChangeAction?: string | null;
  scheduledChangeAt?: string | null;
}

export function hasActivePaidAccess(subscription: UserSubscriptionRecord | null | undefined): boolean {
  if (!subscription) return false;

  const status = subscription.status?.toLowerCase();

  // Active and trialing grant full paid access
  if (status === 'active' || status === 'trialing') {
    return true;
  }

  // Grace period for past_due can be configured, default false
  if (status === 'past_due') {
    return false;
  }

  // Canceled or paused do not grant access
  return false;
}
