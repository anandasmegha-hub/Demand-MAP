import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Modal } from './Modal.tsx';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    selectedProduct,
    setSelectedProduct,
    adjustStock,
    reorderProduct,
  } = useApp();

  if (!selectedProduct) return null;

  const p = products.find((prod) => prod.id === selectedProduct.id) || selectedProduct;
  const marginPct = Math.round(((p.price - p.cost) / p.price) * 100);
  const daysSupply = p.dailyDemandRate > 0 ? (p.stock / p.dailyDemandRate).toFixed(1) : '∞';
  const fillPct = Math.min(100, Math.round((p.stock / p.maxCapacity) * 100));

  return (
    <Modal
      isOpen={!!selectedProduct}
      onClose={() => setSelectedProduct(null)}
      title={p.name}
      subtitle={`SKU: ${p.sku} • Department: ${p.category}`}
      maxWidth="580px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Status and Velocity Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              CURRENT STOCK HEALTH
            </div>
            <div style={{ marginTop: '4px' }}>
              <span className={`status-pill status-${p.status}`}>
                {p.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              EST. DAYS REMAINING
            </div>
            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color:
                  parseFloat(daysSupply) <= 2
                    ? '#b91c1c'
                    : parseFloat(daysSupply) <= 4
                    ? '#b45309'
                    : '#047857',
              }}
            >
              ~{daysSupply} days
            </div>
          </div>
        </div>

        {/* Capacity visual gauge */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              marginBottom: '6px',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>
              Shelf Capacity: <strong>{p.stock}</strong> / {p.maxCapacity} {p.unit} ({fillPct}%)
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              Safety Threshold: <strong>{p.minThreshold}</strong> {p.unit}
            </span>
          </div>

          <div
            style={{
              height: '8px',
              backgroundColor: '#e2e8f0',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${fillPct}%`,
                backgroundColor:
                  p.stock <= p.minThreshold * 0.5
                    ? '#ef4444'
                    : p.stock <= p.minThreshold
                    ? '#f59e0b'
                    : '#0d9488',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* 4-Item Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Retail Price</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
              ${p.price.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Cost: ${p.cost.toFixed(2)} ({marginPct}% margin)
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Daily Run Rate</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
              {p.dailyDemandRate} {p.unit}/day
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Trend: {p.demandTrend}
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>30-Day Volume</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
              {p.unitsSold30d} {p.unit}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#0d9488', fontWeight: 600 }}>
              ${p.revenue30d.toLocaleString()} gross sales
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Last Restocked</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
              {p.lastRestocked}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Shelf location active
            </div>
          </div>
        </div>

        {/* Quick Inventory Adjustments */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Adjust Stock:
            </span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => adjustStock(p.id, -1)}
              disabled={p.stock <= 0}
            >
              -1
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => adjustStock(p.id, 1)}
            >
              +1
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => adjustStock(p.id, 10)}
            >
              +10
            </button>
          </div>

          <button
            type="button"
            className="btn btn-teal btn-sm"
            onClick={() => {
              reorderProduct(p.id, Math.max(20, p.minThreshold * 2));
              setSelectedProduct(null);
            }}
          >
            <ShoppingCart size={14} />
            Restock Reorder ({Math.max(20, p.minThreshold * 2)} units)
          </button>
        </div>
      </div>
    </Modal>
  );
};
