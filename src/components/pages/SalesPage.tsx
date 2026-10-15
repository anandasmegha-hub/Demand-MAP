import React, { useState } from 'react';
import {
  Receipt,
  Download,
  Search,
  DollarSign,
  CreditCard,
  Store,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { MetricCard } from '../common/MetricCard.tsx';
import { EmptyState } from '../common/EmptyState.tsx';

export const SalesPage: React.FC = () => {
  const { transactions, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('today');

  const channels = ['all', 'In-Store POS', 'Online Click & Collect', 'Wholesale B2B', 'Delivery Partner'];

  const filteredTransactions = transactions.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.itemsSummary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchChannel = selectedChannel === 'all' || t.channel === selectedChannel;
    return matchSearch && matchChannel;
  });

  const totalRevenue = filteredTransactions.reduce((acc, t) => acc + t.total, 0);
  const avgBasket = filteredTransactions.length > 0 ? totalRevenue / filteredTransactions.length : 0;

  const handleExport = () => {
    addToast('Transaction ledger downloaded as sales_ledger_20261015.csv (Simulated)', 'success');
  };

  return (
    <div>
      {/* Sales KPI Row */}
      <div className="metrics-grid">
        <MetricCard
          label="Today's Gross Sales"
          value={`$${totalRevenue.toFixed(2)}`}
          changeText="+14.2% vs target"
          trend="up"
          icon={DollarSign}
          iconBgColor="#eff6ff"
          iconColor="#2563eb"
          subtext="across all active channels"
        />

        <MetricCard
          label="Average Ticket / Basket"
          value={`$${avgBasket.toFixed(2)}`}
          changeText="+4.8% basket lift"
          trend="up"
          icon={CreditCard}
          iconBgColor="#f0fdfa"
          iconColor="#0d9488"
          subtext="higher multi-item bundles"
        />

        <MetricCard
          label="Transactions Logged"
          value={filteredTransactions.length}
          changeText="100% register sync"
          trend="neutral"
          icon={Receipt}
          iconBgColor="#ecfdf5"
          iconColor="#047857"
          subtext="zero reconciliation variance"
        />

        <MetricCard
          label="Channel Diversity"
          value="4 Channels"
          changeText="62% POS • 24% Online"
          trend="neutral"
          icon={Store}
          iconBgColor="#f8fafc"
          iconColor="#64748b"
          subtext="balanced revenue blend"
        />
      </div>

      {/* Filter and Date Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)',
              }}
            />
            <input
              type="text"
              placeholder="Search receipts, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '34px' }}
            />
          </div>

          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              backgroundColor: '#ffffff',
            }}
          >
            {channels.map((ch) => (
              <option key={ch} value={ch}>
                Channel: {ch === 'all' ? 'All Channels' : ch}
              </option>
            ))}
          </select>

          <div className="pill-group">
            <button
              type="button"
              className={`pill-btn ${selectedDateRange === 'today' ? 'active' : ''}`}
              onClick={() => setSelectedDateRange('today')}
            >
              Today
            </button>
            <button
              type="button"
              className={`pill-btn ${selectedDateRange === 'yesterday' ? 'active' : ''}`}
              onClick={() => setSelectedDateRange('yesterday')}
            >
              Yesterday
            </button>
            <button
              type="button"
              className={`pill-btn ${selectedDateRange === '7d' ? 'active' : ''}`}
              onClick={() => setSelectedDateRange('7d')}
            >
              Last 7 Days
            </button>
          </div>
        </div>

        <button type="button" className="btn btn-outline btn-sm" onClick={handleExport}>
          <Download size={14} />
          Export Ledger (CSV)
        </button>
      </div>

      {/* Transaction Table */}
      <div className="card">
        {filteredTransactions.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="No receipt records match your current channel or search filters."
            actionText="Clear filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedChannel('all');
            }}
          />
        ) : (
          <div className="table-container">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Timestamp</th>
                  <th>Sales Channel</th>
                  <th>Customer</th>
                  <th>Items Purchased</th>
                  <th>Item Count</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          fontFamily: 'ui-monospace, monospace',
                          color: 'var(--primary-navy)',
                        }}
                      >
                        {t.id}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{t.timestamp}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor:
                            t.channel === 'Wholesale B2B'
                              ? '#f5f3ff'
                              : t.channel === 'Online Click & Collect'
                              ? '#f0fdfa'
                              : '#f8fafc',
                          color:
                            t.channel === 'Wholesale B2B'
                              ? '#6d28d9'
                              : t.channel === 'Online Click & Collect'
                              ? '#0f766e'
                              : '#334155',
                        }}
                      >
                        {t.channel}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{t.customer}</td>
                    <td style={{ maxWidth: '300px' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {t.itemsSummary}
                      </span>
                    </td>
                    <td>{t.itemsCount} items</td>
                    <td>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--primary-navy)' }}>
                        ${t.total.toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          color: t.status === 'Completed' ? '#047857' : '#b45309',
                        }}
                      >
                        {t.status === 'Completed' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
