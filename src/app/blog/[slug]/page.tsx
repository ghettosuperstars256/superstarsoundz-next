import { notFound } from 'next/navigation';
import Link from 'next/link';
import posts from '@/data/posts.json';

interface Props {
  params: { slug: string };
}

export default function BlogPostPage({ params }: Props) {
  const post = posts.find(p => p.slug === params.slug);
  if (!post) notFound();

  // Get related posts (same category)
  const related = posts
    .filter(p => p.id !== post.id && p.categories.some(c => post.categories.includes(c)))
    .slice(0, 3);

  // Extract headings from content for TOC
  const headingRegex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/gi;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;
  while ((match = headingRegex.exec(post.content)) !== null) {
    const level = parseInt(match[0][2]);
    const text = match[1].replace(/<[^>]+>/g, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ level, text, id });
  }

  // Add IDs to headings in content for TOC linking
  let processedContent = post.content;
  headings.forEach(h => {
    const tag = `<h${h.level}`;
    const newTag = `<h${h.level} id="${h.id}"`;
    processedContent = processedContent.replace(
      new RegExp(`<h${h.level}[^>]*>${h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h${h.level}>`, 'i'),
      `<h${h.level} id="${h.id}">${h.text}</h${h.level}>`
    );
  });

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem' }}>
          {/* Main Content */}
          <div>
            {/* Breadcrumb */}
            <div style={{ marginBottom: '1.5rem', fontSize: '0.8125rem', color: '#555555' }}>
              <Link href="/" style={{ color: '#555555' }}>Home</Link>
              <span style={{ margin: '0 0.5rem' }}>/</span>
              <Link href="/blog" style={{ color: '#555555' }}>Guides</Link>
              <span style={{ margin: '0 0.5rem' }}>/</span>
              <span style={{ color: '#e8e8e8' }}>{post.title.slice(0, 40)}...</span>
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {post.categories.map(cat => (
                <span key={cat} className="badge">{cat.replace('Topic: ', '')}</span>
              ))}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem' }}>
              {post.title}
            </h1>

            {/* Date */}
            <p style={{ fontSize: '0.8125rem', color: '#555555', marginBottom: '2rem' }}>
              Published {post.date}
            </p>

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
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Affiliate Disclosure */}
            <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: '#161616', border: '1px solid #222222', borderRadius: '8px', fontSize: '0.8125rem', color: '#555555' }}>
              <strong style={{ color: '#e8e8e8' }}>Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. Links may earn us a commission at no extra cost to you.
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
            {/* Quick Nav */}
            <div style={{ background: '#161616', border: '1px solid #222222', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D4A843', marginBottom: '0.75rem' }}>
                In This Guide
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {headings.slice(0, 8).map((h, i) => (
                  <a key={i} href={`#${h.id}`} style={{ fontSize: '0.8125rem', color: '#888888', paddingLeft: h.level === 3 ? '0.75rem' : 0 }}>
                    {h.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Shop CTA */}
            <div style={{ background: 'rgba(212, 168, 67, 0.1)', border: '1px solid #D4A843', borderRadius: '8px', padding: '1.25rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ready to Buy?</h3>
              <p style={{ fontSize: '0.75rem', color: '#888888', marginBottom: '1rem' }}>
                Browse our curated selection of professional audio gear.
              </p>
              <Link href="/gear" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}>
                Shop All Gear
              </Link>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div style={{ marginTop: '4rem', borderTop: '1px solid #222222', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Related Guides</h2>
            <div className="grid-3">
              {related.map(rp => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="card" style={{ display: 'block' }}>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {rp.categories.map(cat => (
                        <span key={cat} className="badge">{cat.replace('Topic: ', '')}</span>
                      ))}
                    </div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem' }}>{rp.title}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#D4A843', fontWeight: 600 }}>Read More →</span>
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
