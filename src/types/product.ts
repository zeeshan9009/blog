export type ProductStatus = 'verified' | 'pending' | 'flagged' | 'expired';

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
}

export interface QRCodeConfig {
  size: number;
  fgColor: string;
  bgColor: string;
  includeMargin: boolean;
  level: 'L' | 'M' | 'Q' | 'H';
  includeLogo: boolean;
}
