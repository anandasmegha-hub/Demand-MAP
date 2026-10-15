import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  CheckCheck,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import type { NavigationPage } from '../../types/index.ts';

const PAGE_HEADERS: Record<NavigationPage, { title: string; subtitle: string }> = {
  overview: {
    title: 'Dashboard Overview',
    subtitle: 'Real-time demand signals, sales metrics & inventory velocity',
  },
  products: {
    title: 'Product Catalog',
    subtitle: 'Manage inventory items, thresholds and SKU profitability',
  },
  inventory: {
    title: 'Inventory Status & Stock Control',
    subtitle: 'Multi-location shelf levels, turnover velocity and reorders',
  },
  sales: {
    title: 'Sales & Transactions Ledger',
    subtitle: 'Channel breakdown, POS registers and basket analysis',
  },
  'demand-analysis': {
    title: 'Demand Analysis & Patterns',
    subtitle: 'Hourly footfall curves, day-of-week trends and elasticity',
  },
  forecasting: {
    title: 'Predictive Demand Modeling (Demo)',
    subtitle: 'Simulated 14-day projections, confidence bands and risk factors',
  },
  recommendations: {
    title: 'Smart Recommendations',
    subtitle: 'Automated small business intelligence rules & stockout prevention',
  },
  reports: {
    title: 'Reports & Exports',
    subtitle: 'Exportable audits for turnover, lost sales and supplier reliability',
  },
  settings: {
    title: 'Platform Settings',
    subtitle: 'Store profile, alert thresholds and demonstration parameters',
  },
};

export const Header: React.FC = () => {
  const {
    currentPage,
    searchQuery,
    setSearchQuery,
    notifications,
    markAllNotificationsRead,
    setIsMobileNavOpen,
    resetDemoData,
    criticalAlertsCount,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const headerInfo = PAGE_HEADERS[currentPage] || PAGE_HEADERS.overview;

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Informative Demo Banner */}
      <div className="demo-banner">
        <div className="demo-banner-content">
          <span className="demo-indicator" />
          <strong>Demonstration Environment</strong>
          <span>• Simulated Small Business dataset for Apex Artisan Market. Not connected to a live database.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {criticalAlertsCount > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#b91c1c',
                fontWeight: 600,
                fontSize: '0.78rem',
              }}
            >
              <AlertTriangle size={13} />
              {criticalAlertsCount} critical stock alert{criticalAlertsCount > 1 ? 's' : ''}
            </span>
          )}
          <button
            type="button"
            onClick={resetDemoData}
            style={{
              background: 'none',
              border: 'none',
              color: '#0d9488',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
            title="Reset modified demonstration data back to default values"
          >
            <RotateCcw size={12} />
            Reset Demo Data
          </button>
        </div>
      </div>

      <header className="top-header">
        <div className="header-left">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
          >
            <Menu size={22} />
          </button>

          <div className="page-title-group">
            <h1>{headerInfo.title}</h1>
            <p className="page-subtitle">{headerInfo.subtitle}</p>
          </div>
        </div>

        <div className="header-right">
          {/* Global Search bar */}
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search products, SKUs, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-hotkey">/</span>
          </div>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              type="button"
              className="header-btn"
              onClick={() => setShowNotifications((prev) => !prev)}
              aria-label="View notifications"
              title="Notifications & Alerts"
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="badge-dot" />}
            </button>

            {showNotifications && (
              <div className="notification-popover">
                <div
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fafbfc',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    Notifications ({unreadCount} new)
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-teal)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCheck size={14} />
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: n.read ? '#ffffff' : '#f0fdfa',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            color: 'var(--primary-navy)',
                          }}
                        >
                          {n.title}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {n.timestamp}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-secondary)',
                          margin: 0,
                        }}
                      >
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Placeholder Chip */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <div
              className="profile-chip"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              role="button"
              tabIndex={0}
            >
              <div className="profile-avatar">AM</div>
              <span className="profile-name">Alex Morgan</span>
            </div>

            {showProfileMenu && (
              <div
                className="notification-popover"
                style={{ width: '220px', padding: '8px 0' }}
              >
                <div
                  style={{
                    padding: '8px 16px 12px',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>Alex Morgan</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Store Manager • Apex Market
                  </div>
                </div>
                <div style={{ padding: '6px 0' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      resetDemoData();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 16px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <RotateCcw size={14} />
                    Reset Demo State
                  </button>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '100%',
                      padding: '8px 16px',
                      textDecoration: 'none',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <ExternalLink size={14} />
                    Help & Docs
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
