'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import products from '@/data/products.json';
import productCategories from '@/data/product-categories.json';

function GearContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const [sortBy, setSortBy] = useState('default');
  const [activeCat, setActiveCat] = useState(catParam || 'all');

  const filteredProducts = useMemo(() => {
    let filtered = activeCat === 'all'
      ? products
      : products.filter(p => p.categories.some(c => c.toLowerCase().includes(activeCat.toLowerCase().replace(/-/g, ' '))));
    switch (sortBy) {
      case 'price-low': return [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-high': return [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'name': return [...filtered].sort((a, b) => a.short_name.localeCompare(b.short_name));
      default: return filtered;
    }
  }, [activeCat, sortBy]);

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: '1px solid',
    borderColor: active ? 'var(--accent)' : 'var(--border)',
    background: active ? 'var(--accent-dim)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-secondary)',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    cursor: 'pointer',
  });

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveCat('all')} style={btnStyle(activeCat === 'all')}>All</button>
          {productCategories.map(cat => (
            <button key={cat.slug} onClick={() => setActiveCat(cat.slug)} style={btnStyle(activeCat === cat.slug)}>{cat.name}</button>
          ))}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.8125rem', cursor: 'pointer', marginLeft: 'auto' }}>
          <option value="default">Sort by</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="grid-3">
        {filteredProducts.map(product => (
          <Link key={product.id} href={`/gear/${product.slug}`} className="card product-card">
            <div className="product-card-image">
              {product.image ? <img src={product.image} alt={product.short_name} loading="lazy" /> : <span className="text-muted" style={{ fontSize: '0.75rem' }}>No Image</span>}
            </div>
            <div style={{ padding: '1rem' }}>
              <p className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>{product.categories[0]?.replace('Shop: ', '') || 'Gear'}</p>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.short_name}</h3>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.short_description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-accent" style={{ fontSize: '1rem', fontWeight: 700 }}>${product.price}</span>
                <span className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>View Deal →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-muted" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p>No products found in this category.</p>
        </div>
      )}
    </>
  );
}

export default function GearPage() {
  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <p className="label" style={{ marginBottom: '0.5rem' }}>Shop</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>All Gear</h1>
          <p className="text-secondary">23 products</p>
        </div>
        <Suspense fallback={<div className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
          <GearContent />
        </Suspense>
      </div>
    </div>
  );
}
