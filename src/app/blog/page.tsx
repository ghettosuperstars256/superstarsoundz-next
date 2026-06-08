import Link from 'next/link';
import posts from '@/data/posts.json';
import postCategories from '@/data/post-categories.json';

function getReadTime(content: string): number {
  const text = content.replace(/<[^>]+>/g, '');
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPage() {
  const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const activeCats = postCategories.filter(c => c.count > 0);

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <p className="label" style={{ marginBottom: '0.5rem' }}>Learn</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Buying Guides</h1>
          <p className="text-secondary">{posts.length} expert guides to help you choose the right gear</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {activeCats.map(cat => (
            <span key={cat.slug} className="badge">{cat.name} ({cat.count})</span>
          ))}
        </div>

        <div className="grid-2">
          {sortedPosts.map((post, index) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card" style={{ display: 'block', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  {post.categories.map(cat => (
                    <span key={cat} className="badge">{cat.replace('Topic: ', '').replace('Shop: ', '')}</span>
                  ))}
                </div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {post.title}
                </h2>
                <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {post.excerpt}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{post.date}</span>
                    <span className="text-muted" style={{ fontSize: '0.6875rem' }}>·</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4V7L9 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      {getReadTime(post.content)} min read
                    </span>
                  </div>
                  <span className="text-accent" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Read More →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
