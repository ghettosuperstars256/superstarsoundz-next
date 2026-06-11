import Link from 'next/link';
import { notFound } from 'next/navigation';
import posts from '@/data/posts.json';
import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };

  const cleanExcerpt = post.excerpt.replace(/&#8217;/g, "'").replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
  return {
    title: `${post.title} | Superstar Soundz Blog`,
    description: cleanExcerpt.substring(0, 160),
    openGraph: {
      title: post.title,
      description: cleanExcerpt.substring(0, 160),
      type: 'article',
      publishedTime: post.date,
      authors: ['Superstar Soundz'],
    },
  };
}

export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  if (!post) notFound();

  const relatedPosts = posts
    .filter(p => p.id !== post.id && p.categories.some(c => post.categories.includes(c)))
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt.replace(/&#8217;/g, "'").replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim(),
    author: { '@type': 'Organization', name: 'Superstar Soundz' },
    publisher: { '@type': 'Organization', name: 'Superstar Soundz', logo: { '@type': 'ImageObject', url: 'https://superstarsoundz.com/favicon.svg' } },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `https://superstarsoundz.com/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ padding: '4rem 0 2rem', background: 'linear-gradient(135deg, #0e0e12 0%, #08080a 100%)', borderBottom: '1px solid #1e1e26' }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ marginBottom: '2rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#5a5a6a' }}>Home</Link>
            <span style={{ color: '#3a3a48' }}>/</span>
            <Link href="/blog" style={{ color: '#5a5a6a' }}>Blog</Link>
            <span style={{ color: '#3a3a48' }}>/</span>
            <span style={{ color: '#f0f0f2', fontWeight: 500 }}>{post.title}</span>
          </nav>

          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {post.categories.map((cat, i) => (
                <span key={i} style={{
                  padding: '0.25rem 0.75rem', borderRadius: '100px',
                  background: 'rgba(212, 168, 67, 0.08)', color: '#D4A843',
                  fontSize: '0.6875rem', fontWeight: 600,
                  border: '1px solid rgba(212, 168, 67, 0.15)',
                }}>
                  {cat.replace('Topic: ', '').replace('Shop: ', '')}
                </span>
              ))}
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
              {post.title}
            </h1>
            <p className="text-secondary" style={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
              {post.excerpt.replace(/&#8217;/g, "'").replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim()}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <div
              className="prose"
              style={{ color: '#9090a0', lineHeight: 1.8, fontSize: '1.0625rem' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Disclosure */}
            <div style={{
              marginTop: '3rem', padding: '1rem 1.25rem',
              background: '#121216', borderRadius: '10px', border: '1px solid #1e1e26',
              fontSize: '0.8125rem', color: '#5a5a6a',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="8" cy="8" r="6.5" stroke="#5a5a6a" strokeWidth="1.5"/>
                <path d="M8 7v3M8 11v.5" stroke="#5a5a6a" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span><strong style={{ color: '#9090a0' }}>Disclosure:</strong> This post contains affiliate links. As an Amazon Associate, we earn from qualifying purchases at no extra cost to you.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section bg-secondary" style={{ paddingTop: '3rem' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Related Posts</h2>
            <div className="grid-3">
              {relatedPosts.map(rp => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="card" style={{ display: 'block', overflow: 'hidden' }}>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#D4A843' }}>
                        {rp.categories[0]?.replace('Topic: ', '').replace('Shop: ', '') || 'Guide'}
                      </span>
                      <span style={{ color: '#3a3a48' }}>·</span>
                      <span className="text-muted" style={{ fontSize: '0.6875rem' }}>
                        {new Date(rp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>{rp.title}</h3>
                    <p className="text-secondary" style={{ fontSize: '0.8125rem', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {rp.excerpt.replace(/&#8217;/g, "'").replace(/&amp;/g, '&').replace(/&[a-z]+;/g, '')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="bg-accent-dim border-accent" style={{ borderRadius: '12px', padding: '2.5rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ready to Find Your Gear?</h2>
            <p className="text-secondary" style={{ marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
              Browse our curated selection of professional audio equipment.
            </p>
            <Link href="/gear" className="btn-primary">Shop All Gear</Link>
          </div>
        </div>
      </section>
    </>
  );
}
