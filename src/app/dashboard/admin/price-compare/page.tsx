import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');

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
}

function loadProducts(): Product[] {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8')) || [];
  } catch {
    return [];
  }
}

export default async function PriceComparePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const catFilter = params.cat || '';

  const allProducts = loadProducts();

  // Get unique categories
  const categorySet = new Set<string>();
  allProducts.forEach(p => p.categories?.forEach(c => categorySet.add(c)));
  const categories = [...categorySet].sort();

  // Filter by category if selected
  let pool = catFilter
    ? allProducts.filter(p => p.categories.some(c => c.toLowerCase().includes(catFilter.toLowerCase())))
    : allProducts;

  // Search within pool
  let results: Product[] = [];
  if (query) {
    const q = query.toLowerCase();
    const keywords = q.split(/\s+/).filter(w => w.length > 2);
    results = pool.filter(p => {
      const searchable = `${p.name} ${p.short_name} ${p.categories.join(' ')}`.toLowerCase();
      return keywords.some(kw => searchable.includes(kw));
    }).sort((a, b) => a.price - b.price);
  }

  const avgPrice = results.length > 0 ? results.reduce((s, p) => s + p.price, 0) / results.length : 0;
  const minPrice = results.length > 0 ? Math.min(...results.map(p => p.price)) : 0;
  const maxPrice = results.length > 0 ? Math.max(...results.map(p => p.price)) : 0;

  // Group by category for browse view
  const categoryGroups = new Map<string, Product[]>();
  pool.forEach(p => {
    const cat = p.categories[0] || 'Other';
    if (!categoryGroups.has(cat)) categoryGroups.set(cat, []);
    categoryGroups.get(cat)!.push(p);
  });

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>Price Comparison</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Compare prices across your product catalog — {allProducts.length} products in {categories.length} categories</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '2rem' }}>
        <form method="GET" style={{ display: 'flex', gap: '0.75rem', maxWidth: '700px' }}>
          <input type="text" name="q" defaultValue={query} placeholder="Search products to compare prices..."
            style={{ flex: 1, padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none' }} />
          <button type="submit" className="btn-primary" style={{ padding: '0.875rem 1.5rem', fontSize: '0.875rem' }}>Compare</button>
        </form>
      </div>

      {/* Category Quick Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <a href="/dashboard/price-compare" style={{
          padding: '0.375rem 0.875rem', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600,
          background: !catFilter ? 'rgba(212,168,67,0.1)' : 'transparent',
          color: !catFilter ? '#D4A843' : '#9090a0',
          border: !catFilter ? '1px solid rgba(212,168,67,0.25)' : '1px solid transparent',
          textDecoration: 'none',
        }}>All Categories</a>
        {categories.map(cat => (
          <a key={cat} href={`/dashboard/price-compare?cat=${encodeURIComponent(cat)}`} style={{
            padding: '0.375rem 0.875rem', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600,
            background: catFilter === cat ? 'rgba(212,168,67,0.1)' : 'transparent',
            color: catFilter === cat ? '#D4A843' : '#9090a0',
            border: catFilter === cat ? '1px solid rgba(212,168,67,0.25)' : '1px solid transparent',
            textDecoration: 'none',
          }}>{cat}</a>
        ))}
      </div>

      {/* Search Results */}
      {query && results.length > 0 && (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D4A843' }}>{results.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Products Found</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>${minPrice.toFixed(2)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lowest Price</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>${maxPrice.toFixed(2)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Highest Price</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6' }}>${avgPrice.toFixed(2)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Price</div>
            </div>
          </div>

          {/* Price spread visualization */}
          <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem' }}>Price Spread</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 700 }}>${minPrice.toFixed(0)}</span>
              <div style={{ flex: 1, height: '8px', background: '#1e1e26', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%', width: '100%',
                  background: 'linear-gradient(90deg, #22c55e, #D4A843, #ef4444)',
                  borderRadius: '4px',
                }} />
                {results.map((p, i) => {
                  const pct = maxPrice > minPrice ? ((p.price - minPrice) / (maxPrice - minPrice)) * 100 : 50;
                  return (
                    <div key={i} style={{
                      position: 'absolute', left: `${pct}%`, top: '-4px', width: '4px', height: '16px',
                      background: '#f0f0f2', borderRadius: '2px', transform: 'translateX(-50%)',
                    }} title={`${p.short_name}: $${p.price}`} />
                  );
                })}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>${maxPrice.toFixed(0)}</span>
            </div>
          </div>

          {/* Results Table */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>PRODUCT</th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CATEGORY</th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>PRICE</th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>VS AVERAGE</th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>LINK</th>
                </tr>
              </thead>
              <tbody>
                {results.map((product, i) => {
                  const diff = product.price - avgPrice;
                  const diffPct = avgPrice > 0 ? ((diff / avgPrice) * 100).toFixed(1) : '0';
                  return (
                    <tr key={product.id} style={{ borderTop: '1px solid var(--border)', background: i === 0 ? 'rgba(34,197,94,0.03)' : undefined }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {product.image ? <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} /> : <span style={{ fontSize: '0.5rem', color: '#5a5a6a' }}>—</span>}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{product.short_name}</div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#D4A843' }}>{product.categories[0] || '—'}</span>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 700, fontSize: '1rem', color: i === 0 ? '#22c55e' : 'var(--accent)' }}>
                        ${product.price.toFixed(2)}
                        {i === 0 && <span className="badge badge-success" style={{ fontSize: '0.625rem', marginLeft: '0.5rem' }}>Best</span>}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 600, color: diff <= 0 ? '#22c55e' : '#ef4444' }}>
                        {diff <= 0 ? '' : '+'}{diffPct}%
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <a href={product.external_url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>View</a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* No results */}
      {query && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No products found for "{query}". Try a different search term.</p>
        </div>
      )}

      {/* Browse by category (no search) */}
      {!query && !catFilter && (
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Browse by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {Array.from(categoryGroups.entries()).map(([cat, products]) => {
              const catAvg = products.reduce((s, p) => s + p.price, 0) / products.length;
              const catMin = Math.min(...products.map(p => p.price));
              const catMax = Math.max(...products.map(p => p.price));
              return (
                <a key={cat} href={`/dashboard/price-compare?cat=${encodeURIComponent(cat)}`} style={{
                  padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)', textDecoration: 'none', display: 'block',
                }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f0f0f2', marginBottom: '0.5rem' }}>{cat}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{products.length} products</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: '#22c55e', fontWeight: 600 }}>${catMin.toFixed(0)}</span>
                    <span style={{ color: 'var(--text-muted)' }}>avg ${catAvg.toFixed(0)}</span>
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>${catMax.toFixed(0)}</span>
                  </div>
                  <div style={{ height: '4px', background: '#1e1e26', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #22c55e, #D4A843, #ef4444)', borderRadius: '2px', opacity: 0.5 }} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Category filtered view (no search) */}
      {!query && catFilter && (
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>{catFilter}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{pool.length} products — search above to compare specific items</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem' }}>
            {pool.sort((a, b) => a.price - b.price).map(p => (
              <div key={p.id} style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{p.short_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.in_stock ? '● In Stock' : '● Out of Stock'}</div>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#D4A843' }}>${p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
