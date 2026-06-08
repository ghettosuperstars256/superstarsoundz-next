import Link from 'next/link';
import products from '@/data/products.json';
import stats from '@/data/stats.json';
import postCategories from '@/data/post-categories.json';
import productCategories from '@/data/product-categories.json';

export default function HomePage() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);
  const activePostCats = postCategories.filter(c => c.count > 0).slice(0, 6);

  return (
    <>
      {/* Hero — enhanced with animated gradient */}
      <section className="hero" style={{ minHeight: '550px' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '5rem 0' }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', borderRadius: '100px', border: '1px solid var(--accent)', background: 'var(--accent-dim)', marginBottom: '1.5rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em' }}>TRUSTED BY AUDIO PROFESSIONALS</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.25rem, 6vw, 3.75rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Professional Sound Gear<br />
              <span className="text-accent">Curated For Pros</span>
            </h1>
            <p className="text-secondary" style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '500px', lineHeight: 1.7 }}>
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
      <section>
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
              <p className="label" style={{ marginBottom: '0.5rem' }}>Browse</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Shop by Category</h2>
            </div>
            <Link href="/gear" className="text-accent" style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              View All →
            </Link>
          </div>
          <div className="grid-4">
            {productCategories.map(cat => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="card category-card" style={{ padding: '1.5rem', display: 'block', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-glow)', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', position: 'relative', zIndex: 1 }}>{cat.name}</h3>
                <p className="text-muted" style={{ fontSize: '0.75rem', position: 'relative', zIndex: 1 }}>{cat.count} product{cat.count !== 1 ? 's' : ''}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gear */}
      <section className="section bg-secondary">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <p className="label" style={{ marginBottom: '0.5rem' }}>Top Picks</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured Gear</h2>
            </div>
            <Link href="/gear" className="text-accent" style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>No Image</span>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <p className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                    {product.categories[0]?.replace('Shop: ', '') || 'Gear'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.375rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9l-3 1.5.5-3.5L1 4.5 4.5 4z" fill={i < 4 ? 'var(--accent)' : 'var(--border)'} />
                      </svg>
                    ))}
                    <span className="text-muted" style={{ fontSize: '0.6875rem', marginLeft: '0.25rem' }}>(4.0)</span>
                  </div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.short_name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-accent" style={{ fontSize: '1rem', fontWeight: 700 }}>${product.price}</span>
                    <span className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
              <p className="label" style={{ marginBottom: '0.5rem' }}>Learn</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Buying Guides</h2>
            </div>
            <Link href="/blog" className="text-accent" style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              All Guides →
            </Link>
          </div>
          <div className="grid-3">
            {activePostCats.map(cat => (
              <Link key={cat.slug} href="/blog" className="card" style={{ padding: '1.5rem', display: 'block' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.375rem' }}>{cat.name}</h3>
                <p className="text-muted" style={{ fontSize: '0.75rem' }}>{cat.count} guide{cat.count !== 1 ? 's' : ''}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="section bg-secondary">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="label" style={{ marginBottom: '0.5rem' }}>Why Trust Us</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Loved by Audio Professionals</h2>
          </div>
          <div className="grid-3">
            {[
              { name: 'Marcus D.', role: 'Studio Producer', text: 'Superstar Soundz helped me outfit my entire home studio. The guides are thorough and genuinely unbiased.', rating: 5 },
              { name: 'Sarah K.', role: 'DJ & Performer', text: 'Finally a gear site that doesn\'t just push the most expensive stuff. Their budget picks are actually great.', rating: 5 },
              { name: 'James W.', role: 'Podcast Engineer', text: 'The audio interface buying guide saved me hours of research. Direct comparisons with real-world testing.', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.125rem', marginBottom: '0.75rem' }}>
                  {[...Array(t.rating)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9l-3 1.5.5-3.5L1 4.5 4.5 4z" fill="var(--accent)" />
                    </svg>
                  ))}
                </div>
                <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>"{t.text}"</p>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="bg-accent-dim border-accent" style={{ borderRadius: '12px', padding: '3rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Get Gear Deals in Your Inbox</h2>
            <p className="text-secondary" style={{ marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
              Join 2,000+ audio professionals. Weekly roundups of the best deals, new gear releases, and buying guides.
            </p>
            <Link href="/contact" className="btn-primary">Get Started →</Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section bg-secondary" style={{ paddingTop: 0 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Find Your Perfect Sound</h2>
          <p className="text-secondary" style={{ marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
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
