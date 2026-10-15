import React, { useState } from 'react';
import {
  Activity,
  Clock,
  Calendar,
  Flame,
  TrendingDown,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { HOURLY_DEMAND_PATTERN } from '../../data/mockData.ts';
import { MetricCard } from '../common/MetricCard.tsx';

export const DemandAnalysisPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Thursday');

  const maxVolume = Math.max(...HOURLY_DEMAND_PATTERN.map((h) => h.volume));

  const weekDays = [
    { name: 'Monday', volumeIndex: '82%', note: 'Morning commuter spike' },
    { name: 'Tuesday', volumeIndex: '88%', note: 'Consistent baseline' },
    { name: 'Wednesday', volumeIndex: '94%', note: 'Mid-week inventory turnover' },
    { name: 'Thursday', volumeIndex: '100%', note: 'Peak weekday demand (Today)' },
    { name: 'Friday', volumeIndex: '118%', note: 'High weekend prep & wholesale' },
    { name: 'Saturday', volumeIndex: '142%', note: 'Highest footfall day' },
    { name: 'Sunday', volumeIndex: '130%', note: 'Strong brunch & bakery volume' },
  ];

  const elasticityItems = [
    {
      item: 'Ethiopian Yirgacheffe Beans',
      sensitivity: 'Low (Inelastic)',
      score: '0.42',
      insight: 'Specialty coffee drinkers are brand-loyal; price increases of 5-8% produce minimal volume drop.',
      recommendation: 'Can absorb $0.75 price increase without demand loss.',
    },
    {
      item: 'Barista Organic Oat Milk',
      sensitivity: 'Medium (Elastic)',
      score: '1.18',
      insight: 'Multiple store alternatives exist nearby; prices over $5.50 push customers to standard dairy.',
      recommendation: 'Keep stable at $5.25 to maintain basket driver velocity.',
    },
    {
      item: 'Raw Wildflower Honeycomb',
      sensitivity: 'High (Discretionary)',
      score: '1.85',
      insight: 'Impulse gift purchase; demand spikes 2.4x when discounted or cross-merchandised with specialty tea.',
      recommendation: 'Use limited-time bundle promotions to stimulate inventory movement.',
    },
  ];

  return (
    <div>
      {/* Metric Cards Row */}
      <div className="metrics-grid">
        <MetricCard
          label="Peak Rush Window"
          value="8:30 – 9:45 AM"
          changeText="95 transactions/hr"
          trend="up"
          icon={Clock}
          iconBgColor="#eff6ff"
          iconColor="#2563eb"
          subtext="account for 38% of daily sales"
        />

        <MetricCard
          label="Demand Velocity Index"
          value="114.2"
          changeText="+14.2% above baseline"
          trend="up"
          icon={Flame}
          iconBgColor="#fef3c7"
          iconColor="#d97706"
          subtext="accelerating week-over-week"
        />

        <MetricCard
          label="Weekend Lift Factor"
          value="+42%"
          changeText="Sat & Sun surge"
          trend="up"
          icon={Activity}
          iconBgColor="#f0fdfa"
          iconColor="#0d9488"
          subtext="requires Friday evening prep"
        />

        <MetricCard
          label="Unfulfilled Demand"
          value="~$380 / wk"
          changeText="Due to stockouts"
          trend="down"
          icon={TrendingDown}
          iconBgColor="#fef2f2"
          iconColor="#ef4444"
          subtext="mostly Nitro Cold Brew & Oat Milk"
        />
      </div>

      {/* Hourly Demand Histogram & Curve */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <div className="card-title-group">
              <Clock size={18} color="var(--accent-teal)" />
              <h2 className="card-title">Hourly Demand Density Profile</h2>
            </div>
            <div className="card-subtitle">
              Transaction and footfall concentration across store operating hours (7:00 AM – 7:00 PM)
            </div>
          </div>

          <div className="pill-group">
            {['Monday', 'Thursday', 'Saturday'].map((d) => (
              <button
                key={d}
                type="button"
                className={`pill-btn ${selectedDay === d ? 'active' : ''}`}
                onClick={() => setSelectedDay(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Bar Distribution Chart */}
        <div style={{ padding: '10px 0 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${HOURLY_DEMAND_PATTERN.length}, 1fr)`,
              gap: '12px',
              alignItems: 'flex-end',
              height: '180px',
              borderBottom: '2px solid var(--border-color)',
              paddingBottom: '8px',
            }}
          >
            {HOURLY_DEMAND_PATTERN.map((h) => {
              const heightPct = Math.round((h.volume / maxVolume) * 100);
              const isPeak = h.volume >= 75;

              return (
                <div
                  key={h.hour}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                  title={`${h.hour}: ${h.volume} customers (${h.note})`}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: isPeak ? 'var(--accent-teal)' : 'var(--text-muted)',
                      marginBottom: '4px',
                    }}
                  >
                    {h.volume}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '38px',
                      height: `${heightPct}%`,
                      backgroundColor: isPeak ? 'var(--accent-teal)' : '#cbd5e1',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Hour Labels */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${HOURLY_DEMAND_PATTERN.length}, 1fr)`,
              gap: '12px',
              marginTop: '8px',
            }}
          >
            {HOURLY_DEMAND_PATTERN.map((h) => (
              <div
                key={h.hour}
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                }}
              >
                {h.hour}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Info size={16} color="var(--accent-teal)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Key Operational Takeaway:</strong> Two major peaks occur at 8:00–9:30 AM (Morning rush)
            and 12:00–1:30 PM (Lunch crowd). Pre-packing bakery items and batch brewing espresso shots 15 minutes prior reduces customer wait times by ~42%.
          </span>
        </div>
      </div>

      {/* Two Column Grid: Day of Week Analysis & Price Elasticity */}
      <div className="dashboard-grid-1-1">
        {/* Day of Week Demand Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title-group">
                <Calendar size={18} color="var(--primary-navy)" />
                <h2 className="card-title">Day-of-Week Demand Variance</h2>
              </div>
              <div className="card-subtitle">Relative demand vs weekly store average</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {weekDays.map((d) => (
              <div
                key={d.name}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: d.name.includes('Today') ? '#f0fdfa' : '#ffffff',
                  border: d.name.includes('Today')
                    ? '1px solid var(--accent-teal)'
                    : '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--primary-navy)' }}>
                    {d.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.note}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      color: parseInt(d.volumeIndex) >= 100 ? '#0d9488' : '#64748b',
                    }}
                  >
                    {d.volumeIndex}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Elasticity Insights */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title-group">
                <Activity size={18} color="var(--primary-navy)" />
                <h2 className="card-title">Price Elasticity & Sensitivity</h2>
              </div>
              <div className="card-subtitle">How demand volume responds to unit price changes</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {elasticityItems.map((e) => (
              <div
                key={e.item}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <strong style={{ fontSize: '0.88rem', color: 'var(--primary-navy)' }}>
                    {e.item}
                  </strong>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#f1f5f9',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {e.sensitivity} (Score: {e.score})
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 6px' }}>
                  {e.insight}
                </p>

                <div
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--accent-teal-hover)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={13} />
                  {e.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
