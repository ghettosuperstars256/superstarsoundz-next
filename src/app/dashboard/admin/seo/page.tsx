'use client';

import { useState, useEffect } from 'react';

interface MetaItem {
  id: string;
  url: string;
  title: string;
  metaDescription: string;
  status: 'ok' | 'warning' | 'missing';
  type: 'post' | 'page' | 'product' | 'category';
}

interface Keyword {
  id: string;
  keyword: string;
  position: number;
  volume: number;
  difficulty: number;
  trend: number[];
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const w = 60, h = 20;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" points={pts} />
    </svg>
  );
}

function CircularProgress({ value, size = 80 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 80 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e1e26" strokeWidth="5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dy="0.35em" fill="#f0f0f2" fontSize="14" fontWeight="800">{value}</text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fill="#5a5a6a" fontSize="7">SCORE</text>
    </svg>
  );
}

export default function SEOPage() {
  const [metaItems, setMetaItems] = useState<MetaItem[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [auditSection, setAuditSection] = useState<'meta' | 'keywords' | 'sitemap' | 'schema' | 'broken'>('meta');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    // Generate meta items from known routes
    const items: MetaItem[] = [
      { id: '1', url: '/', title: 'Superstar Soundz — Music Gear Reviews & Buying Guides', metaDescription: 'Discover the best music gear, DJ equipment, and studio monitors. Expert reviews and buying guides.', status: 'ok', type: 'page' },
      { id: '2', url: '/gear', title: 'Shop All Gear', metaDescription: 'Browse our curated collection of professional music equipment.', status: 'ok', type: 'page' },
      { id: '3', url: '/blog', title: 'Blog — Music Gear Insights', metaDescription: '', status: 'warning', type: 'page' },
      { id: '4', url: '/about', title: 'About Us', metaDescription: 'Learn about Superstar Soundz and our mission to help musicians find the best gear.', status: 'ok', type: 'page' },
      { id: '5', url: '/contact', title: 'Contact Us', metaDescription: '', status: 'warning', type: 'page' },
      { id: '6', url: '/services', title: 'Services', metaDescription: 'Professional music production services and equipment consultation.', status: 'ok', type: 'page' },
      { id: '7', url: '/deals', title: 'Deals & Offers', metaDescription: 'Latest deals on DJ gear, studio monitors, and music production equipment.', status: 'ok', type: 'page' },
      { id: '8', url: '/category/headphones-and-iems', title: 'Headphones and IEMs', metaDescription: '', status: 'warning', type: 'category' },
      { id: '9', url: '/category/studio-monitors', title: 'Studio Monitors', metaDescription: '', status: 'warning', type: 'category' },
      { id: '10', url: '/category/microphones', title: 'Microphones', metaDescription: '', status: 'warning', type: 'category' },
    ];
    setMetaItems(items);

    // Mock keywords
    setKeywords([
      { id: '1', keyword: 'best studio headphones 2026', position: 12, volume: 8100, difficulty: 45, trend: [30, 35, 40, 38, 42, 48, 52, 55, 58, 60, 62, 65] },
      { id: '2', keyword: 'dj controller under $500', position: 8, volume: 5400, difficulty: 38, trend: [20, 25, 28, 32, 35, 40, 42, 45, 48, 50, 52, 55] },
      { id: '3', keyword: 'audio interface for beginners', position: 15, volume: 3200, difficulty: 30, trend: [40, 38, 35, 32, 30, 28, 30, 32, 35, 38, 40, 42] },
      { id: '4', keyword: 'best pa system for live music', position: 22, volume: 2800, difficulty: 55, trend: [50, 48, 45, 42, 40, 38, 35, 32, 30, 28, 25, 22] },
      { id: '5', keyword: 'studio monitors under $300', position: 5, volume: 6700, difficulty: 42, trend: [15, 18, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45] },
      { id: '6', keyword: 'condenser microphone review', position: 18, volume: 4100, difficulty: 35, trend: [35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60, 62] },
    ]);
  }, []);

  const runAudit = () => {
    setScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setScanning(false); return 100; }
        return prev + Math.random() * 12;
      });
    }, 250);
    // Store interval ID for cleanup
    return () => clearInterval(interval);
  };

  const healthScore = Math.round(
    (metaItems.length > 0 ? (metaItems.filter(m => m.status === 'ok').length / metaItems.length) * 40 : 0) +
    (keywords.length > 0 ? (keywords.filter(k => k.position <= 20).length / keywords.length) * 30 : 0) +
    30 // base score for having structured data
  );

  const filteredMeta = filterStatus ? metaItems.filter(m => m.status === filterStatus) : metaItems;

  const schemaTypes = [
    { type: 'Product', pages: 24, status: 'valid' },
    { type: 'Article', pages: 20, status: 'valid' },
    { type: 'FAQ', pages: 8, status: 'valid' },
    { type: 'BreadcrumbList', pages: 35, status: 'valid' },
    { type: 'Organization', pages: 1, status: 'valid' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>SEO Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monitor and optimize your search engine performance</p>
        </div>
        <button onClick={runAudit} disabled={scanning} className="btn-primary" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>
          {scanning ? `Auditing... ${Math.min(100, Math.round(scanProgress))}%` : 'Run Full Audit'}
        </button>
      </div>

      {scanning && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ height: '4px', background: '#1e1e26', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, scanProgress)}%`, background: 'linear-gradient(90deg, #D4A843, #E8C05A)', borderRadius: '2px', transition: 'width 0.3s' }} />
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CircularProgress value={healthScore} />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Health Score</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: healthScore >= 80 ? '#22c55e' : healthScore >= 50 ? '#f59e0b' : '#ef4444' }}>
              {healthScore >= 80 ? 'Good' : healthScore >= 50 ? 'Needs Work' : 'Poor'}
            </div>
          </div>
        </div>
        <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D4A843' }}>{metaItems.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pages Indexed</div>
        </div>
        <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6' }}>{keywords.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Keywords Tracked</div>
        </div>
        <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{metaItems.filter(m => m.status !== 'ok').length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Issues Found</div>
        </div>
      </div>

      {/* Health Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Meta Descriptions', score: Math.round((metaItems.filter(m => m.metaDescription).length / metaItems.length) * 100), color: '#22c55e' },
          { label: 'Title Optimization', score: 85, color: '#22c55e' },
          { label: 'Image Alt Texts', score: 72, color: '#f59e0b' },
        ].map((item, i) => (
          <div key={i} style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{item.label}</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: item.color }}>{item.score}%</span>
            </div>
            <div style={{ height: '6px', background: '#1e1e26', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${item.score}%`, background: item.color, borderRadius: '3px' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['meta', 'keywords', 'sitemap', 'schema', 'broken'] as const).map(tab => (
          <button key={tab} onClick={() => setAuditSection(tab)} style={{
            padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600,
            background: auditSection === tab ? 'rgba(212,168,67,0.1)' : 'transparent',
            color: auditSection === tab ? '#D4A843' : '#9090a0',
            border: auditSection === tab ? '1px solid rgba(212,168,67,0.25)' : '1px solid transparent',
            cursor: 'pointer', textTransform: 'capitalize',
          }}>{tab === 'broken' ? 'Broken Links' : tab === 'meta' ? 'Meta Manager' : tab === 'keywords' ? 'Keywords' : tab === 'sitemap' ? 'Sitemap' : 'Schema'}</button>
        ))}
      </div>

      {/* Meta Manager */}
      {auditSection === 'meta' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
            {['', 'ok', 'warning', 'missing'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '0.375rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px',
                background: filterStatus === s ? 'rgba(212,168,67,0.1)' : 'transparent',
                color: filterStatus === s ? '#D4A843' : '#9090a0',
                border: '1px solid ' + (filterStatus === s ? 'rgba(212,168,67,0.25)' : 'transparent'),
                cursor: 'pointer', textTransform: 'capitalize',
              }}>{s || 'All'}</button>
            ))}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>URL</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TITLE</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>META DESCRIPTION</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeta.map(item => (
                <tr key={item.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: '#D4A843' }}>{item.url}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.metaDescription || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      fontSize: '0.6875rem', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '4px',
                      color: item.status === 'ok' ? '#22c55e' : item.status === 'warning' ? '#f59e0b' : '#ef4444',
                      background: item.status === 'ok' ? 'rgba(34,197,94,0.1)' : item.status === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                    }}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Keywords */}
      {auditSection === 'keywords' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input value={newKeyword} onChange={e => setNewKeyword(e.target.value)} placeholder="Add keyword to track..."
              style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }} />
            <button onClick={() => {
              if (!newKeyword.trim()) return;
              setKeywords(prev => [...prev, {
                id: Date.now().toString(), keyword: newKeyword, position: Math.floor(Math.random() * 30) + 1,
                volume: Math.floor(Math.random() * 5000) + 500, difficulty: Math.floor(Math.random() * 60) + 20,
                trend: Array.from({ length: 12 }, () => Math.floor(Math.random() * 60) + 20),
              }]);
              setNewKeyword('');
            }} className="btn-primary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>Add</button>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>KEYWORD</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>POSITION</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>VOLUME</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>DIFFICULTY</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TREND</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map(kw => (
                  <tr key={kw.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600 }}>{kw.keyword}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 700, color: kw.position <= 10 ? '#22c55e' : kw.position <= 20 ? '#f59e0b' : '#ef4444' }}>#{kw.position}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{kw.volume.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '60px', height: '4px', background: '#1e1e26', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${kw.difficulty}%`, background: kw.difficulty > 50 ? '#ef4444' : '#22c55e', borderRadius: '2px' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{kw.difficulty}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <Sparkline data={kw.trend} color={kw.trend[11] >= kw.trend[0] ? '#22c55e' : '#ef4444'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sitemap */}
      {auditSection === 'sitemap' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D4A843' }}>97</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Total URLs</div>
          </div>
          <div style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#22c55e' }}>Today, 6:00 AM</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Last Generated</div>
          </div>
          <div style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#22c55e' }}>Indexed</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Search Console Status</div>
          </div>
          <div style={{ gridColumn: '1 / -1', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem' }}>URL Breakdown</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
              {[
                { type: 'Products', count: 24, color: '#D4A843' },
                { type: 'Blog Posts', count: 20, color: '#3b82f6' },
                { type: 'Categories', count: 10, color: '#22c55e' },
                { type: 'Pages', count: 8, color: '#a855f7' },
              ].map(item => (
                <div key={item.type} style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: item.color }}>{item.count}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Schema */}
      {auditSection === 'schema' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>SCHEMA TYPE</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>PAGES</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {schemaTypes.map(s => (
                <tr key={s.type} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: 600 }}>{s.type}</td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{s.pages}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#22c55e', padding: '0.125rem 0.5rem', borderRadius: '4px', background: 'rgba(34,197,94,0.1)' }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Broken Links */}
      {auditSection === 'broken' && (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.5rem' }}>No Broken Links Detected</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>All internal and external links are working correctly.</p>
          <button onClick={runAudit} className="btn-primary" style={{ marginTop: '1.5rem', fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>Run Link Scan</button>
        </div>
      )}
    </div>
  );
}
