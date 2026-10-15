import React, { useState } from 'react';
import {
  Package,
  DollarSign,
  Boxes,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Receipt,
  ShoppingCart,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { MetricCard } from '../common/MetricCard.tsx';
import { SalesTrendChart } from '../charts/SalesTrendChart.tsx';
import { InventoryStatusBar } from '../charts/InventoryStatusBar.tsx';
import { EmptyState } from '../common/EmptyState.tsx';

export const OverviewPage: React.FC = () => {
  const {
    products,
    alerts,
    transactions,
    totalProductsCount,
    lowStockCount,
    totalInventoryValue,
    todaySalesTotal,
    setCurrentPage,
    reorderProduct,
    dismissAlert,
    setSelectedProduct,
    searchQuery,
  } = useApp();

  const [topProductCategory, setTopProductCategory] = useState<string>('all');

  // Filter top selling products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      topProductCategory === 'all' || p.category === topProductCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedTopProducts = [...filteredProducts].sort(
    (a, b) => b.unitsSold30d - a.unitsSold30d
  );

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div>
      {/* 1. Overview KPI Cards */}
      <div className="metrics-grid">
        <MetricCard
          label="Total Products"
          value={totalProductsCount}
          changeText="+3 this month"
          trend="up"
          icon={Package}
          iconBgColor="#eff6ff"
          iconColor="#2563eb"
          subtext="across 5 store categories"
        />

        <MetricCard
          label="Today's Sales"
          value={`$${todaySalesTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          changeText="+18.4% vs yday"
          trend="up"
          icon={DollarSign}
          iconBgColor="#f0fdfa"
          iconColor="#0d9488"
          subtext="106 store transactions"
        />

        <MetricCard
          label="Inventory Value"
          value={`$${Math.round(totalInventoryValue).toLocaleString()}`}
          changeText="Optimal turn"
          trend="neutral"
          icon={Boxes}
          iconBgColor="#fef3c7"
          iconColor="#d97706"
          subtext="at wholesale cost basis"
        />

        <MetricCard
          label="Low-Stock Items"
          value={lowStockCount}
          changeText={lowStockCount > 3 ? 'Action needed' : 'Normal range'}
          trend={lowStockCount > 3 ? 'down' : 'neutral'}
          icon={AlertTriangle}
          iconBgColor={lowStockCount > 0 ? '#fef2f2' : '#ecfdf5'}
          iconColor={lowStockCount > 0 ? '#ef4444' : '#10b981'}
          subtext={`${alerts.length} active reorder alerts`}
        />
      </div>

      {/* 2. Low-Stock Alerts Panel (Prominent action banner) */}
      {alerts.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div>
              <div className="card-title-group">
                <AlertTriangle size={18} color="#ef4444" />
                <h2 className="card-title">Priority Low-Stock Alerts & Depletion Risks</h2>
              </div>
              <div className="card-subtitle">
                Automated demand velocity warnings calculated from rolling POS consumption
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setCurrentPage('inventory')}
            >
              View Inventory Table
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {alerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className={`alert-card ${alert.urgency}`}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor:
                          alert.urgency === 'critical'
                            ? '#fee2e2'
                            : alert.urgency === 'warning'
                            ? '#fef3c7'
                            : '#e0f2fe',
                        color:
                          alert.urgency === 'critical'
                            ? '#b91c1c'
                            : alert.urgency === 'warning'
                            ? '#b45309'
                            : '#0369a1',
                      }}
                    >
                      {alert.urgency}
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary-navy)' }}>
                      {alert.productName}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      ({alert.sku})
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginTop: '6px',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span>
                      Current Stock: <strong>{alert.currentStock}</strong> (Min: {alert.reorderThreshold})
                    </span>
                    <span>•</span>
                    <span
                      style={{
                        color: alert.daysRemaining <= 1.5 ? '#b91c1c' : '#b45309',
                        fontWeight: 600,
                      }}
                    >
                      ~{alert.daysRemaining.toFixed(1)} days supply left
                    </span>
                    <span>•</span>
                    <span>Supplier Lead Time: {alert.leadTimeDays}d</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-teal btn-sm"
                    onClick={() => reorderProduct(alert.productId, alert.suggestedReorderQty)}
                    title={`Order ${alert.suggestedReorderQty} units`}
                  >
                    <ShoppingCart size={13} />
                    Reorder {alert.suggestedReorderQty} units
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => dismissAlert(alert.id)}
                    title="Dismiss alert temporarily"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Sales Trends Chart + Inventory Status Section (Two-Column Layout) */}
      <div className="dashboard-grid-2-1">
        <SalesTrendChart />
        <InventoryStatusBar />
      </div>

      {/* 4. Top-Selling Products Table + Recent Sales Section */}
      <div className="dashboard-grid-2-1">
        {/* Top-Selling Products Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title-group">
                <TrendingUp size={18} color="var(--primary-navy)" />
                <h2 className="card-title">Top-Selling Products</h2>
              </div>
              <div className="card-subtitle">
                Ranked by 30-day sales volume and demand trajectory
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="pill-group">
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`pill-btn ${topProductCategory === cat ? 'active' : ''}`}
                  onClick={() => setTopProductCategory(cat)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {cat === 'all' ? 'All' : cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {sortedTopProducts.length === 0 ? (
            <EmptyState
              title="No products match your filter"
              description="Clear category or search filter to view your items."
              actionText="Reset filters"
              onAction={() => setTopProductCategory('all')}
            />
          ) : (
            <div className="table-container">
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Product & SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>30D Sold</th>
                    <th>Revenue</th>
                    <th>Trend</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTopProducts.slice(0, 5).map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>
                          {prod.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {prod.sku}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.76rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                          }}
                        >
                          {prod.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>${prod.price.toFixed(2)}</td>
                      <td>
                        <span className={`status-pill status-${prod.status}`}>
                          {prod.stock} {prod.unit}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{prod.unitsSold30d}</td>
                      <td style={{ fontWeight: 600, color: '#0d9488' }}>
                        ${prod.revenue30d.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            color:
                              prod.demandTrend === 'surging'
                                ? '#0d9488'
                                : prod.demandTrend === 'rising'
                                ? '#2563eb'
                                : prod.demandTrend === 'declining'
                                ? '#b91c1c'
                                : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          {prod.demandTrend === 'surging' && '▲ Surging'}
                          {prod.demandTrend === 'rising' && '▲ Rising'}
                          {prod.demandTrend === 'stable' && '— Steady'}
                          {prod.demandTrend === 'declining' && '▼ Slow'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setSelectedProduct(prod)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '14px', textAlign: 'right' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setCurrentPage('products')}
            >
              View All {products.length} Products
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Recent Sales Live Stream */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title-group">
                <Receipt size={18} color="var(--primary-navy)" />
                <h2 className="card-title">Recent Sales Stream</h2>
              </div>
              <div className="card-subtitle">Live register & multi-channel receipts</div>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setCurrentPage('sales')}
            >
              Ledger
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.slice(0, 5).map((txn) => (
              <div
                key={txn.id}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Receipt size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                      {txn.customer}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {txn.channel} • {txn.timestamp}
                    </div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '220px',
                      }}
                    >
                      {txn.itemsSummary}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      color: 'var(--primary-navy)',
                    }}
                  >
                    ${txn.total.toFixed(2)}
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: txn.status === 'Completed' ? '#047857' : '#b45309',
                    }}
                  >
                    {txn.status === 'Completed' ? (
                      <CheckCircle2 size={11} />
                    ) : (
                      <Clock size={11} />
                    )}
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
