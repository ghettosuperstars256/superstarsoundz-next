'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

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
}

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '',
  short_name: '',
  slug: '',
  price: 0,
  image: '',
  categories: [],
  short_description: '',
  description: '',
  external_url: '',
  in_stock: true,
  featured: false,
  badge: '',
};

const EMPTY_POST: Omit<Post, 'id'> = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  categories: [],
  date: new Date().toISOString().split('T')[0],
};

const BADGES = ['Best Value', "Editor's Choice", 'Top Pick', 'Limited Deal', ''];

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'products'>('posts');
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Product form state
  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [productCategoriesInput, setProductCategoriesInput] = useState('');

  // Post form state
  const [post, setPost] = useState(EMPTY_POST);
  const [postCategoriesInput, setPostCategoriesInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load item for editing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const id = params.get('id');

    if (type && id) {
      setActiveTab(type as 'posts' | 'products');
      setEditId(id);
      setIsEditing(true);

      fetch(`/api/content?type=${type}&id=${id}`)
        .then(r => r.json())
        .then(data => {
          if (type === 'product') {
            setProduct(data);
            setProductCategoriesInput(data.categories?.join(', ') || '');
          } else {
            setPost(data);
            setPostCategoriesInput(data.categories?.join(', ') || '');
          }
        })
        .catch(() => {
          setMessage({ type: 'error', text: 'Failed to load item for editing' });
        });
    } else {
      setIsEditing(false);
      setEditId(null);
      setProduct(EMPTY_PRODUCT);
      setPost(EMPTY_POST);
      setProductCategoriesInput('');
      setPostCategoriesInput('');
    }
  }, [typeof window !== 'undefined' ? window.location.search : '']);

  const handleSaveProduct = useCallback(async () => {
    if (!product.short_name) {
      setMessage({ type: 'error', text: 'Product name is required' });
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        ...product,
        categories: productCategoriesInput.split(',').map(c => c.trim()).filter(Boolean),
        slug: product.slug || product.short_name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'),
      };

      const res = await fetch('/api/content', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'product',
          id: isEditing ? editId : undefined,
          data: payload,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage({ type: 'success', text: isEditing ? 'Product updated successfully!' : 'Product created successfully!' });
        if (!isEditing) {
          setProduct(EMPTY_PRODUCT);
          setProductCategoriesInput('');
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save product' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  }, [product, productCategoriesInput, isEditing, editId]);

  const handleSavePost = useCallback(async () => {
    if (!post.title) {
      setMessage({ type: 'error', text: 'Post title is required' });
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        ...post,
        categories: postCategoriesInput.split(',').map(c => c.trim()).filter(Boolean),
        slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'),
      };

      const res = await fetch('/api/content', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'post',
          id: isEditing ? editId : undefined,
          data: payload,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage({ type: 'success', text: isEditing ? 'Post updated successfully!' : 'Post created successfully!' });
        if (!isEditing) {
          setPost(EMPTY_POST);
          setPostCategoriesInput('');
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save post' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  }, [post, postCategoriesInput, isEditing, editId]);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.625rem 0.875rem', background: '#141418',
    border: '1px solid #1e1e26', borderRadius: '8px', color: '#f0f0f2',
    fontSize: '0.875rem', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8125rem', fontWeight: 600,
    color: '#9090a0', marginBottom: '0.375rem',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {isEditing ? 'Edit Content' : 'Create Content'}
          </h1>
          <p style={{ color: '#9090a0', fontSize: '0.875rem' }}>
            {isEditing ? `Editing ${activeTab === 'products' ? 'product' : 'post'} #${editId}` : 'Add new products or blog posts'}
          </p>
        </div>
        <Link href="/dashboard/admin/content" className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
          ← Back to Content Manager
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['posts', 'products'] as const).map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setMessage(null); }} style={{
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
        }}>{message.text}</div>
      )}

      {/* Product Form */}
      {activeTab === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Product Name *</label>
              <input type="text" value={product.short_name} onChange={e => setProduct({ ...product, short_name: e.target.value })}
                placeholder="e.g. beyerdynamic DT 990 PRO" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Slug</label>
              <input type="text" value={product.slug} onChange={e => setProduct({ ...product, slug: e.target.value })}
                placeholder="auto-generated from name" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Price ($)</label>
              <input type="number" value={product.price} onChange={e => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00" step="0.01" style={inputStyle} />
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
              <input type="text" value={productCategoriesInput} onChange={e => setProductCategoriesInput(e.target.value)}
                placeholder="Shop: Headphones and IEMs" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Image URL</label>
            <input type="text" value={product.image} onChange={e => setProduct({ ...product, image: e.target.value })}
              placeholder="/images/products/filename.jpg or full URL" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Affiliate / External URL</label>
            <input type="text" value={product.external_url} onChange={e => setProduct({ ...product, external_url: e.target.value })}
              placeholder="https://amazon.com/dp/B0DGLV6QVX/?tag=ghettosuper02-20" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Short Description</label>
            <textarea value={product.short_description} onChange={e => setProduct({ ...product, short_description: e.target.value })}
              rows={2} placeholder="Brief product summary..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={labelStyle}>Full Description (HTML supported)</label>
            <textarea value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })}
              rows={6} placeholder="<p>Full product description with <strong>HTML</strong> formatting...</p>" style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input type="checkbox" checked={product.in_stock} onChange={e => setProduct({ ...product, in_stock: e.target.checked })}
                style={{ accentColor: '#D4A843', width: '16px', height: '16px' }} />
              In Stock
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input type="checkbox" checked={product.featured} onChange={e => setProduct({ ...product, featured: e.target.checked })}
                style={{ accentColor: '#D4A843', width: '16px', height: '16px' }} />
              Featured
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => { setProduct(EMPTY_PRODUCT); setProductCategoriesInput(''); setIsEditing(false); setEditId(null); }}
              className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>
              Clear
            </button>
            <button onClick={handleSaveProduct} disabled={saving} className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.625rem 2rem' }}>
              {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      )}

      {/* Post Form */}
      {activeTab === 'posts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Post Title *</label>
              <input type="text" value={post.title} onChange={e => setPost({ ...post, title: e.target.value })}
                placeholder="e.g. Best Studio Headphones Under $500" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Slug</label>
              <input type="text" value={post.slug} onChange={e => setPost({ ...post, slug: e.target.value })}
                placeholder="auto-generated from title" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={post.date} onChange={e => setPost({ ...post, date: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Categories (comma-separated)</label>
              <input type="text" value={postCategoriesInput} onChange={e => setPostCategoriesInput(e.target.value)}
                placeholder="Music Production, Buying Guides" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Excerpt / Meta Description</label>
            <textarea value={post.excerpt} onChange={e => setPost({ ...post, excerpt: e.target.value })}
              rows={2} placeholder="Brief summary for SEO and previews..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={labelStyle}>Content (HTML supported)</label>
            <textarea value={post.content} onChange={e => setPost({ ...post, content: e.target.value })}
              rows={12} placeholder="<h2>Introduction</h2><p>Your blog post content here...</p>" style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => { setPost(EMPTY_POST); setPostCategoriesInput(''); setIsEditing(false); setEditId(null); }}
              className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>
              Clear
            </button>
            <button onClick={handleSavePost} disabled={saving} className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.625rem 2rem' }}>
              {saving ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
