'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email.');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <footer style={{ background: '#0e0e12', borderTop: '1px solid #1e1e26' }}>
      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid #1e1e26', padding: '2rem 0' }}>
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: '2rem', flexWrap: 'wrap',
            padding: 'clamp(1.25rem, 3vw, 2rem)', background: '#121216', borderRadius: '16px',
            border: '1px solid #1e1e26',
          }}>
            <div style={{ flex: '1 1 250px' }}>
              <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 700, marginBottom: '0.5rem' }}>Stay in the Loop</h3>
              <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: '#9090a0', lineHeight: 1.6 }}>
                Get the latest deals, buying guides, and product reviews delivered to your inbox. No spam, ever.
              </p>
            </div>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 300px', maxWidth: '420px' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                placeholder="Enter your email"
                style={{
                  flex: 1, minWidth: 0, padding: '0.75rem 1rem', borderRadius: '10px',
                  border: '1px solid #1e1e26', background: '#141418',
                  color: '#f0f0f2', fontSize: '0.875rem', outline: 'none',
                  transition: 'border-color 0.15s',
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap', fontSize: '0.8125rem' }} disabled={status === 'loading'}>
                {status === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
          </div>
          {status !== 'idle' && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: status === 'success' ? '#22c55e' : '#ef4444' }}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="container" style={{ padding: '2.5rem 0 1.5rem' }}>
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}>
          <div>
            <Logo variant="dark" height={28} />
            <p style={{ fontSize: '0.875rem', color: '#9090a0', lineHeight: 1.7, marginTop: '1rem', maxWidth: '280px' }}>
              Expert reviews, buying guides, and curated audio equipment for musicians, DJs, and producers worldwide.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4A843', marginBottom: '1rem', letterSpacing: '0.08em' }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: '/gear', label: 'All Shop' },
                { href: '/category/microphones', label: 'Microphones' },
                { href: '/category/headphones-and-iems', label: 'Headphones' },
                { href: '/category/studio-monitors', label: 'Studio Monitors' },
                { href: '/category/dj-controllers', label: 'DJ Controllers' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="footer-link">{link.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4A843', marginBottom: '1rem', letterSpacing: '0.08em' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: '/services', label: 'Services' },
                { href: '/blog', label: 'Blog' },
                { href: '/tools', label: 'Free AI Music Tools' },
                { href: '/plugins', label: 'Plugins' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="footer-link">{link.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4A843', marginBottom: '1rem', letterSpacing: '0.08em' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms-of-service', label: 'Terms of Service' },
                { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="footer-link">{link.label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div className="divider" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#5a5a6a' }}>© {new Date().getFullYear()} Superstar Soundz. All rights reserved.</p>
          <p style={{ fontSize: '0.75rem', color: '#5a5a6a', textAlign: 'right' }}>As an Amazon Associate we earn from qualifying purchases.</p>
        </div>
      </div>
    </footer>
  );
}
