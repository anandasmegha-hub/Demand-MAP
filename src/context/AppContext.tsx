import React, { createContext, useContext, useState, useMemo } from 'react';
import type {
  NavigationPage,
  Product,
  SaleTransaction,
  StockAlert,
  Recommendation,
  NotificationItem,
  ToastMessage,
  TimeRange,
} from '../types/index.ts';
import {
  INITIAL_PRODUCTS,
  INITIAL_ALERTS,
  INITIAL_TRANSACTIONS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData.ts';

interface AppContextType {
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  products: Product[];
  alerts: StockAlert[];
  transactions: SaleTransaction[];
  recommendations: Recommendation[];
  notifications: NotificationItem[];
  toasts: ToastMessage[];
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  // Actions
  addProduct: (product: Product) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  adjustStock: (productId: string, delta: number) => void;
  setExactStock: (productId: string, newStock: number) => void;
  reorderProduct: (productId: string, quantity: number) => void;
  dismissAlert: (alertId: string) => void;
  applyRecommendation: (recId: string) => void;
  dismissRecommendation: (recId: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
  // Computed helpers
  totalProductsCount: number;
  lowStockCount: number;
  criticalAlertsCount: number;
  totalInventoryValue: number;
  todaySalesTotal: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [alerts, setAlerts] = useState<StockAlert[]>(INITIAL_ALERTS);
  const [transactions] = useState<SaleTransaction[]>(INITIAL_TRANSACTIONS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    addToast(`Item "${newProduct.name}" added to catalog with ${newProduct.stock} initial units!`, 'success');
  };

  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const adjustStock = (productId: string, delta: number) => {
    let updatedProduct: Product | undefined;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newStock = Math.max(0, p.stock + delta);
        let status = p.status;
        if (newStock === 0) status = 'out_of_stock';
        else if (newStock <= p.minThreshold * 0.5) status = 'critical';
        else if (newStock <= p.minThreshold) status = 'reorder';
        else status = 'optimal';

        updatedProduct = { ...p, stock: newStock, status };
        return updatedProduct;
      })
    );

    // Keep alerts synchronized
    setAlerts((prev) => {
      const target = products.find((p) => p.id === productId);
      if (!target) return prev;
      const newStock = Math.max(0, target.stock + delta);

      if (newStock > target.minThreshold) {
        return prev.filter((a) => a.productId !== productId);
      }

      const existing = prev.find((a) => a.productId === productId);
      const daysRemaining = target.dailyDemandRate > 0 ? newStock / target.dailyDemandRate : 0;
      const urgency = newStock === 0 || newStock <= target.minThreshold * 0.5 ? 'critical' : 'warning';

      if (existing) {
        return prev.map((a) =>
          a.productId === productId ? { ...a, currentStock: newStock, daysRemaining, urgency } : a
        );
      } else {
        return [
          ...prev,
          {
            id: `alert-${Date.now()}`,
            productId: target.id,
            productName: target.name,
            sku: target.sku,
            currentStock: newStock,
            reorderThreshold: target.minThreshold,
            daysRemaining,
            urgency,
            suggestedReorderQty: Math.max(20, target.minThreshold * 2),
            leadTimeDays: 2,
          },
        ];
      }
    });

    addToast(
      delta > 0
        ? `Added +${delta} units to stock.`
        : `Deducted ${Math.abs(delta)} units from stock.`,
      'info'
    );
  };

  const setExactStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const validStock = Math.max(0, newStock);
        let status = p.status;
        if (validStock === 0) status = 'out_of_stock';
        else if (validStock <= p.minThreshold * 0.5) status = 'critical';
        else if (validStock <= p.minThreshold) status = 'reorder';
        else status = 'optimal';

        return { ...p, stock: validStock, status };
      })
    );
    addToast(`Stock level updated to ${newStock} units.`, 'success');
  };

  const reorderProduct = (productId: string, quantity: number) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    // Simulate instant delivery / order placed confirmation
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedStock = p.stock + quantity;
        return {
          ...p,
          stock: updatedStock,
          status: updatedStock > p.minThreshold ? 'optimal' : 'reorder',
          lastRestocked: 'Today (Simulated Delivery)',
        };
      })
    );

    // Auto resolve alert if matching
    setAlerts((prev) => prev.filter((a) => a.productId !== productId));

    addToast(
      `Purchase Order for ${quantity} units of ${target.name.split(' (')[0]} drafted and simulated in inventory!`,
      'success'
    );
  };

  const dismissAlert = (alertId: string) => {
    const target = alerts.find((a) => a.id === alertId);
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    addToast(
      `Alert dismissed for ${target?.productName.split(' (')[0] || 'item'}. Re-triggers on next day turnover.`,
      'info'
    );
  };

  const applyRecommendation = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, applied: true } : r))
    );
    addToast('Recommendation rule applied to active intelligence engine!', 'success');
  };

  const dismissRecommendation = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, dismissed: true } : r))
    );
    addToast('Recommendation dismissed.', 'info');
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  const resetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setAlerts(INITIAL_ALERTS);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTimeRange('7d');
    setSearchQuery('');
    addToast('Demonstration data restored to initial factory state.', 'info');
  };

  const totalProductsCount = products.length;
  const lowStockCount = useMemo(
    () => products.filter((p) => p.status === 'critical' || p.status === 'reorder' || p.status === 'out_of_stock').length,
    [products]
  );
  const criticalAlertsCount = useMemo(
    () => alerts.filter((a) => a.urgency === 'critical').length,
    [alerts]
  );
  const totalInventoryValue = useMemo(
    () => products.reduce((acc, p) => acc + p.stock * p.cost, 0),
    [products]
  );
  const todaySalesTotal = 2840.5;

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        timeRange,
        setTimeRange,
        searchQuery,
        setSearchQuery,
        products,
        alerts,
        transactions,
        recommendations,
        notifications,
        toasts,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileNavOpen,
        setIsMobileNavOpen,
        selectedProduct,
        setSelectedProduct,
        addProduct,
        addToast,
        removeToast,
        adjustStock,
        setExactStock,
        reorderProduct,
        dismissAlert,
        applyRecommendation,
        dismissRecommendation,
        markAllNotificationsRead,
        resetDemoData,
        totalProductsCount,
        lowStockCount,
        criticalAlertsCount,
        totalInventoryValue,
        todaySalesTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// oxlint-disable-next-line react/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
