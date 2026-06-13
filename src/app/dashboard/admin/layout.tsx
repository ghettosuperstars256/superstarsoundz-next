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

// ============================================================
// LAYOUT COMPONENT
// ============================================================
export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Lock body scroll on mobile when sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebarOpen, isMobile]);

  useEffect(() => {
    fetch('/api/auth/login', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          router.push('/login?redirect=/dashboard/admin');
        }
      })
      .catch(() => router.push('/login?redirect=/dashboard/admin'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE', credentials: 'include' });
    router.push('/login');
    router.refresh();
  };

  // Filter nav items by search
  const filteredSections = searchQuery
    ? NAV_SECTIONS.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(section => section.items.length > 0)
    : NAV_SECTIONS;

  const handleNavClick = () => {
    if (isMobile) setMobileSidebarOpen(false);
  };

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

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #1e1e26', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.875rem', fontWeight: 800, color: '#000',
        }}>SS</div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f0f0f2' }}>SSZ Admin</div>
          <div style={{ fontSize: '0.6875rem', color: '#5a5a6a' }}>Command Center</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '0.75rem', flexShrink: 0 }}>
        <input
          type="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search..."
          aria-label="Search navigation"
          style={{
            width: '100%', padding: '0.5rem 0.75rem', background: '#141418',
            border: '1px solid #1e1e26', borderRadius: '8px', color: '#f0f0f2',
            fontSize: '0.8125rem', outline: 'none',
          }}
        />
      </div>

      {/* Navigation */}
      <nav aria-label="Admin navigation" style={{ flex: 1, padding: '0.5rem 0.75rem', overflowY: 'auto' }}>
        {filteredSections.map((section, si) => (
          <div key={si} style={{ marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', fontSize: '0.625rem', fontWeight: 700, color: '#5a5a6a', letterSpacing: '0.08em' }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const isActive = pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} onClick={handleNavClick} aria-current={isActive ? 'page' : undefined} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.625rem 0.75rem', borderRadius: '8px',
                  fontSize: '0.875rem', fontWeight: 500,
                  color: isActive ? '#D4A843' : '#9090a0',
                  background: isActive ? 'rgba(212,168,67,0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(212,168,67,0.15)' : '1px solid transparent',
                  marginBottom: '0.125rem', textDecoration: 'none',
                  minHeight: '44px',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
                    <path d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid #1e1e26', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', padding: '0.375rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: '#000',
          }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f0f0f2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
            <div style={{ fontSize: '0.6875rem', color: '#5a5a6a' }}>Administrator</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <Link href="/" target="_blank" style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
            padding: '0.5rem', fontSize: '0.6875rem', color: '#9090a0',
            border: '1px solid #1e1e26', borderRadius: '6px', textDecoration: 'none',
            minHeight: '36px',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            View Site
          </Link>
          <button onClick={handleLogout} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
            padding: '0.5rem', fontSize: '0.6875rem', color: '#ef4444',
            border: '1px solid #1e1e26', borderRadius: '6px', background: 'transparent', cursor: 'pointer',
            minHeight: '36px',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#08080a', overflowX: 'hidden' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <>
          {/* Sidebar */}
          <aside style={{
            width: sidebarOpen ? '260px' : '64px',
            background: '#0a0a0e',
            borderRight: '1px solid #1e1e26',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 50,
            transition: 'width 0.2s',
            overflow: 'hidden',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}>
            {sidebarContent}
          </aside>

          {/* Sidebar Toggle — positioned outside the sidebar, adjacent to main content */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{
              position: 'fixed',
              top: '1.5rem',
              left: sidebarOpen ? '248px' : '52px',
              width: '24px', height: '24px',
              background: '#1e1e26', border: '1px solid #2a2a36', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: '#9090a0', fontSize: '0.625rem',
              zIndex: 51,
              transition: 'left 0.2s',
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && mobileSidebarOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)',
        }} onClick={() => setMobileSidebarOpen(false)}>
          <aside style={{
            width: '280px', height: '100vh', background: '#0a0a0e',
            borderRight: '1px solid #1e1e26', display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main style={{
        marginLeft: !isMobile ? (sidebarOpen ? '260px' : '64px') : 0,
        flex: 1,
        minHeight: '100vh',
        transition: 'margin-left 0.2s',
        minWidth: 0,
        width: !isMobile ? undefined : '100%',
      }}>
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 1rem', borderBottom: '1px solid #1e1e26',
            background: '#0a0a0e', position: 'sticky', top: 0, zIndex: 40,
          }}>
            <button onClick={() => setMobileSidebarOpen(true)} aria-label="Open navigation menu" style={{
              background: 'none', border: 'none', color: '#f0f0f2', cursor: 'pointer',
              padding: '0.5rem', minWidth: '44px', minHeight: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 800, color: '#000',
              }}>SS</div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f0f0f2' }}>SSZ Admin</span>
            </div>
            <div style={{ width: '44px' }} />
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
