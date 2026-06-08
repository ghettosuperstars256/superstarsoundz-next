'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import products from '@/data/products.json';
import posts from '@/data/posts.json';

interface SearchResult {
  type: 'product' | 'post' | 'category';
  title: string;
  subtitle: string;
  href: string;
  image?: string;
}

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const productResults: SearchResult[] = products
      .filter(p => p.short_name.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.short_description.toLowerCase().includes(q))
      .slice(0, 5)
      .map(p => ({
        type: 'product',
        title: p.short_name,
        subtitle: `$${p.price} · ${p.categories[0]?.replace('Shop: ', '') || 'Shop'}`,
        href: `/gear/${p.slug}`,
        image: p.image,
      }));
    const postResults: SearchResult[] = posts
      .filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
      .slice(0, 4)
      .map(p => ({
        type: 'post',
        title: p.title,
        subtitle: p.date,
        href: `/blog/${p.slug}`,
      }));
    setResults([...productResults, ...postResults]);
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      router.push(results[selectedIndex].href);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [results, selectedIndex, router, onClose]);

  useEffect(() => {
    if (resultsRef.current) {
      const selected = resultsRef.current.children[selectedIndex] as HTMLElement;
      selected?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', justifyContent: 'center', paddingTop: '15vh',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '100%', maxWidth: '600px', margin: '0 1rem',
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--accent)', flexShrink: 0 }}>
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12.5 12.5L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, guides..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontSize: '1rem',
            }}
          />
          <kbd style={{
            padding: '0.125rem 0.375rem', borderRadius: '4px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'monospace',
          }}>ESC</kbd>
        </div>
        {results.length > 0 && (
          <div ref={resultsRef} style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {results.map((r, i) => (
              <Link
                key={`${r.type}-${r.href}-${i}`}
                href={r.href}
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1.25rem',
                  background: i === selectedIndex ? 'var(--accent-dim)' : 'transparent',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.1s',
                }}
              >
                {r.image ? (
                  <img src={r.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', background: 'var(--bg-card)', flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '4px',
                    background: r.type === 'post' ? 'var(--accent-dim)' : 'var(--bg-card)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '0.625rem', fontWeight: 700, color: 'var(--accent)',
                  }}>
                    {r.type === 'post' ? 'GUIDE' : r.type === 'category' ? 'CAT' : 'GEAR'}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.subtitle}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {query.trim() && results.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No results for "{query}"
          </div>
        )}
        {!query.trim() && (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Type to search products and buying guides...
          </div>
        )}
      </div>
    </div>
  );
}
