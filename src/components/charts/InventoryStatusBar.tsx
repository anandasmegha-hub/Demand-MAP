import React from 'react';
import { Boxes, CheckCircle2, AlertTriangle, AlertOctagon, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { CATEGORY_SUMMARIES } from '../../data/mockData.ts';

export const InventoryStatusBar: React.FC = () => {
  const { products, setCurrentPage } = useApp();

  const total = products.length || 1;
  const optimal = products.filter((p) => p.status === 'optimal').length;
  const reorder = products.filter((p) => p.status === 'reorder').length;
  const critical = products.filter((p) => p.status === 'critical').length;
  const outOfStock = products.filter((p) => p.status === 'out_of_stock').length;

  const optimalPct = Math.round((optimal / total) * 100);
  const reorderPct = Math.round((reorder / total) * 100);
  const criticalPct = Math.round((critical / total) * 100);
  const outOfStockPct = Math.round((outOfStock / total) * 100);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title-group">
            <Boxes size={18} color="var(--primary-navy)" />
            <h2 className="card-title">Inventory Health & Stock Distribution</h2>
          </div>
          <div className="card-subtitle">
            Current stock status across {products.length} monitored SKUs
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => setCurrentPage('inventory')}
        >
          Manage Stock
        </button>
      </div>

      {/* Multi-segment Distribution Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            height: '14px',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            backgroundColor: '#e2e8f0',
            marginBottom: '10px',
          }}
        >
          {optimalPct > 0 && (
            <div
              style={{
                width: `${optimalPct}%`,
                backgroundColor: '#10b981',
                transition: 'width 0.3s ease',
              }}
              title={`Optimal: ${optimal} items (${optimalPct}%)`}
            />
          )}
          {reorderPct > 0 && (
            <div
              style={{
                width: `${reorderPct}%`,
                backgroundColor: '#f59e0b',
                transition: 'width 0.3s ease',
              }}
              title={`Reorder Soon: ${reorder} items (${reorderPct}%)`}
            />
          )}
          {criticalPct > 0 && (
            <div
              style={{
                width: `${criticalPct}%`,
                backgroundColor: '#ef4444',
                transition: 'width 0.3s ease',
              }}
              title={`Critical Low: ${critical} items (${criticalPct}%)`}
            />
          )}
          {outOfStockPct > 0 && (
            <div
              style={{
                width: `${outOfStockPct}%`,
                backgroundColor: '#64748b',
                transition: 'width 0.3s ease',
              }}
              title={`Out of Stock: ${outOfStock} items (${outOfStockPct}%)`}
            />
          )}
        </div>

        {/* Legend Pills */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '8px',
          }}
        >
          <div
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
            }}
          >
            <CheckCircle2 size={14} color="#047857" />
            <div>
              <strong style={{ color: '#047857' }}>Optimal: </strong>
              <span>
                {optimal} ({optimalPct}%)
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              backgroundColor: '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
            }}
          >
            <AlertTriangle size={14} color="#b45309" />
            <div>
              <strong style={{ color: '#b45309' }}>Reorder: </strong>
              <span>
                {reorder} ({reorderPct}%)
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
            }}
          >
            <AlertOctagon size={14} color="#b91c1c" />
            <div>
              <strong style={{ color: '#b91c1c' }}>Critical: </strong>
              <span>
                {critical} ({criticalPct}%)
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
            }}
          >
            <XCircle size={14} color="#475569" />
            <div>
              <strong style={{ color: '#475569' }}>Out of Stock: </strong>
              <span>
                {outOfStock} ({outOfStockPct}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category In-Stock Health Bars */}
      <div>
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
            marginBottom: '10px',
          }}
        >
          Department Fill Rate & Turnover
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {CATEGORY_SUMMARIES.map((cat) => (
            <div key={cat.category} style={{ fontSize: '0.8rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>
                  {cat.category}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {cat.inStockPercent}% in-stock • {cat.turnoverRate}
                </span>
              </div>
              <div
                style={{
                  height: '6px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${cat.inStockPercent}%`,
                    backgroundColor:
                      cat.inStockPercent >= 85
                        ? '#0d9488'
                        : cat.inStockPercent >= 70
                        ? '#f59e0b'
                        : '#ef4444',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
