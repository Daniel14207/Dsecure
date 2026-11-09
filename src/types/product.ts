export interface Product {
  id: string;
  category: string;
  name: string;
  reference: string;
  description: string;
  sellingPriceAr: number | null;
  formattedPrice: string;
  currency: string;
  image: string | null;
  images: string[];
  topSection: 'cameras' | 'alarms' | 'packs' | 'dvr_nvr' | 'accessories' | 'hdd' | 'network' | 'monitors';
}

export interface AdminProduct extends Product {
  originalPriceAr: number | null;
  sourceWorkbook: string;
  sourceSheet: string;
  sourceRow: string;
  validationStatus: string;
  issue: string | null;
  marginAr: number | null;
  marginPercentage: number | null;
}

export interface AdminAuditSummary {
  totalCount: number;
  withImageCount: number;
  withoutImageCount: number;
  withPriceCount: number;
  missingPriceCount: number;
  flaggedCount: number;
  totalPurchaseValueAr: number;
  totalSellingValueAr: number;
  grossMarginAr: number;
  averageMarginPercent: number;
  sheetDistribution: { [key: string]: number };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
}

export type ActiveSection =
  | 'home'
  | 'cameras'
  | 'alarms'
  | 'packs'
  | 'dvr_nvr'
  | 'accessories'
  | 'hdd'
  | 'network'
  | 'monitors'
  | 'services'
  | 'about'
  | 'testimonials'
  | 'contact'
  | 'admin';
