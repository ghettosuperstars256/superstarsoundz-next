import fs from 'fs';
import path from 'path';
import Link from 'next/link';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');
const POSTS_FILE = path.join(process.cwd(), 'src', 'data', 'posts.json');
const PAGES_FILE = path.join(process.cwd(), 'src', 'data', 'pages.json');

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
  featured: boolean;
  badge: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image: string;
  author: string;
  status: string;
  meta_description: string;
  tags: string[];
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

function getWordCount(html: string): number {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; stock?: string; sort?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const perPage = 12;

  const allProducts: Product[] = loadJSON(PRODUCTS_FILE);
  const allPosts: Post[] = loadJSON(POSTS_FILE);

  // Build category list from products
  const categorySet = new Set<string>();
  allProducts.forEach(p => p.categories?.forEach(c => categorySet.add(c)));
  const categories = [...categorySet].sort();

  // Filter products
  let products = [...allProducts];

  if (params.search) {
    const q = params.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.short_name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.categories.some(c => c.toLowerCase().includes(q))
    );
  }

  if (params.category) {
    products = products.filter(p => p.categories.some(c => c.toLowerCase().includes(params.category!.toLowerCase())));
  }

  if (params.stock === 'in') {
    products = products.filter(p => p.in_stock);
  } else if (params.stock === 'out') {
    products = products.filter(p => !p.in_stock);
  }

  // Sort
  switch (params.sort) {
    case 'price-asc': products.sort((a, b) => a.price - b.price); break;
    case 'price-desc': products.sort((a, b) => b.price - a.price); break;
    case 'name': products.sort((a, b) => a.short_name.localeCompare(b.short_name)); break;
    case 'newest': products.sort((a, b) => b.id - a.id); break;
    default: products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  const totalPages = Math.ceil(products.length / perPage);
  const paginated = products.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Stats
  const avgPrice = allProducts.length > 0 ? allProducts.reduce((s, p) => s + p.price, 0) / allProducts.length : 0;
  const inStock = allProducts.filter(p => p.in_stock).length;
  const featured = allProducts.filter(p => p.featured).length;

  // Related posts count per product
  const getRelatedPosts = (product: Product) => {
    return allPosts.filter(post =>
      post.title.toLowerCase().includes(product.categories[0]?.toLowerCase() || '') ||
      post.content.toLowerCase().includes(product.short_name.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase())
    ).length;
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Products</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{allProducts.length} products in catalog</p>
        </div>
        <Link href="/dashboard/scraper" className="btn-primary" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>
          Scrape New Products
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Products', value: allProducts.length, color: '#D4A843', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
          { label: 'In Stock', value: inStock, color: '#22c55e', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Avg Price', value: `$${avgPrice.toFixed(0)}`, color: '#3b82f6', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
          { label: 'Featured', value: featured, color: '#f59e0b', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '1rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="1.5"><path d={s.icon} /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <form method="GET" style={{ display: 'flex', gap: '0.75rem', flex: 1, flexWrap: 'wrap' }}>
          <input type="text" name="search" defaultValue={params.search || ''} placeholder="Search products..."
            style={{ flex: 1, minWidth: '200px', padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }} />
          <select name="category" defaultValue={params.category || ''}
            style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="stock" defaultValue={params.stock || ''}
            style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }}>
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <select name="sort" defaultValue={params.sort || ''}
            style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }}>
            <option value="">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
            <option value="newest">Newest First</option>
          </select>
          <button type="submit" className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.625rem 1rem' }}>Apply</button>
        </form>
      </div>

      {/* Products Grid */}
      {paginated.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No products found matching your filters.</p>
          <Link href="/dashboard/scraper" className="btn-primary" style={{ fontSize: '0.8125rem' }}>Scrape Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {paginated.map(product => {
            const wordCount = getWordCount(product.description);
            const relatedPosts = getRelatedPosts(product);
            return (
              <div key={product.id} style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                overflow: 'hidden', transition: 'all 0.15s', position: 'relative',
              }}>
                {product.featured && (
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 1 }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>FEATURED</span>
                  </div>
                )}

                {/* Image */}
                <div style={{ height: '160px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.short_name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5a5a6a" strokeWidth="1"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem' }}>
                  {/* Categories */}
                  <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    {product.categories.slice(0, 2).map(cat => (
                      <span key={cat} style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem', borderRadius: '4px', background: 'rgba(212,168,67,0.1)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.2)' }}>{cat}</span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.375rem', lineHeight: 1.3 }}>
                    <a href={`/gear/${product.slug}`} target="_blank" style={{ color: '#f0f0f2', textDecoration: 'none' }}>{product.short_name}</a>
                  </h3>

                  {/* Description */}
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.short_description}
                  </p>

                  {/* Meta row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#D4A843' }}>${product.price.toFixed(2)}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.6875rem', color: product.in_stock ? '#22c55e' : '#ef4444' }}>
                        {product.in_stock ? '● In Stock' : '● Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Content health */}
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    <span style={{ color: wordCount >= 100 ? '#22c55e' : '#f59e0b' }}>{wordCount} words</span>
                    <span>·</span>
                    <span>{relatedPosts} related posts</span>
                    {product.badge && <><span>·</span><span style={{ color: '#D4A843' }}>{product.badge}</span></>}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a href={`/gear/${product.slug}`} target="_blank" className="btn-ghost" style={{ flex: 1, fontSize: '0.75rem', padding: '0.375rem', textAlign: 'center' }}>View Page</a>
                    <a href={product.external_url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ flex: 1, fontSize: '0.75rem', padding: '0.375rem', textAlign: 'center', color: '#D4A843' }}>Affiliate Link</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.375rem', marginTop: '1.5rem' }}>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(page => (
            <Link key={page} href={`/dashboard/products?page=${page}${params.search ? `&search=${params.search}` : ''}${params.category ? `&category=${params.category}` : ''}${params.stock ? `&stock=${params.stock}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}
              className="btn-ghost" style={{
                padding: '0.375rem 0.75rem', fontSize: '0.8125rem',
                background: page === currentPage ? 'var(--accent-dim)' : 'transparent',
                color: page === currentPage ? 'var(--accent)' : undefined,
              }}>{page}</Link>
          ))}
        </div>
      )}
    </div>
  );
}
