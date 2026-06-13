'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  DashboardStyles, StatCard, Card, Button, Badge, MessageBanner, Tabs,
  SectionHeader, EmptyState, SkeletonCard,
} from '@/components/dashboard-ui';

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

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function CommandCenter() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState('overview');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const T = {
    text: '#f0f0f2', textSecondary: '#9090a0', textMuted: '#5a5a6a',
    card: '#121216', border: '#1e1e26', accent: '#D4A843',
    success: '#22c55e', danger: '#ef4444', warning: '#f59e0b',
    info: '#3b82f6', purple: '#a855f7',
  };

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
      const productCategories = new Set(products.map((p: any) => p.categories?.[0]).filter(Boolean));
      const postCategories = new Set(posts.map((p: any) => p.categories?.[0]).filter(Boolean));
      const allCategories = new Set([...productCategories, ...postCategories]);
      const productsWithImages = products.filter((p: any) => p.image).length;
      const postsWithContent = posts.filter((p: any) => p.content && p.content.length > 100).length;
      const healthScore = Math.round(
        (productsWithImages / Math.max(products.length, 1)) * 30 +
        (postsWithContent / Math.max(posts.length, 1)) * 30 +
        (campaigns.length > 0 ? 20 : 0) + 20
      );
      const issues: string[] = [];
      if (productsWithImages < products.length) issues.push(`${products.length - productsWithImages} products missing images`);
      if (postsWithContent < posts.length) issues.push(`${posts.length - postsWithContent} posts with thin content`);

      setStats({
        products: products.length, posts: posts.length,
        categories: allCategories.size,
        scraperProducts: campaignsRes?.totalProducts || 0,
        campaigns: campaigns.length,
        activeCampaigns: campaigns.filter((c: any) => c.isActive).length,
        healthScore, issues: issues.length,
        apiResponseTime: campaignsRes?.apiResponseTime || 0,
        lastScrape: campaignsRes?.lastScrapeTime || null,
      });

      setActivities([
        { id: 'sys-1', type: 'system', message: `Dashboard loaded — ${products.length} products, ${posts.length} posts`, timestamp: new Date().toLocaleTimeString() },
        ...posts.slice(0, 5).map((p: any) => ({ id: `post-${p.id}`, type: 'content' as const, message: `Post: "${p.title.substring(0, 50)}..."`, timestamp: p.date || '—' })),
        ...campaigns.slice(0, 3).map((c: any) => ({ id: `camp-${c.id}`, type: 'scrape' as const, message: `Campaign: ${c.name} (${c.totalScraped || 0} scraped)`, timestamp: c.lastRun || 'Never run' })),
      ]);
    } catch (err) { console.error('Dashboard load error:', err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAIAction = async (actionId: string, action: string) => {
    setAiLoading(actionId);
    setMessage(null);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message || 'Action completed successfully' });
        loadData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Action failed' });
      }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
    finally { setAiLoading(null); }
  };

  const aiActions = [
    { id: 'ai-generate-posts', label: 'Generate Blog Posts', description: 'AI creates 5 new buying guide posts with full content, SEO meta, and affiliate links', icon: '📝', color: T.info, actionId: 'generate-posts' },
    { id: 'ai-optimize-content', label: 'Optimize All Content', description: 'AI reviews and improves all product descriptions and blog posts for SEO', icon: '✨', color: T.purple, actionId: 'optimize-content' },
    { id: 'ai-generate-descriptions', label: 'Generate Descriptions', description: 'AI writes unique descriptions for products missing or with thin content', icon: '📦', color: T.success, actionId: 'generate-descriptions' },
    { id: 'ai-seo-audit', label: 'Run SEO Audit', description: 'AI audits all pages for SEO issues and generates fix recommendations', icon: '🔍', color: T.warning, actionId: 'seo-audit' },
    { id: 'ai-scrape-products', label: 'Smart Product Scraper', description: 'AI finds trending audio gear, scrapes details, and creates product pages', icon: '🤖', color: T.accent, actionId: 'smart-scrape' },
    { id: 'ai-social-content', label: 'Generate Social Content', description: 'AI creates social media posts, email newsletters, and promotional copy', icon: '📱', color: T.danger, actionId: 'social-content' },
  ];

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <DashboardStyles />
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ width: 120, height: 28, background: '#1a1a20', borderRadius: 6, marginBottom: '1rem' }} />
          <div style={{ width: '60%', maxWidth: 400, height: 40, background: '#1a1a20', borderRadius: 6, marginBottom: '0.75rem' }} />
          <div style={{ width: '80%', maxWidth: 500, height: 16, background: '#1a1a20', borderRadius: 6 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const statCards = stats ? [
    { label: 'Products', value: stats.products, sub: `${stats.scraperProducts} scraped`, color: T.accent, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Blog Posts', value: stats.posts, sub: 'Published', color: T.info, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7 8z' },
    { label: 'Categories', value: stats.categories, sub: 'Active', color: T.success, icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { label: 'Health', value: `${stats.healthScore}%`, sub: `${stats.issues} issues`, color: stats.healthScore >= 80 ? T.success : stats.healthScore >= 50 ? T.warning : T.danger, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Campaigns', value: stats.campaigns, sub: `${stats.activeCampaigns} active`, color: T.purple, icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Last Scrape', value: stats.lastScrape ? new Date(stats.lastScrape).toLocaleDateString() : 'Never', sub: 'Product scraper', color: T.textSecondary, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ] : [];

  const panelTabs = [
    { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
    { id: 'ai', label: 'AI Actions', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { id: 'content', label: 'Content', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { id: 'scraper', label: 'Scraper', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { id: 'seo', label: 'SEO', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  const activityTypeColor: Record<string, string> = {
    ai: T.purple, scrape: T.info, content: T.success, system: T.accent, deploy: T.warning,
  };

  return (
    <div>
      <DashboardStyles />
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>⚡</div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: T.text }}>Command Center</h1>
            <p style={{ color: T.textSecondary, fontSize: '0.875rem' }}>AI-powered site management & autonomous operations</p>
          </div>
        </div>
        <div style={{ position: 'relative', maxWidth: '600px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            placeholder="Search products, posts, pages..."
            style={{
              width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
              background: '#141418', border: `1px solid ${T.border}`, borderRadius: '10px',
              color: T.text, fontSize: '0.875rem', outline: 'none',
            }}
          />
          <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          {searchLoading && <div style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: T.textMuted, fontSize: '0.75rem' }}>Searching...</div>}
          {searchOpen && searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
              background: '#141418', border: `1px solid ${T.border}`, borderRadius: '10px',
              marginTop: '0.25rem', maxHeight: '400px', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              {searchResults.map((r: any, i: number) => (
                <a key={i} href={r.dashboardUrl} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.75rem 1rem', borderBottom: i < searchResults.length - 1 ? `1px solid ${T.border}` : 'none',
                  textDecoration: 'none',
                }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: T.text }}>{r.title}</div>
                    <div style={{ fontSize: '0.6875rem', color: T.textMuted }}>{r.subtitle}</div>
                  </div>
                  <Badge color={r.type === 'product' ? T.accent : r.type === 'post' ? T.info : T.purple}>{r.type}</Badge>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      {message && <MessageBanner type={message.type} message={message.text} onDismiss={() => setMessage(null)} />}

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} sub={s.sub} color={s.color} icon={s.icon} />
        ))}
      </div>

      {/* Panel Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: `1px solid ${T.border}`, overflowX: 'auto' }}>
        {panelTabs.map(tab => {
          const isActive = activePanel === tab.id;
          return (
            <button key={tab.id} onClick={() => setActivePanel(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem',
              fontSize: '0.8125rem', fontWeight: 600,
              background: isActive ? 'rgba(212,168,67,0.08)' : 'transparent',
              color: isActive ? T.accent : T.textMuted,
              border: isActive ? '1px solid rgba(212,168,67,0.15)' : '1px solid transparent',
              borderBottom: isActive ? `2px solid ${T.accent}` : '2px solid transparent',
              borderRadius: '10px 10px 0 0',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={tab.icon} /></svg>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* AI Panel */}
      {activePanel === 'ai' && (
        <div>
          <SectionHeader title="AI-Powered Actions" subtitle="Let AI handle content creation, optimization, and site management tasks autonomuously." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {aiActions.map(a => (
              <Card key={a.id} hover onClick={() => handleAIAction(a.id, a.actionId)} style={{ borderColor: `${a.color}30` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>{a.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text }}>{a.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: a.color }}>{aiLoading === a.id ? '⏳ Processing...' : 'Click to execute'}</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8125rem', color: T.textSecondary, lineHeight: 1.5 }}>{a.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Overview Panel */}
      {activePanel === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <Card>
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${T.border}`, marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text }}>Quick Actions</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.75rem 0.75rem' }}>
              {[
                { href: '/dashboard/admin/editor', label: 'Create New Content', icon: 'M12 4v16m8-8H4', color: T.accent },
                { href: '/dashboard/admin/scraper', label: 'Run Product Scraper', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', color: T.info },
                { href: '/dashboard/admin/campaigns', label: 'Manage Campaigns', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: T.purple },
                { href: '/dashboard/admin/seo', label: 'SEO Center', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: T.warning },
                { href: '/dashboard/admin/analytics', label: 'View Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: T.success },
                { href: '/dashboard/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', color: T.textSecondary },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
                  borderRadius: '8px', textDecoration: 'none', transition: 'background 0.15s', minHeight: '44px',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1e1e26')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${item.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: T.text }}>{item.label}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Activity Log */}
          <Card>
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${T.border}`, marginBottom: '0' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text }}>Activity Log</h3>
            </div>
            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {activities.map(event => (
                <div key={event.id} style={{
                  padding: '0.75rem 1.25rem', borderBottom: `1px solid ${T.border}`,
                  display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                }}>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%', marginTop: '0.375rem', flexShrink: 0,
                    background: activityTypeColor[event.type] || T.accent,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8125rem', color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.message}</div>
                    <div style={{ fontSize: '0.6875rem', color: T.textMuted }}>{event.timestamp}</div>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted, fontSize: '0.8125rem' }}>No activity yet</div>
              )}
            </div>
          </Card>

          {/* Content Summary */}
          <Card>
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${T.border}`, marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text }}>Content Summary</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 0.75rem 0.75rem' }}>
              {[
                { href: '/dashboard/admin/products', label: 'Products', count: stats?.products || 0, color: T.accent },
                { href: '/dashboard/admin/content?tab=posts', label: 'Blog Posts', count: stats?.posts || 0, color: T.info },
                { href: '/dashboard/admin/content?tab=pages', label: 'Categories', count: stats?.categories || 0, color: T.success },
                { href: '/dashboard/admin/campaigns', label: 'Campaigns', count: stats?.campaigns || 0, color: T.purple },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.625rem 0.75rem', borderRadius: '8px', textDecoration: 'none',
                  minHeight: '44px', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1e1e26')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: T.text }}>{item.label}</span>
                  <Badge color={item.color}>{item.count}</Badge>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Scraper Panel */}
      {activePanel === 'scraper' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <Card>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text, marginBottom: '0.75rem' }}>Quick Scrape</h3>
            <p style={{ fontSize: '0.8125rem', color: T.textMuted, marginBottom: '1rem' }}>Scrape products from Amazon, eBay, or AliExpress by keyword</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/dashboard/admin/scraper" className="dsz-btn dsz-btn-primary" style={{ display: 'block', padding: '0.625rem', borderRadius: '10px', background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)', color: '#000', textAlign: 'center', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem' }}>Open Scraper</Link>
              <button onClick={() => handleAIAction('ai-scrape-products', 'smart-scrape')} disabled={aiLoading === 'ai-scrape-products'} style={{ padding: '0.625rem', borderRadius: '10px', background: 'transparent', border: `1px solid ${T.border}`, color: T.accent, cursor: 'pointer', fontSize: '0.8125rem' }}>
                {aiLoading === 'ai-scrape-products' ? '⏳ Scraping...' : '🤖 AI Smart Scrape'}
              </button>
            </div>
          </Card>
          <Card>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text, marginBottom: '1rem' }}>Campaigns</h3>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', background: '#141418', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: T.accent }}>{stats?.campaigns || 0}</div>
                <div style={{ fontSize: '0.625rem', color: T.textMuted }}>Total</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', background: '#141418', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: T.success }}>{stats?.activeCampaigns || 0}</div>
                <div style={{ fontSize: '0.625rem', color: T.textMuted }}>Active</div>
              </div>
            </div>
            <Link href="/dashboard/admin/campaigns" style={{ display: 'block', padding: '0.5rem', borderRadius: '8px', border: `1px solid ${T.border}`, color: T.textSecondary, textAlign: 'center', textDecoration: 'none', fontSize: '0.8125rem' }}>Manage Campaigns →</Link>
          </Card>
          <Card>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text, marginBottom: '1rem' }}>Scraper Status</h3>
            {[
              { label: 'Last Scrape', value: stats?.lastScrape ? new Date(stats.lastScrape).toLocaleDateString() : 'Never' },
              { label: 'Products Scraped', value: `${stats?.scraperProducts || 0}`, color: T.accent },
              { label: 'API Response', value: `${stats?.apiResponseTime || 0}ms`, color: T.success },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.8125rem' }}>
                <span style={{ color: T.textSecondary }}>{item.label}</span>
                <span style={{ color: item.color || T.text, fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
            <Link href="/dashboard/admin/logs" style={{ display: 'block', padding: '0.5rem', borderRadius: '8px', border: `1px solid ${T.border}`, color: T.textSecondary, textAlign: 'center', textDecoration: 'none', fontSize: '0.8125rem', marginTop: '0.25rem' }}>View Logs →</Link>
          </Card>
        </div>
      )}

      {/* SEO Panel */}
      {activePanel === 'seo' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <Card>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text, marginBottom: '1rem' }}>SEO Health</h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: stats && stats.healthScore >= 80 ? T.success : stats && stats.healthScore >= 50 ? T.warning : T.danger }}>{stats?.healthScore || 0}%</div>
              <div style={{ fontSize: '0.75rem', color: T.textMuted, marginBottom: '1rem' }}>{stats?.issues || 0} issues found</div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Link href="/dashboard/admin/seo" style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)', color: '#000', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem', flex: 1, textAlign: 'center' }}>SEO Center</Link>
                <button onClick={() => handleAIAction('ai-seo-audit', 'seo-audit')} style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: `1px solid ${T.border}`, background: 'transparent', color: T.textSecondary, cursor: 'pointer' }}>🤖 AI Audit</button>
              </div>
            </div>
          </Card>
          <Card>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text, marginBottom: '0.75rem' }}>Quick Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {[
                { href: '/dashboard/admin/seo', label: 'Full SEO Audit', icon: '🔍', desc: 'Complete site analysis' },
                { href: '/dashboard/admin/seo?tab=keywords', label: 'Keywords', icon: '📊', desc: 'Keyword tracking' },
                { href: '/dashboard/admin/topics', label: 'Trending Topics', icon: '📈', desc: 'Content opportunities' },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.625rem', borderRadius: '8px', textDecoration: 'none', minHeight: '44px',
                }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: T.text }}>{item.icon} {item.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: T.textMuted }}>{item.desc}</div>
                  </div>
                  <span style={{ color: T.textMuted }}>→</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Content Panel */}
      {activePanel === 'content' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <Card>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text, marginBottom: '1rem' }}>Products</h3>
            {stats && stats.products > 0 ? (
              <>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: T.accent, marginBottom: '0.25rem' }}>{stats.products}</div>
                <div style={{ fontSize: '0.75rem', color: T.textMuted, marginBottom: '1rem' }}>Total products in catalog</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href="/dashboard/admin/editor" style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)', color: '#000', textAlign: 'center', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem' }}>+ Add Product</Link>
                  <Link href="/dashboard/admin/scraper" style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: `1px solid ${T.border}`, color: T.textSecondary, textDecoration: 'none', fontSize: '0.8125rem' }}>Scrape</Link>
                </div>
              </>
            ) : (
              <EmptyState icon="📦" title="No products yet" description="Create your first product or run the scraper"
                action={<Link href="/dashboard/admin/editor" style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)', color: '#000', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem' }}>Create First Product</Link>}
              />
            )}
          </Card>
          <Card>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text, marginBottom: '1rem' }}>Blog Posts</h3>
            {stats && stats.posts > 0 ? (
              <>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: T.info, marginBottom: '0.25rem' }}>{stats.posts}</div>
                <div style={{ fontSize: '0.75rem', color: T.textMuted, marginBottom: '1rem' }}>Published posts</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href="/dashboard/admin/editor?type=post" style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)', color: '#000', textAlign: 'center', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem' }}>+ Write Post</Link>
                  <button onClick={() => handleAIAction('ai-generate-posts', 'generate-posts')} style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: `1px solid ${T.border}`, background: 'transparent', color: T.textSecondary, cursor: 'pointer', fontSize: '0.8125rem' }}>🤖 AI</button>
                </div>
              </>
            ) : (
              <EmptyState icon="📝" title="No posts yet" description="Write your first blog post or let AI generate one"
                action={<Link href="/dashboard/admin/editor?type=post" style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)', color: '#000', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem' }}>Write First Post</Link>}
              />
            )}
          </Card>
          <Card>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text, marginBottom: '0.75rem' }}>Content Tools</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {[
                { href: '/dashboard/admin/content', label: '📋 Content Manager', desc: 'Manage all content' },
                { href: '/dashboard/admin/seo', label: '🔍 SEO Center', desc: 'Optimize for search' },
                { href: '/dashboard/admin/topics', label: '📊 Trending Topics', desc: 'Keyword insights' },
                { href: '/dashboard/admin/price-compare', label: '💰 Price Compare', desc: 'Compare prices' },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem', borderRadius: '8px', textDecoration: 'none', minHeight: '44px' }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: T.text }}>{item.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: T.textMuted }}>{item.desc}</div>
                  </div>
                  <span style={{ color: T.textMuted }}>→</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Settings Panel */}
      {activePanel === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <Card>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text, marginBottom: '0.75rem' }}>Quick Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {[
                { href: '/dashboard/admin/settings', label: '⚙️ All Settings', desc: 'Full configuration' },
                { href: '/dashboard/admin/settings#affiliate', label: '🏷️ Affiliate Tags', desc: 'Amazon, eBay, etc.' },
                { href: '/dashboard/admin/settings#security', label: '🔒 Account Security', desc: 'Password, email' },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem', borderRadius: '8px', textDecoration: 'none', minHeight: '44px' }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: T.text }}>{item.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: T.textMuted }}>{item.desc}</div>
                  </div>
                  <span style={{ color: T.textMuted }}>→</span>
                </Link>
              ))}
            </div>
          </Card>
          <Card>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.text, marginBottom: '1rem' }}>Site Overview</h3>
            {[
              { label: 'Products', value: stats?.products || 0, color: T.accent },
              { label: 'Posts', value: stats?.posts || 0, color: T.info },
              { label: 'Categories', value: stats?.categories || 0, color: T.success },
              { label: 'Campaigns', value: stats?.campaigns || 0, color: T.purple },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.8125rem' }}>
                <span style={{ color: T.textSecondary }}>{item.label}</span>
                <span style={{ color: item.color, fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
            <a href="/" target="_blank" style={{ display: 'block', padding: '0.5rem', borderRadius: '8px', border: `1px solid ${T.border}`, color: T.textSecondary, textAlign: 'center', textDecoration: 'none', fontSize: '0.8125rem', marginTop: '0.25rem' }}>🌐 View Live Site</a>
          </Card>
        </div>
      )}
    </div>
  );
}
