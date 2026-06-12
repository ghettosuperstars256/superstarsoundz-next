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
      <section className="hero" style={{ minHeight: '560px', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '3rem 0' }}>
          <div style={{ maxWidth: '820px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: '#D4A843', marginBottom: '1rem' }}>
              Uganda's Premier Audio & Production Company
            </p>
            <h1 style={{ fontSize: 'clamp(2.25rem, 6vw, 3.75rem)', fontWeight: 800, lineHeight: 1.08, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Sound. Vision. Stage.<br />
              <span className="text-accent">Done Right.</span>
            </h1>
            <p className="text-secondary" style={{ fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)', marginBottom: '0.75rem', maxWidth: '620px', lineHeight: 1.7 }}>
              Superstar Soundz is Kampala's trusted partner for professional audio equipment, AV production, and event services — from intimate gatherings to large-scale concerts and festivals.
            </p>
            <p className="text-secondary" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', marginBottom: '2rem', maxWidth: '560px', lineHeight: 1.7 }}>
              We supply world-class gear, run full production, and help you find the right equipment through honest expert reviews. One team. Every event. Any scale.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link href="/services" className="btn-primary">Our Services</Link>
              <Link href="/gear" className="btn-secondary">Browse Equipment</Link>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l2.5 5 5.5.8-4 3.9.9 5.3L8 13.5 3.1 16l.9-5.3-4-3.9 5.5-.8z" fill="#D4A843"/></svg>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Kampala-Based</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#D4A843" strokeWidth="1.5"/><path d="M8 5v3l2 1" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Full Production</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="10" rx="2" stroke="#D4A843" strokeWidth="1.5"/><path d="M2 7h12" stroke="#D4A843" strokeWidth="1.5"/></svg>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>{products.length}+ Products</span>
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
              <div className="stat-label">Products Available</div>
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

      {/* ===== TRUSTED BY ===== */}
      <section style={{ padding: '2rem 0', borderBottom: '1px solid #1e1e26' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>TRUSTED BY EVENT ORGANIZERS & ARTISTS ACROSS UGANDA</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', opacity: 0.5 }}>
            {['Kampala Music Festival', 'Nyege Nyege', 'Camp Pine', 'Blankets & Wine', 'Kampala Symphony'].map((name, i) => (
              <span key={i} style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9090a0', whiteSpace: 'nowrap' }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES OVERVIEW ===== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            <p className="label" style={{ marginBottom: '0.75rem' }}>What We Do</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Everything Your Event Needs
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.8, fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)' }}>
              From equipment supply to full production — we handle the technical side so you can focus on the experience.
            </p>
          </div>
          <div className="grid-4">
            {[
              {
                icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
                title: 'AV Production',
                text: 'Full audio and visual production for concerts, festivals, corporate events, and private functions — from design to live operation.',
                link: '/services',
              },
              {
                icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
                title: 'Equipment Supply',
                text: 'Professional-grade audio equipment, PA systems, mixers, microphones, and lighting — curated and ready for deployment.',
                link: '/gear',
              },
              {
                icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
                title: 'Expert Reviews',
                text: 'Honest, thorough reviews of audio equipment based on real-world use — so you buy the right gear the first time.',
                link: '/blog',
              },
              {
                icon: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
                title: 'Free AI Tools',
                text: 'BPM detector, chord identifier, key finder, scale explorer, metronome, and tuner — free tools for musicians.',
                link: '/tools',
              },
            ].map((item, i) => (
              <Link key={i} href={item.link} className="card" style={{ padding: '1.5rem', display: 'block' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(212, 168, 67, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d={item.icon} stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{item.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT TEASER ===== */}
      <section className="section bg-secondary">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <p className="label" style={{ marginBottom: '0.75rem' }}>Who We Are</p>
              <h2 style={{ fontSize: 'clamp(1.375rem, 3.5vw, 2rem)', fontWeight: 800, marginBottom: '1rem' }}>
                Born in Kampala.<br />Built for Every Stage.
              </h2>
              <p className="text-secondary" style={{ lineHeight: 1.8, marginBottom: '1rem', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                Superstar Soundz is a Ugandan entertainment and production company founded by audio professionals who understand what it takes to deliver world-class sound and visuals — whether it's a corporate event in Kampala or a multi-stage festival.
              </p>
              <p className="text-secondary" style={{ lineHeight: 1.8, marginBottom: '1.5rem', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                We supply professional audio equipment, run full AV production, and share our expertise through honest reviews and free tools. Every product in our shop is something we'd use ourselves.
              </p>
              <Link href="/about" className="text-accent" style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Learn More About Us</Link>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1.5rem' }}>
                {[
                  { num: '24', label: 'Products' },
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

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p className="label" style={{ marginBottom: '0.5rem' }}>Shop</p>
              <h2 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 800 }}>Featured Equipment</h2>
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

      {/* ===== SHOP BY CATEGORY ===== */}
      <section className="section bg-secondary">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p className="label" style={{ marginBottom: '0.5rem' }}>Browse</p>
              <h2 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 800 }}>Shop by Category</h2>
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

      {/* ===== BLOG / GUIDES ===== */}
      <section className="section">
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
              Planning an Event? Need the Right Gear?
            </h2>
            <p className="text-secondary" style={{ marginBottom: '1.5rem', fontSize: 'clamp(0.875rem, 2vw, 1rem)', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
              Whether you need a full production team or the right microphone — we're here to help. Based in Kampala, serving Uganda and beyond.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn-primary">Get a Quote</Link>
              <Link href="/gear" className="btn-secondary">Browse Gear</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
