export type UserRole = 'buyer' | 'provider';

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
  role?: string;
  title?: string;
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

export interface ExternalProfileLink {
  id: string;
  profileId: string;
  userId?: string;
  platform: 'linkedin' | 'upwork' | 'fiverr' | 'github' | 'portfolio' | 'website';
  url: string;
  isPrimary?: boolean;
  displayOrder?: number;
  clicks?: number;
}

export interface ExternalLinks {
  linkedin?: string;
  github?: string;
  upwork?: string;
  fiverr?: string;
  website?: string;
  portfolio?: string;
  behance?: string;
}

export interface Service {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerHeadline: string;
  title: string; // e.g. "Build a REST API with Node.js"
  category: string; // e.g. "Web Development"
  description: string;
  skills: string[];
  startingPrice: number; // e.g. 50
  priceType: 'fixed' | 'hourly' | 'starting_from';
  deliveryTime: string; // e.g. "3 days"
  image?: string;
  isPromoted?: boolean;
  score?: number;
  rating?: number;
  reviewCount?: number;
}

export interface ServiceRequest {
  id: string;
  serviceId?: string;
  serviceTitle?: string;
  providerId: string;
  providerName: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  projectDescription: string;
  budget: string; // e.g. "$500"
  deadline: string; // e.g. "7 days"
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'contact' | 'request' | 'status' | 'promotion';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Professional {
  id: string;
  userId?: string;
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
  experience: ExperienceItem[];
  portfolio: PortfolioItem[];
  reviews: Review[];
  externalLinks: ExternalLinks;
  externalProfileLinks?: ExternalProfileLink[];
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
  activeDisputes?: number;
  accountStanding?: 'active' | 'flagged' | 'suspended';
  deliveryTime?: string;
  offersConsultation?: boolean;
  services?: Service[];
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
  isSponsoredLead?: boolean;
}

export interface PromotionRecord {
  id: string;
  professionalId: string;
  professionalName: string;
  amount: number; // $2 USD
  durationHours: number; // 24
  startedAt: string;
  expiresAt: string;
  paymentMethod: string;
  status: 'active' | 'expired';
  transactionId: string;
  impressions?: number;
  clicks?: number;
  contacts?: number;
}

export interface FilterState {
  query: string;
  category: string;
  service?: string;
  location: string;
  experience: string;
  minScore: number;
  maxHourlyRate: number;
  skills: string[];
  promotedOnly: boolean;
  deliverySpeed?: string;
  sortBy: 'relevance' | 'score' | 'rating' | 'hourlyRateAsc' | 'hourlyRateDesc';
}
