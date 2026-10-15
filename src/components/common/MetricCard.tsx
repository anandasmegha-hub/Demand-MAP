import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  changeText?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  iconBgColor?: string;
  iconColor?: string;
  subtext?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  changeText,
  trend = 'neutral',
  icon: Icon,
  iconBgColor = 'rgba(13, 148, 136, 0.1)',
  iconColor = '#0d9488',
  subtext,
}) => {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        <div
          className="metric-icon-box"
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          <Icon size={19} />
        </div>
      </div>

      <div className="metric-value">{value}</div>

      <div className="metric-footer">
        {changeText && (
          <span
            className={`trend-badge ${
              trend === 'up' ? 'positive' : trend === 'down' ? 'negative' : 'neutral'
            }`}
          >
            {trend === 'up' && <ArrowUpRight size={13} />}
            {trend === 'down' && <ArrowDownRight size={13} />}
            {trend === 'neutral' && <Minus size={13} />}
            {changeText}
          </span>
        )}
        {subtext && <span style={{ color: 'var(--text-muted)' }}>{subtext}</span>}
      </div>
    </div>
  );
};
