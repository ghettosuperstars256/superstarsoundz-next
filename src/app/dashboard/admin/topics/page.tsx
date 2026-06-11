import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');
const POSTS_FILE = path.join(process.cwd(), 'src', 'data', 'posts.json');

interface Product {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  price: number;
  image: string;
  categories: string[];
  short_description: string;
  description: string;
  external_url: string;
  in_stock: boolean;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  tags: string[];
}

interface TrendingTopic {
  keyword: string;
  productCount: number;
  postCount: number;
  avgPrice: number;
  priceRange: string;
  relatedProducts: Product[];
  relatedPosts: Post[];
  categories: string[];
  color: string;
}

function loadJSON(file: string): any[] {
  try {
    if (!fs.existsSync(file)) return [];
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function generateTrendingTopics(): TrendingTopic[] {
  const products: Product[] = loadJSON(PRODUCTS_FILE);
  const posts: Post[] = loadJSON(POSTS_FILE);

  // Build keyword map from product categories and post tags/categories
  const topicMap = new Map<string, { products: Product[]; posts: Post[]; categories: Set<string> }>();

  // Index products by category
  products.forEach(p => {
    p.categories.forEach(cat => {
      const key = cat.toLowerCase();
      if (!topicMap.has(key)) topicMap.set(key, { products: [], posts: [], categories: new Set() });
      topicMap.get(key)!.products.push(p);
      topicMap.get(key)!.categories.add(cat);
    });

    // Also index by significant words in name
    const words = p.short_name.split(/\s+/).filter(w => w.length > 3);
    words.forEach(w => {
      const key = w.toLowerCase().replace(/[^a-z]/g, '');
      if (key.length > 3) {
        if (!topicMap.has(key)) topicMap.set(key, { products: [], posts: [], categories: new Set() });
        if (!topicMap.get(key)!.products.find(pp => pp.id === p.id)) {
          topicMap.get(key)!.products.push(p);
        }
      }
    });
  });

  // Index posts by category and tags
  posts.forEach(p => {
    if (p.category) {
      const key = p.category.toLowerCase();
      if (!topicMap.has(key)) topicMap.set(key, { products: [], posts: [], categories: new Set() });
      topicMap.get(key)!.posts.push(p);
    }
    (p.tags || []).forEach(tag => {
      const key = tag.toLowerCase();
      if (!topicMap.has(key)) topicMap.set(key, { products: [], posts: [], categories: new Set() });
      if (!topicMap.get(key)!.posts.find(pp => pp.id === p.id)) {
        topicMap.get(key)!.posts.push(p);
      }
    });
  });

  const colors = ['#D4A843', '#22c55e', '#3b82f6', '#ef4444', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];

  // Convert to trending topics, sorted by total content count
  return Array.from(topicMap.entries())
    .filter(([_, data]) => data.products.length > 0 || data.posts.length > 0)
    .map(([keyword, data], i) => {
      const prices = data.products.map(p => p.price).filter(p => p > 0);
      const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

      return {
        keyword,
        productCount: data.products.length,
        postCount: data.posts.length,
        avgPrice,
        priceRange: minPrice > 0 ? `$${minPrice.toFixed(0)} — $${maxPrice.toFixed(0)}` : '—',
        relatedProducts: data.products.slice(0, 5),
        relatedPosts: data.posts.slice(0, 3),
        categories: [...data.categories],
        color: colors[i % colors.length],
      };
    })
    .sort((a, b) => (b.productCount + b.postCount) - (a.productCount + a.postCount))
    .slice(0, 16);
}

function Sparkline({ data, color, width = 80, height = 24 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * height} r="2.5" fill={color} />
    </svg>
  );
}

export default async function TopicsPage() {
  const topics = generateTrendingTopics();
  const products: Product[] = loadJSON(PRODUCTS_FILE);
  const posts: Post[] = loadJSON(POSTS_FILE);

  // Generate sparkline data based on product/post counts (simulated trend)
  const generateTrend = (base: number) => {
    const trend: number[] = [];
    let val = 30 + Math.random() * 20;
    for (let j = 0; j < 12; j++) {
      val += (Math.random() - 0.4) * 15 + (base > 2 ? 2 : -1);
      val = Math.max(10, Math.min(100, val));
      trend.push(Math.round(val));
    }
    return trend;
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>Trending Topics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Keywords and categories from {products.length} products and {posts.length} posts
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D4A843' }}>{topics.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Topics</div>
        </div>
        <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>{products.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Products Indexed</div>
        </div>
        <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6' }}>{posts.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blog Posts</div>
        </div>
        <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7' }}>{topics.filter(t => t.productCount > 0 && t.postCount > 0).length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cross-Linked</div>
        </div>
      </div>

      {topics.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No topics found. Add products and posts to generate topic insights.</p>
        </div>
      ) : (
        <>
          {/* Keyword Cloud */}
          <div style={{ marginBottom: '2rem', padding: '2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Topic Cloud</h2>
            <div style={{ textAlign: 'center', lineHeight: 2 }}>
              {topics.sort(() => Math.random() - 0.5).map((topic, i) => {
                const maxCount = Math.max(...topics.map(t => t.productCount + t.postCount));
                const normalized = (topic.productCount + topic.postCount) / maxCount;
                const fontSize = 0.75 + normalized * 1.5;
                const opacity = 0.5 + normalized * 0.5;
                return (
                  <span key={i} style={{
                    display: 'inline-block', fontSize: `${fontSize}rem`, fontWeight: 500 + normalized * 500,
                    color: topic.color, opacity, margin: '0.25rem 0.625rem', cursor: 'pointer',
                    textTransform: 'capitalize',
                  }} title={`${topic.keyword}: ${topic.productCount} products, ${topic.postCount} posts`}>
                    {topic.keyword}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Topic Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
            {topics.map((topic, i) => {
              const trend = generateTrend(topic.productCount);
              return (
                <div key={i} style={{
                  padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, right: 0, width: '80px', height: '80px',
                    background: `radial-gradient(circle at top right, ${topic.color}10, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />

                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                        {topic.keyword}
                      </h3>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {topic.categories.length > 0 ? topic.categories.join(', ') : 'General'}
                      </div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.625rem', borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700,
                      color: topic.color, background: `${topic.color}15`, border: `1px solid ${topic.color}25`,
                    }}>{topic.productCount + topic.postCount} items</div>
                  </div>

                  {/* Sparkline */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <Sparkline data={trend} color={topic.color} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.625rem', color: 'var(--text-faint)' }}>30 days ago</span>
                      <span style={{
                        fontSize: '0.6875rem', fontWeight: 600,
                        color: trend[trend.length - 1] >= trend[0] ? '#22c55e' : '#ef4444',
                      }}>
                        {trend[trend.length - 1] >= trend[0] ? '↑' : '↓'}{Math.abs(trend[trend.length - 1] - trend[0])}%
                      </span>
                      <span style={{ fontSize: '0.625rem', color: 'var(--text-faint)' }}>Today</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem',
                    padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Products</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: topic.color }}>{topic.productCount}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Posts</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: topic.color }}>{topic.postCount}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Avg Price</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: topic.color }}>{topic.avgPrice > 0 ? `$${topic.avgPrice.toFixed(0)}` : '—'}</div>
                    </div>
                  </div>

                  {/* Related products preview */}
                  {topic.relatedProducts.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Top Products</div>
                      {topic.relatedProducts.slice(0, 3).map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0', fontSize: '0.75rem' }}>
                          <a href={`/gear/${p.slug}`} target="_blank" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{p.short_name}</a>
                          <span style={{ color: '#D4A843', fontWeight: 600 }}>${p.price.toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Related posts preview */}
                  {topic.relatedPosts.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Related Posts</div>
                      {topic.relatedPosts.map(p => (
                        <div key={p.id} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0.125rem 0' }}>
                          · {p.title.substring(0, 50)}{p.title.length > 50 ? '...' : ''}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Price range */}
                  {topic.avgPrice > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Price range: <span style={{ color: '#f0f0f2', fontWeight: 600 }}>{topic.priceRange}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a href={`/dashboard/campaigns?keyword=${encodeURIComponent(topic.keyword)}`} className="btn-secondary" style={{ flex: 1, fontSize: '0.8125rem', padding: '0.5rem', textAlign: 'center' }}>
                      Create Campaign
                    </a>
                    <a href={`/dashboard/scraper?keyword=${encodeURIComponent(topic.keyword)}`} className="btn-ghost" style={{ flex: 1, fontSize: '0.8125rem', padding: '0.5rem', textAlign: 'center', color: '#D4A843' }}>
                      Scrape Products
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
