'use client';

import { useState, useCallback, useMemo } from 'react';
import productsData from '@/data/products.json';
import postsData from '@/data/posts.json';
import productCategoriesData from '@/data/product-categories.json';
import postCategoriesData from '@/data/post-categories.json';

// ─── Design Tokens ───────────────────────────────────────────────
const C = {
  bg: '#08080a',
  card: '#121216',
  tertiary: '#1a1a20',
  border: '#1e1e26',
  accent: '#D4A843',
  text: '#f0f0f2',
  muted: '#5a5a6a',
  secondary: '#9090a0',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#a855f7',
};

// ─── Types ───────────────────────────────────────────────────────
type DateRange = '7d' | '30d' | '90d' | 'all';

interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: string;
}

interface TopPage {
  page: string;
  title: string;
  type: 'product' | 'post';
  price?: number;
  category: string;
}

interface AffiliateSource {
  source: string;
  productCount: number;
  avgPrice: number;
  color: string;
}

interface CategorySummary {
  name: string;
  slug: string;
  productCount: number;
  postCount: number;
}

// ─── Helpers ─────────────────────────────────────────────────────

/** Extract affiliate source domain from a product external_url */
function extractSource(url: string): string {
  try {
    const host = new URL(url).hostname;
    if (host.includes('amazon')) return 'Amazon';
    if (host.includes('ebay')) return 'eBay';
    if (host.includes('aliexpress')) return 'AliExpress';
    if (host.includes('sweetwater')) return 'Sweetwater';
    if (host.includes('bhphotovideo') || host.includes('bhphoto')) return 'B&H Photo';
    if (host.includes('pluginboutique')) return 'Plugin Boutique';
    return host.replace('www.', '').split('.')[0].replace(/^./, c => c.toUpperCase());
  } catch {
    return 'Direct';
  }
}

