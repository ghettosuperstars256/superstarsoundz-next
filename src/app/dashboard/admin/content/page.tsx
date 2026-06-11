import fs from 'fs';
import path from 'path';
import Link from 'next/link';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');
const POSTS_FILE = path.join(process.cwd(), 'src', 'data', 'posts.json');
const PAGES_FILE = path.join(process.cwd(), 'src', 'data', 'pages.json');

interface Product {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  price: number;
  image: string;
  categories: string[];
  short_description: string;
  description: string;
  external_url: string;
  in_stock: boolean;
  featured: boolean;
  badge: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categories: string[];
  date: string;
  image?: string;
  author?: string;
  status?: string;
  meta_description?: string;
  tags?: string[];
}

function loadJSON(file: string): any[] {
  try {
    if (!fs.existsSync(file)) return [];
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getWordCount(html: string): number {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

function trunc(str: string, len: number) {
  return str.length > len ? str.substring(0, len) + '...' : str;
}

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; search?: string }>;
}) {
  const params = await searchParams;
  const activeTab = params.tab || 'posts';
  const search = params.search || '';

  const allProducts: Product[] = loadJSON(PRODUCTS_FILE);
  const allPosts: Post[] = loadJSON(POSTS_FILE);
  const pagesData = loadJSON(PAGES_FILE);
  const allPages = Array.isArray(pagesData) ? pagesData : Object.entries(pagesData).map(([slug, data]: [string, any]) => ({
    id: slug,
    title: data.title || slug,
    slug,
    content: data.content || '',
    status: 'published',
    date: '',
    metaDescription: '',
  }));

  // Filter
  const filteredPosts = search
    ? allPosts.filter(p => {
        const q = search.toLowerCase();
        return p.title.toLowerCase().includes(q) ||
          (p.categories || []).some((c: string) => c.toLowerCase().includes(q)) ||
          (p.excerpt || '').toLowerCase().includes(q);
      })
    : allPosts;

  const filteredPages = search
    ? allPages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase()))
    : allPages;

  const productIssues = allProducts.filter(p => {
    const wc = getWordCount(p.description);
    return wc < 100 || !p.image;
  });

  const publishedPosts = allPosts.length; // all posts in data are published
  const publishedPages = allPages.length;

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>Content Manager</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage blog posts, pages, and product content quality</p>
        </div>
        <Link href="/dashboard/admin/editor" className="btn-primary" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>
          + Create Content
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Blog Posts', value: allPosts.length, color: '#D4A843' },
          { label: 'Pages', value: allPages.length, color: '#3b82f6' },
          { label: 'Published', value: publishedPosts + publishedPages, color: '#22c55e' },
          { label: 'Need Attention', value: productIssues.length, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '1rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['posts', 'pages', 'products'] as const).map(tab => (
          <a key={tab} href={`/dashboard/content?tab=${tab}`} style={{
            padding: '0.625rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600,
            background: activeTab === tab ? 'rgba(212,168,67,0.1)' : 'transparent',
            color: activeTab === tab ? '#D4A843' : '#9090a0',
            border: activeTab === tab ? '1px solid rgba(212,168,67,0.25)' : '1px solid transparent',
            textDecoration: 'none', textTransform: 'capitalize',
          }}>{tab}</a>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1rem' }}>
        <form method="GET" style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="hidden" name="tab" value={activeTab} />
          <input type="text" name="search" defaultValue={search} placeholder={`Search ${activeTab}...`}
            style={{ flex: 1, maxWidth: '400px', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }} />
          <button type="submit" className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>Search</button>
        </form>
      </div>

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {filteredPosts.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              {search ? 'No posts match your search.' : 'No posts found.'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TITLE</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CATEGORY</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>DATE</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>WORDS</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map(post => (
                  <tr key={post.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{trunc(post.title, 60)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/blog/{post.slug}</div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {(post.categories || []).slice(0, 2).join(', ') || '—'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{
                        fontSize: '0.6875rem', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '4px',
                        color: '#22c55e',
                        background: 'rgba(34,197,94,0.1)',
                      }}>published</span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {post.date ? new Date(post.date).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {getWordCount(post.content || '')}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <a href={`/blog/${post.slug}`} target="_blank" className="btn-ghost" style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: '#D4A843' }}>View</a>
                        <Link href={`/dashboard/admin/editor?type=post&id=${post.id}`} className="btn-ghost" style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: '#3b82f6' }}>Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {filteredPages.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No pages found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>TITLE</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>SLUG</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>WORDS</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page: any) => (
                  <tr key={page.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{page.title}</div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{page.slug}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '4px', color: '#22c55e', background: 'rgba(34,197,94,0.1)' }}>
                        {page.status || 'published'}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {getWordCount(page.content || '')}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <a href={`/${page.slug}`} target="_blank" className="btn-ghost" style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: '#D4A843' }}>View</a>
                        <Link href={`/dashboard/content?tab=pages&edit=${page.id}`} className="btn-ghost" style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: '#3b82f6' }}>Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Products Content Tab */}
      {activeTab === 'products' && (
        <div>
          <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: productIssues.length > 0 ? '#f59e0b' : '#22c55e' }}>
              {productIssues.length} products need content optimization
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              (thin description or missing image)
            </span>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            {productIssues.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                All products have good content. Nothing needs attention.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>PRODUCT</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>WORDS</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>IMAGE</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>ISSUES</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {productIssues.map(p => {
                    const wc = getWordCount(p.description);
                    const issues: string[] = [];
                    if (wc < 100) issues.push('Thin content');
                    if (!p.image) issues.push('No image');
                    return (
                      <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{trunc(p.short_name || p.name, 50)}</div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{p.categories?.[0] || ''}</div>
                        </td>
                        <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: wc < 100 ? '#f59e0b' : '#22c55e', fontWeight: 600 }}>{wc}</td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          {p.image ? <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>✓</span> : <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>✗</span>}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', color: '#f59e0b' }}>{issues.join(', ')}</td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.375rem' }}>
                            <a href={`/gear/${p.slug}`} target="_blank" className="btn-ghost" style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: '#D4A843' }}>View</a>
                            <Link href={`/dashboard/admin/editor?type=product&id=${p.id}`} className="btn-ghost" style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: '#3b82f6' }}>Edit</Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
