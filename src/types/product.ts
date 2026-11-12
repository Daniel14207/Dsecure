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
  isAvailable?: boolean; // true = En stock / Disponible, false = Indisponible temporairement
  updatedAt?: string;
}

export interface AdminProduct extends Product {
  originalPriceAr: number | null;
  sourceWorkbook?: string;
  sourceSheet?: string;
  sourceRow?: string;
  validationStatus?: string;
  issue?: string | null;
  marginAr: number | null;
  marginPercentage: number | null;
  createdAt?: string;
}

export interface AdminAuditSummary {
  totalCount: number;
  availableCount: number;
  unavailableCount: number;
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
  categoriesCount: number;
  ordersCount: number;
  pendingOrdersCount: number;
  completedOrdersCount: number;
  customersCount: number;
  totalVisits: number;
}

export type OrderStatus =
  | 'Nouvelle commande'
  | 'En attente de confirmation'
  | 'Confirmée'
  | 'En préparation'
  | 'Livrée'
  | 'Annulée';

export interface OrderItem {
  productId: string;
  reference: string;
  name: string;
  quantity: number;
  unitPriceAr: number;
  totalPriceAr: number;
  image?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "CMD-2026-001"
  customer: {
    fullName: string;
    phone: string;
    address: string;
    note?: string;
  };
  items: OrderItem[];
  totalAmountAr: number;
  formattedTotal: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  internalNotes?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpentAr: number;
  formattedTotalSpent: string;
  firstOrderAt: string;
  lastOrderAt: string;
  orderIds: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action:
    | 'PRODUCT_UPDATED'
    | 'PRODUCT_CREATED'
    | 'PRODUCT_DELETED'
    | 'AVAILABILITY_TOGGLED'
    | 'PRICE_MODIFIED'
    | 'PACK_MODIFIED'
    | 'CATEGORY_MODIFIED'
    | 'ORDER_STATUS_CHANGED';
  entityId: string;
  entityName: string;
  details: string;
  user: string;
}

export interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  pageViews: Record<string, number>;
  productViews: Record<string, number>;
  dailyVisits: Array<{ date: string; visits: number }>;
  lastVisitedAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  topSection: 'cameras' | 'alarms' | 'packs' | 'dvr_nvr' | 'accessories' | 'hdd' | 'network' | 'monitors';
  description?: string;
  productCount: number;
  isActive: boolean;
  order: number;
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
