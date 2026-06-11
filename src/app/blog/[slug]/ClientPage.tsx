'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import posts from '@/data/posts.json';
import products from '@/data/products.json';

interface Props { params: { slug: string }; }

function ReadTime({ content }: { content: string }) {
  const [minutes, setMinutes] = useState(0);
  useEffect(() => {
    const text = content.replace(/<[^>]+>/g, '');
    const words = text.trim().split(/\s+/).length;
    setMinutes(Math.max(1, Math.ceil(words / 200)));
  }, [content]);
  return <>{minutes} min read</>;
}

function parseHeadings(content: string) {
  const headings: { level: number; text: string; id: string }[] = [];
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  const h3Regex = /<h3[^>]*>(.*?)<\/h3>/gi;
  let m;
  while ((m = h2Regex.exec(content)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ level: 2, text, id });
  }
  while ((m = h3Regex.exec(content)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ level: 3, text, id });
  }
  return headings;
}

export default function BlogPostPage({ params }: Props) {
  const post = posts.find(p => p.slug === params.slug);
  if (!post) notFound();

  const related = posts.filter(p => p.id !== post.id && p.categories.some(c => post.categories.includes(c))).slice(0, 3);
  const [readProgress, setReadProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState('');
  const headings = parseHeadings(post.content);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);

      // Track active heading
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveHeading(headings[i].id);
          break;
        }
      }
    };
    const setProgress = (v: number) => setReadProgress(Math.round(v));
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt.substring(0, 200),
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Superstar Soundz' },
    publisher: { '@type': 'Organization', name: 'Superstar Soundz', logo: { '@type': 'ImageObject', url: 'https://superstarsoundz.com/favicon.svg' } },
    mainEntityOfPage: `https://superstarsoundz.com/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Reading progress bar */}
      <div style={{ position: 'fixed', top: '72px', left: 0, right: 0, height: '3px', zIndex: 99, background: '#1e1e26' }}>
        <div style={{ height: '100%', width: `${readProgress}%`, background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)', transition: 'width 0.1s', borderRadius: '0 2px 2px 0' }} />
      </div>

      {/* ===== ARTICLE HERO ===== */}
      <section style={{ padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <nav style={{ marginBottom: '2rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Link href="/" style={{ color: '#5a5a6a' }}>Home</Link>
              <span style={{ color: '#3a3a48' }}>/</span>
              <Link href="/blog" style={{ color: '#5a5a6a' }}>Blog</Link>
              <span style={{ color: '#3a3a48' }}>/</span>
              <span style={{ color: '#9090a0' }}>{post.title.length > 35 ? post.title.slice(0, 35) + '...' : post.title}</span>
            </nav>

            {/* Categories */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {post.categories.map(cat => (
                <span key={cat} className="badge">{cat.replace('Topic: ', '').replace('Shop: ', '')}</span>
              ))}
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1,
              marginBottom: '1.5rem', letterSpacing: '-0.03em',
            }}>
              {post.title}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: '#000',
                }}>SS</div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Superstar Soundz</div>
                  <div style={{ fontSize: '0.75rem', color: '#5a5a6a' }}>Expert Team</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#5a5a6a', fontSize: '0.8125rem' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M2 5h10M5 1v2M9 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                {post.date}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#5a5a6a', fontSize: '0.8125rem' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4V7L9 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <ReadTime content={post.content} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ARTICLE CONTENT + SIDEBAR ===== */}
      <section className="section-sm" style={{ paddingTop: '0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '4rem' }}>
            {/* Main Content */}
            <div>
              {/* TOC */}
              {headings.length > 2 && (
                <div className="toc" style={{ marginBottom: '3rem' }}>
                  <div className="toc-title">Table of Contents</div>
                  <ol>
                    {headings.map((h, i) => (
                      <li key={i} style={{ marginLeft: h.level === 3 ? '1.25rem' : 0 }}>
                        <a
                          href={`#${h.id}`}
                          onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                          style={{ color: activeHeading === h.id ? '#D4A843' : undefined, fontWeight: activeHeading === h.id ? 600 : undefined }}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Content */}
              <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

              {/* Disclosure */}
              <div style={{
                marginTop: '3rem', padding: '1.25rem 1.5rem',
                background: '#121216', borderRadius: '16px',
                border: '1px solid #1e1e26',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><circle cx="8" cy="8" r="6.5" stroke="#5a5a6a" strokeWidth="1.5"/><path d="M8 7v3M8 12v.5" stroke="#5a5a6a" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span style={{ fontSize: '0.8125rem', color: '#5a5a6a' }}>
                  <strong style={{ color: '#9090a0' }}>Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases.
                </span>
              </div>

              {/* Author card */}
              <div style={{
                marginTop: '2rem', padding: '2rem',
                background: '#121216', borderRadius: '16px',
                border: '1px solid #1e1e26',
                display: 'flex', gap: '1.25rem', alignItems: 'center',
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.125rem', fontWeight: 800, color: '#000', flexShrink: 0,
                }}>SS</div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Superstar Soundz</div>
                  <p style={{ fontSize: '0.875rem', color: '#9090a0', lineHeight: 1.6 }}>
                    Expert audio equipment reviews and buying guides. We test and research every product we recommend.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside style={{ position: 'sticky', top: '5rem', alignSelf: 'start' }}>
              {/* Table of Contents (sidebar version for desktop) */}
              {headings.length > 2 && (
                <div style={{
                  padding: '1.5rem', background: '#121216', borderRadius: '16px',
                  border: '1px solid #1e1e26', marginBottom: '1.5rem',
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4A843', marginBottom: '1rem', letterSpacing: '0.08em' }}>
                    IN THIS GUIDE
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {headings.slice(0, 10).map((h, i) => (
                      <a
                        key={i}
                        href={`#${h.id}`}
                        onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                        style={{
                          fontSize: '0.875rem', color: activeHeading === h.id ? '#D4A843' : '#9090a0',
                          fontWeight: activeHeading === h.id ? 600 : 400,
                          paddingLeft: h.level === 3 ? '1rem' : 0,
                          transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}
                      >
                        <span style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: activeHeading === h.id ? 'rgba(212, 168, 67, 0.08)' : '#141418',
                          color: activeHeading === h.id ? '#D4A843' : '#5a5a6a',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.625rem', fontWeight: 700, flexShrink: 0,
                        }}>{i + 1}</span>
                        {h.text}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Products */}
              {(() => {
                const relatedProds = products
                  .filter(p => post.categories.some(pc => p.categories.some(cat => cat.toLowerCase().includes(pc.replace('Topic: ', '').replace('Shop: ', '').toLowerCase()))))
                  .slice(0, 3);
                if (relatedProds.length === 0) return null;
                return (
                  <div style={{
                    padding: '1.5rem', background: '#121216', borderRadius: '16px',
                    border: '1px solid #1e1e26', marginBottom: '1.5rem',
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4A843', marginBottom: '1rem', letterSpacing: '0.08em' }}>
                      PRODUCTS MENTIONED
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {relatedProds.map(p => (
                        <Link key={p.id} href={`/gear/${p.slug}`} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.5rem', borderRadius: '10px', transition: 'background 0.15s' }}>
                          <div style={{
                            width: '56px', height: '56px', borderRadius: '6px',
                            background: '#141418', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, overflow: 'hidden', border: '1px solid #1e1e26',
                          }}>
                            {p.image ? (
                              <img src={p.image} alt={p.short_name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
                            ) : (
                              <span style={{ fontSize: '0.625rem', color: '#5a5a6a' }}>—</span>
                            )}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.short_name}</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#D4A843' }}>${p.price}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* CTA */}
              <div style={{
                padding: '1.5rem', borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(212, 168, 67, 0.08) 0%, rgba(212,168,67,0.04) 100%)',
                border: '1px solid rgba(212, 168, 67, 0.25)', textAlign: 'center',
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ready to Buy?</h3>
                <p style={{ fontSize: '0.8125rem', color: '#9090a0', marginBottom: '1rem' }}>Browse our curated selection of professional audio gear.</p>
                <Link href="/gear" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8125rem' }}>Shop All</Link>
              </div>

              {/* Deals link */}
              <Link href="/deals" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                marginTop: '1rem', padding: '0.875rem', borderRadius: '10px',
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
                color: '#ef4444', fontSize: '0.8125rem', fontWeight: 600, textAlign: 'center',
                transition: 'all 0.15s',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                View All Deals
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* ===== RELATED POSTS ===== */}
      {related.length > 0 && (
        <section className="section-sm" style={{ background: '#0e0e12', borderTop: '1px solid #1e1e26' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <div className="label" style={{ marginBottom: '0.75rem' }}>Read Next</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Related Articles</h2>
              </div>
              <Link href="/blog" className="btn-ghost" style={{ fontSize: '0.8125rem' }}>
                All Posts
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
            <div className="grid-3 stagger-children">
              {related.map(rp => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="card" style={{ display: 'block' }}>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      {rp.categories.map(cat => (
                        <span key={cat} className="badge" style={{ fontSize: '0.625rem' }}>{cat.replace('Topic: ', '').replace('Shop: ', '')}</span>
                      ))}
                    </div>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>{rp.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#9090a0', marginBottom: '1rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rp.excerpt}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#5a5a6a' }}>{rp.date}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D4A843' }}>Read More</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
