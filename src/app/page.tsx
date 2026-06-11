import Link from 'next/link';
import products from '@/data/products.json';
import posts from '@/data/posts.json';
import postCategories from '@/data/post-categories.json';
import productCategories from '@/data/product-categories.json';

export default function HomePage() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);
  const activePostCats = postCategories.filter(c => c.count > 0).slice(0, 6);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero" style={{ minHeight: '520px', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '3rem 0' }}>
          <div style={{ maxWidth: '800px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: '#D4A843', marginBottom: '1rem' }}>
              Expert Audio Gear Reviews & Buying Guides
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, lineHeight: 1.08, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Find the Perfect Gear.<br />
              <span className="text-accent">Without the Guesswork</span>
            </h1>
            <p className="text-secondary" style={{ fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)', marginBottom: '0.75rem', maxWidth: '600px', lineHeight: 1.7 }}>
              Superstar Soundz helps musicians, DJs, producers, and audio engineers find the best equipment for their needs and budget — with honest reviews, expert buying guides, and free tools.
            </p>
            <p className="text-secondary" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', marginBottom: '2rem', maxWidth: '550px', lineHeight: 1.7 }}>
              We also provide professional audio and visual production services for events of every scale. Whether you need the right microphone or a full-stage production team — we've got you covered.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link href="/gear" className="btn-primary">Shop Gear</Link>
              <Link href="/blog" className="btn-secondary">Read Guides</Link>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l2.5 5 5.5.8-4 3.9.9 5.3L8 13.5 3.1 16l.9-5.3-4-3.9 5.5-.8z" fill="#D4A843"/></svg>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>{products.length}+ Products Reviewed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#D4A843" strokeWidth="1.5"/><path d="M8 5v3l2 1" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>{posts.length} Expert Guides</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="10" rx="2" stroke="#D4A843" strokeWidth="1.5"/><path d="M2 7h12" stroke="#D4A843" strokeWidth="1.5"/></svg>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Free AI Music Tools</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section style={{ padding: '0.5rem 0' }}>
        <div className="container">
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-number">{products.length}</div>
              <div className="stat-label">Products Reviewed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{posts.length}</div>
              <div className="stat-label">Expert Guides</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{productCategories.length}</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6</div>
              <div className="stat-label">Free AI Tools</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPOSITION ===== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            <p className="label" style={{ marginBottom: '0.75rem' }}>Why Superstar Soundz</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Honest Reviews. Expert Advice. Free Tools.
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.8, fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)' }}>
              We cut through the noise and marketing hype to help you make informed decisions. Every recommendation is based on real-world testing, research, and genuine expertise.
            </p>
          </div>
          <div className="grid-4">
            {[
              {
                icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
                title: 'Honest Reviews',
                text: 'No paid placements. No biased recommendations. We tell you what\'s good, what\'s not, and what\'s the best value for your budget.',
              },
              {
                icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
                title: 'Buying Guides',
                text: 'Comprehensive guides that compare top picks, explain key features, and help you choose the right gear for your specific needs.',
              },
              {
                icon: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
                title: 'Free AI Tools',
                text: 'BPM detector, chord identifier, key finder, scale explorer, metronome, and tuner — all free, all browser-based.',
              },
              {
                icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
                title: 'AV Production',
                text: 'Beyond reviews — we provide professional audio and visual production services for events, from intimate sessions to large-scale productions.',
              },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(212, 168, 67, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d={item.icon} stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT TEASER ===== */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="grid-2" style={{ gap: '3rem', alignItems: 'center' }}>
            <div>
              <p className="label" style={{ marginBottom: '0.75rem' }}>Our Story</p>
              <h2 style={{ fontSize: 'clamp(1.375rem, 3.5vw, 2rem)', fontWeight: 800, marginBottom: '1rem' }}>
                Born From a Passion.<br />Built for Musicians.
              </h2>
              <p className="text-secondary" style={{ lineHeight: 1.8, marginBottom: '1rem', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                Superstar Soundz was created by musicians and audio professionals who were tired of biased reviews and affiliate sites that recommend whatever pays the most. We built this site to be different — honest, thorough, and genuinely helpful.
              </p>
              <p className="text-secondary" style={{ lineHeight: 1.8, marginBottom: '1.5rem', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                Our team has spent years working in studios, on stages, and in the field — so when we recommend a product, it's because we've used it or thoroughly researched it. We also provide professional AV production services for events, because great gear deserves great production.
              </p>
              <Link href="/about" className="text-accent" style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Learn More About Us</Link>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[
                  { num: '21', label: 'Products Reviewed' },
                  { num: '20', label: 'Buying Guides' },
                  { num: '10', label: 'Categories' },
                  { num: '100%', label: 'Honest Reviews' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#D4A843' }}>{s.num}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES TEASER ===== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="label" style={{ marginBottom: '0.75rem' }}>What We Offer</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Gear Reviews & Production Services
            </h2>
            <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto', lineHeight: 1.7, fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              We help you find the best audio gear — and when you need professional production, we deliver that too. Two sides of the same expertise.
            </p>
          </div>
          <div className="grid-3">
            {[
              {
                title: 'Buying Guides & Reviews',
                text: 'Honest, thorough reviews of audio equipment — microphones, headphones, studio monitors, DJ controllers, and more. We compare top picks so you don\'t have to.',
                items:['Top Picks by Category', 'Price-to-Performance Analysis', 'Comparison Tables', 'Real-World Testing'],
              },
              {
                title: 'Free AI Music Tools',
                text: 'Browser-based tools for musicians — no downloads, no signups. Detect BPM, identify chords, explore scales, tune your instrument, and more.',
                items: ['BPM Detector', 'Chord Identifier', 'Key Finder', 'Metronome & Tuner'],
              },
              {
                title: 'AV Production Services',
                text: 'Professional audio and visual production for events of every scale — from studio recording sessions to concerts, festivals, and corporate events.',
                items: ['Live Sound Engineering', 'Studio Recording', 'Video Production', 'Event AV & Equipment'],
              },
            ].map((service, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{service.title}</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1rem' }}>{service.text}</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {service.items.map((item, j) => (
                    <li key={j} style={{ fontSize: '0.8125rem', color: '#5a5a6a', padding: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#D4A843', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/services" className="btn-primary">Explore All Services</Link>
          </div>
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY ===== */}
      <section className="section bg-secondary">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p className="label" style={{ marginBottom: '0.5rem' }}>Shop</p>
              <h2 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 800 }}>Professional Audio Gear</h2>
            </div>
            <Link href="/gear" className="text-accent" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              View All
            </Link>
          </div>
          <div className="grid-4">
            {productCategories.map(cat => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="card category-card" style={{ padding: '1.25rem', display: 'block', position: 'relative', overflow: 'hidden', minHeight: '80px' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(212, 168, 67, 0.2)', opacity: 0.5 }} />
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.25rem', position: 'relative', zIndex: 1 }}>{cat.name}</h3>
                <p className="text-muted" style={{ fontSize: '0.75rem', position: 'relative', zIndex: 1 }}>{cat.count} product{cat.count !== 1 ? 's' : ''}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p className="label" style={{ marginBottom: '0.5rem' }}>Top Picks</p>
              <h2 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 800 }}>Featured Products</h2>
            </div>
            <Link href="/gear" className="text-accent" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              View All
            </Link>
          </div>
          <div className="grid-3">
            {displayProducts.map(product => (
              <Link key={product.id} href={`/gear/${product.slug}`} className="card product-card" style={{ position: 'relative', overflow: 'visible' }}>
                {product.badge && (
                  <div style={{
                    position: 'absolute', top: '-8px', right: '1rem', zIndex: 2,
                    padding: '0.25rem 0.625rem', borderRadius: '4px',
                    background: product.badge === 'Best Value' ? 'rgba(34,197,94,0.15)' : product.badge === "Editor's Choice" ? 'rgba(212,168,67,0.15)' : 'rgba(168,85,247,0.15)',
                    color: product.badge === 'Best Value' ? '#22c55e' : product.badge === "Editor's Choice" ? '#D4A843' : '#a855f7',
                    fontSize: '0.625rem', fontWeight: 700,
                  }}>
                    {product.badge}
                  </div>
                )}
                <div className="product-card-image" style={{ borderRadius: '8px 8px 0 0' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.short_name} loading="lazy" />
                  ) : (
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>No Image</span>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <p className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {product.categories[0]?.replace('Shop: ', '') || 'Shop'}
                  </p>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.short_name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-accent" style={{ fontSize: '1rem', fontWeight: 700 }}>${product.price}</span>
                    <span className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600 }}>
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG POSTS ===== */}
      <section className="section bg-secondary">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p className="label" style={{ marginBottom: '0.5rem' }}>Learn</p>
              <h2 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 800 }}>Expert Guides & Insights</h2>
            </div>
            <Link href="/blog" className="text-accent" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              All Posts
            </Link>
          </div>
          <div className="grid-3">
            {activePostCats.map(cat => (
              <Link key={cat.slug} href="/blog" className="card" style={{ padding: '1.25rem', display: 'block' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.25rem' }}>{cat.name}</h3>
                <p className="text-muted" style={{ fontSize: '0.75rem' }}>{cat.count} post{cat.count !== 1 ? 's' : ''}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="bg-accent-dim border-accent" style={{ borderRadius: '12px', padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem)', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Ready to Find Your Perfect Gear?
            </h2>
            <p className="text-secondary" style={{ marginBottom: '1.5rem', fontSize: 'clamp(0.875rem, 2vw, 1rem)', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
              Browse our curated selection, read expert buying guides, or try our free music tools. We're here to help you make the right choice.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/gear" className="btn-primary">Shop All Gear</Link>
              <Link href="/tools" className="btn-secondary">Try Free Tools</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
