import React, { useState } from 'react';
import {
  Sparkles,
  AlertCircle,
  TrendingUp,
  Calendar,
  Layers,
  ShieldAlert,
  Sliders,
} from 'lucide-react';
import { FORECAST_POINTS } from '../../data/mockData.ts';
import { MetricCard } from '../common/MetricCard.tsx';

export const ForecastingPage: React.FC = () => {
  const [scenarioBoost, setScenarioBoost] = useState<number>(0);

  // SVG Chart Dimensions
  const width = 800;
  const height = 260;
  const paddingX = 50;
  const paddingY = 30;

  const points = FORECAST_POINTS;
  const maxVal = 4600;
  const minVal = 1500;

  const getX = (i: number) => paddingX + (i / (points.length - 1)) * (width - paddingX * 2);
  const getY = (val: number) =>
    height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);

  // Actual line points (first 7 points)
  const actualPoints = points
    .filter((p) => p.actual !== undefined)
    .map((p, i) => ({ x: getX(i), y: getY(p.actual!) }));

  let actualPath = `M ${actualPoints[0].x} ${actualPoints[0].y}`;
  for (let i = 1; i < actualPoints.length; i++) {
    actualPath += ` L ${actualPoints[i].x} ${actualPoints[i].y}`;
  }

  // Forecast line points (all points from 6 onwards)
  const forecastPoints = points.slice(6).map((p, i) => {
    const adjustedForecast = p.forecast * (1 + scenarioBoost / 100);
    return { x: getX(i + 6), y: getY(adjustedForecast) };
  });

  let forecastPath = `M ${forecastPoints[0].x} ${forecastPoints[0].y}`;
  for (let i = 1; i < forecastPoints.length; i++) {
    forecastPath += ` L ${forecastPoints[i].x} ${forecastPoints[i].y}`;
  }

  // Confidence Band Area (Upper & Lower)
  const upperPoints = points.slice(6).map((p, i) => ({
    x: getX(i + 6),
    y: getY(p.confidenceUpper * (1 + scenarioBoost / 100)),
  }));
  const lowerPoints = points.slice(6).map((p, i) => ({
    x: getX(i + 6),
    y: getY(p.confidenceLower * (1 + scenarioBoost / 100)),
  }));

  let bandPath = `M ${upperPoints[0].x} ${upperPoints[0].y}`;
  for (let i = 1; i < upperPoints.length; i++) {
    bandPath += ` L ${upperPoints[i].x} ${upperPoints[i].y}`;
  }
  for (let i = lowerPoints.length - 1; i >= 0; i--) {
    bandPath += ` L ${lowerPoints[i].x} ${lowerPoints[i].y}`;
  }
  bandPath += ' Z';

  return (
    <div>
      {/* Explicit Simulation Disclaimer as required by prompt */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <AlertCircle size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.82rem', color: '#1e3a8a' }}>
          <strong>DEMONSTRATION PREDICTION MODEL — Not real financial or algorithmic forecasts.</strong>
          <p style={{ margin: '3px 0 0', color: '#1e40af' }}>
            The projections shown below represent simulated scenario models designed to demonstrate
            confidence intervals (P10–P90), seasonal multipliers, and stockout timeline visualization.
            DemandMap is currently operating in local demo mode without an active production ML pipeline.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="metrics-grid">
        <MetricCard
          label="Next 7D Projected Sales"
          value="$21,460"
          changeText="+9.2% demand lift"
          trend="up"
          icon={TrendingUp}
          iconBgColor="#f0fdfa"
          iconColor="#0d9488"
          subtext="weekend event expansion"
        />

        <MetricCard
          label="Confidence Interval (P80)"
          value="± 8.4%"
          changeText="High historic model fit"
          trend="neutral"
          icon={Layers}
          iconBgColor="#eff6ff"
          iconColor="#2563eb"
          subtext="based on 90-day training"
        />

        <MetricCard
          label="Projected Stockout Items"
          value="3 SKUs"
          changeText="Before next Tuesday"
          trend="down"
          icon={ShieldAlert}
          iconBgColor="#fef2f2"
          iconColor="#ef4444"
          subtext="if replenishment delayed"
        />

        <MetricCard
          label="Simulated Event Factor"
          value={scenarioBoost > 0 ? `+${scenarioBoost}% Surge` : 'Baseline'}
          changeText="Interactive sensitivity"
          trend="neutral"
          icon={Sliders}
          iconBgColor="#f8fafc"
          iconColor="#475569"
          subtext="adjust slider below"
        />
      </div>

      {/* Forecast Chart Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <div className="card-title-group">
              <Sparkles size={18} color="var(--accent-teal)" />
              <h2 className="card-title">14-Day Demand Projection with Confidence Band</h2>
            </div>
            <div className="card-subtitle">
              Historical actuals vs simulated future trajectory and demand variance bounds
            </div>
          </div>

          {/* Interactive Scenario Multiplier */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Scenario Surge:
            </span>
            <div className="pill-group">
              {[0, 10, 20].map((b) => (
                <button
                  key={b}
                  type="button"
                  className={`pill-btn ${scenarioBoost === b ? 'active' : ''}`}
                  onClick={() => setScenarioBoost(b)}
                >
                  {b === 0 ? 'Normal' : `+${b}% Lift`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Forecast Chart Canvas */}
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: 'auto', display: 'block', minWidth: '600px' }}
          >
            {/* Guide Gridlines */}
            {[2000, 3000, 4000].map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="3,3"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    fill="#94a3b8"
                    fontSize="11"
                    textAnchor="end"
                    fontFamily="system-ui"
                  >
                    ${val / 1000}k
                  </text>
                </g>
              );
            })}

            {/* Transition dividing line between actuals and forecast */}
            <line
              x1={getX(6)}
              y1={paddingY}
              x2={getX(6)}
              y2={height - paddingY}
              stroke="#0f172a"
              strokeDasharray="4,4"
              strokeWidth="1.5"
            />
            <text
              x={getX(6) + 6}
              y={paddingY + 12}
              fill="#0f172a"
              fontSize="10"
              fontWeight="700"
              fontFamily="system-ui"
            >
              TODAY • FORECAST HORIZON →
            </text>

            {/* Confidence Band Polygon */}
            <path d={bandPath} fill="rgba(13, 148, 136, 0.12)" />

            {/* Historical Actual Line */}
            <path
              d={actualPath}
              fill="none"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Forecast Projection Line */}
            <path
              d={forecastPath}
              fill="none"
              stroke="#0d9488"
              strokeWidth="2.5"
              strokeDasharray="5,5"
              strokeLinecap="round"
            />

            {/* Points & Labels */}
            {points.map((p, i) => {
              const x = getX(i);
              const isPast = p.actual !== undefined;
              const y = getY(isPast ? p.actual! : p.forecast * (1 + scenarioBoost / 100));

              return (
                <g key={p.date}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isPast ? 4 : 4.5}
                    fill={isPast ? '#0f172a' : '#ffffff'}
                    stroke={isPast ? '#ffffff' : '#0d9488'}
                    strokeWidth={2}
                  />
                  <text
                    x={x}
                    y={height - paddingY + 16}
                    fill="#64748b"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="system-ui"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '14px',
                height: '3px',
                backgroundColor: '#0f172a',
                borderRadius: '2px',
              }}
            />
            <span>Historical Actual Revenue</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '14px',
                height: '0px',
                borderTop: '2px dashed #0d9488',
              }}
            />
            <span>Simulated Projected Demand</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '14px',
                height: '10px',
                backgroundColor: 'rgba(13, 148, 136, 0.25)',
                borderRadius: '2px',
              }}
            />
            <span>Confidence Interval (P10–P90 Range)</span>
          </div>
        </div>
      </div>

      {/* Projection Driver Factors Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title-group">
              <Calendar size={18} color="var(--primary-navy)" />
              <h2 className="card-title">Simulated Demand Drivers & External Indicators</h2>
            </div>
            <div className="card-subtitle">
              Qualitative demand multipliers incorporated in the demonstration prediction
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Target Date</th>
                <th>Projected Volume</th>
                <th>Confidence Window</th>
                <th>Primary Demand Driver</th>
                <th>Inventory Preparedness</th>
              </tr>
            </thead>
            <tbody>
              {points.slice(7).map((p) => {
                const adjForecast = Math.round(p.forecast * (1 + scenarioBoost / 100));
                const adjLower = Math.round(p.confidenceLower * (1 + scenarioBoost / 100));
                const adjUpper = Math.round(p.confidenceUpper * (1 + scenarioBoost / 100));

                return (
                  <tr key={p.date}>
                    <td>
                      <strong style={{ color: 'var(--primary-navy)' }}>{p.date}</strong>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--accent-teal)' }}>
                        ${adjForecast.toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        ${adjLower.toLocaleString()} – ${adjUpper.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: '#f1f5f9',
                          color: '#334155',
                        }}
                      >
                        {p.demandFactor}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          color: p.date.includes('Sat') || p.date.includes('Sun') ? '#b45309' : '#047857',
                        }}
                      >
                        {p.date.includes('Sat') || p.date.includes('Sun')
                          ? '⚠ Reorder Buffer Needed'
                          : '✓ Adequate'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
