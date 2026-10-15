import React, { useState } from 'react';
import {
  Store,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const SettingsPage: React.FC = () => {
  const { addToast, resetDemoData } = useApp();

  const [storeName, setStoreName] = useState('Apex Artisan Market & Cafe');
  const [storeLocation, setStoreLocation] = useState('Seattle, WA • Pine St Branch');
  const [currency, setCurrency] = useState('USD ($)');
  const [safetyBufferDays, setSafetyBufferDays] = useState('3.0');
  const [forecastSensitivity, setForecastSensitivity] = useState('Balanced (Rolling 30D)');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [posPopupAlerts, setPosPopupAlerts] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Store configuration saved successfully.', 'success');
  };

  return (
    <div style={{ maxWidth: '860px' }}>
      {/* Store Profile Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div>
            <div className="card-title-group">
              <Store size={18} color="var(--primary-navy)" />
              <h2 className="card-title">Small Business Store Profile</h2>
            </div>
            <div className="card-subtitle">
              Configure business identity and local operating parameters
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  Store / Business Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '12px' }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  Location / Outlet
                </label>
                <input
                  type="text"
                  value={storeLocation}
                  onChange={(e) => setStoreLocation(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '12px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  Operating Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  Demand Reorder Trigger Buffer (Days)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={safetyBufferDays}
                  onChange={(e) => setSafetyBufferDays(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '12px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="submit" className="btn btn-teal">
                Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Demand Model & Alert Preferences */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div>
            <div className="card-title-group">
              <Sliders size={18} color="var(--primary-navy)" />
              <h2 className="card-title">Demand Modeling & Notification Sensitivity</h2>
            </div>
            <div className="card-subtitle">
              Set velocity thresholds and alerting preferences
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              Forecasting Model Calibration Mode
            </label>
            <select
              value={forecastSensitivity}
              onChange={(e) => setForecastSensitivity(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
              }}
            >
              <option value="Aggressive (Higher Safety Stock)">
                Aggressive (Higher safety stock buffer, low stockout tolerance)
              </option>
              <option value="Balanced (Rolling 30D)">
                Balanced (Rolling 30-day velocity weighted with day-of-week seasonality)
              </option>
              <option value="Lean (Just-In-Time)">
                Lean (Minimal capital tied in stock, quick turnover)
              </option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={posPopupAlerts}
                onChange={(e) => setPosPopupAlerts(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-teal)' }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <strong>Enable POS Register Banners</strong> — Warn cashier when an item has &lt; 2 days of stock left
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-teal)' }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <strong>Morning Stockout Digest</strong> — Email daily priority reorders at 7:00 AM
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Demo Controls Card */}
      <div
        className="card"
        style={{
          border: '1px solid #fecaca',
          backgroundColor: '#fff5f5',
        }}
      >
        <div className="card-header">
          <div>
            <div className="card-title-group">
              <RotateCcw size={18} color="#b91c1c" />
              <h2 className="card-title" style={{ color: '#b91c1c' }}>
                Demonstration State Management
              </h2>
            </div>
            <div className="card-subtitle">
              Clear local changes, restock simulations, and restore initial sample catalog
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: '#7f1d1d', margin: '0 0 16px' }}>
          Resetting the demonstration data will restore all 12 items to their original stock counts,
          re-arm all dismissed low-stock alerts, and restore the initial smart recommendation feed.
        </p>

        <button
          type="button"
          className="btn btn-danger"
          onClick={resetDemoData}
        >
          <RotateCcw size={14} />
          Reset All Demo Data to Default
        </button>
      </div>
    </div>
  );
};
