import React, { useState } from 'react';
import {
  Boxes,
  RotateCw,
  ShoppingCart,
  AlertTriangle,
  Warehouse,
  History,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { MetricCard } from '../common/MetricCard.tsx';
import { EmptyState } from '../common/EmptyState.tsx';

export const InventoryPage: React.FC = () => {
  const { products, reorderProduct, adjustStock, addToast } = useApp();
  const [filterMode, setFilterMode] = useState<'all' | 'needs-attention' | 'optimal'>('all');
  const [reorderModalItem, setReorderModalItem] = useState<{ id: string; name: string; qty: number } | null>(null);

  const totalValue = products.reduce((acc, p) => acc + p.stock * p.cost, 0);
  const potentialRevenue = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const stockoutRiskCount = products.filter((p) => p.status === 'critical' || p.status === 'out_of_stock').length;

  const filteredProducts = products.filter((p) => {
    if (filterMode === 'needs-attention') {
      return p.status === 'critical' || p.status === 'reorder' || p.status === 'out_of_stock';
    }
    if (filterMode === 'optimal') {
      return p.status === 'optimal';
    }
    return true;
  });

  const handleConfirmReorder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reorderModalItem) return;
    reorderProduct(reorderModalItem.id, reorderModalItem.qty);
    setReorderModalItem(null);
  };

  return (
    <div>
      {/* Top Metrics Row */}
      <div className="metrics-grid">
        <MetricCard
          label="Total Inventory Value"
          value={`$${Math.round(totalValue).toLocaleString()}`}
          changeText="Wholesale cost"
          trend="neutral"
          icon={Boxes}
          iconBgColor="#eff6ff"
          iconColor="#2563eb"
          subtext="across all warehouse zones"
        />

        <MetricCard
          label="Potential Retail Yield"
          value={`$${Math.round(potentialRevenue).toLocaleString()}`}
          changeText={`${Math.round(((potentialRevenue - totalValue) / potentialRevenue) * 100)}% projected gross margin`}
          trend="up"
          icon={Warehouse}
          iconBgColor="#f0fdfa"
          iconColor="#0d9488"
          subtext="when fully sold at MSRP"
        />

        <MetricCard
          label="Annual Turnover Rate"
          value="7.4x / yr"
          changeText="Top quartile for specialty"
          trend="up"
          icon={RotateCw}
          iconBgColor="#ecfdf5"
          iconColor="#047857"
          subtext="benchmark: 5.2x"
        />

        <MetricCard
          label="Stockout Hazard Index"
          value={`${stockoutRiskCount} Items`}
          changeText={stockoutRiskCount > 0 ? 'High stockout vulnerability' : 'Low risk'}
          trend={stockoutRiskCount > 0 ? 'down' : 'up'}
          icon={AlertTriangle}
          iconBgColor={stockoutRiskCount > 0 ? '#fef2f2' : '#f0fdf4'}
          iconColor={stockoutRiskCount > 0 ? '#ef4444' : '#10b981'}
          subtext="requiring purchase POs"
        />
      </div>

      {/* Filter and Control Bar */}
      <div
        className="card"
        style={{
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Filter by Stock Health:
          </span>
          <div className="pill-group">
            <button
              type="button"
              className={`pill-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All Items ({products.length})
            </button>
            <button
              type="button"
              className={`pill-btn ${filterMode === 'needs-attention' ? 'active' : ''}`}
              onClick={() => setFilterMode('needs-attention')}
            >
              Needs Attention ({stockoutRiskCount})
            </button>
            <button
              type="button"
              className={`pill-btn ${filterMode === 'optimal' ? 'active' : ''}`}
              onClick={() => setFilterMode('optimal')}
            >
              Healthy Buffer ({products.length - stockoutRiskCount})
            </button>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() =>
            addToast('Audit log: Cycle count simulated. Variance: 0 units across shelf bins.', 'info')
          }
        >
          <History size={14} />
          Run Demo Cycle Count
        </button>
      </div>

      {/* Main Stock Management Table */}
      <div className="card">
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No inventory records found"
            description="No items match your active inventory filter."
            actionText="View all stock"
            onAction={() => setFilterMode('all')}
          />
        ) : (
          <div className="table-container">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Item / SKU</th>
                  <th>Shelf Location</th>
                  <th>In-Stock</th>
                  <th>Reorder Point</th>
                  <th>Est. Days Supply</th>
                  <th>Wholesale Cost</th>
                  <th>Total Valuation</th>
                  <th>Status</th>
                  <th>Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, idx) => {
                  const daysSupply = p.dailyDemandRate > 0 ? (p.stock / p.dailyDemandRate).toFixed(1) : '∞';
                  const shelfLocations = [
                    'Bay A1 • Top Tier',
                    'Cooler 2 • Dairy Shelf',
                    'Bakery Display • Front',
                    'Cooler 1 • Grab & Go',
                    'Tea Cabinet • Dry Aisle',
                    'Pantry Wire Rack • Mid',
                  ];
                  const location = shelfLocations[idx % shelfLocations.length];

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {p.sku}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {location}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '2px 7px' }}
                            onClick={() => adjustStock(p.id, -1)}
                            disabled={p.stock <= 0}
                            title="Decrease stock by 1"
                          >
                            -
                          </button>
                          <span style={{ fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>
                            {p.stock}
                          </span>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '2px 7px' }}
                            onClick={() => adjustStock(p.id, 1)}
                            title="Increase stock by 1"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {p.minThreshold} {p.unit}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 600,
                            color:
                              parseFloat(daysSupply) <= 2
                                ? '#b91c1c'
                                : parseFloat(daysSupply) <= 4
                                ? '#b45309'
                                : '#047857',
                          }}
                        >
                          ~{daysSupply} days
                        </span>
                      </td>
                      <td>${p.cost.toFixed(2)}</td>
                      <td style={{ fontWeight: 600 }}>${(p.stock * p.cost).toFixed(2)}</td>
                      <td>
                        <span className={`status-pill status-${p.status}`}>
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-teal btn-sm"
                          onClick={() =>
                            setReorderModalItem({
                              id: p.id,
                              name: p.name,
                              qty: Math.max(20, p.minThreshold * 2),
                            })
                          }
                        >
                          <ShoppingCart size={13} />
                          Reorder
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reorder Dialog Modal */}
      {reorderModalItem && (
        <div className="modal-overlay" onClick={() => setReorderModalItem(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                Draft Restock Order (Demonstration)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Simulate submitting a supplier replenishment request
              </p>
            </div>

            <form onSubmit={handleConfirmReorder} style={{ padding: '20px 24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Product:
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-navy)' }}>
                  {reorderModalItem.name}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  Quantity to Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={reorderModalItem.qty}
                  onChange={(e) =>
                    setReorderModalItem({
                      ...reorderModalItem,
                      qty: parseInt(e.target.value) || 1,
                    })
                  }
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '12px' }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setReorderModalItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-teal">
                  Confirm Simulated Reorder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
