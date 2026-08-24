/**
 * Promoted Ranking & Boost Auction Types
 */

export type DestinationType =
  | 'linkedin'
  | 'fiverr'
  | 'upwork'
  | 'github'
  | 'portfolio'
  | 'website'
  | 'other';

export type CampaignStatus =
  | 'active'
  | 'outbid'
  | 'expired'
  | 'paused'
  | 'cancelled';

export interface PromotedCampaign {
  id: string;
  userId: string;
  profileId?: string;
  authorName: string;
  avatarUrl?: string;
  title: string;
  description: string;
  destinationType: DestinationType;
  destinationUrl: string;
  category: string;
  skills: string[];
  status: CampaignStatus;
  startingBid: number;
  currentBid: number;
  currentPosition: number;
  peakPosition: number;
  impressions: number;
  clicks: number;
  externalVisits: number;
  startAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionBid {
  id: string;
  campaignId: string;
  userId: string;
  bidderName: string;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  isWinning: boolean;
  previousHighestBid: number;
  createdAt: string;
}

export interface CampaignAnalytics {
  campaignId: string;
  currentPosition: number;
  peakPosition: number;
  currentBid: number;
  startingBid: number;
  impressions: number;
  clicks: number;
  externalVisits: number;
  ctr: number;
  estimatedConversion: number;
  exposureShare: number;
  dampingPercentage: number;
  timeRemainingSeconds: number;
  isDamped: boolean;
}
