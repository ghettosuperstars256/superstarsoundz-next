'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import posts from '@/data/posts.json';

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
  const headings = parseHeadings(post.content);

  useEffect(() => {
    const setProgress = (v: number) => setReadProgress(Math.round(v));
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <div style={{ position: 'fixed', top: '64px', left: 0, right: 0, height: '3px', zIndex: 99, background: 'var(--border)' }}>
        <div style={{ height: '100%', width: `${readProgress}%`, background: 'var(--accent)', transition: 'width 0.1s', borderRadius: '0 2px 2px 0' }} />
      </div>

      <div className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem' }}>
            <div>
              {/* Breadcrumb */}
              <div className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.8125rem' }}>
                <Link href="/" className="text-muted">Home</Link>
                <span style={{ margin: '0 0.5rem' }}>/</span>
                <Link href="/blog" className="text-muted">Guides</Link>
                <span style={{ margin: '0 0.5rem' }}>/</span>
                <span className="text-primary">{post.title.length > 40 ? post.title.slice(0, 40) + '...' : post.title}</span>
              </div>

              {/* Categories */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {post.categories.map(cat => (
                  <span key={cat} className="badge">{cat.replace('Topic: ', '').replace('Shop: ', '')}</span>
                ))}
              </div>

              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.5rem' }}>{post.title}</h1>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <p className="text-muted" style={{ fontSize: '0.8125rem' }}>Published {post.date}</p>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>·</span>
                <p className="text-muted" style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4V7L9 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <ReadTime content={post.content} />
                </p>
              </div>

              {/* TOC */}
              {headings.length > 2 && (
                <div className="toc">
                  <div className="toc-title">Table of Contents</div>
                  <ol>
                    {headings.map((h, i) => (
                      <li key={i} style={{ marginLeft: h.level === 3 ? '1rem' : 0 }}>
                        <a href={`#${h.id}`}>{h.text}</a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Content */}
              <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

              {/* Disclosure */}
              <div className="card" style={{ marginTop: '2rem', padding: '1rem 1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <strong className="text-primary">Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases.
              </div>
            </div>

            {/* Sidebar */}
            <aside style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
              <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h3 className="text-accent" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>In This Guide</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {headings.slice(0, 8).map((h, i) => (
                    <a key={i} href={`#${h.id}`} className="text-secondary" style={{ fontSize: '0.8125rem', paddingLeft: h.level === 3 ? '0.75rem' : 0 }}>{h.text}</a>
                  ))}
                </div>
              </div>

              <div className="bg-accent-dim border-accent" style={{ borderRadius: '8px', padding: '1.25rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ready to Buy?</h3>
                <p className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '1rem' }}>Browse our curated selection of professional audio gear.</p>
                <Link href="/gear" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}>Shop All Gear</Link>
              </div>
            </aside>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Related Guides</h2>
              <div className="grid-3">
                {related.map(rp => (
                  <Link key={rp.id} href={`/blog/${rp.slug}`} className="card" style={{ display: 'block' }}>
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {rp.categories.map(cat => (
                          <span key={cat} className="badge">{cat.replace('Topic: ', '').replace('Shop: ', '')}</span>
                        ))}
                      </div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem' }}>{rp.title}</h3>
                      <span className="text-accent" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Read More →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
