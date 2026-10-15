import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  FileText,
  Sparkles,
} from 'lucide-react';
import { AVAILABLE_REPORTS } from '../../data/mockData.ts';
import { useApp } from '../../context/AppContext.tsx';
import type { ReportItem } from '../../types/index.ts';

export const ReportsPage: React.FC = () => {
  const { addToast } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);

  const handleDownloadReport = (rep: ReportItem) => {
    setGeneratingReportId(rep.id);
    setTimeout(() => {
      setGeneratingReportId(null);
      addToast(
        `Export complete: "${rep.title}" downloaded (${rep.fileSize}).`,
        'success'
      );
    }, 600);
  };

  const handleGenerateCustom = () => {
    addToast(
      'Custom date-range report generated for Apex Artisan Market. Downloading PDF...',
      'success'
    );
  };

  return (
    <div>
      {/* Top Description and Custom Export Bar */}
      <div
        className="card"
        style={{
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div className="card-title-group">
            <FileSpreadsheet size={18} color="var(--primary-navy)" />
            <h2 className="card-title">Demand & Operations Reports</h2>
          </div>
          <div className="card-subtitle">
            Export structured audits for supply chain reviews, accounting, and inventory reconciliations
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="pill-group">
            <button
              type="button"
              className={`pill-btn ${selectedPeriod === '7d' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('7d')}
            >
              Past 7 Days
            </button>
            <button
              type="button"
              className={`pill-btn ${selectedPeriod === '30d' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('30d')}
            >
              Past 30 Days
            </button>
            <button
              type="button"
              className={`pill-btn ${selectedPeriod === 'quarter' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('quarter')}
            >
              Q3 2026
            </button>
          </div>

          <button type="button" className="btn btn-teal btn-sm" onClick={handleGenerateCustom}>
            <Sparkles size={14} />
            Generate Custom Audit
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {AVAILABLE_REPORTS.map((rep) => {
          const isPdf = rep.fileSize.includes('PDF');
          const isGenerating = generatingReportId === rep.id;

          return (
            <div key={rep.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: isPdf ? '#fee2e2' : '#ecfdf5',
                      color: isPdf ? '#b91c1c' : '#047857',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isPdf ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {rep.category}
                    </span>
                    <h3
                      style={{
                        margin: '2px 0 0',
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        color: 'var(--primary-navy)',
                      }}
                    >
                      {rep.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  margin: '0 0 16px',
                  flex: 1,
                  lineHeight: '1.45',
                }}
              >
                {rep.summary}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '0.76rem',
                  color: 'var(--text-muted)',
                }}
              >
                <div>
                  <div>Coverage: <strong>{rep.period}</strong></div>
                  <div>Size: {rep.fileSize} • {rep.generatedAt}</div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleDownloadReport(rep)}
                  disabled={isGenerating}
                >
                  <Download size={13} />
                  {isGenerating ? 'Downloading...' : 'Export File'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
