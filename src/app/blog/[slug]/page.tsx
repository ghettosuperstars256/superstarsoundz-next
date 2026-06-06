import { notFound } from 'next/navigation';
import Link from 'next/link';
import posts from '@/data/posts.json';

interface Props { params: { slug: string }; }

export default function BlogPostPage({ params }: Props) {
  const post = posts.find(p => p.slug === params.slug);
  if (!post) notFound();

  const related = posts.filter(p => p.id !== post.id && p.categories.some(c => post.categories.includes(c))).slice(0, 3);

  const headingRegex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/gi;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;
  while ((match = headingRegex.exec(post.content)) !== null) {
    const level = parseInt(match[0][2]);
    const text = match[1].replace(/<[^>]+>/g, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ level, text, id });
  }

  return (
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
              <span className="text-primary">{post.title.slice(0, 40)}...</span>
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {post.categories.map(cat => (
                <span key={cat} className="badge">{cat.replace('Topic: ', '').replace('Shop: ', '')}</span>
              ))}
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem' }}>{post.title}</h1>
            <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '2rem' }}>Published {post.date}</p>

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
  );
}

export function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));
}
