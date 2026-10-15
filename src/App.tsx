import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Sidebar } from './components/common/Sidebar.tsx';
import { Header } from './components/common/Header.tsx';
import { ToastContainer } from './components/common/Toast.tsx';
import { ProductDetailModal } from './components/common/ProductDetailModal.tsx';
import { OverviewPage } from './components/pages/OverviewPage.tsx';
import { ProductsPage } from './components/pages/ProductsPage.tsx';
import { InventoryPage } from './components/pages/InventoryPage.tsx';
import { SalesPage } from './components/pages/SalesPage.tsx';
import { DemandAnalysisPage } from './components/pages/DemandAnalysisPage.tsx';
import { ForecastingPage } from './components/pages/ForecastingPage.tsx';
import { RecommendationsPage } from './components/pages/RecommendationsPage.tsx';
import { ReportsPage } from './components/pages/ReportsPage.tsx';
import { SettingsPage } from './components/pages/SettingsPage.tsx';

const MainLayout: React.FC = () => {
  const { currentPage, isSidebarCollapsed } = useApp();

  const renderActivePage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage />;
      case 'products':
        return <ProductsPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'sales':
        return <SalesPage />;
      case 'demand-analysis':
        return <DemandAnalysisPage />;
      case 'forecasting':
        return <ForecastingPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`main-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Header />

        <main className="page-content">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Overlays & Modals */}
      <ProductDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
