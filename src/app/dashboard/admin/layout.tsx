'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ToastProvider } from '@/components/ToastProvider';
import { DashboardStyles } from '@/components/dashboard-ui';

// ============================================================
// NAVIGATION CONFIG
// ============================================================
const NAV_SECTIONS = [
  {
    label: 'OVERVIEW',
    items: [
      { href: '/dashboard/admin', label: 'Command Center', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { href: '/dashboard/admin/content', label: 'All Content', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { href: '/dashboard/admin/editor', label: 'Create New', icon: 'M12 4v16m8-8H4' },
      { href: '/dashboard/admin/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    ],
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { href: '/dashboard/admin/scraper', label: 'Scraper', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
      { href: '/dashboard/admin/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { href: '/dashboard/admin/seo', label: 'SEO Center', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
      { href: '/dashboard/admin/health', label: 'Site Health', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { href: '/dashboard/admin/campaigns', label: 'Campaigns', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { href: '/dashboard/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ],
  },
];

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 64;

// ============================================================
// LAYOUT COMPONENT
// ============================================================
export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile (< 768px)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = (mobileOpen && isMobile) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, isMobile]);

  // Auth check
  useEffect(() => {
    fetch('/api/auth/login', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.authenticated && data.user) setUser(data.user);
        else router.push('/login?redirect=/dashboard/admin');
      })
      .catch(() => router.push('/login?redirect=/dashboard/admin'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE', credentials: 'include' });
    router.push('/login');
    router.refresh();
  };

  const filteredSections = searchQuery
    ? NAV_SECTIONS.map(s => ({ ...s, items: s.items.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase())) })).filter(s => s.items.length > 0)
    : NAV_SECTIONS;

  // ── Loading state ──
  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#08080a' }}>
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
          <div style={{ color: '#9090a0', marginBottom: '1rem' }}>Loading Command Center...</div>
          <div style={{ color: '#5a5a6a', fontSize: '0.75rem' }}>If this takes too long, <a href="/login" style={{ color: '#D4A843' }}>log in again</a></div>
        </div>
      </div>
    );
  }

  // ── Colors ──
  const C = { bg: '#08080a', sidebar: '#0a0a0e', border: '#1e1e26', text: '#f0f0f2', muted: '#5a5a6a', secondary: '#9090a0', accent: '#D4A843', danger: '#ef4444' };

  const sidebarW = sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED;

  // ── Sidebar inner content ──
  const sidebarInner = (
    <>
      {/* Logo */}
      <div style={{ padding: '1rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 800, color: '#000' }}>SS</div>
        {sidebarOpen && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>SSZ Admin</div>
            <div style={{ fontSize: '0.6875rem', color: C.muted }}>Command Center</div>
          </div>
        )}
      </div>

      {/* Search */}
      {sidebarOpen && (
        <div style={{ padding: '0.75rem', flexShrink: 0 }}>
          <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search nav..." aria-label="Search navigation" style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#141418', border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: '0.8125rem', outline: 'none' }} />
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.5rem 0.75rem', overflowY: 'auto' }}>
        {filteredSections.map((section, si) => (
          <div key={si} style={{ marginBottom: '1rem' }}>
            {sidebarOpen && (
              <div style={{ padding: '0.5rem', fontSize: '0.625rem', fontWeight: 700, color: C.muted, letterSpacing: '0.08em' }}>{section.label}</div>
            )}
            {section.items.map(item => {
              const isActive = pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} onClick={() => isMobile && setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 500, color: isActive ? C.accent : C.secondary, background: isActive ? 'rgba(212,168,67,0.08)' : 'transparent', border: isActive ? '1px solid rgba(212,168,67,0.15)' : '1px solid transparent', marginBottom: '0.125rem', textDecoration: 'none', minHeight: 44 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}><path d={item.icon} /></svg>
                  {sidebarOpen && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '0.75rem', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', padding: '0.375rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#000' }}>A</div>
          {sidebarOpen && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: '0.6875rem', color: C.muted }}>Administrator</div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <Link href="/" target="_blank" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '0.5rem', fontSize: '0.6875rem', color: C.secondary, border: `1px solid ${C.border}`, borderRadius: 6, textDecoration: 'none', minHeight: 36 }}>
            View Site
          </Link>
          <button onClick={handleLogout} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '0.5rem', fontSize: '0.6875rem', color: C.danger, border: `1px solid ${C.border}`, borderRadius: 6, background: 'transparent', cursor: 'pointer', minHeight: 36 }}>
            Logout
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, overflow: 'hidden' }}>
      {/* ── Desktop Sidebar ── */}
      {!isMobile && (
        <>
          <aside style={{
            width: sidebarW,
            background: C.sidebar,
            borderRight: `1px solid ${C.border}`,
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0, left: 0, bottom: 0,
            zIndex: 50,
            transition: 'width 0.2s',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {sidebarInner}
          </aside>

          {/* Toggle button */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'} style={{
            position: 'fixed', top: '1.5rem', left: sidebarW - 12, width: 24, height: 24,
            background: '#1e1e26', border: '1px solid #2a2a36', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            color: '#9090a0', fontSize: '0.625rem', zIndex: 51,
            transition: 'left 0.2s',
          }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </>
      )}

      {/* ── Mobile Sidebar Overlay ── */}
      {isMobile && mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)' }} onClick={() => setMobileOpen(false)}>
          <aside style={{ width: 280, height: '100vh', background: C.sidebar, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            {sidebarInner}
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <main style={{
        marginLeft: !isMobile ? sidebarW : 0,
        flex: 1,
        minHeight: '100vh',
        height: '100vh',
        transition: 'margin-left 0.2s',
        minWidth: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}`, background: C.sidebar, position: 'sticky', top: 0, zIndex: 40 }}>
            <button onClick={() => setMobileOpen(true)} aria-label="Open menu" style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer', padding: '0.5rem', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#000' }}>SS</div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: C.text }}>SSZ Admin</span>
            </div>
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
