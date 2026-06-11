'use client';

import { useState, useCallback } from 'react';

interface ScrapedProduct {
  id: string; title: string; description: string; price: number; currency: string;
  image: string; source: string; sourceUrl: string; affiliateUrl: string;
  category: string; brand: string; rating: number; reviewCount: number;
  inStock: boolean; specs: Record<string, string>; scrapedAt: string;
  campaignId: string; status: 'pending' | 'approved' | 'rejected' | 'published';
}

interface ScrapeStats { totalFound: number; newSaved: number; duplicates: number; avgPrice: number; }

const SOURCES = [
  { value: 'amazon', label: 'Amazon', color: '#FF9900' },
  { value: 'ebay', label: 'eBay', color: '#0064D2' },
  { value: 'aliexpress', label: 'AliExpress', color: '#E52E20' },
  { value: 'rss', label: 'RSS Feed', color: '#FA9B39' },
];

const CATEGORIES = [
  'Audio Equipment', 'Headphones and IEMs', 'Microphones', 'Studio Monitors',
  'Mixers', 'DJ Controllers', 'Audio Interfaces', 'PA Systems', 'Turntables',
  'Keyboards and Synthesizers', 'Guitar Amps',
];

export default function ScraperPage() {
  const [activeTab, setActiveTab] = useState<'manual' | 'bulk' | 'asin'>('manual');
  const [source, setSource] = useState('amazon');
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState('');
  const [maxResults, setMaxResults] = useState(20);
  const [spinContent, setSpinContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<ScrapedProduct[]>([]);
  const [stats, setStats] = useState<ScrapeStats | null>(null);

  // Bulk import state
  const [bulkText, setBulkText] = useState('');
  const [bulkType, setBulkType] = useState<'asin' | 'url' | 'keyword'>('asin');

  const handleScrape = useCallback(async () => {
    if (!keywords.trim() && activeTab === 'manual') { setError('Enter keywords'); return; }
    if (!bulkText.trim() && activeTab !== 'manual') { setError('Enter items to import'); return; }
    
    setLoading(true); setError(''); setProducts([]); setStats(null);

    try {
      let body: any = { source, category, maxResults, spinContent };
      
      if (activeTab === 'manual') {
        body.keywords = keywords.split(',').map(k => k.trim()).filter(Boolean);
      } else {
        // Parse bulk items
        const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
        body.bulkItems = lines.map(line => ({ type: bulkType, value: line }));
        body.keywords = [];
      }

      const res = await fetch('/api/scraper/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (data.success) {
        setProducts(data.products);
        setStats(data.stats);
      } else {
        setError(data.error || 'Scrape failed');
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [source, keywords, category, maxResults, spinContent, activeTab, bulkText, bulkType]);

  const handleBulkAction = async (action: 'approve' | 'reject', productId?: string) => {
    const targets = productId ? [products.find(p => p.id === productId)!] : products;
    for (const p of targets) {
      if (p) {
        await fetch('/api/scraper/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: p.id, status: action === 'approve' ? 'approved' : 'rejected' }),
        });
        setProducts(prev => prev.map(pr => pr.id === p.id ? { ...pr, status: action === 'approve' ? 'approved' : 'rejected' } : pr));
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>Product Scraper</h1>
        <p style={{ color: '#9090a0' }}>Scrape products from multiple sources, compare prices, and auto-assign categories</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e1e26', paddingBottom: '1rem' }}>
        {[
          { id: 'manual', label: 'Manual Search', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
          { id: 'bulk', label: 'Bulk Import', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
          { id: 'asin', label: 'ASIN/URL Lookup', icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-14a2 2 0 00-2-2h-4M14 4h6m0 0v6m0-6L10 14' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem',
            borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600,
            background: activeTab === tab.id ? 'rgba(212,168,67,0.1)' : 'transparent',
            color: activeTab === tab.id ? '#D4A843' : '#9090a0',
            border: activeTab === tab.id ? '1px solid rgba(212,168,67,0.25)' : '1px solid transparent',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={tab.icon}/></svg>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem' }}>
        {/* Left: Controls */}
        <div>
          {/* Source */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#9090a0' }}>Source</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {SOURCES.map(s => (
                <button key={s.value} onClick={() => setSource(s.value)} style={{
                  padding: '0.625rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600,
                  background: source === s.value ? `${s.color}15` : '#121216',
                  color: source === s.value ? s.color : '#9090a0',
                  border: `1px solid ${source === s.value ? s.color + '40' : '#1e1e26'}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>{s.label}</button>
              ))}
            </div>
          </div>

          {/* Manual Search */}
          {activeTab === 'manual' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#9090a0' }}>Keywords (comma-separated)</label>
              <textarea value={keywords} onChange={e => setKeywords(e.target.value)} rows={3} placeholder="e.g. studio headphones, beyerdynamic dt 990"
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #1e1e26', background: '#141418', color: '#f0f0f2', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }} />
            </div>
          )}

          {/* Bulk Import */}
          {activeTab !== 'manual' && (
            <>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#9090a0' }}>Import Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'asin', label: 'ASINs' },
                    { id: 'url', label: 'URLs' },
                    { id: 'keyword', label: 'Keywords' },
                  ].map(t => (
                    <button key={t.id} onClick={() => setBulkType(t.id as any)} style={{
                      padding: '0.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
                      background: bulkType === t.id ? 'rgba(212,168,67,0.1)' : '#121216',
                      color: bulkType === t.id ? '#D4A843' : '#9090a0',
                      border: `1px solid ${bulkType === t.id ? 'rgba(212,168,67,0.25)' : '#1e1e26'}`,
                      cursor: 'pointer',
                    }}>{t.label}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#9090a0' }}>
                  Paste {bulkType === 'asin' ? 'ASINs' : bulkType === 'url' ? 'URLs' : 'Keywords'} (one per line)
                </label>
                <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={8}
                  placeholder={bulkType === 'asin' ? 'B0DGLV6QVX\nB08C5HSR78\nB0006NL5SM' : bulkType === 'url' ? 'https://amazon.com/dp/B0DGLV6QVX\nhttps://ebay.com/itm/123456' : 'studio headphones\nbeyerdynamic dt 990\naudio interface'}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #1e1e26', background: '#141418', color: '#f0f0f2', fontSize: '0.875rem', outline: 'none', resize: 'vertical', fontFamily: 'monospace' }} />
                <div style={{ fontSize: '0.6875rem', color: '#5a5a6a', marginTop: '0.375rem' }}>
                  {bulkText.split('\n').filter(l => l.trim()).length} items
                </div>
              </div>
            </>
          )}

          {/* Category */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#9090a0' }}>Category (auto-mapped)</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #1e1e26', background: '#141418', color: '#f0f0f2', fontSize: '0.875rem', outline: 'none' }}>
              <option value="">Auto-detect</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Max Results */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#9090a0' }}>Max Results: {maxResults}</label>
            <input type="range" min="1" max="100" value={maxResults} onChange={e => setMaxResults(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#D4A843' }} />
          </div>

          {/* Options */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: '#9090a0' }}>
              <input type="checkbox" checked={spinContent} onChange={e => setSpinContent(e.target.checked)}
                style={{ accentColor: '#D4A843', width: '18px', height: '18px' }} />
              <span>Auto-spin descriptions (AI rewrite)</span>
            </label>
          </div>

          {/* Scrape Button */}
          <button onClick={handleScrape} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Scraping...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {activeTab === 'manual' ? 'Search Products' : 'Import Products'}
              </span>
            )}
          </button>

          {error && <p style={{ color: '#ef4444', fontSize: '0.8125rem', marginTop: '0.75rem' }}>{error}</p>}
        </div>

        {/* Right: Results */}
        <div>
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Found', value: stats.totalFound, color: '#D4A843' },
                { label: 'New Saved', value: stats.newSaved, color: '#22c55e' },
                { label: 'Duplicates', value: stats.duplicates, color: '#f59e0b' },
                { label: 'Avg Price', value: `$${stats.avgPrice.toFixed(2)}`, color: '#3b82f6' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '1rem', background: '#121216', borderRadius: '10px', border: '1px solid #1e1e26' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#5a5a6a' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => handleBulkAction('approve')} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem', color: '#22c55e' }}>✓ Approve All</button>
              <button onClick={() => handleBulkAction('reject')} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem', color: '#ef4444' }}>✗ Reject All</button>
            </div>
          )}

          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            {products.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#5a5a6a' }}>
                <p>No products yet. Use the search or import panel to get started.</p>
              </div>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {products.map(product => (
                  <div key={product.id} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
                    borderBottom: '1px solid #1e1e26',
                  }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: '#141418', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {product.image ? <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} /> : <span style={{ fontSize: '0.625rem', color: '#5a5a6a' }}>—</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#5a5a6a', marginTop: '0.125rem' }}>
                        {product.category && <span style={{ color: '#D4A843' }}>{product.category} · </span>}
                        {product.brand && <span>{product.brand} · </span>}
                        {product.rating > 0 && <span>★ {product.rating} ({product.reviewCount})</span>}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#D4A843', fontSize: '0.9375rem', flexShrink: 0 }}>${product.price.toFixed(2)}</div>
                    <span className={`badge ${product.source === 'amazon' ? '' : product.source === 'ebay' ? 'badge-info' : 'badge-purple'}`} style={{ fontSize: '0.625rem', flexShrink: 0, textTransform: 'capitalize' }}>{product.source}</span>
                    <span className={`badge ${product.status === 'approved' ? 'badge-success' : product.status === 'rejected' ? 'badge-danger' : ''}`} style={{ fontSize: '0.625rem', flexShrink: 0 }}>{product.status}</span>
                    <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                      {product.status === 'pending' && (
                        <>
                          <button onClick={() => handleBulkAction('approve', product.id)} className="btn-ghost" style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: '#22c55e' }}>✓</button>
                          <button onClick={() => handleBulkAction('reject', product.id)} className="btn-ghost" style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: '#ef4444' }}>✗</button>
                        </>
                      )}
                      <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem' }}>↗</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
