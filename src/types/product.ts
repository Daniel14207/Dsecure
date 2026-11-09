export interface Product {
  id: string;
  sourceWorkbook: string;
  sourceSheet: string;
  sourceRow: string;
  category: string;
  name: string;
  reference: string;
  description: string;
  originalPriceAr: number | null;
  sellingPriceAr: number | null;
  formattedPrice: string;
  currency: string;
  image: string | null;
  images: string[];
  validationStatus: string;
  issue: string | null;
  topSection: 'cameras' | 'alarms' | 'packs' | 'dvr_nvr' | 'accessories' | 'hdd' | 'network' | 'monitors';
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
  | 'data-qa';
