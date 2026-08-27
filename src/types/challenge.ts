export type ChallengeStatus = 'draft' | 'open_entry' | 'submission_window' | 'voting_window' | 'closed';

export type SubmissionStatus =
  | 'draft'
  | 'payment_pending'
  | 'paid'
  | 'submission_pending'
  | 'submitted'
  | 'approved'
  | 'rejected';

export type PaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export type SponsorshipTier = 'bronze' | 'silver' | 'gold';

export interface ChallengeVotingSettings {
  challengeId: string;
  maxVotesPerVoter: number;
  allowOncePerParticipant: boolean;
  requireAuth: boolean;
  isPublic: boolean;
  minVotes?: number;
  maxVotes?: number;
  votingStartAt?: string;
  votingEndAt?: string;
  voteStatus: 'upcoming' | 'active' | 'ended';
  createdAt?: string;
  updatedAt?: string;
}

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
  votingSettings?: ChallengeVotingSettings;
  sponsorships?: ChallengeSponsorship[];
  createdAt: string;
}

export interface ChallengeEntry {
  id: string;
  challengeId: string;
  profileId: string;
  paddleTransactionId?: string;
  stripePaymentIntentId?: string;
  status: 'succeeded' | 'failed';
  createdAt: string;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  challengeTitle?: string;
  profileId: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar: string;
  authorTitle: string;
  authorScore: number;
  authorVerified: boolean;
  title?: string;
  submissionUrl: string;
  submissionText: string;
  status: SubmissionStatus;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  reviewFeedback?: string;
  voteCount: number;
  finalRank?: number | null;
  percentageOfVotes?: number;
  lockedAt?: string;
  lastVotedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChallengeVote {
  id: string;
  submissionId: string;
  challengeId?: string;
  voterFingerprint: string;
  voterProfileId?: string | null;
  createdAt: string;
}

export interface VoteAuditLog {
  id: string;
  submissionId: string;
  challengeId: string;
  voterIdentifier: string;
  voterProfileId?: string | null;
  ipAddress?: string;
  userAgent?: string;
  clientFingerprint?: string;
  status: 'valid' | 'flagged_suspicious' | 'rejected';
  reason?: string;
  createdAt: string;
}

export interface SuspiciousActivityRecord {
  id: string;
  challengeId?: string;
  submissionId?: string;
  voterIdentifier?: string;
  activityType: string;
  details?: any;
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
  stripePaymentIntentId?: string;
  paddleTransactionId?: string;
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
  sponsorshipAuction?: ChallengeSponsorshipAuction | null;
  votingSettings?: ChallengeVotingSettings;
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
