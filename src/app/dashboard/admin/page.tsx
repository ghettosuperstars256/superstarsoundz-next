'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Global search
  const handleSearch = useCallback(async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); setSearchOpen(false); return; }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=10`);
      const data = await res.json();
      setSearchResults(data.results || []);
      setSearchOpen(true);
    } catch {} finally { setSearchLoading(false); }
  }, []);

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
  const handleAIAction = async (actionId: string, action: string) => {
    setAiLoading(actionId);
    setMessage(null);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
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
      action: () => handleAIAction('ai-generate-posts', 'generate-posts'),
    },
    {
      id: 'ai-optimize-content',
      label: 'Optimize All Content',
      description: 'AI reviews and improves all product descriptions and blog posts for SEO',
      icon: '✨',
      color: '#a855f7',
      action: () => handleAIAction('ai-optimize-content', 'optimize-content'),
    },
    {
      id: 'ai-generate-descriptions',
      label: 'Generate Product Descriptions',
      description: 'AI writes unique descriptions for products missing or with thin content',
      icon: '📦',
      color: '#22c55e',
      action: () => handleAIAction('ai-generate-descriptions', 'generate-descriptions'),
    },
    {
      id: 'ai-seo-audit',
      label: 'Run SEO Audit',
      description: 'AI audits all pages for SEO issues and generates fix recommendations',
      icon: '🔍',
      color: '#f59e0b',
      action: () => handleAIAction('ai-seo-audit', 'seo-audit'),
    },
    {
      id: 'ai-scrape-products',
      label: 'Smart Product Scraper',
      description: 'AI finds trending audio gear, scrapes details, and creates product pages',
      icon: '🤖',
      color: '#D4A843',
      action: () => handleAIAction('ai-scrape-products', 'smart-scrape'),
    },
    {
      id: 'ai-social-content',
      label: 'Generate Social Content',
      description: 'AI creates social media posts, email newsletters, and promotional copy',
      icon: '📱',
      color: '#ef4444',
      action: () => handleAIAction('ai-social-content', 'social-content'),
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
      {/* Header with Search */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>⚡</div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Command Center</h1>
            <p style={{ color: '#9090a0', fontSize: '0.875rem' }}>AI-powered site management & autonomous operations</p>
          </div>
        </div>
        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '600px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            placeholder="Search products, posts, pages... (Ctrl+K)"
            style={{
              width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
              background: '#141418', border: '1px solid #1e1e26', borderRadius: '10px',
              color: '#f0f0f2', fontSize: '0.875rem', outline: 'none',
            }}
          />
          <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#5a5a6a' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          {searchLoading && <div style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#5a5a6a', fontSize: '0.75rem' }}>Searching...</div>}
          {/* Search Results Dropdown */}
          {searchOpen && searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
              background: '#141418', border: '1px solid #1e1e26', borderRadius: '10px',
              marginTop: '0.25rem', maxHeight: '400px', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              {searchResults.map((r: any, i: number) => (
                <a key={i} href={r.dashboardUrl} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.75rem 1rem', borderBottom: i < searchResults.length - 1 ? '1px solid #1e1e26' : 'none',
                  textDecoration: 'none', minHeight: '44px',
                }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f0f0f2' }}>{r.title}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#5a5a6a' }}>{r.subtitle}</div>
                  </div>
                  <span style={{
                    fontSize: '0.625rem', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '4px',
                    background: r.type === 'product' ? 'rgba(212,168,67,0.1)' : r.type === 'post' ? 'rgba(59,130,246,0.1)' : 'rgba(168,85,247,0.1)',
                    color: r.type === 'product' ? '#D4A843' : r.type === 'post' ? '#3b82f6' : '#a855f7',
                    textTransform: 'capitalize',
                  }}>{r.type}</span>
                </a>
              ))}
              <div style={{ padding: '0.5rem 1rem', fontSize: '0.6875rem', color: '#5a5a6a', textAlign: 'center' }}>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </div>
            </div>
          )}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
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
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e1e26', paddingBottom: '1rem', flexWrap: 'wrap' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Recent Products */}
          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e1e26', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Recent Products</h3>
              <Link href="/dashboard/admin/products" style={{ fontSize: '0.75rem', color: '#D4A843' }}>View All →</Link>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {stats && stats.products > 0 ? (
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D4A843', padding: '1rem' }}>{stats.products}</div>
                  <div style={{ fontSize: '0.75rem', color: '#5a5a6a', padding: '0 1rem' }}>Total products in catalog</div>
                  <div style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <Link href="/dashboard/admin/editor" className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', flex: 1, textAlign: 'center' }}>+ Add Product</Link>
                    <Link href="/dashboard/admin/scraper" className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>Scrape</Link>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#5a5a6a' }}>
                  <p style={{ marginBottom: '1rem' }}>No products yet</p>
                  <Link href="/dashboard/admin/editor" className="btn-primary" style={{ fontSize: '0.75rem' }}>Create First Product</Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Posts */}
          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e1e26', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Blog Posts</h3>
              <Link href="/dashboard/admin/content?tab=posts" style={{ fontSize: '0.75rem', color: '#D4A843' }}>View All →</Link>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {stats && stats.posts > 0 ? (
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6', padding: '1rem' }}>{stats.posts}</div>
                  <div style={{ fontSize: '0.75rem', color: '#5a5a6a', padding: '0 1rem' }}>Published posts</div>
                  <div style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <Link href="/dashboard/admin/editor?type=post" className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', flex: 1, textAlign: 'center' }}>+ Write Post</Link>
                    <button onClick={() => handleAIAction('ai-generate-posts', 'generate-posts')} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>🤖 AI</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#5a5a6a' }}>
                  <p style={{ marginBottom: '1rem' }}>No posts yet</p>
                  <Link href="/dashboard/admin/editor?type=post" className="btn-primary" style={{ fontSize: '0.75rem' }}>Write First Post</Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e1e26' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Content Tools</h3>
            </div>
            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {[
                { href: '/dashboard/admin/content', label: '📋 Content Manager', desc: 'Manage all content' },
                { href: '/dashboard/admin/editor', label: '✏️ Create New', desc: 'Add product or post' },
                { href: '/dashboard/admin/seo', label: '🔍 SEO Center', desc: 'Optimize for search' },
                { href: '/dashboard/admin/topics', label: '📊 Trending Topics', desc: 'Keyword insights' },
                { href: '/dashboard/admin/price-compare', label: '💰 Price Compare', desc: 'Compare prices' },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem', borderRadius: '8px', textDecoration: 'none', minHeight: '44px' }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f0f0f2' }}>{item.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#5a5a6a' }}>{item.desc}</div>
                  </div>
                  <span style={{ color: '#5a5a6a', fontSize: '0.75rem' }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scraper Panel */}
      {activePanel === 'scraper' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Quick Scrape */}
          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e1e26' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Quick Scrape</h3>
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#5a5a6a', marginBottom: '1rem' }}>Scrape products from Amazon, eBay, or AliExpress by keyword</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="/dashboard/admin/scraper" className="btn-primary" style={{ fontSize: '0.8125rem', padding: '0.75rem', textAlign: 'center' }}>Open Scraper</a>
                <button onClick={() => handleAIAction('ai-scrape-products', 'smart-scrape')} disabled={aiLoading === 'ai-scrape-products'} className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.75rem', color: '#D4A843' }}>
                  {aiLoading === 'ai-scrape-products' ? '⏳ Scraping...' : '🤖 AI Smart Scrape'}
                </button>
              </div>
            </div>
          </div>

          {/* Campaigns */}
          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e1e26', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Campaigns</h3>
              <Link href="/dashboard/admin/campaigns" style={{ fontSize: '0.75rem', color: '#D4A843' }}>Manage →</Link>
            </div>
            <div style={{ padding: '1rem' }}>
              {stats && stats.campaigns > 0 ? (
                <>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', background: '#141418', borderRadius: '8px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D4A843' }}>{stats.campaigns}</div>
                      <div style={{ fontSize: '0.625rem', color: '#5a5a6a' }}>Total</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', background: '#141418', borderRadius: '8px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>{stats.activeCampaigns}</div>
                      <div style={{ fontSize: '0.625rem', color: '#5a5a6a' }}>Active</div>
                    </div>
                  </div>
                  <Link href="/dashboard/admin/campaigns" className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.5rem', textAlign: 'center', display: 'block' }}>View All Campaigns</Link>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#5a5a6a', padding: '1rem' }}>
                  <p style={{ marginBottom: '1rem', fontSize: '0.75rem' }}>No campaigns yet</p>
                  <Link href="/dashboard/admin/campaigns" className="btn-primary" style={{ fontSize: '0.75rem' }}>Create Campaign</Link>
                </div>
              )}
            </div>
          </div>

          {/* Last Scrape */}
          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e1e26' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Scraper Status</h3>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9090a0' }}>Last Scrape</span>
                <span style={{ fontSize: '0.75rem', color: '#f0f0f2' }}>{stats?.lastScrape ? new Date(stats.lastScrape).toLocaleDateString() : 'Never'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9090a0' }}>Products Scraped</span>
                <span style={{ fontSize: '0.75rem', color: '#D4A843', fontWeight: 600 }}>{stats?.scraperProducts || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9090a0' }}>API Response</span>
                <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>{stats?.apiResponseTime || 0}ms</span>
              </div>
              <Link href="/dashboard/admin/logs" className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.5rem', textAlign: 'center', display: 'block' }}>View Logs</Link>
            </div>
          </div>
        </div>
      )}

      {/* SEO Panel */}
      {activePanel === 'seo' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e1e26' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>SEO Health</h3>
            </div>
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: stats && stats.healthScore >= 80 ? '#22c55e' : stats && stats.healthScore >= 50 ? '#f59e0b' : '#ef4444' }}>{stats?.healthScore || 0}%</div>
              <div style={{ fontSize: '0.75rem', color: '#5a5a6a', marginBottom: '1rem' }}>{stats?.issues || 0} issues found</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a href="/dashboard/admin/seo" className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', flex: 1, textAlign: 'center' }}>SEO Center</a>
                <button onClick={() => handleAIAction('ai-seo-audit', 'seo-audit')} disabled={aiLoading === 'ai-seo-audit'} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>{aiLoading === 'ai-seo-audit' ? '⏳' : '🤖'}</button>
              </div>
            </div>
          </div>
          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e1e26' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Quick SEO</h3>
            </div>
            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {[
                { href: '/dashboard/admin/seo', label: '🔍 Full SEO Audit', desc: 'Complete site analysis' },
                { href: '/dashboard/admin/seo?tab=keywords', label: '📊 Keywords', desc: 'Keyword tracking' },
                { href: '/dashboard/admin/seo?tab=sitemap', label: '🗺️ Sitemap', desc: 'URL management' },
                { href: '/dashboard/admin/topics', label: '📈 Trending Topics', desc: 'Content opportunities' },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem', borderRadius: '8px', textDecoration: 'none', minHeight: '44px' }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f0f0f2' }}>{item.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#5a5a6a' }}>{item.desc}</div>
                  </div>
                  <span style={{ color: '#5a5a6a', fontSize: '0.75rem' }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {activePanel === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e1e26' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Quick Settings</h3>
            </div>
            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {[
                { href: '/dashboard/admin/settings', label: '⚙️ All Settings', desc: 'Full configuration' },
                { href: '/dashboard/admin/settings#affiliate', label: '🏷️ Affiliate Tags', desc: 'Amazon, eBay, etc.' },
                { href: '/dashboard/admin/settings#scraper', label: '🤖 Scraper Defaults', desc: 'Price, rating filters' },
                { href: '/dashboard/admin/settings#security', label: '🔒 Account Security', desc: 'Password, email' },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem', borderRadius: '8px', textDecoration: 'none', minHeight: '44px' }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f0f0f2' }}>{item.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#5a5a6a' }}>{item.desc}</div>
                  </div>
                  <span style={{ color: '#5a5a6a', fontSize: '0.75rem' }}>→</span>
                </Link>
              ))}
            </div>
          </div>
          <div style={{ background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e1e26' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Site Info</h3>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9090a0' }}>Products</span>
                <span style={{ fontSize: '0.75rem', color: '#D4A843', fontWeight: 600 }}>{stats?.products || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9090a0' }}>Posts</span>
                <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>{stats?.posts || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9090a0' }}>Categories</span>
                <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>{stats?.categories || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9090a0' }}>Campaigns</span>
                <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600 }}>{stats?.campaigns || 0}</span>
              </div>
              <a href="/" target="_blank" className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.5rem', textAlign: 'center', display: 'block' }}>🌐 View Live Site</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
