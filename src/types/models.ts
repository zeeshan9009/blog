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
