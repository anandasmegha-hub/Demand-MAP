import React from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Receipt,
  Activity,
  Sparkles,
  Lightbulb,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import type { NavigationPage } from '../../types/index.ts';

interface NavItemDef {
  id: NavigationPage;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileNavOpen,
    setIsMobileNavOpen,
    lowStockCount,
    recommendations,
  } = useApp();

  const pendingRecommendationsCount = recommendations.filter((r) => !r.applied && !r.dismissed).length;

  const navItems: NavItemDef[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'sales', label: 'Sales', icon: Receipt },
    { id: 'demand-analysis', label: 'Demand Analysis', icon: Activity },
    { id: 'forecasting', label: 'Forecasting', icon: Sparkles },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: Lightbulb,
      badge: pendingRecommendationsCount > 0 ? pendingRecommendationsCount : undefined,
    },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (pageId: NavigationPage) => {
    setCurrentPage(pageId);
    if (isMobileNavOpen) {
      setIsMobileNavOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 35,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <aside
        className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${
          isMobileNavOpen ? 'mobile-open' : ''
        }`}
      >
        <div className="sidebar-header">
          <div className="brand-container" title="DemandMap">
            <div className="brand-icon-box">
              <Compass size={22} strokeWidth={2.4} />
            </div>
            {!isSidebarCollapsed && (
              <div className="brand-info">
                <span className="brand-name">
                  Demand<span>Map</span>
                </span>
                <span className="brand-tag">Small Business SaaS</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar width"
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Main Navigation">
          {!isSidebarCollapsed && <div className="nav-section-label">Core Platform</div>}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                title={item.label}
              >
                <span className="nav-item-icon">
                  <Icon size={19} strokeWidth={isActive ? 2.2 : 1.9} />
                </span>
                {!isSidebarCollapsed && <span className="nav-item-label">{item.label}</span>}
                {!isSidebarCollapsed && item.badge !== undefined && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="store-pill" title="Apex Specialty Roasters & Market">
            <div className="store-avatar">
              <Store size={15} />
            </div>
            {!isSidebarCollapsed && (
              <div className="store-details">
                <div className="store-title">Apex Artisan Market</div>
                <div className="store-sub">Demo Store #04</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
