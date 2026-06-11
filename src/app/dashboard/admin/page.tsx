'use client';

import { useState, useEffect, useCallback } from 'react';

// ============================================================
// TYPES
// ============================================================
interface DashboardStats {
  products: number;
  posts: number;
  categories: number;
  scraperProducts: number;
  campaigns: number;
  activeCampaigns: number;
  healthScore: number;
  issues: number;
  apiResponseTime: number;
  lastScrape: string | null;
}

interface ActivityEvent {
  id: string;
  type: 'scrape' | 'content' | 'system' | 'ai' | 'deploy';
  message: string;
  timestamp: string;
}

interface AIAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
  loading?: boolean;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function CommandCenter() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<'overview' | 'ai' | 'content' | 'scraper' | 'seo' | 'settings'>('overview');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  // Load dashboard data
  const loadData = useCallback(async () => {
    try {
      const [productsRes, postsRes, campaignsRes] = await Promise.all([
        fetch('/data/products.json').then(r => r.json()).catch(() => []),
        fetch('/data/posts.json').then(r => r.json()).catch(() => []),
        fetch('/api/scraper/stats').then(r => r.json()).catch(() => ({})),
      ]);

      const products = Array.isArray(productsRes) ? productsRes : [];
      const posts = Array.isArray(postsRes) ? postsRes : [];
      const campaigns = campaignsRes?.campaigns || [];

      // Compute stats
      const productCategories = new Set(products.map((p: any) => p.categories?.[0]).filter(Boolean));
      const postCategories = new Set(posts.map((p: any) => p.categories?.[0]).filter(Boolean));
      const allCategories = new Set([...productCategories, ...postCategories]);

      const productsWithImages = products.filter((p: any) => p.image).length;
      const postsWithContent = posts.filter((p: any) => p.content && p.content.length > 100).length;
      const healthScore = Math.round(
        (productsWithImages / Math.max(products.length, 1)) * 30 +
        (postsWithContent / Math.max(posts.length, 1)) * 30 +
        (campaigns.length > 0 ? 20 : 0) +
        20
      );

      const issues: string[] = [];
      if (productsWithImages < products.length) issues.push(`${products.length - productsWithImages} products missing images`);
      if (postsWithContent < posts.length) issues.push(`${posts.length - postsWithContent} posts with thin content`);

      setStats({
        products: products.length,
        posts: posts.length,
        categories: allCategories.size,
        scraperProducts: campaignsRes?.totalProducts || 0,
        campaigns: campaigns.length,
        activeCampaigns: campaigns.filter((c: any) => c.isActive).length,
        healthScore,
        issues: issues.length,
        apiResponseTime: campaignsRes?.apiResponseTime || 0,
        lastScrape: campaignsRes?.lastScrapeTime || null,
      });

      // Build activity log
      const events: ActivityEvent[] = [
        { id: 'sys-1', type: 'system', message: `Dashboard loaded — ${products.length} products, ${posts.length} posts`, timestamp: new Date().toLocaleTimeString() },
        ...posts.slice(0, 5).map((p: any) => ({
          id: `post-${p.id}`,
          type: 'content' as const,
          message: `Post: "${p.title.substring(0, 50)}..."`,
          timestamp: p.date || '—',
        })),
        ...campaigns.slice(0, 3).map((c: any) => ({
          id: `camp-${c.id}`,
          type: 'scrape' as const,
          message: `Campaign: ${c.name} (${c.totalScraped || 0} scraped)`,
          timestamp: c.lastRun || 'Never run',
        })),
      ];
      setActivities(events);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // AI Actions
  const handleAIAction = async (actionId: string, endpoint: string, body?: any) => {
    setAiLoading(actionId);
    setMessage(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message || 'Action completed successfully' });
        loadData(); // Refresh
      } else {
        setMessage({ type: 'error', text: data.error || 'Action failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setAiLoading(null);
    }
  };

  const aiActions: AIAction[] = [
    {
      id: 'ai-generate-posts',
      label: 'Generate Blog Posts',
      description: 'AI creates 5 new buying guide posts with full content, SEO meta, and affiliate links',
      icon: '📝',
      color: '#3b82f6',
      action: () => handleAIAction('ai-generate-posts', '/api/ai/generate-posts'),
    },
    {
      id: 'ai-optimize-content',
      label: 'Optimize All Content',
      description: 'AI reviews and improves all product descriptions and blog posts for SEO',
      icon: '✨',
      color: '#a855f7',
      action: () => handleAIAction('ai-optimize-content', '/api/ai/optimize-content'),
    },
    {
      id: 'ai-generate-descriptions',
      label: 'Generate Product Descriptions',
      description: 'AI writes unique descriptions for products missing or with thin content',
      icon: '📦',
      color: '#22c55e',
      action: () => handleAIAction('ai-generate-descriptions', '/api/ai/generate-descriptions'),
    },
    {
      id: 'ai-seo-audit',
      label: 'Run SEO Audit',
      description: 'AI audits all pages for SEO issues and generates fix recommendations',
      icon: '🔍',
      color: '#f59e0b',
      action: () => handleAIAction('ai-seo-audit', '/api/ai/seo-audit'),
    },
    {
      id: 'ai-scrape-products',
      label: 'Smart Product Scraper',
      description: 'AI finds trending audio gear, scrapes details, and creates product pages',
      icon: '🤖',
      color: '#D4A843',
      action: () => handleAIAction('ai-scrape-products', '/api/ai/smart-scrape'),
    },
    {
      id: 'ai-social-content',
      label: 'Generate Social Content',
      description: 'AI creates social media posts, email newsletters, and promotional copy',
      icon: '📱',
      color: '#ef4444',
      action: () => handleAIAction('ai-social-content', '/api/ai/social-content'),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#9090a0' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
        <div>Loading Command Center...</div>
      </div>
    );
  }

  const statCards = stats ? [
    { label: 'Products', value: stats.products, sub: `${stats.scraperProducts} scraped`, color: '#D4A843', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Blog Posts', value: stats.posts, sub: 'Published', color: '#3b82f6', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7 8z' },
    { label: 'Categories', value: stats.categories, sub: 'Active', color: '#22c55e', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { label: 'Health', value: `${stats.healthScore}%`, sub: `${stats.issues} issues`, color: stats.healthScore >= 80 ? '#22c55e' : stats.healthScore >= 50 ? '#f59e0b' : '#ef4444', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Campaigns', value: stats.campaigns, sub: `${stats.activeCampaigns} active`, color: '#a855f7', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Last Scrape', value: stats.lastScrape ? new Date(stats.lastScrape).toLocaleDateString() : 'Never', sub: 'Product scraper', color: '#9090a0', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ] : [];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>⚡</div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Command Center</h1>
            <p style={{ color: '#9090a0', fontSize: '0.875rem' }}>AI-powered site management & autonomous operations</p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem',
          background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)',
          color: message.type === 'success' ? '#22c55e' : message.type === 'error' ? '#ef4444' : '#3b82f6',
          fontSize: '0.875rem', border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.25)' : message.type === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(59,130,246,0.25)'}`,
        }}>{message.text}</div>
      )}

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ padding: '1rem 1.25rem', background: '#121216', borderRadius: '12px', border: '1px solid #1e1e26' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="1.5"><path d={s.icon} /></svg>
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9090a0' }}>{s.label}</div>
            <div style={{ fontSize: '0.625rem', color: '#5a5a6a' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Panel Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e1e26', paddingBottom: '1rem' }}>
        {([
          { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
          { id: 'ai', label: 'AI Actions', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
          { id: 'content', label: 'Content', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
          { id: 'scraper', label: 'Scraper', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
          { id: 'seo', label: 'SEO', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
          { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActivePanel(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem',
            borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600,
            background: activePanel === tab.id ? 'rgba(212,168,67,0.1)' : 'transparent',
            color: activePanel === tab.id ? '#D4A843' : '#9090a0',
            border: activePanel === tab.id ? '1px solid rgba(212,168,67,0.25)' : '1px solid transparent',
            cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={tab.icon} /></svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* AI Actions Panel */}
      {activePanel === 'ai' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI-Powered Actions</h2>
            <p style={{ color: '#9090a0', fontSize: '0.875rem' }}>Let AI handle content creation, optimization, and site management tasks autonomously.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
            {aiActions.map(action => (
              <button key={action.id} onClick={action.action} disabled={aiLoading === action.id}
                style={{
                  padding: '1.5rem', background: '#121216', borderRadius: '16px',
                  border: `1px solid ${action.color}30`, textAlign: 'left', cursor: aiLoading === action.id ? 'wait' : 'pointer',
                  opacity: aiLoading === action.id ? 0.7 : 1, transition: 'all 0.15s',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>{action.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{action.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: action.color }}>
                      {aiLoading === action.id ? 'Processing...' : 'Click to execute'}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#9090a0', lineHeight: 1.5 }}>{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overview Panel */}
      {activePanel === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Quick Actions */}
          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e1e26' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Quick Actions</h2>
            </div>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: '/dashboard/admin/editor', label: 'Create New Content', icon: 'M12 4v16m8-8H4', color: '#D4A843' },
                { href: '/dashboard/admin/scraper', label: 'Run Product Scraper', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', color: '#3b82f6' },
                { href: '/dashboard/admin/campaigns', label: 'Manage Campaigns', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: '#22c55e' },
                { href: '/dashboard/admin/seo', label: 'SEO Center', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: '#f59e0b' },
                { href: '/dashboard/admin/analytics', label: 'View Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: '#a855f7' },
                { href: '/dashboard/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', color: '#9090a0' },
              ].map((item, i) => (
                <a key={i} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem',
                  borderRadius: '10px', textDecoration: 'none', border: '1px solid transparent',
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${item.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5"><path d={item.icon} /></svg>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0f0f2' }}>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e1e26' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Activity Log</h2>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {activities.map(event => (
                <div key={event.id} style={{ padding: '0.875rem 1.5rem', borderBottom: '1px solid #1e1e26', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', marginTop: '0.375rem', flexShrink: 0,
                    background: event.type === 'ai' ? '#a855f7' : event.type === 'scrape' ? '#3b82f6' : event.type === 'content' ? '#22c55e' : '#D4A843',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8125rem', color: '#f0f0f2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.message}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#5a5a6a' }}>{event.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Panel */}
      {activePanel === 'content' && (
        <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📝</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Content Manager</h2>
          <p style={{ color: '#9090a0', marginBottom: '1.5rem' }}>Manage all products, blog posts, and pages</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/dashboard/admin/content" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.75rem 1.5rem' }}>Open Content Manager</a>
            <a href="/dashboard/admin/editor" className="btn-ghost" style={{ fontSize: '0.875rem', padding: '0.75rem 1.5rem' }}>Create New</a>
          </div>
        </div>
      )}

      {/* Scraper Panel */}
      {activePanel === 'scraper' && (
        <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Product Scraper</h2>
          <p style={{ color: '#9090a0', marginBottom: '1.5rem' }}>Scrape products from Amazon, eBay, and AliExpress</p>
          <a href="/dashboard/admin/scraper" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.75rem 1.5rem' }}>Open Scraper</a>
        </div>
      )}

      {/* SEO Panel */}
      {activePanel === 'seo' && (
        <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>SEO Center</h2>
          <p style={{ color: '#9090a0', marginBottom: '1.5rem' }}>Monitor and optimize search engine performance</p>
          <a href="/dashboard/admin/seo" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.75rem 1.5rem' }}>Open SEO Center</a>
        </div>
      )}

      {/* Settings Panel */}
      {activePanel === 'settings' && (
        <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚙️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Settings</h2>
          <p style={{ color: '#9090a0', marginBottom: '1.5rem' }}>Configure affiliate tags, scrape defaults, and account security</p>
          <a href="/dashboard/admin/settings" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.75rem 1.5rem' }}>Open Settings</a>
        </div>
      )}
    </div>
  );
}
