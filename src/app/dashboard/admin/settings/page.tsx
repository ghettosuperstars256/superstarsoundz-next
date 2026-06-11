'use client';

import { useState, useEffect } from 'react';

interface DashboardSettings {
  amazonAffiliateTag: string;
  ebayCampaignId: string;
  aliExpressAffTrace: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  autoPublish: boolean;
  autoAffiliate: boolean;
}

const DEFAULT_SETTINGS: DashboardSettings = {
  amazonAffiliateTag: 'ghettosuper02-20',
  ebayCampaignId: '',
  aliExpressAffTrace: '',
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  autoPublish: false,
  autoAffiliate: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<DashboardSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [updatingAccount, setUpdatingAccount] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
    }).catch(() => {});
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAccount = async () => {
    if (!currentPassword) {
      setSecurityMessage({ type: 'error', text: 'Current password is required' });
      return;
    }
    setUpdatingAccount(true);
    setSecurityMessage(null);
    try {
      const res = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, newEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setSecurityMessage({ type: 'success', text: data.message });
        setCurrentPassword('');
        setNewPassword('');
        setNewEmail('');
      } else {
        setSecurityMessage({ type: 'error', text: data.error || 'Update failed' });
      }
    } catch {
      setSecurityMessage({ type: 'error', text: 'Network error' });
    } finally {
      setUpdatingAccount(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.625rem 0.875rem', background: '#141418',
    border: '1px solid #1e1e26', borderRadius: '8px', color: '#f0f0f2',
    fontSize: '0.875rem', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8125rem', fontWeight: 600,
    color: '#9090a0', marginBottom: '0.375rem',
  };

  const cardStyle: React.CSSProperties = {
    background: '#121216', borderRadius: '16px',
    border: '1px solid #1e1e26', overflow: 'hidden', marginBottom: '1.5rem',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.375rem' }}>Settings</h1>
        <p style={{ color: '#9090a0', fontSize: '0.875rem' }}>
          Configure affiliate tags, scrape defaults, and account security
        </p>
      </div>

      {message && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem',
          background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          color: message.type === 'success' ? '#22c55e' : '#ef4444',
          fontSize: '0.875rem', border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
        }}>{message.text}</div>
      )}

      {/* Affiliate Configuration */}
      <div style={cardStyle}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e1e26' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Affiliate Configuration</h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Amazon Affiliate Tag</label>
            <input type="text" value={settings.amazonAffiliateTag}
              onChange={e => setSettings({ ...settings, amazonAffiliateTag: e.target.value })}
              placeholder="e.g. ghettosuper02-20" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>eBay Campaign ID</label>
            <input type="text" value={settings.ebayCampaignId}
              onChange={e => setSettings({ ...settings, ebayCampaignId: e.target.value })}
              placeholder="e.g. 5338741806" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>AliExpress Aff Trace Key</label>
            <input type="text" value={settings.aliExpressAffTrace}
              onChange={e => setSettings({ ...settings, aliExpressAffTrace: e.target.value })}
              placeholder="e.g. your-affiliate-trace-key" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Scrape Settings */}
      <div style={cardStyle}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e1e26' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Default Scrape Settings</h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Min Price ($)</label>
              <input type="number" value={settings.minPrice}
                onChange={e => setSettings({ ...settings, minPrice: parseFloat(e.target.value) || 0 })}
                min="0" step="0.01" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Max Price ($)</label>
              <input type="number" value={settings.maxPrice}
                onChange={e => setSettings({ ...settings, maxPrice: parseFloat(e.target.value) || 10000 })}
                min="0" step="0.01" style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Min Rating (0-5)</label>
            <input type="number" value={settings.minRating}
              onChange={e => setSettings({ ...settings, minRating: parseFloat(e.target.value) || 0 })}
              min="0" max="5" step="0.1" style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: '#141418', borderRadius: '8px', border: '1px solid #1e1e26', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input type="checkbox" checked={settings.autoPublish}
                onChange={e => setSettings({ ...settings, autoPublish: e.target.checked })}
                style={{ accentColor: '#D4A843', width: '18px', height: '18px' }} />
              <div><div style={{ fontWeight: 600 }}>Auto-Publish</div><div style={{ fontSize: '0.6875rem', color: '#5a5a6a' }}>Publish after scraping</div></div>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: '#141418', borderRadius: '8px', border: '1px solid #1e1e26', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input type="checkbox" checked={settings.autoAffiliate}
                onChange={e => setSettings({ ...settings, autoAffiliate: e.target.checked })}
                style={{ accentColor: '#D4A843', width: '18px', height: '18px' }} />
              <div><div style={{ fontWeight: 600 }}>Auto-Affiliate</div><div style={{ fontSize: '0.6875rem', color: '#5a5a6a' }}>Inject affiliate links</div></div>
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={handleSaveSettings} disabled={saving} className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.75rem 2rem' }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Account Security */}
      <div style={cardStyle}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e1e26' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Account Security</h2>
          <p style={{ color: '#5a5a6a', fontSize: '0.8125rem', marginTop: '0.25rem' }}>Change your admin password or email</p>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {securityMessage && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem',
              background: securityMessage.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: securityMessage.type === 'success' ? '#22c55e' : '#ef4444',
              fontSize: '0.875rem',
            }}>{securityMessage.text}</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <div>
              <label style={labelStyle}>Current Password *</label>
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>New Email</label>
              <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                placeholder="Leave blank to keep current" style={inputStyle} />
            </div>
            <button onClick={handleUpdateAccount} disabled={updatingAccount} className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.75rem 2rem', alignSelf: 'flex-start' }}>
              {updatingAccount ? 'Updating...' : 'Update Account'}
            </button>
          </div>
        </div>
      </div>

      {/* Marketplace Links */}
      <div style={cardStyle}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e1e26' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Marketplace Links</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { name: 'Amazon Associates', color: '#D4A843', url: 'https://affiliate-program.amazon.com', desc: 'Manage your Amazon affiliate account' },
            { name: 'eBay Partner Network', color: '#3b82f6', url: 'https://partnernetwork.ebay.com', desc: 'View eBay campaign performance' },
            { name: 'AliExpress Portals', color: '#ef4444', url: 'https://portals.aliexpress.com', desc: 'AliExpress affiliate portal' },
          ].map(source => (
            <a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer" style={{
              padding: '1.25rem', background: '#141418', borderRadius: '8px', border: '1px solid #1e1e26', textDecoration: 'none', display: 'block',
            }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: `${source.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={source.color} strokeWidth="1.5">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0f0f2', marginBottom: '0.25rem' }}>{source.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#5a5a6a' }}>{source.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
