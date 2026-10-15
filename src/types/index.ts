export type NavigationPage =
  | 'overview'
  | 'products'
  | 'inventory'
  | 'sales'
  | 'demand-analysis'
  | 'forecasting'
  | 'recommendations'
  | 'reports'
  | 'settings';

export type StockStatus = 'optimal' | 'reorder' | 'critical' | 'out_of_stock';

export type DemandTrend = 'surging' | 'rising' | 'stable' | 'declining';

export type AlertUrgency = 'critical' | 'warning' | 'info';

export type TimeRange = '7d' | '30d' | '90d' | 'ytd';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minThreshold: number;
  maxCapacity: number;
  unit: string;
  dailyDemandRate: number;
  lastRestocked: string;
  demandTrend: DemandTrend;
  status: StockStatus;
  unitsSold30d: number;
  revenue30d: number;
}

export interface SaleTransaction {
  id: string;
  timestamp: string;
  channel: 'In-Store POS' | 'Online Click & Collect' | 'Delivery Partner' | 'Wholesale B2B';
  customer: string;
  itemsCount: number;
  total: number;
  status: 'Completed' | 'Processing' | 'Refunded';
  itemsSummary: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderThreshold: number;
  daysRemaining: number;
  urgency: AlertUrgency;
  suggestedReorderQty: number;
  leadTimeDays: number;
  dismissed?: boolean;
}

export interface SalesTrendPoint {
  date: string;
  label: string;
  sales: number;
  orders: number;
  baseline: number;
}

export interface CategoryHealth {
  category: string;
  totalItems: number;
  inStockPercent: number;
  stockValue: number;
  turnoverRate: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: 'reorder' | 'pricing' | 'inventory' | 'marketing';
  impact: string;
  description: string;
  actionLabel: string;
  urgency: 'high' | 'medium' | 'low';
  applied?: boolean;
  dismissed?: boolean;
}

export interface ForecastPoint {
  date: string;
  label: string;
  actual?: number;
  forecast: number;
  confidenceLower: number;
  confidenceUpper: number;
  demandFactor: string;
}

export interface ReportItem {
  id: string;
  title: string;
  category: string;
  period: string;
  generatedAt: string;
  fileSize: string;
  summary: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'order' | 'system';
  read: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
}
