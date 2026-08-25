export type ChallengeStatus = 'draft' | 'open_entry' | 'submission_window' | 'voting_window' | 'closed';

export type SponsorshipTier = 'bronze' | 'silver' | 'gold';

export interface Challenge {
  id: string;
  slug?: string;
  title: string;
  prompt: string;
  category: string;
  bannerImage?: string;
  status: ChallengeStatus;
  entryDeadline: string;
  submissionDeadline: string;
  votingDeadline: string;
  entryFeeCents: number; // 500 = $5.00
  winnerSubmissionId?: string | null;
  winner?: {
    submissionId: string;
    profileId: string;
    name: string;
    avatar: string;
    title: string;
  } | null;
  submissionCount?: number;
  entryCount?: number;
  voteCount?: number;
  sponsorships?: ChallengeSponsorship[];
  createdAt: string;
}

export interface ChallengeEntry {
  id: string;
  challengeId: string;
  profileId: string;
  stripePaymentIntentId: string;
  status: 'succeeded' | 'failed';
  createdAt: string;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  profileId: string;
  authorName: string;
  authorAvatar: string;
  authorTitle: string;
  authorScore: number;
  authorVerified: boolean;
  title?: string;
  submissionUrl: string;
  submissionText: string;
  voteCount: number;
  finalRank?: number | null;
  lockedAt?: string;
  createdAt: string;
}

export interface ChallengeVote {
  id: string;
  submissionId: string;
  voterFingerprint: string;
  voterProfileId?: string | null;
  createdAt: string;
}

export interface ChallengeSponsorship {
  id: string;
  challengeId: string;
  companyName: string;
  companyLogoUrl?: string;
  companyLink?: string;
  tier: SponsorshipTier;
  amountCents: number; // 5000, 15000, 30000
  stripePaymentIntentId: string;
  status: 'succeeded' | 'failed';
  createdAt: string;
}

export interface ChallengeSponsorshipAuction {
  id: string;
  challengeId: string;
  currentBidCents: number;
  minIncrementCents: number;
  minNextBidCents: number;
  currentSponsorName?: string;
  currentSponsorLogoUrl?: string;
  currentSponsorLink?: string;
  totalBidsCount: number;
  claimedAt?: string;
  recentBids?: SponsorshipBidRecord[];
}

export interface SponsorshipBidRecord {
  id: string;
  challengeId: string;
  companyName: string;
  companyLogoUrl?: string;
  companyLink?: string;
  amountCents: number;
  createdAt: string;
}

export interface TopDeveloperEntry {
  id: string;
  profileId: string;
  name: string;
  avatar: string;
  title: string;
  challengeId: string;
  challengeTitle: string;
  rankPosition: number; // 1, 2, or 3
  expiresAt: string;
  coSponsor?: {
    companyName: string;
    companyLogoUrl?: string;
    companyLink?: string;
    tier: 'gold';
  } | null;
  createdAt: string;
}

export interface ChallengeBadge {
  id: string;
  profileId: string;
  challengeId: string;
  challengeTitle: string;
  badgeType: 'challenge_winner' | 'challenge_runner_up';
  createdAt: string;
}

export interface ChallengeSocialPost {
  id: string;
  challengeId: string;
  platform: 'x' | 'instagram' | 'linkedin';
  postUrl?: string;
  caption: string;
  status: 'queued' | 'published' | 'failed';
  retryCount: number;
  postedAt: string;
}

export interface ChallengeDetailResponse {
  challenge: Challenge;
  submissions: ChallengeSubmission[];
  entries: ChallengeEntry[];
  sponsorships: ChallengeSponsorship[];
  userHasEntered?: boolean;
  userSubmission?: ChallengeSubmission | null;
  stats: {
    entryFeeDollars: number;
    totalEntries: number;
    totalSubmissions: number;
    totalVotes: number;
    activeSponsorshipTiers: SponsorshipTier[];
    timeRemainingMs: number;
  };
}
