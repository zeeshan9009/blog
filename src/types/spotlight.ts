export type SpotlightScope = 'global' | 'category';

export interface SpotlightSlot {
  id: string;
  scope: SpotlightScope;
  category?: string | null;
  position: number; // 1, 2, 3
  currentHolderProfileId?: string | null;
  currentHolderName?: string | null;
  currentHolderAvatar?: string | null;
  currentHolderTitle?: string | null;
  currentHolderDestinationUrl?: string | null;
  currentHolderPlatform?: string | null;
  currentPriceCents: number;
  minIncrementCents: number;
  claimedAt?: string | null;
  expiresAt?: string | null;
  nextMinimumBidCents: number;
  isExpired?: boolean;
}

export interface SpotlightBid {
  id: string;
  slotId: string;
  profileId: string;
  bidderName?: string;
  bidderEmail?: string;
  destinationUrl?: string;
  destinationPlatform?: string;
  amountCents: number;
  stripePaymentIntentId: string;
  status: 'succeeded' | 'failed' | 'refunded';
  createdAt: string;
}

export interface SpotlightActivityEvent {
  id: string;
  bidderName: string;
  scope: SpotlightScope;
  category?: string | null;
  position: number;
  amountCents: number;
  platform: string;
  destinationUrl?: string;
  createdAt: string;
}

export interface SpotlightStatsSummary {
  totalSpentAllTimeCents: number;
  totalBidsCount: number;
  activeSlotsCount: number;
  recentActivity: SpotlightActivityEvent[];
}
