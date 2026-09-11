export type ProductStatus = 'verified' | 'pending' | 'flagged' | 'expired';

export type ProductLifecycleState = 
  | 'MANUFACTURED' 
  | 'IN_INVENTORY' 
  | 'DISTRIBUTED' 
  | 'SOLD' 
  | 'REGISTERED' 
  | 'ACTIVATED' 
  | 'OWNED'
  | 'TRANSFERRED'
  | 'SERVICED' 
  | 'WARRANTY_CLAIMED'
  | 'RECALLED' 
  | 'RETIRED';

export interface OwnershipHistoryRecord {
  id: string;
  date: string;
  fromName: string;
  toName: string;
  eventType: 'initial_registration' | 'transfer' | 'custody_update' | 'dealer_assignment';
  notes?: string;
  location?: string;
}

export interface ServiceRecord {
  id: string;
  date: string;
  serviceType: 'Routine Maintenance' | 'Parts Replacement' | 'Firmware Update' | 'Inspection' | 'Repair' | 'Polishing & Cleaning';
  serviceCenter: string;
  technicianName?: string;
  description: string;
  cost?: string;
  nextServiceDueDate?: string;
}

export interface RecallNotice {
  isRecalled: boolean;
  recallCode?: string;
  reason?: string;
  safetyHazard?: string;
  actionRequired?: string;
  dateIssued?: string;
  contactSupport?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  serialNumber: string;
  batchNumber: string;
  manufacturingDate: string;
  originCountry: string;
  status: ProductStatus;
  imageUrl?: string;
  passportHash: string;
  verificationCount: number;
  qrCodeUrl: string;
  createdAt: string;
  specs?: Record<string, string>;
  warrantyMonths?: number;
  currentOwnerId?: string;
  currentOwnerName?: string;
  currentOwnerEmail?: string;
  currentOwnerPhone?: string;
  purchaseDate?: string;
  dealerName?: string;
  lifecycleState?: ProductLifecycleState;
  recallNotice?: RecallNotice;
  serviceHistory?: ServiceRecord[];
  ownershipHistory?: OwnershipHistoryRecord[];
}

export interface QRCodeConfig {
  size: number;
  fgColor: string;
  bgColor: string;
  includeMargin: boolean;
  level: 'L' | 'M' | 'Q' | 'H';
  includeLogo: boolean;
}

