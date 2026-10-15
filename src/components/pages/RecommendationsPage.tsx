import React, { useState } from 'react';
import {
  CheckCircle2,
  Zap,
  TrendingUp,
  Tag,
  Boxes,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { EmptyState } from '../common/EmptyState.tsx';

export const RecommendationsPage: React.FC = () => {
  const { recommendations, applyRecommendation, dismissRecommendation, resetDemoData } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const visibleRecommendations = recommendations.filter((r) => {
    if (r.dismissed) return false;
    if (filterType !== 'all' && r.category !== filterType) return false;
    return true;
  });

  return (
    <div>
      {/* Top Banner */}
      <div
        className="card"
        style={{
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '24px',
          border: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(13, 148, 136, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2dd4bf',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontWeight: 700 }}>
              Demand Intelligence Action Feed
            </h2>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
              Synthesized from point-of-sale velocity, inventory turnaround rate, and lead time variance
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="card"
        style={{
          marginBottom: '20px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Category:
          </span>
          <div className="pill-group">
            <button
              type="button"
              className={`pill-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Suggestions
            </button>
            <button
              type="button"
              className={`pill-btn ${filterType === 'reorder' ? 'active' : ''}`}
              onClick={() => setFilterType('reorder')}
            >
              Reorders
            </button>
            <button
              type="button"
              className={`pill-btn ${filterType === 'pricing' ? 'active' : ''}`}
              onClick={() => setFilterType('pricing')}
            >
              Pricing & Bundles
            </button>
            <button
              type="button"
              className={`pill-btn ${filterType === 'inventory' ? 'active' : ''}`}
              onClick={() => setFilterType('inventory')}
            >
              Safety Buffers
            </button>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={resetDemoData}
          title="Restore recommendations"
        >
          <RotateCcw size={14} />
          Reset All Suggestions
        </button>
      </div>

      {/* Recommendations Cards List */}
      {visibleRecommendations.length === 0 ? (
        <EmptyState
          title="All recommendations reviewed"
          description="You're all caught up! No active recommendations match this category or all have been applied."
          actionText="Reset suggestions"
          onAction={resetDemoData}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {visibleRecommendations.map((rec) => {
            let CategoryIcon = Zap;
            if (rec.category === 'reorder') CategoryIcon = Boxes;
            if (rec.category === 'pricing' || rec.category === 'marketing') CategoryIcon = Tag;
            if (rec.category === 'inventory') CategoryIcon = TrendingUp;

            return (
              <div
                key={rec.id}
                className="card"
                style={{
                  borderLeft: rec.applied ? '4px solid #10b981' : '4px solid #0d9488',
                  backgroundColor: rec.applied ? '#f0fdf4' : '#ffffff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor:
                            rec.urgency === 'high'
                              ? '#fee2e2'
                              : rec.urgency === 'medium'
                              ? '#fef3c7'
                              : '#eff6ff',
                          color:
                            rec.urgency === 'high'
                              ? '#b91c1c'
                              : rec.urgency === 'medium'
                              ? '#b45309'
                              : '#1d4ed8',
                        }}
                      >
                        {rec.urgency} Urgency
                      </span>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          textTransform: 'capitalize',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <CategoryIcon size={12} />
                        {rec.category} Recommendation
                      </span>
                      {rec.applied && (
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: '#047857',
                            backgroundColor: '#d1fae5',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <CheckCircle2 size={12} />
                          Rule Applied
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        margin: '0 0 6px',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: 'var(--primary-navy)',
                      }}
                    >
                      {rec.title}
                    </h3>

                    <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {rec.description}
                    </p>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#f0fdfa',
                        border: '1px solid #ccfbf1',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#0f766e',
                      }}
                    >
                      <Sparkles size={13} />
                      Estimated Impact: {rec.impact}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!rec.applied ? (
                      <button
                        type="button"
                        className="btn btn-teal btn-sm"
                        onClick={() => applyRecommendation(rec.id)}
                      >
                        <CheckCircle2 size={14} />
                        {rec.actionLabel}
                      </button>
                    ) : (
                      <button type="button" className="btn btn-outline btn-sm" disabled>
                        Applied to Store
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => dismissRecommendation(rec.id)}
                      title="Dismiss this suggestion"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
