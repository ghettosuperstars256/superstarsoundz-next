'use client';

import { useState, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { ClientDeleteButton } from './ClientDeleteButton';
import { useToast } from '@/components/ToastProvider';

interface Product {
  id: number; name: string; short_name: string; slug: string; price: number;
  image: string; categories: string[]; short_description: string; description: string;
  external_url: string; in_stock: boolean; featured: boolean; badge: string;
}

interface Post {
  id: number; title: string; slug: string; content: string; excerpt: string;
  categories: string[]; date: string; status?: string;
}

interface Page {
  id: string; title: string; slug: string; content: string; status?: string;
}

interface Props {
  activeTab: string;
  search: string;
  allProducts: Product[];
  allPosts: Post[];
  allPages: Page[];
  productIssues: Product[];
}

export function ContentManagerClient({ activeTab, search, allProducts, allPosts, allPages, productIssues }: Props) {
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const currentTab = ['posts', 'pages', 'products'].includes(activeTab) ? activeTab : 'posts';

  // Post status helpers
  const getPostStatus = (post: Post): 'published' | 'draft' | 'scheduled' => {
    return (post.status as 'published' | 'draft' | 'scheduled') || 'published';
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'published': return '#22c55e';
      case 'draft': return '#f59e0b';
      case 'scheduled': return '#3b82f6';
      default: return '#5a5a6a';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Published';
      case 'draft': return 'Draft';
      case 'scheduled': return 'Scheduled';
      default: return 'Unknown';
    }
  };

  // Toggle selection
  const toggleAll = useCallback((type: 'post' | 'page' | 'product', ids: string[], checked: boolean) => {
    const setter = type === 'post' ? setSelectedPosts : type === 'page' ? setSelectedPages : setSelectedProducts;
    setter(prev => {
      const next = new Set(prev);
      ids.forEach(id => checked ? next.add(id) : next.delete(id));
      return next;
    });
  }, []);

  const toggleOne = useCallback((type: 'post' | 'page' | 'product', id: string) => {
    const setter = type === 'post' ? setSelectedPosts : type === 'page' ? setSelectedPages : setSelectedProducts;
    setter(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // Bulk delete
  const bulkDelete = useCallback(async (type: 'post' | 'page' | 'product', ids: Set<string>) => {
    if (ids.size === 0) return;
    const msg = `Delete ${ids.size} item(s)? This cannot be undone.`;
    if (!confirm(msg)) return;
    setBulkDeleting(true);
    try {
      const endpoint = type === 'page' ? '/api/content/pages' : '/api/content';
      const promises = Array.from(ids).map(id =>
        fetch(endpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(type === 'page' ? { id } : { type, id }),
        })
      );
      await Promise.all(promises);
      // Clear selection
      if (type === 'post') setSelectedPosts(new Set());
      else if (type === 'page') setSelectedPages(new Set());
      else setSelectedProducts(new Set());
      addToast('success', `Deleted ${ids.size} item(s)`);
      startTransition(() => { window.location.reload(); });
    } catch {
      addToast('error', 'Failed to delete items');
    } finally {
      setBulkDeleting(false);
    }
  }, [addToast]);

  // Stats
  const publishedPosts = allPosts.filter(p => getPostStatus(p) === 'published').length;
  const publishedPages = allPages.filter(p => (p.status || 'published') === 'published').length;

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Products', value: allProducts.length, color: '#D4A843' },
          { label: 'Posts', value: allPosts.length, color: '#3b82f6' },
          { label: 'Pages', value: allPages.length, color: '#a855f7' },
          { label: 'Published', value: publishedPosts + publishedPages, color: '#22c55e' },
          { label: 'Need Attention', value: productIssues.length, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} role="status" aria-label={`${s.label}: ${s.value}`} style={{ padding: '1rem 1.25rem', background: '#121216', borderRadius: '10px', border: '1px solid #1e1e26' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#9090a0' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Content type" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['posts', 'pages', 'products'] as const).map(tab => (
          <a
            key={tab}
            role="tab"
            aria-selected={currentTab === tab}
            aria-controls={`tabpanel-${tab}`}
            href={`/dashboard/admin/content?tab=${tab}`}
            style={{
              padding: '0.625rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600,
              background: currentTab === tab ? 'rgba(212,168,67,0.1)' : 'transparent',
              color: currentTab === tab ? '#D4A843' : '#9090a0',
              border: currentTab === tab ? '1px solid rgba(212,168,67,0.25)' : '1px solid transparent',
              textDecoration: 'none', textTransform: 'capitalize',
            }}
          >{tab}</a>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1rem' }}>
        <form method="GET" role="search" aria-label={`Search ${currentTab}`} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input type="hidden" name="tab" value={currentTab} />
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder={`Search ${currentTab}...`}
            aria-label={`Search ${currentTab}`}
            style={{
              flex: 1, minWidth: '200px', maxWidth: '400px',
              padding: '0.5rem 1rem', borderRadius: '8px',
              border: '1px solid #1e1e26', background: '#141418',
              color: '#f0f0f2', fontSize: '0.875rem', outline: 'none',
            }}
          />
          <button type="submit" aria-label="Submit search" className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>Search</button>
        </form>
      </div>

      {/* Bulk Actions Bar */}
      {((currentTab === 'posts' && selectedPosts.size > 0) || (currentTab === 'pages' && selectedPages.size > 0) || (currentTab === 'products' && selectedProducts.size > 0)) && (
        <div role="toolbar" aria-label="Bulk actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.05)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', color: '#ef4444', fontWeight: 600 }}>
            {currentTab === 'posts' ? selectedPosts.size : currentTab === 'pages' ? selectedPages.size : selectedProducts.size} selected
          </span>
          <button
            onClick={() => {
              if (currentTab === 'posts') bulkDelete('post', selectedPosts);
              else if (currentTab === 'pages') bulkDelete('page', selectedPages);
              else bulkDelete('product', selectedProducts);
            }}
            disabled={bulkDeleting}
            aria-label="Delete selected items"
            style={{
              fontSize: '0.75rem', padding: '0.375rem 0.75rem', color: '#ef4444',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '6px', cursor: 'pointer',
            }}
          >{bulkDeleting ? 'Deleting...' : 'Delete Selected'}</button>
          <button
            onClick={() => { setSelectedPosts(new Set()); setSelectedPages(new Set()); setSelectedProducts(new Set()); }}
            aria-label="Clear selection"
            style={{
              fontSize: '0.75rem', padding: '0.375rem 0.75rem', color: '#9090a0',
              background: 'transparent', border: '1px solid #1e1e26',
              borderRadius: '6px', cursor: 'pointer',
            }}
          >Clear</button>
        </div>
      )}

      {/* Posts Table */}
      {currentTab === 'posts' && (
        <div id="tabpanel-posts" role="tabpanel" aria-label="Posts">
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '10px', border: '1px solid #1e1e26' }}>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }} role="grid" aria-label="Posts list">
              <thead>
                <tr style={{ background: '#121216' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '40px' }}>
                    <input
                      type="checkbox"
                      aria-label="Select all posts"
                      checked={allPosts.length > 0 && selectedPosts.size === allPosts.length}
                      onChange={e => toggleAll('post', allPosts.map(p => String(p.id)), e.target.checked)}
                      style={{ accentColor: '#D4A843', width: '16px', height: '16px' }}
                    />
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#9090a0', fontSize: '0.75rem', fontWeight: 600 }}>Title</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#9090a0', fontSize: '0.75rem', fontWeight: 600, width: '100px' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#9090a0', fontSize: '0.75rem', fontWeight: 600, width: '120px' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#9090a0', fontSize: '0.75rem', fontWeight: 600, width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allPosts.map(post => (
                  <tr key={post.id} style={{ borderTop: '1px solid #1e1e26' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <input
                        type="checkbox"
                        aria-label={`Select post: ${post.title}`}
                        checked={selectedPosts.has(String(post.id))}
                        onChange={() => toggleOne('post', String(post.id))}
                        style={{ accentColor: '#D4A843', width: '16px', height: '16px' }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <Link href={`/dashboard/admin/editor?type=post&id=${post.id}`} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0f0f2', textDecoration: 'none' }}>{post.title}</Link>
                      {post.categories?.length > 0 && (
                        <div style={{ fontSize: '0.6875rem', color: '#5a5a6a', marginTop: '0.125rem' }}>{post.categories.join(', ')}</div>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        fontSize: '0.6875rem', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '4px',
                        background: `${statusColor(getPostStatus(post))}15`,
                        color: statusColor(getPostStatus(post)),
                      }}>{statusLabel(getPostStatus(post))}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#9090a0' }}>{post.date}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <Link href={`/dashboard/admin/editor?type=post&id=${post.id}`} style={{ fontSize: '0.75rem', color: '#D4A843', marginRight: '0.75rem' }}>Edit</Link>
                      <ClientDeleteButton id={String(post.id)} type="post" label={post.title} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {allPosts.length === 0 && (
            <div role="status" aria-label="No posts found" style={{ textAlign: 'center', padding: '3rem', color: '#5a5a6a' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
              <p style={{ marginBottom: '1rem' }}>{search ? 'No posts match your search.' : 'No posts yet.'}</p>
              <Link href="/dashboard/admin/editor?type=post" className="btn-primary" style={{ fontSize: '0.8125rem' }}>Create First Post</Link>
            </div>
          )}
        </div>
      )}

      {/* Pages Table */}
      {currentTab === 'pages' && (
        <div id="tabpanel-pages" role="tabpanel" aria-label="Pages">
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '10px', border: '1px solid #1e1e26' }}>
            <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse' }} role="grid" aria-label="Pages list">
              <thead>
                <tr style={{ background: '#121216' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '40px' }}>
                    <input type="checkbox" aria-label="Select all pages"
                      checked={allPages.length > 0 && selectedPages.size === allPages.length}
                      onChange={e => toggleAll('page', allPages.map(p => String(p.id)), e.target.checked)}
                      style={{ accentColor: '#D4A843', width: '16px', height: '16px' }} />
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#9090a0', fontSize: '0.75rem', fontWeight: 600 }}>Title</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#9090a0', fontSize: '0.75rem', fontWeight: 600, width: '100px' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#9090a0', fontSize: '0.75rem', fontWeight: 600, width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allPages.map(page => (
                  <tr key={page.id} style={{ borderTop: '1px solid #1e1e26' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <input type="checkbox" aria-label={`Select page: ${page.title}`}
                        checked={selectedPages.has(String(page.id))}
                        onChange={() => toggleOne('page', String(page.id))}
                        style={{ accentColor: '#D4A843', width: '16px', height: '16px' }} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <Link href={`/dashboard/admin/editor?type=page&id=${page.id}`} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0f0f2', textDecoration: 'none' }}>{page.title}</Link>
                      <div style={{ fontSize: '0.6875rem', color: '#5a5a6a', marginTop: '0.125rem' }}>/{page.slug}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        fontSize: '0.6875rem', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '4px',
                        background: `${statusColor(page.status || 'published')}15`,
                        color: statusColor(page.status || 'published'),
                      }}>{statusLabel(page.status || 'published')}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <Link href={`/dashboard/admin/editor?type=page&id=${page.id}`} style={{ fontSize: '0.75rem', color: '#D4A843', marginRight: '0.75rem' }}>Edit</Link>
                      <ClientDeleteButton id={String(page.id)} type="page" label={page.title} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {allPages.length === 0 && (
            <div role="status" aria-label="No pages found" style={{ textAlign: 'center', padding: '3rem', color: '#5a5a6a' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
              <p style={{ marginBottom: '1rem' }}>No pages yet.</p>
              <Link href="/dashboard/admin/editor?type=page" className="btn-primary" style={{ fontSize: '0.8125rem' }}>Create First Page</Link>
            </div>
          )}
        </div>
      )}

      {/* Products Table */}
      {currentTab === 'products' && (
        <div id="tabpanel-products" role="tabpanel" aria-label="Products">
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '10px', border: '1px solid #1e1e26' }}>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }} role="grid" aria-label="Products list">
              <thead>
                <tr style={{ background: '#121216' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '40px' }}>
                    <input type="checkbox" aria-label="Select all products"
                      checked={allProducts.length > 0 && selectedProducts.size === allProducts.length}
                      onChange={e => toggleAll('product', allProducts.map(p => String(p.id)), e.target.checked)}
                      style={{ accentColor: '#D4A843', width: '16px', height: '16px' }} />
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#9090a0', fontSize: '0.75rem', fontWeight: 600 }}>Product</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#9090a0', fontSize: '0.75rem', fontWeight: 600, width: '100px' }}>Price</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#9090a0', fontSize: '0.75rem', fontWeight: 600, width: '120px' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#9090a0', fontSize: '0.75rem', fontWeight: 600, width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map(product => {
                  const hasIssues = productIssues.some(p => p.id === product.id);
                  return (
                    <tr key={product.id} style={{ borderTop: '1px solid #1e1e26' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <input type="checkbox" aria-label={`Select product: ${product.short_name}`}
                          checked={selectedProducts.has(String(product.id))}
                          onChange={() => toggleOne('product', String(product.id))}
                          style={{ accentColor: '#D4A843', width: '16px', height: '16px' }} />
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <Link href={`/dashboard/admin/editor?type=product&id=${product.id}`} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0f0f2', textDecoration: 'none' }}>{product.short_name || product.name}</Link>
                        {product.categories?.length > 0 && (
                          <div style={{ fontSize: '0.6875rem', color: '#5a5a6a', marginTop: '0.125rem' }}>{product.categories.join(', ')}</div>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: '#D4A843', fontWeight: 600 }}>${product.price?.toFixed(2) || '0.00'}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {hasIssues ? (
                          <span style={{ fontSize: '0.6875rem', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '4px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>Needs Work</span>
                        ) : (
                          <span style={{ fontSize: '0.6875rem', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '4px', background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>Good</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <Link href={`/dashboard/admin/editor?type=product&id=${product.id}`} style={{ fontSize: '0.75rem', color: '#D4A843', marginRight: '0.75rem' }}>Edit</Link>
                        <ClientDeleteButton id={String(product.id)} type="product" label={product.short_name || product.name} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {allProducts.length === 0 && (
            <div role="status" aria-label="No products found" style={{ textAlign: 'center', padding: '3rem', color: '#5a5a6a' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
              <p style={{ marginBottom: '1rem' }}>No products yet.</p>
              <Link href="/dashboard/admin/editor?type=product" className="btn-primary" style={{ fontSize: '0.8125rem' }}>Add First Product</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
