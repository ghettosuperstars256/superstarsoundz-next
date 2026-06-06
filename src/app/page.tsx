import Link from 'next/link';
import products from '@/data/products.json';
import stats from '@/data/stats.json';
import postCategories from '@/data/post-categories.json';
import productCategories from '@/data/product-categories.json';

const categoryIcons: Record<string, string> = {
  'Microphones': '🎤',
  'Headphones and IEMs': '🎧',
  'Studio Monitors': '🔊',
  'Audio Interfaces': '🎸',
  'DJ Controllers': '🎛️',
  'Mixers': '🎚️',
  'MIDI Controllers': '🎹',
  'PA Systems': '📢',
  'Keyboards and Synthesizers': '🎹',
  'Turntables': '💿',
};

export default function HomePage() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '4rem 0' }}>
          <div style={{ maxWidth: '700px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#D4A843', marginBottom: '1rem' }}>
              Professional Audio Equipment
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Professional Sound Gear<br />
              <span style={{ color: '#D4A843' }}>Curated For Pros</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#888888', marginBottom: '2rem', maxWidth: '500px', lineHeight: 1.6 }}>
              Expert reviews, buying guides, and hand-picked audio equipment for musicians, DJs, producers, and audio engineers.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/gear" className="btn-primary">Shop All Gear</Link>
              <Link href="/blog" className="btn-secondary">Read Buying Guides</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0' }}>
        <div className="container">
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-number">{stats.products}</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.categories}</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.brands}</div>
              <div className="stat-label">Brands</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.posts}</div>
              <div className="stat-label">Buying Guides</div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="section" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#D4A843', marginBottom: '0.5rem' }}>Browse</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Shop by Category</h2>
            </div>
            <Link href="/gear" style={{ fontSize: '0.8125rem', color: '#D4A843', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              View All →
            </Link>
          </div>
          <div className="grid-4">
            {productCategories.map(cat => (
              <Link key={cat.slug} href={`/gear?cat=${cat.slug}`} className="card" style={{ padding: '1.5rem', display: 'block' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                  {categoryIcons[cat.name] || '🔊'}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.75rem', color: '#555555' }}>{cat.count} product{cat.count !== 1 ? 's' : ''}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gear */}
      <section className="section" style={{ background: '#111111' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#D4A843', marginBottom: '0.5rem' }}>Top Picks</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured Gear</h2>
            </div>
            <Link href="/gear" style={{ fontSize: '0.8125rem', color: '#D4A843', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              View All →
            </Link>
          </div>
          <div className="grid-3">
            {displayProducts.map(product => (
              <Link key={product.id} href={`/gear/${product.slug}`} className="card product-card">
                <div className="product-card-image">
                  {product.image ? (
                    <img src={product.image} alt={product.short_name} loading="lazy" />
                  ) : (
                    <div style={{ color: '#555555', fontSize: '0.75rem' }}>No Image</div>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <p style={{ fontSize: '0.6875rem', color: '#D4A843', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                    {product.categories[0]?.replace('Shop: ', '') || 'Gear'}
                  </p>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.short_name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#D4A843' }}>${product.price}</span>
                    <span style={{ fontSize: '0.6875rem', color: '#555555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      View Deal →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Buying Guides */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#D4A843', marginBottom: '0.5rem' }}>Learn</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Buying Guides</h2>
            </div>
            <Link href="/blog" style={{ fontSize: '0.8125rem', color: '#D4A843', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              All Guides →
            </Link>
          </div>
          <div className="grid-3">
            {postCategories.filter(c => c.count > 0).slice(0, 6).map(cat => (
              <Link key={cat.slug} href="/blog" className="card" style={{ padding: '1.5rem', display: 'block' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.375rem' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.75rem', color: '#555555' }}>{cat.count} guide{cat.count !== 1 ? 's' : ''}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: '#111111' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Find Your Perfect Sound</h2>
          <p style={{ color: '#888888', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Browse {stats.products}+ professional audio products across {stats.categories} categories, or read our expert buying guides.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/gear" className="btn-primary">Shop All Gear</Link>
            <Link href="/blog" className="btn-secondary">Read Guides</Link>
          </div>
        </div>
      </section>
    </>
  );
}
