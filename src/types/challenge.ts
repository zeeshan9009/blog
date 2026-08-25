export type ChallengeStatus = 'open' | 'judging' | 'closed';

export interface Challenge {
  id: string;
  categoryId?: string | null;
  category: string;
  title: string;
  prompt: string;
  bannerImage?: string;
  status: ChallengeStatus;
  submissionDeadline: string;
  votingDeadline: string;
  prizePoolCents: number;
  platformFeeBps: number;
  winnerSubmissionId?: string | null;
  winner?: {
    submissionId: string;
    profileId: string;
    name: string;
    avatar: string;
    title: string;
    prizeAmountDollars: number;
  } | null;
  submissionCount?: number;
  bidCount?: number;
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
  title: string;
  submissionUrl: string;
  submissionText: string;
  demoVideoUrl?: string;
  voteCount: number;
  clientScore?: number | null;
  finalRank?: number | null;
  finalScore?: number | null;
  createdAt: string;
}

export interface ChallengeVote {
  id: string;
  submissionId: string;
  voterProfileId?: string | null;
  voterFingerprint: string;
  weight: number;
  createdAt: string;
}

export interface ChallengeBid {
  id: string;
  challengeId: string;
  bidderProfileId?: string | null;
  bidderLabel: string;
  bidderMessage?: string;
  bidderAvatar?: string;
  amountCents: number;
  stripePaymentIntentId: string;
  status: 'succeeded' | 'failed';
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
  recentBids: ChallengeBid[];
  stats: {
    totalPrizePoolDollars: number;
    netWinnerPrizeDollars: number;
    platformFeeDollars: number;
    totalSubmissions: number;
    totalVotes: number;
    totalBids: number;
    timeRemainingMs: number;
  };
}
