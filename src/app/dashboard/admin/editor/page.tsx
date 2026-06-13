'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ============================================================
// TYPES
// ============================================================
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
  badge: string | null;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categories: string[];
  date: string;
  tags: string[];
  status: string;
}

interface Page {
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  status: string;
}

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '', short_name: '', slug: '', price: 0, image: '',
  categories: [], short_description: '', description: '',
  external_url: '', in_stock: true, featured: false, badge: '',
};

const EMPTY_POST: Omit<Post, 'id'> = {
  title: '', slug: '', content: '', excerpt: '',
  categories: [], date: new Date().toISOString().split('T')[0],
  tags: [], status: 'published',
};

const EMPTY_PAGE: Page = {
  title: '', slug: '', content: '', metaDescription: '', status: 'published',
};

const BADGES = ['Best Value', "Editor's Choice", 'Top Pick', 'Limited Deal', ''];
const POST_STATUSES = ['published', 'draft', 'scheduled'];
const PAGE_STATUSES = ['published', 'draft'];

// ============================================================
// HELPERS
// ============================================================
function getWordCount(html: string): number {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

function getCharCount(text: string): number {
  return text.replace(/<[^>]+>/g, '').trim().length;
}

function generateSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'products' | 'pages'>('posts');
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Product form state
  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [productCategoriesInput, setProductCategoriesInput] = useState('');

  // Post form state
  const [post, setPost] = useState(EMPTY_POST);
  const [postCategoriesInput, setPostCategoriesInput] = useState('');
  const [postTagsInput, setPostTagsInput] = useState('');

  // Page form state
  const [page, setPage] = useState(EMPTY_PAGE);

  // Load item for editing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const id = params.get('id');

    if (type && id) {
      setActiveTab(type as 'posts' | 'products' | 'pages');
      setEditId(id);
      setIsEditing(true);

      if (type === 'page') {
        fetch('/api/content/pages')
          .then(r => r.json())
          .then((data: any[]) => {
            const found = data.find((p: any) => String(p.id) === String(id));
            if (found) {
              setPage({
                title: found.title || '',
                slug: found.slug || '',
                content: found.content || '',
                metaDescription: found.metaDescription || '',
                status: found.status || 'published',
              });
            }
          })
          .catch(() => setMessage({ type: 'error', text: 'Failed to load page' }));
      } else {
        fetch(`/api/content?type=${type}&id=${id}`)
          .then(r => r.json())
          .then(data => {
            if (type === 'product') {
              setProduct(data);
              setProductCategoriesInput(data.categories?.join(', ') || '');
            } else {
              setPost(data);
              setPostCategoriesInput(data.categories?.join(', ') || '');
              setPostTagsInput(data.tags?.join(', ') || '');
            }
          })
          .catch(() => setMessage({ type: 'error', text: 'Failed to load item' }));
      }
    } else {
      setIsEditing(false);
      setEditId(null);
      setProduct(EMPTY_PRODUCT);
      setPost(EMPTY_POST);
      setPage(EMPTY_PAGE);
      setProductCategoriesInput('');
      setPostCategoriesInput('');
      setPostTagsInput('');
    }
  }, [typeof window !== 'undefined' ? window.location.search : '']);

  // Auto-generate slug from title/name
  useEffect(() => {
    if (!isEditing) {
      if (activeTab === 'posts' && post.title && !post.slug) {
        setPost(p => ({ ...p, slug: generateSlug(post.title) }));
      }
      if (activeTab === 'products' && product.short_name && !product.slug) {
        setProduct(p => ({ ...p, slug: generateSlug(product.short_name) }));
      }
      if (activeTab === 'pages' && page.title && !page.slug) {
        setPage(p => ({ ...p, slug: generateSlug(page.title) }));
      }
    }
  }, [activeTab, post.title, product.short_name, page.title, isEditing, post.slug, product.slug, page.slug]);

  // Keyboard shortcuts moved below handleSave definition

  // Clear message after 5s
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(t);
    }
  }, [message]);

  // ===== SAVE HANDLERS =====

  const handleSaveProduct = useCallback(async (redirect = false) => {
    if (!product.short_name) { setMessage({ type: 'error', text: 'Product name is required' }); return; }
    setSaving(true); setMessage(null);
    try {
      const payload = {
        ...product,
        categories: productCategoriesInput.split(',').map(c => c.trim()).filter(Boolean),
        slug: product.slug || generateSlug(product.short_name),
      };
      const res = await fetch('/api/content', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'product', id: isEditing ? editId : undefined, data: payload }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage({ type: 'success', text: isEditing ? 'Product updated!' : 'Product created!' });
        if (!isEditing) { setProduct(EMPTY_PRODUCT); setProductCategoriesInput(''); }
        if (redirect) window.location.href = '/dashboard/admin/content?tab=products';
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save' });
      }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
    finally { setSaving(false); }
  }, [product, productCategoriesInput, isEditing, editId]);

  const handleSavePost = useCallback(async (redirect = false) => {
    if (!post.title) { setMessage({ type: 'error', text: 'Post title is required' }); return; }
    setSaving(true); setMessage(null);
    try {
      const payload = {
        ...post,
        categories: postCategoriesInput.split(',').map(c => c.trim()).filter(Boolean),
        tags: postTagsInput.split(',').map(t => t.trim()).filter(Boolean),
        slug: post.slug || generateSlug(post.title),
      };
      const res = await fetch('/api/content', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post', id: isEditing ? editId : undefined, data: payload }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage({ type: 'success', text: isEditing ? 'Post updated!' : 'Post created!' });
        if (!isEditing) { setPost(EMPTY_POST); setPostCategoriesInput(''); setPostTagsInput(''); }
        if (redirect) window.location.href = '/dashboard/admin/content?tab=posts';
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save' });
      }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
    finally { setSaving(false); }
  }, [post, postCategoriesInput, postTagsInput, isEditing, editId]);

  const handleSavePage = useCallback(async (redirect = false) => {
    if (!page.title) { setMessage({ type: 'error', text: 'Page title is required' }); return; }
    setSaving(true); setMessage(null);
    try {
      const payload = { ...page, slug: page.slug || generateSlug(page.title) };
      const res = await fetch('/api/content/pages', {
        method: isEditing && editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing && editId ? { ...payload, id: editId } : payload),
      });
      const result = await res.json();
      if (result.success || result.id) {
        setMessage({ type: 'success', text: isEditing ? 'Page updated!' : 'Page created!' });
        if (!isEditing) { setPage(EMPTY_PAGE); }
        if (redirect) window.location.href = '/dashboard/admin/content?tab=pages';
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save' });
      }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
    finally { setSaving(false); }
  }, [page, isEditing, editId]);

  const handleSave = useCallback((redirect = false) => {
    if (activeTab === 'products') handleSaveProduct(redirect);
    else if (activeTab === 'posts') handleSavePost(redirect);
    else handleSavePage(redirect);
  }, [activeTab, handleSaveProduct, handleSavePost, handleSavePage]);

  // Keyboard shortcuts (Ctrl+S to save)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  // ===== STYLES =====
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.625rem 0.875rem', background: '#141418',
    border: '1px solid #1e1e26', borderRadius: '8px', color: '#f0f0f2',
    fontSize: '0.875rem', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8125rem', fontWeight: 600,
    color: '#9090a0', marginBottom: '0.375rem',
  };

  // ===== COMPUTED =====
  const currentContent = activeTab === 'products' ? product.description : activeTab === 'posts' ? post.content : page.content;
  const currentTitle = activeTab === 'products' ? product.short_name : activeTab === 'posts' ? post.title : page.title;
  const wordCount = getWordCount(currentContent);
  const charCount = getCharCount(currentContent);

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {isEditing ? `Edit ${activeTab.slice(0, -1)}` : 'Create Content'}
          </h1>
          <p style={{ color: '#9090a0', fontSize: '0.875rem' }}>
            {isEditing ? `Editing #${editId}` : 'Add new products, blog posts, or pages'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/dashboard/admin/content" className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
            ← Back
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['posts', 'products', 'pages'] as const).map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setMessage(null); setShowPreview(false); }} style={{
            padding: '0.625rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600,
            background: activeTab === tab ? 'rgba(212,168,67,0.1)' : 'transparent',
            color: activeTab === tab ? '#D4A843' : '#9090a0',
            border: activeTab === tab ? '1px solid rgba(212,168,67,0.25)' : '1px solid transparent',
            cursor: 'pointer', textTransform: 'capitalize',
          }}>{tab}</button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem',
          background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          color: message.type === 'success' ? '#22c55e' : '#ef4444',
          fontSize: '0.875rem', border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
        </div>
      )}

      {/* Preview Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#5a5a6a' }}>
          <span>{wordCount} words</span>
          <span>·</span>
          <span>{charCount} chars</span>
          {activeTab === 'posts' && post.excerpt && (
            <><span>·</span><span style={{ color: post.excerpt.length > 160 ? '#f59e0b' : '#22c55e' }}>Meta: {post.excerpt.length}/160</span></>
          )}
          {activeTab === 'pages' && page.metaDescription && (
            <><span>·</span><span style={{ color: page.metaDescription.length > 160 ? '#f59e0b' : '#22c55e' }}>Meta: {page.metaDescription.length}/160</span></>
          )}
        </div>
        <button onClick={() => setShowPreview(!showPreview)} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>
          {showPreview ? '✏️ Edit' : '👁️ Preview'}
        </button>
      </div>

      {/* ===== PREVIEW ===== */}
      {showPreview && (
        <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#fff', borderRadius: '12px', color: '#1a1a1a', minHeight: '200px' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            {activeTab === 'products' && (
              <>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1a1a1a' }}>{product.short_name || 'Product Name'}</h1>
                {product.price > 0 && <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#D4A843', marginBottom: '1rem' }}>${product.price.toFixed(2)}</div>}
                {product.image && <img src={product.image} alt="" style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain', marginBottom: '1rem' }} />}
                <div dangerouslySetInnerHTML={{ __html: product.description || '<p>No description yet...</p>' }} style={{ lineHeight: 1.7, color: '#333' }} />
              </>
            )}
            {activeTab === 'posts' && (
              <>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1a1a1a' }}>{post.title || 'Post Title'}</h1>
                <div style={{ fontSize: '0.8125rem', color: '#666', marginBottom: '1.5rem' }}>
                  {post.date && new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {post.categories?.length > 0 && <span> · {post.categories.join(', ')}</span>}
                </div>
                <div dangerouslySetInnerHTML={{ __html: post.content || '<p>No content yet...</p>' }} style={{ lineHeight: 1.8, color: '#333' }} />
              </>
            )}
            {activeTab === 'pages' && (
              <>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#1a1a1a' }}>{page.title || 'Page Title'}</h1>
                <div dangerouslySetInnerHTML={{ __html: page.content || '<p>No content yet...</p>' }} style={{ lineHeight: 1.8, color: '#333' }} />
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== PRODUCT FORM ===== */}
      {activeTab === 'products' && !showPreview && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Product Name *</label>
              <input type="text" value={product.short_name} onChange={e => setProduct({ ...product, short_name: e.target.value })} placeholder="e.g. beyerdynamic DT 990 PRO" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Slug</label>
              <input type="text" value={product.slug} onChange={e => setProduct({ ...product, slug: e.target.value })} placeholder="auto-generated" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Price ($)</label>
              <input type="number" value={product.price} onChange={e => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })} placeholder="0.00" step="0.01" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Badge</label>
              <select value={product.badge || ''} onChange={e => setProduct({ ...product, badge: e.target.value || null })} style={inputStyle}>
                <option value="">None</option>
                {BADGES.filter(b => b).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Categories (comma-separated)</label>
              <input type="text" value={productCategoriesInput} onChange={e => setProductCategoriesInput(e.target.value)} placeholder="Shop: Headphones and IEMs" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Image URL</label>
            <input type="text" value={product.image} onChange={e => setProduct({ ...product, image: e.target.value })} placeholder="/images/products/filename.jpg or full URL" style={inputStyle} />
            {product.image && <img src={product.image} alt="Preview" style={{ marginTop: '0.5rem', maxWidth: '120px', maxHeight: '120px', objectFit: 'contain', background: '#1a1a20', borderRadius: '8px', padding: '0.5rem' }} />}
          </div>
          <div>
            <label style={labelStyle}>Affiliate / External URL</label>
            <input type="text" value={product.external_url} onChange={e => setProduct({ ...product, external_url: e.target.value })} placeholder="https://amazon.com/dp/B0DGLV6QVX/?tag=ghettosuper02-20" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Short Description</label>
            <textarea value={product.short_description} onChange={e => setProduct({ ...product, short_description: e.target.value })} rows={2} placeholder="Brief product summary..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={labelStyle}>Full Description (HTML supported)</label>
            <textarea value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })} rows={8} placeholder="<p>Full product description with <strong>HTML</strong> formatting...</p>" style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input type="checkbox" checked={product.in_stock} onChange={e => setProduct({ ...product, in_stock: e.target.checked })} style={{ accentColor: '#D4A843', width: '16px', height: '16px' }} />
              In Stock
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input type="checkbox" checked={product.featured} onChange={e => setProduct({ ...product, featured: e.target.checked })} style={{ accentColor: '#D4A843', width: '16px', height: '16px' }} />
              Featured
            </label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button onClick={() => { setProduct(EMPTY_PRODUCT); setProductCategoriesInput(''); setIsEditing(false); setEditId(null); }} className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>Clear</button>
            <button onClick={() => handleSaveProduct(false)} disabled={saving} className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => handleSaveProduct(true)} disabled={saving} className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.625rem 2rem' }}>{saving ? 'Saving...' : isEditing ? 'Update & Close' : 'Create & Close'}</button>
          </div>
        </div>
      )}

      {/* ===== POST FORM ===== */}
      {activeTab === 'posts' && !showPreview && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Post Title *</label>
            <input type="text" value={post.title} onChange={e => setPost({ ...post, title: e.target.value })} placeholder="e.g. Best Studio Headphones Under $500" style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Slug</label>
              <input type="text" value={post.slug} onChange={e => setPost({ ...post, slug: e.target.value })} placeholder="auto-generated" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={post.date} onChange={e => setPost({ ...post, date: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Categories (comma-separated)</label>
              <input type="text" value={postCategoriesInput} onChange={e => setPostCategoriesInput(e.target.value)} placeholder="Music Production, Buying Guides" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input type="text" value={postTagsInput} onChange={e => setPostTagsInput(e.target.value)} placeholder="headphones, studio, audio" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>
              Excerpt / Meta Description
              <span style={{ fontWeight: 400, color: post.excerpt.length > 160 ? '#f59e0b' : '#5a5a6a', marginLeft: '0.5rem' }}>({post.excerpt.length}/160)</span>
            </label>
            <textarea value={post.excerpt} onChange={e => setPost({ ...post, excerpt: e.target.value })} rows={2} placeholder="Brief summary for SEO and previews..." style={{ ...inputStyle, resize: 'vertical', borderColor: post.excerpt.length > 160 ? '#f59e0b' : '#1e1e26' }} />
          </div>
          <div>
            <label style={labelStyle}>Content (HTML supported)</label>
            <textarea value={post.content} onChange={e => setPost({ ...post, content: e.target.value })} rows={14} placeholder="<h2>Introduction</h2><p>Your blog post content here...</p>" style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.875rem', color: '#9090a0' }}>Status:</label>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {POST_STATUSES.map(s => (
                <button key={s} onClick={() => setPost({ ...post, status: s })} style={{
                  padding: '0.375rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                  background: post.status === s ? 'rgba(212,168,67,0.1)' : 'transparent',
                  color: post.status === s ? '#D4A843' : '#5a5a6a',
                  border: post.status === s ? '1px solid rgba(212,168,67,0.25)' : '1px solid #1e1e26',
                  cursor: 'pointer', textTransform: 'capitalize',
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button onClick={() => { setPost(EMPTY_POST); setPostCategoriesInput(''); setPostTagsInput(''); setIsEditing(false); setEditId(null); }} className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>Clear</button>
            <button onClick={() => handleSavePost(false)} disabled={saving} className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => handleSavePost(true)} disabled={saving} className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.625rem 2rem' }}>{saving ? 'Saving...' : isEditing ? 'Update & Close' : 'Create & Close'}</button>
          </div>
        </div>
      )}

      {/* ===== PAGE FORM ===== */}
      {activeTab === 'pages' && !showPreview && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Page Title *</label>
              <input type="text" value={page.title} onChange={e => setPage({ ...page, title: e.target.value })} placeholder="e.g. About Us" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Slug</label>
              <input type="text" value={page.slug} onChange={e => setPage({ ...page, slug: e.target.value })} placeholder="auto-generated" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>
              Meta Description
              <span style={{ fontWeight: 400, color: page.metaDescription.length > 160 ? '#f59e0b' : '#5a5a6a', marginLeft: '0.5rem' }}>({page.metaDescription.length}/160)</span>
            </label>
            <textarea value={page.metaDescription} onChange={e => setPage({ ...page, metaDescription: e.target.value })} rows={2} placeholder="Brief description for SEO..." style={{ ...inputStyle, resize: 'vertical', borderColor: page.metaDescription.length > 160 ? '#f59e0b' : '#1e1e26' }} />
          </div>
          <div>
            <label style={labelStyle}>Content (HTML supported)</label>
            <textarea value={page.content} onChange={e => setPage({ ...page, content: e.target.value })} rows={14} placeholder="<h1>Page Title</h1><p>Your page content here...</p>" style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.875rem', color: '#9090a0' }}>Status:</label>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {PAGE_STATUSES.map(s => (
                <button key={s} onClick={() => setPage({ ...page, status: s })} style={{
                  padding: '0.375rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                  background: page.status === s ? 'rgba(212,168,67,0.1)' : 'transparent',
                  color: page.status === s ? '#D4A843' : '#5a5a6a',
                  border: page.status === s ? '1px solid rgba(212,168,67,0.25)' : '1px solid #1e1e26',
                  cursor: 'pointer', textTransform: 'capitalize',
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button onClick={() => { setPage(EMPTY_PAGE); setIsEditing(false); setEditId(null); }} className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>Clear</button>
            <button onClick={() => handleSavePage(false)} disabled={saving} className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => handleSavePage(true)} disabled={saving} className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.625rem 2rem' }}>{saving ? 'Saving...' : isEditing ? 'Update & Close' : 'Create & Close'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
