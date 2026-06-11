import type { Metadata } from 'next';
import Link from 'next/link';
import posts from '@/data/posts.json';
import postCategories from '@/data/post-categories.json';

export const metadata: Metadata = {
  title: 'Blog — Expert Guides & Buying Advice | Superstar Soundz',
  description: 'Expert buying guides, gear reviews, and music production tips. Find the best audio equipment for your needs and budget.',
  openGraph: {
    title: 'Blog — Expert Guides & Buying Advice | Superstar Soundz',
    description: 'Expert buying guides, gear reviews, and music production tips.',
    type: 'website',
  },
};

export default function BlogPage() {
  const categoriesWithPosts = postCategories.filter(c => c.count > 0);

  return (
    <>
      {/* Hero */}
      <section style={{ padding: '3rem 0 1.5rem', background: 'linear-gradient(135deg, #0e0e12 0%, #08080a 100%)', borderBottom: '1px solid #1e1e26' }}>
        <div className="container">
          <p className="label" style={{ marginBottom: '0.75rem' }}>Learn</p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' }}>
            Expert Guides & Insights
          </h1>
          <p className="text-secondary" style={{ fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)', lineHeight: 1.7, maxWidth: '600px' }}>
            Honest buying guides, gear reviews, and production tips — written by musicians, for musicians.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section style={{ padding: '1rem 0', borderBottom: '1px solid #1e1e26', background: '#0a0a0e' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '0.25rem' }}>
            <span className="text-muted" style={{ fontSize: '0.6875rem', fontWeight: 600, marginRight: '0.25rem', flexShrink: 0 }}>CATEGORIES</span>
            {categoriesWithPosts.map(cat => (
              <Link
                key={cat.slug}
                href={`#${cat.slug}`}
                style={{
                  padding: '0.375rem 0.875rem', borderRadius: '100px',
                  background: 'rgba(212, 168, 67, 0.08)', color: '#D4A843',
                  fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none',
                  border: '1px solid rgba(212, 168, 67, 0.15)',
                  flexShrink: 0, whiteSpace: 'nowrap',
                  minHeight: '36px', display: 'inline-flex', alignItems: 'center',
                }}
              >
                {cat.name} <span style={{ opacity: 0.6 }}>({cat.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts by Category */}
      <section className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          {categoriesWithPosts.map(cat => {
            const catPosts = posts.filter(p =>
              p.categories.some(c => c.toLowerCase().includes(cat.name.toLowerCase()) || c.toLowerCase().includes(cat.slug.toLowerCase()))
            );
            if (catPosts.length === 0) return null;

            return (
              <div key={cat.slug} id={cat.slug} style={{ marginBottom: '3rem', scrollMarginTop: '5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {cat.name}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#5a5a6a' }}>{catPosts.length} post{catPosts.length !== 1 ? 's' : ''}</span>
                  </h2>
                </div>
                <div className="grid-3">
                  {catPosts.map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="card" style={{ display: 'block', overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s' }}>
                      <div style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#D4A843' }}>
                            {post.categories[0]?.replace('Topic: ', '').replace('Shop: ', '') || 'Guide'}
                          </span>
                          <span style={{ color: '#3a3a48' }}>·</span>
                          <span className="text-muted" style={{ fontSize: '0.6875rem' }}>
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                          {post.title}
                        </h3>
                        <p className="text-secondary" style={{ fontSize: '0.8125rem', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                          {post.excerpt.replace(/&#8217;/g, "'").replace(/&amp;/g, '&').replace(/&[a-z]+;/g, '')}
                        </p>
                        <span className="text-accent" style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          Read More
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {posts.length === 0 && (
            <div className="text-muted" style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>No posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-secondary" style={{ paddingTop: 0 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="bg-accent-dim border-accent" style={{ borderRadius: '12px', padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Can't Find What You Need?</h2>
            <p className="text-secondary" style={{ marginBottom: '1.5rem', lineHeight: 1.7, fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              Browse our full shop or reach out — we're happy to help you find the right gear.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/gear" className="btn-primary">Shop All Gear</Link>
              <Link href="/contact" className="btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
