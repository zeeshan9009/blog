export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Review {
  id: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  project: string;
}

export interface ExternalLinks {
  linkedin?: string;
  github?: string;
  upwork?: string;
  fiverr?: string;
  website?: string;
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  category: string;
  location: string;
  country: string;
  avatar: string;
  bio: string;
  hourlyRate: number;
  experienceYears: number;
  score: number; // 0-100 ProRank score
  rating: number; // e.g. 4.9
  reviewCount: number;
  skills: string[];
  detailedSkills?: Skill[];
  experience: ExperienceItem[];
  portfolio: PortfolioItem[];
  reviews: Review[];
  externalLinks: ExternalLinks;
  isVerified: boolean;
  isPromoted: boolean;
  promotionExpiresAt?: string; // ISO String
  viewsCount: number;
  clicksCount: number;
  inquiriesCount: number;
  createdAt: string;
  // Marketplace / Ranking Page Fields
  gigImage?: string;
  gigTitle?: string;
  levelBadge?: string;
  isOnline?: boolean;
  deliveryTime?: string;
  offersConsultation?: boolean;
}

export interface Inquiry {
  id: string;
  professionalId: string;
  professionalName: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  message: string;
  budget?: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export interface PromotionRecord {
  id: string;
  professionalId: string;
  professionalName: string;
  amount: number; // $1
  durationHours: number; // 24
  startedAt: string;
  expiresAt: string;
  paymentMethod: string;
  status: 'active' | 'expired';
  transactionId: string;
}

export interface FilterState {
  query: string;
  category: string;
  location: string;
  experience: string;
  minScore: number;
  maxHourlyRate: number;
  skills: string[];
  promotedOnly: boolean;
  sortBy: 'relevance' | 'score' | 'rating' | 'hourlyRateAsc' | 'hourlyRateDesc';
}
