'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UserDashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/login', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.authenticated && data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.375rem', color: '#f0f0f2' }}>
          Welcome back, {user?.name || 'User'}
        </h1>
        <p style={{ color: '#9090a0', fontSize: '0.875rem' }}>Your Superstar Soundz dashboard</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Saved Articles', value: '0', color: '#D4A843', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
          { label: 'AI Tools Used', value: '0', color: '#3b82f6', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
          { label: 'Comments', value: '0', color: '#22c55e', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
        ].map((stat, i) => (
          <div key={i} style={{ padding: '1.5rem', background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="1.5"><path d={stat.icon} /></svg>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.8125rem', color: '#9090a0', marginTop: '0.25rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#f0f0f2' }}>Quick Links</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link href="/ai-tools" style={{ padding: '1.5rem', background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', textDecoration: 'none' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#f0f0f2', marginBottom: '0.25rem' }}>Free AI Music Tools</div>
          <div style={{ fontSize: '0.75rem', color: '#5a5a6a' }}>Explore our collection of free AI tools for music production</div>
        </Link>
        <Link href="/blog" style={{ padding: '1.5rem', background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', textDecoration: 'none' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(212,168,67,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.5"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#f0f0f2', marginBottom: '0.25rem' }}>Browse Blog</div>
          <div style={{ fontSize: '0.75rem', color: '#5a5a6a' }}>Read the latest gear reviews and buying guides</div>
        </Link>
        <Link href="/gear" style={{ padding: '1.5rem', background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26', textDecoration: 'none' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#f0f0f2', marginBottom: '0.25rem' }}>Shop Gear</div>
          <div style={{ fontSize: '0.75rem', color: '#5a5a6a' }}>Browse our curated collection of music equipment</div>
        </Link>
      </div>
    </div>
  );
}
