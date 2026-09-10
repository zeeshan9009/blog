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

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  city: string;
  tier: 'Standard' | 'VIP Collector' | 'Institutional' | 'Verified Buyer';
  registeredDate: string;
  ownedProductsCount: number;
  ownedProductIds: string[];
  totalScans: number;
  status: 'active' | 'pending' | 'flagged';
  walletAddress?: string;
}

export interface OwnershipTransfer {
  id: string;
  productId: string;
  productName: string;
  fromCustomerId: string;
  fromCustomerName: string;
  toCustomerId: string;
  toCustomerName: string;
  transferDate: string;
  txHash: string;
  status: 'completed' | 'pending' | 'rejected';
}
