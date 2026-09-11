import { Product } from './product';

export type CertificateStatus = 'active' | 'revoked' | 'transferred' | 'pending';

export interface Certificate {
  id: string;
  certificateNumber: string;
  productId: string;
  productName: string;
  brand: string;
  category: string;
  recipientName: string;
  recipientEmail: string;
  issuerName: string;
  issueDate: string;
  expiryDate?: string;
  status: CertificateStatus;
  blockchainTxHash: string;
  signatureHash: string;
  qrCodeUrl: string;
  sealType: 'gold_standard' | 'quantum_vault' | 'holographic';
  notes?: string;
}

export type CustomerTier = 'Standard' | 'VIP Collector' | 'Institutional' | 'Verified Buyer';

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  city: string;
  tier?: CustomerTier;
  registeredDate: string;
  ownedProductsCount: number;
  ownedProductIds: string[];
  status: 'active' | 'verified' | 'pending' | 'flagged';
  notes?: string;
}

export interface OwnershipTransfer {
  id: string;
  productId: string;
  productName: string;
  serialNumber?: string;
  fromCustomerId: string;
  fromCustomerName: string;
  toCustomerId: string;
  toCustomerName: string;
  toCustomerEmail: string;
  transferDate: string;
  status: 'completed' | 'pending' | 'rejected';
  notes?: string;
}

// ==========================================
// 🛡️ WARRANTY & CLAIMS
// ==========================================
export type WarrantyStatus = 'active' | 'expiring_soon' | 'expired' | 'voided' | 'pending_registration';

export interface Warranty {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  serialNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  purchaseDate: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  status: WarrantyStatus;
  warrantyType: 'Standard Factory' | 'Extended Care' | 'Lifetime Authenticity' | 'Comprehensive Protection';
  dealerName?: string;
  invoiceNumber?: string;
  termsSummary?: string;
  claimCount?: number;
}

export type ClaimStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'resolved';

export interface WarrantyClaim {
  id: string;
  warrantyId: string;
  productId: string;
  productName: string;
  serialNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  issueCategory: 'Hardware Failure' | 'Cosmetic Damage' | 'Electronic Malfunction' | 'Defect in Material' | 'Missing Parts';
  issueDescription: string;
  claimDate: string;
  status: ClaimStatus;
  resolutionNotes?: string;
  resolvedDate?: string;
  assignedTechnician?: string;
}

// ==========================================
// 🚨 FRAUD & INCIDENT REPORTS
// ==========================================
export type IncidentReason = 
  | 'unreadable_qr' 
  | 'counterfeit_suspected' 
  | 'specs_mismatch' 
  | 'duplicate_serial' 
  | 'suspicious_seller' 
  | 'tampered_seal'
  | 'stolen_goods';

export type IncidentStatus = 'investigating' | 'confirmed_counterfeit' | 'false_alarm' | 'resolved';

export interface FraudReport {
  id: string;
  productId?: string;
  productName: string;
  serialNumber?: string;
  reporterName: string;
  reporterEmail: string;
  reporterPhone?: string;
  reason: IncidentReason;
  locationCity: string;
  locationCountry: string;
  dealerOrStoreName?: string;
  description: string;
  reportDate: string;
  status: IncidentStatus;
  severity: 'low' | 'medium' | 'high' | 'critical';
  adminNotes?: string;
  investigatedBy?: string;
  investigatedDate?: string;
}

// ==========================================
// 🏢 ORGANIZATION & TEAMS (RBAC)
// ==========================================
export type UserRole = 
  | 'Owner' 
  | 'Admin' 
  | 'Production Manager' 
  | 'Certificate Officer' 
  | 'Security Auditor' 
  | 'Support Viewer';

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  type: 'Factory / Plant' | 'Distribution Center' | 'Retail Flagship' | 'Regional HQ';
  activeItemsCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId: string;
  branchName: string;
  status: 'active' | 'invited' | 'suspended';
  lastActive: string;
  avatarUrl?: string;
}

// ==========================================
// 💻 DEVELOPER & API
// ==========================================
export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  secretMasked: string;
  createdAt: string;
  lastUsedAt?: string;
  requestsCount: number;
  environment: 'production' | 'sandbox';
  status: 'active' | 'revoked';
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'failing' | 'disabled';
  createdAt: string;
  successfulDispatches: number;
  failedDispatches: number;
}

