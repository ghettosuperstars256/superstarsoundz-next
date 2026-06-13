'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ToastProvider } from '@/components/ToastProvider';
import { DashboardStyles } from '@/components/dashboard-ui';

const NAV = [
  { href: '/dashboard/admin', label: 'Command Center', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { href: '/dashboard/admin/content', label: 'All Content', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { href: '/dashboard/admin/editor', label: 'Create New', icon: 'M12 4v16m8-8H4' },
  { href: '/dashboard/admin/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { href: '/dashboard/admin/scraper', label: 'Scraper', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { href: '/dashboard/admin/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { href: '/dashboard/admin/seo', label: 'SEO Center', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { href: '/dashboard/admin/health', label: 'Site Health', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { href: '/dashboard/admin/campaigns', label: 'Campaigns', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { href: '/dashboard/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

const SIDEBAR_W = 260;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (mobileOpen && isMobile) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, isMobile]);

  useEffect(() => {
    fetch('/api/auth/login', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.authenticated && data.user) setUser(data.user);
        else router.push('/login?redirect=/dashboard/admin');
      })
      .catch(() => router.push('/login?redirect=/dashboard/admin'));
  }, [router]);

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#08080a' }}>
        <div style={{ textAlign: 'center', color: '#9090a0' }}>Loading...</div>
      </div>
    );
  }

  const C = { bg: '#08080a', sidebar: '#0a0a0e', border: '#1e1e26', text: '#f0f0f2', muted: '#5a5a6a', secondary: '#9090a0', accent: '#D4A843' };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside style={{
          width: SIDEBAR_W, flexShrink: 0,
          background: C.sidebar, borderRight: `1px solid ${C.border}`,
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: 0, bottom: 0,
          zIndex: 50, overflow: 'hidden',
        }}>
          {/* Logo */}
          <div style={{ padding: '1rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #D4A843, #C49A38)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000', fontSize: '0.875rem' }}>SS</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: C.text }}>SSZ Admin</div>
              <div style={{ fontSize: '0.6875rem', color: C.muted }}>Command Center</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '0.75rem', overflowY: 'auto' }}>
            {NAV.map(item => {
              const active = pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.625rem 0.75rem', borderRadius: 8,
                  fontSize: '0.875rem', fontWeight: 500,
                  color: active ? C.accent : C.secondary,
                  background: active ? 'rgba(212,168,67,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(212,168,67,0.15)' : '1px solid transparent',
                  marginBottom: '0.125rem', textDecoration: 'none', minHeight: 44,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}><path d={item.icon} /></svg>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div style={{ padding: '0.75rem', borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #D4A843, #E8C05A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#000', fontSize: '0.75rem' }}>A</div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: C.text }}>{user.name}</div>
                <div style={{ fontSize: '0.6875rem', color: C.muted }}>Administrator</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <Link href="/" target="_blank" style={{ flex: 1, padding: '0.5rem', textAlign: 'center', fontSize: '0.6875rem', color: C.secondary, border: `1px solid ${C.border}`, borderRadius: 6, textDecoration: 'none' }}>View Site</Link>
              <button onClick={async () => { await fetch('/api/auth/login', { method: 'DELETE', credentials: 'include' }); router.push('/login'); }} style={{ flex: 1, padding: '0.5rem', fontSize: '0.6875rem', color: '#ef4444', border: `1px solid ${C.border}`, borderRadius: 6, background: 'transparent', cursor: 'pointer' }}>Logout</button>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)' }} onClick={() => setMobileOpen(false)}>
          <aside style={{ width: 280, height: '100vh', background: C.sidebar, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #D4A843, #C49A38)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000', fontSize: '0.875rem' }}>SS</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: C.text }}>SSZ Admin</div>
                <div style={{ fontSize: '0.6875rem', color: C.muted }}>Command Center</div>
              </div>
            </div>
            <nav style={{ flex: 1, padding: '0.75rem', overflowY: 'auto' }}>
              {NAV.map(item => {
                const active = pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.625rem 0.75rem', borderRadius: 8,
                    fontSize: '0.875rem', fontWeight: 500,
                    color: active ? C.accent : C.secondary,
                    background: active ? 'rgba(212,168,67,0.08)' : 'transparent',
                    marginBottom: '0.125rem', textDecoration: 'none', minHeight: 44,
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}><path d={item.icon} /></svg>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <main style={{
        marginLeft: !isMobile ? SIDEBAR_W : 0,
        flex: 1, height: '100vh',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        {/* Mobile header */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}`, background: C.sidebar, position: 'sticky', top: 0, zIndex: 40 }}>
            <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer', padding: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <span style={{ fontWeight: 700, color: C.text }}>SSZ Admin</span>
            <div style={{ width: 44 }} />
          </div>
        )}

        <ToastProvider>
          <DashboardStyles />
          <div style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
            {children}
          </div>
        </ToastProvider>
      </main>
    </div>
  );
}
