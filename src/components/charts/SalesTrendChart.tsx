import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { SALES_TRENDS_MAP } from '../../data/mockData.ts';
import type { TimeRange, SalesTrendPoint } from '../../types/index.ts';

export const SalesTrendChart: React.FC = () => {
  const { timeRange, setTimeRange } = useApp();
  const [hoveredPoint, setHoveredPoint] = useState<SalesTrendPoint | null>(null);

  const data = SALES_TRENDS_MAP[timeRange] || SALES_TRENDS_MAP['7d'];

  const timeRangeLabels: { id: TimeRange; label: string }[] = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: 'ytd', label: 'YTD' },
  ];

  // Calculate totals and metrics
  const totalSales = data.reduce((acc, p) => acc + p.sales, 0);
  const totalOrders = data.reduce((acc, p) => acc + p.orders, 0);
  const avgSales = Math.round(totalSales / data.length);
  const peakPoint = data.reduce((max, p) => (p.sales > max.sales ? p : max), data[0]);

  // SVG Chart Geometry
  const width = 760;
  const height = 240;
  const paddingX = 45;
  const paddingY = 30;

  const maxVal = Math.max(...data.map((d) => d.sales), ...data.map((d) => d.baseline)) * 1.15;
  const minVal = 0;

  const getX = (index: number) => {
    if (data.length <= 1) return paddingX;
    return paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
  };

  const getY = (val: number) => {
    return height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);
  };

  // Build smooth bezier path
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.sales) }));
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${
    points[0].x
  } ${height - paddingY} Z`;

  // Baseline dotted path
  const baselinePoints = data.map((d, i) => ({ x: getX(i), y: getY(d.baseline) }));
  let baselinePath = `M ${baselinePoints[0].x} ${baselinePoints[0].y}`;
  for (let i = 1; i < baselinePoints.length; i++) {
    baselinePath += ` L ${baselinePoints[i].x} ${baselinePoints[i].y}`;
  }

  // Y-axis tick values
  const yTicks = [0, maxVal * 0.33, maxVal * 0.66, maxVal];

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title-group">
            <TrendingUp size={18} color="var(--accent-teal)" />
            <h2 className="card-title">Sales Trends & Demand Velocity</h2>
          </div>
          <div className="card-subtitle">
            Dynamic revenue curve with target baseline and transaction density
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="pill-group" role="tablist" aria-label="Select sales trend time range">
          {timeRangeLabels.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`pill-btn ${timeRange === item.id ? 'active' : ''}`}
              onClick={() => setTimeRange(item.id)}
              role="tab"
              aria-selected={timeRange === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: '#fafbfc',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            PERIOD REVENUE
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
            ${totalSales.toLocaleString()}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            AVG DAILY RUN RATE
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
            ${avgSales.toLocaleString()}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            TOTAL ORDERS
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
            {totalOrders.toLocaleString()} txns
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            PEAK PERIOD
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2563eb' }}>
            {peakPoint.label} (${peakPoint.sales.toLocaleString()})
          </div>
        </div>
      </div>

      {/* Responsive SVG Canvas Container */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', minWidth: '480px' }}
        >
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.28" />
              <stop offset="85%" stopColor="#0d9488" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>

          {/* Grid lines and ticks */}
          {yTicks.map((tickVal, idx) => {
            const y = getY(tickVal);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray={idx === 0 ? 'none' : '3,3'}
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="11"
                  textAnchor="end"
                  fontFamily="system-ui"
                >
                  ${tickVal >= 1000 ? `${(tickVal / 1000).toFixed(tickVal % 1000 === 0 ? 0 : 1)}k` : Math.round(tickVal)}
                </text>
              </g>
            );
          })}

          {/* Baseline Comparison Line */}
          <path
            d={baselinePath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            opacity="0.8"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#salesGrad)" />

          {/* Actual Sales Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data Points and Interactivity */}
          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.sales);
            const isHovered = hoveredPoint?.date === d.date;

            return (
              <g key={d.date}>
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={height - paddingY}
                    stroke="#0d9488"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                )}

                {/* Point dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#0d9488"
                  strokeWidth={isHovered ? 3 : 2}
                  style={{ transition: 'all 0.15s ease', cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPoint(d)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* X-axis label */}
                <text
                  x={x}
                  y={height - paddingY + 18}
                  fill={isHovered ? '#0f172a' : '#64748b'}
                  fontSize="11"
                  fontWeight={isHovered ? '600' : '400'}
                  textAnchor="middle"
                  fontFamily="system-ui"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '20px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              boxShadow: 'var(--shadow-md)',
              pointerEvents: 'none',
              display: 'flex',
              gap: '12px',
              zIndex: 10,
            }}
          >
            <div>
              <div style={{ color: '#94a3b8' }}>{hoveredPoint.date}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#2dd4bf' }}>
                ${hoveredPoint.sales.toLocaleString()}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid #334155', paddingLeft: '10px' }}>
              <div style={{ color: '#94a3b8' }}>Volume</div>
              <div style={{ fontWeight: 600 }}>{hoveredPoint.orders} orders</div>
            </div>
            <div style={{ borderLeft: '1px solid #334155', paddingLeft: '10px' }}>
              <div style={{ color: '#94a3b8' }}>Target</div>
              <div style={{ fontWeight: 600, color: '#cbd5e1' }}>
                ${hoveredPoint.baseline.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '12px',
                height: '3px',
                backgroundColor: 'var(--accent-teal)',
                borderRadius: '2px',
              }}
            />
            <span>Actual Sales Trend</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '12px',
                height: '0px',
                borderTop: '2px dashed #94a3b8',
              }}
            />
            <span>Baseline Expectation</span>
          </div>
        </div>
        <div>Hover points to view granular period values</div>
      </div>
    </div>
  );
};