/** Count items created/updated this month (by date field) */
function countThisMonth(items: { date?: string }[]): number {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  return items.filter(item => {
    if (!item.date) return false;
    const d = new Date(item.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
}

// ─── Real Data Computation ───────────────────────────────────────
function computeRealData() {
  const products = productsData as any[];
  const posts = postsData as any[];
  const productCategories = productCategoriesData as any[];
  const postCategories = postCategoriesData as any[];

  // ── Stats Cards ──
  const totalProducts = products.length;
  const totalPosts = posts.length;
  const totalCategories = productCategories.length + postCategories.length;
  const inStockProducts = products.filter(p => p.in_stock).length;
  const featuredProducts = products.filter(p => p.featured).length;
  const productsThisMonth = countThisMonth(products);
  const postsThisMonth = countThisMonth(posts);

  const avgProductPrice = products.reduce((a, p) => a + (p.price || 0), 0) / totalProducts;
  const maxProductPrice = Math.max(...products.map(p => p.price || 0));
  const minProductPrice = Math.min(...products.map(p => p.price || 0));

  const stats: StatCard[] = [
    { label: 'Products', value: totalProducts.toString(), change: productsThisMonth > 0 ? `+${productsThisMonth} this month` : 'No recent changes', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Blog Posts', value: totalPosts.toString(), change: postsThisMonth > 0 ? `+${postsThisMonth} this month` : 'No recent changes', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { label: 'Categories', value: totalCategories.toString(), change: `${productCategories.length} shop · ${postCategories.length} topic`, icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { label: 'Avg Product Price', value: `$${avgProductPrice.toFixed(2)}`, change: `$${minProductPrice.toFixed(0)}–$${maxProductPrice.toFixed(0)} range`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  // ── Top Pages (from real products and posts) ──
  const productPages: TopPage[] = products.map(p => ({
    page: `/gear/${p.slug}`,
    title: p.short_name || p.name,
    type: 'product' as const,
    price: p.price,
    category: p.categories?.[0] || 'Uncategorized',
  }));

  const postPages: TopPage[] = posts.map(p => ({
    page: `/blog/${p.slug}`,
    title: p.title,
    type: 'post' as const,
    category: p.categories?.[0] || 'Uncategorized',
  }));

  const allPages: TopPage[] = [...productPages, ...postPages];

  // ── Affiliate Sources (from real product external_urls) ──
  const sourceMap = new Map<string, { count: number; totalPrice: number }>();
  products.forEach(p => {
    if (!p.external_url) return;
    const source = extractSource(p.external_url);
    const existing = sourceMap.get(source) || { count: 0, totalPrice: 0 };
    existing.count++;
    existing.totalPrice += p.price || 0;
    sourceMap.set(source, existing);
  });

  const sourceColors: Record<string, string> = {
    Amazon: '#FF9900',
    eBay: '#E53238',
    AliExpress: '#FF4747',
    Sweetwater: '#DA291C',
    'B&H Photo': '#0073CF',
    'Plugin Boutique': '#6C5CE7',
  };

  const affiliateSources: AffiliateSource[] = Array.from(sourceMap.entries())
    .map(([source, data]) => ({
      source,
      productCount: data.count,
      avgPrice: data.totalPrice / data.count,
      color: sourceColors[source] || C.accent,
    }))
    .sort((a, b) => b.productCount - a.productCount);

  // ── Category Summary ──
  const categorySummary: CategorySummary[] = productCategories.map((cat: any) => ({
    name: cat.name,
    slug: cat.slug,
    productCount: cat.count || 0,
    postCount: posts.filter((p: any) => p.categories?.some((c: string) => c.includes(cat.name))).length,
  }));

  // ── Price Distribution (for chart) ──
  const priceRanges = [
    { label: '$0–$100', min: 0, max: 100, color: C.success },
    { label: '$100–$250', min: 100, max: 250, color: C.accent },
    { label: '$250–$500', min: 250, max: 500, color: C.info },
    { label: '$500–$1000', min: 500, max: 1000, color: C.purple },
    { label: '$1000+', min: 1000, max: Infinity, color: C.warning },
  ];
  const priceDistribution = priceRanges.map(r => ({
    ...r,
    count: products.filter(p => (p.price || 0) >= r.min && (p.price || 0) < r.max).length,
  }));

  // ── Badge Distribution ──
  const badgeCounts = new Map<string, number>();
  products.forEach(p => {
    const badge = p.badge || 'None';
    badgeCounts.set(badge, (badgeCounts.get(badge) || 0) + 1);
  });
  const badgeDistribution = Array.from(badgeCounts.entries())
    .map(([badge, count]) => ({ badge, count }))
    .sort((a, b) => b.count - a.count);

  // ── Posts by Month ──
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const postsByMonth = months.map((month, i) => ({
    month,
    count: posts.filter(p => {
      if (!p.date) return false;
      const d = new Date(p.date);
      return d.getMonth() === i && d.getFullYear() === currentYear;
    }).length,
  }));

  return {
    stats,
    allPages,
    productPages,
    postPages,
    affiliateSources,
    categorySummary,
    priceDistribution,
    badgeDistribution,
    postsByMonth,
    totalProducts,
    totalPosts,
    totalCategories,
    inStockProducts,
    featuredProducts,
    avgProductPrice,
    productsThisMonth,
    postsThisMonth,
  };
}

// ─── SVG Chart Components ────────────────────────────────────────

function Sparkline({ data, width = 600, height = 120, color = C.accent }: { data: number[]; width?: number; height?: number; color?: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 4;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const step = innerW / (data.length - 1);
  const points = data.map((v, i) => `${pad + i * step},${pad + innerH - ((v - min) / range) * innerH}`).join(' ');
  const areaPoints = `${pad},${pad + innerH} ${points} ${pad + innerW},${pad + innerH}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#sparkGrad)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={pad + i * step} cy={pad + innerH - ((v - min) / range) * innerH} r={i === data.length - 1 ? 3.5 : 0} fill={color} />
      ))}
    </svg>
  );
}

function HorizontalBarChart({ data, width = 400, height = 32 }: { data: { label: string; value: number; max: number; color: string; display: string }[]; width?: number; height?: number }) {
  return (
    <svg width="100%" height={data.length * (height + 12)} viewBox={`0 0 ${width} ${data.length * (height + 12)}`} style={{ overflow: 'visible' }}>
      {data.map((d, i) => {
        const y = i * (height + 12);
        const barW = (d.value / d.max) * (width - 120);
        return (
          <g key={i}>
            <text x={0} y={y + height / 2 + 4} fill={C.secondary} fontSize="11" fontWeight="600">{d.label}</text>
            <rect x={120} y={y + 6} width={Math.max(barW, 2)} height={height - 12} rx={4} fill={d.color} opacity="0.85" />
            <text x={124 + barW} y={y + height / 2 + 4} fill={C.text} fontSize="11" fontWeight="700">{d.display || d.value.toLocaleString()}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ data, size = 160 }: { data: { name: string; value: number; color: string }[]; size?: number }) {
  const radius = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  const total = data.reduce((a, d) => a + d.value, 0);
  let cumAngle = -90;

  const arcs = data.map(d => {
    const angle = (d.value / total) * 360;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const largeArc = angle > 180 ? 1 : 0;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const labelAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
    const labelR = radius * 0.65;
    const lx = cx + labelR * Math.cos(labelAngle);
    const ly = cy + labelR * Math.sin(labelAngle);
    return {
      path: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      color: d.color,
      name: d.name,
      value: d.value,
      percentage: Math.round((d.value / total) * 100),
      lx, ly,
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((arc, i) => (
        <g key={i}>
          <path d={arc.path} fill="none" stroke={arc.color} strokeWidth="18" strokeLinecap="round" opacity="0.9" />
          <text x={arc.lx} y={arc.ly} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="10" fontWeight="700">{arc.percentage}%</text>
        </g>
      ))}
    </svg>
  );
}

function MonthlyTrendChart({ data, width = 500, height = 140 }: { data: { month: string; value: number }[]; width?: number; height?: number }) {
  const max = Math.max(...data.map(d => d.value));
  const pad = { top: 10, bottom: 24, left: 8, right: 8 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const step = innerW / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => `${pad.left + i * step},${pad.top + innerH - (d.value / Math.max(max, 1)) * innerH}`).join(' ');
  const areaPoints = `${pad.left},${pad.top + innerH} ${points} ${pad.left + innerW},${pad.top + innerH}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={pad.left} y1={pad.top + innerH * (1 - f)} x2={pad.left + innerW} y2={pad.top + innerH * (1 - f)} stroke={C.border} strokeWidth="0.5" strokeDasharray={f === 0 ? '0' : '4 4'} />
      ))}
      <polygon points={areaPoints} fill="url(#trendGrad)" />
      <polyline points={points} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={pad.left + i * step} cy={pad.top + innerH - (d.value / Math.max(max, 1)) * innerH} r="3" fill="#22c55e" />
          <text x={pad.left + i * step} y={height - 4} textAnchor="middle" fill={C.muted} fontSize="9" fontWeight="500">{d.month}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────

function SectionCard({ title, children, extra }: { title: string; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: C.text }}>{title}</h3>
        {extra}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ChangeBadge({ value }: { value: string }) {
  const isPositive = value.startsWith('+') || value.startsWith('↑');
  const isNeutral = value.startsWith('No ') || value.includes('·');
  return (
    <span style={{
      fontSize: '0.6875rem', fontWeight: 600,
      color: isNeutral ? C.secondary : isPositive ? C.success : C.muted,
      background: isNeutral ? 'rgba(144,144,160,0.08)' : isPositive ? 'rgba(34,197,94,0.1)' : 'rgba(90,90,106,0.1)',
      padding: '0.125rem 0.5rem', borderRadius: '6px',
      border: `1px solid ${isNeutral ? 'rgba(144,144,160,0.15)' : isPositive ? 'rgba(34,197,94,0.2)' : 'rgba(90,90,106,0.2)'}`,
    }}>
      {value}
    </span>
  );
}

function PlaceholderCard({ title, description, action }: { title: string; description: string; action: string }) {
  return (
    <div style={{
      padding: '2rem', background: C.card, borderRadius: '16px',
      border: `1px solid ${C.border}`, textAlign: 'center',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: `${C.accent}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1rem',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: C.text, marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.81rem', color: C.muted, marginBottom: '1rem', lineHeight: 1.5 }}>{description}</p>
      <div style={{
        display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '8px',
        background: `${C.accent}10`, border: `1px solid ${C.accent}30`,
        fontSize: '0.75rem', fontWeight: 600, color: C.accent,
      }}>
        {action}
      </div>
    </div>
  );
}

// ─── CSV Export ──────────────────────────────────────────────────
function exportCSV(data: ReturnType<typeof computeRealData>) {
  const rows: string[][] = [];

  rows.push(['SSZ Analytics Dashboard Export']);
  rows.push(['Generated', new Date().toISOString()]);
  rows.push([]);

  rows.push(['Overview Stats']);
  rows.push(['Metric', 'Value', 'Note']);
  data.stats.forEach(s => rows.push([s.label, s.value, s.change]));
  rows.push([]);

  rows.push(['Products']);
  rows.push(['Name', 'Slug', 'Price', 'In Stock', 'Featured', 'Badge', 'Category', 'External URL']);
  (productsData as any[]).forEach(p => rows.push([
    p.short_name || p.name, p.slug, `$${p.price}`, p.in_stock ? 'Yes' : 'No',
    p.featured ? 'Yes' : 'No', p.badge || '', p.categories?.[0] || '', p.external_url || '',
  ]));
  rows.push([]);

  rows.push(['Blog Posts']);
  rows.push(['Title', 'Slug', 'Date', 'Categories']);
  (postsData as any[]).forEach(p => rows.push([
    p.title, p.slug, p.date || '', (p.categories || []).join('; '),
  ]));
  rows.push([]);

  rows.push(['Affiliate Sources']);
  rows.push(['Source', 'Product Count', 'Avg Price']);
  data.affiliateSources.forEach(s => rows.push([s.source, String(s.productCount), `$${s.avgPrice.toFixed(2)}`]));
  rows.push([]);

  rows.push(['Categories']);
  rows.push(['Name', 'Slug', 'Product Count']);
  data.categorySummary.forEach(c => rows.push([c.name, c.slug, String(c.productCount)]));

  const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ssz-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Main Page ───────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  const data = useMemo(() => computeRealData(), []);

  const handleExport = useCallback(() => {
    exportCSV(data);
  }, [data]);

  const rangeButtons: { label: string; value: DateRange }[] = [
    { label: 'Overview', value: '30d' },
    { label: 'Products', value: '7d' },
    { label: 'Content', value: '90d' },
    { label: 'All Data', value: 'all' },
  ];

  // Bar chart data for affiliate sources
  const affMax = Math.max(...data.affiliateSources.map(s => s.productCount), 1);
  const affBarData = data.affiliateSources.map(s => ({
    label: s.source,
    value: s.productCount,
    max: affMax,
    color: s.color,
    display: `${s.productCount} products`,
  }));

  // Bar chart data for price distribution
  const priceMax = Math.max(...data.priceDistribution.map(r => r.count), 1);
  const priceBarData = data.priceDistribution.map(r => ({
    label: r.label,
    value: r.count,
    max: priceMax,
    color: r.color,
    display: `${r.count} products`,
  }));

  // Donut chart data for badge distribution
  const badgeDonutData = data.badgeDistribution.map((b, i) => ({
    name: b.badge,
    value: b.count,
    color: [C.accent, C.success, C.info, C.purple, C.warning][i % 5],
  }));

  // Monthly posts trend
  const monthlyPostsTrend = data.postsByMonth.map(d => ({ month: d.month, value: d.count }));

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem', color: C.text }}>
            Analytics Dashboard
          </h1>
          <p style={{ color: C.muted, fontSize: '0.875rem' }}>Real data from {data.totalProducts} products, {data.totalPosts} posts, {data.totalCategories} categories</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {rangeButtons.map(btn => (
            <button
              key={btn.value}
              onClick={() => setDateRange(btn.value)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.812rem', fontWeight: 600,
                border: `1px solid ${dateRange === btn.value ? C.accent : C.border}`,
                background: dateRange === btn.value ? 'rgba(212,168,67,0.1)' : 'transparent',
                color: dateRange === btn.value ? C.accent : C.secondary,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {btn.label}
            </button>
          ))}
          <button
            onClick={handleExport}
            style={{
              padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.81rem', fontWeight: 600,
              border: `1px solid ${C.border}`, background: C.card, color: C.text,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {data.stats.map((stat, i) => (
          <div key={i} style={{
            padding: '1.25rem', background: C.card, borderRadius: '16px',
            border: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '70px', height: '70px',
              background: `radial-gradient(circle at top right, ${C.accent}10, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: `${C.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '0.75rem',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={stat.icon} />
              </svg>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, letterSpacing: '-0.02em', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.375rem' }}>
              <span style={{ fontSize: '0.75rem', color: C.muted }}>{stat.label}</span>
              <ChangeBadge value={stat.change} />
            </div>
          </div>
        ))}
      </div>

      {/* Row 1: Traffic Placeholder + Top Pages */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Traffic Overview — Placeholder */}
        <PlaceholderCard
          title="Traffic Overview"
          description="Connect Google Analytics to see visitor counts, page views, bounce rates, and session duration."
          action="Setup Guide: Add GA4 tracking ID to site config"
        />

        {/* Top Pages — Real product/post list */}
        <SectionCard title={`Top Pages (${data.allPages.length})`} extra={<span style={{ fontSize: '0.75rem', color: C.muted }}>Products + Posts</span>}>
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {data.allPages.slice(0, 10).map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.5rem', borderBottom: `1px solid ${C.border}40` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.81rem', fontWeight: 500, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.title}>{p.title}</div>
                  <div style={{ fontSize: '0.6875rem', color: C.muted, marginTop: '0.125rem' }}>
                    {p.page}
                    {p.price ? <span style={{ color: C.accent, marginLeft: '0.5rem' }}>${p.price}</span> : null}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.625rem', fontWeight: 600, marginLeft: '0.75rem',
                  color: p.type === 'product' ? C.accent : C.info,
                  background: p.type === 'product' ? `${C.accent}10` : `${C.info}10`,
                  padding: '0.125rem 0.375rem', borderRadius: '4px',
                }}>
                  {p.type === 'product' ? 'GEAR' : 'BLOG'}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Row 2: Affiliate Sources + Price Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Affiliate Performance — Real sources from products */}
        <SectionCard
          title="Affiliate Sources"
          extra={<span style={{ fontSize: '0.75rem', color: C.muted }}>{data.affiliateSources.length} sources from product URLs</span>}
        >
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Products', value: data.totalProducts.toString(), color: C.text },
                { label: 'In Stock', value: data.inStockProducts.toString(), color: C.success },
                { label: 'Affiliate Sources', value: data.affiliateSources.length.toString(), color: C.accent },
                { label: 'Avg Price', value: `$${data.avgProductPrice.toFixed(2)}`, color: C.info },
              ].map((m, i) => (
                <div key={i} style={{ padding: '1rem', background: C.tertiary, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: '0.6875rem', color: C.muted, marginBottom: '0.375rem' }}>{m.label}</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: (m as any).color || C.accent }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.75rem', color: C.muted, marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Products by Source</div>
            <HorizontalBarChart data={affBarData} width={400} height={30} />

            {/* Source table */}
            <table style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.81rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Source', 'Products', 'Avg Price', 'Est. Revenue'].map(h => (
                    <th key={h} style={{ padding: '0.625rem 0.75rem', textAlign: 'left', color: C.muted, fontWeight: 600, fontSize: '0.6875rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.affiliateSources.map((s, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}40` }}>
                    <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                      <span style={{ color: C.text, fontWeight: 600 }}>{s.source}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: C.secondary }}>{s.productCount}</td>
                    <td style={{ padding: '0.75rem', color: C.secondary }}>${s.avgPrice.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem', color: C.muted, fontStyle: 'italic' }}>Set up tracking</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Price Distribution + Badge Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <SectionCard title="Price Distribution">
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <HorizontalBarChart data={priceBarData} width={400} height={28} />
            </div>
          </SectionCard>

          <SectionCard title="Product Badges" extra={<span style={{ fontSize: '0.75rem', color: C.muted }}>{data.badgeDistribution.length} types</span>}>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <DonutChart data={badgeDonutData} size={160} />
              <div style={{ width: '100%' }}>
                {data.badgeDistribution.map((b, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: i < data.badgeDistribution.length - 1 ? `1px solid ${C.border}40` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: [C.accent, C.success, C.info, C.purple, C.warning][i % 5], display: 'inline-block' }} />
                      <span style={{ fontSize: '0.81rem', color: C.text, fontWeight: 500 }}>{b.badge}</span>
                    </div>
                    <span style={{ fontSize: '0.81rem', color: C.secondary, fontWeight: 700 }}>{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Row 3: Search Placeholder + Content Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Search Performance — Placeholder */}
        <PlaceholderCard
          title="Search Performance"
          description="Connect Google Search Console to see impressions, clicks, CTR, and average position for your top queries."
          action="Setup Guide: Verify site in GSC and link API"
        />

        {/* Posts by Month */}
        <SectionCard title={`Posts by Month (${currentYear()})`} extra={<span style={{ fontSize: '0.75rem', color: C.muted }}>{data.postsByMonth.reduce((a, b) => a + b.count, 0)} total</span>}>
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <MonthlyTrendChart data={monthlyPostsTrend} width={400} height={140} />
          </div>
        </SectionCard>
      </div>

      {/* Row 4: Category Overview */}
      <SectionCard title="Category Overview" extra={<span style={{ fontSize: '0.75rem', color: C.muted }}>{data.categorySummary.length} product categories</span>}>
        <div style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            {data.categorySummary.map((cat, i) => (
              <div key={i} style={{ padding: '1rem', background: C.tertiary, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '0.6875rem', color: C.muted, marginBottom: '0.375rem' }}>{cat.name}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: C.accent }}>{cat.productCount}</div>
                <div style={{ fontSize: '0.6875rem', color: C.secondary }}>products</div>
                {cat.postCount > 0 && (
                  <div style={{ fontSize: '0.625rem', color: C.info, marginTop: '0.25rem' }}>{cat.postCount} posts</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Full-width All Pages Table */}
      <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
        <SectionCard title="All Pages" extra={<span style={{ fontSize: '0.75rem', color: C.muted }}>{data.allPages.length} total · estimated views</span>}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.81rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.tertiary }}>
                  {['Type', 'Page', 'Title', 'Category', 'Price'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: C.muted, fontWeight: 600, fontSize: '0.6875rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.allPages.map((p, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}30`, transition: 'background 0.15s' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        fontSize: '0.625rem', fontWeight: 700,
                        color: p.type === 'product' ? C.accent : C.info,
                        background: p.type === 'product' ? `${C.accent}12` : `${C.info}12`,
                        padding: '0.125rem 0.5rem', borderRadius: '4px',
                      }}>
                        {p.type === 'product' ? 'GEAR' : 'BLOG'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: C.accent, fontWeight: 500 }}>{p.page}</td>
                    <td style={{ padding: '0.75rem 1rem', color: C.text, fontWeight: 500 }}>{p.title}</td>
                    <td style={{ padding: '0.75rem 1rem', color: C.secondary, fontSize: '0.75rem' }}>{p.category}</td>
                    <td style={{ padding: '0.75rem 1rem', color: p.price ? C.success : C.muted }}>
                      {p.price ? `$${p.price.toFixed(2)}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function currentYear() {
  return new Date().getFullYear();
}
