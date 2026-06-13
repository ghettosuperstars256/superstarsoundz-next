'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const USER_NAV = [
  { href: '/dashboard', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { href: '/blog', label: 'Browse Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { href: '/gear', label: 'Shop Gear', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { href: '/ai-tools', label: 'Free AI Tools', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
];

export default function UserDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Don't render this layout for admin routes — admin has its own layout
  if (pathname?.startsWith('/dashboard/admin')) {
    return <>{children}</>;
  }

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Lock body scroll on mobile when menu is open
  useEffect(() => {
    if (mobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, isMobile]);

  useEffect(() => {
    fetch('/api/auth/login', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.authenticated && data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE', credentials: 'include' });
    router.push('/login');
    router.refresh();
  };

  const handleNavClick = () => {
    if (isMobile) setMobileMenuOpen(false);
  };

  const sidebarContent = (
    <>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e1e26' }}>
        <Link href="/dashboard" onClick={handleNavClick} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.875rem', fontWeight: 800, color: '#000',
          }}>SS</div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f0f0f2' }}>My Dashboard</div>
            <div style={{ fontSize: '0.6875rem', color: '#5a5a6a' }}>Superstar Soundz</div>
          </div>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        {USER_NAV.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={handleNavClick} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 0.875rem', borderRadius: '10px',
              fontSize: '0.875rem', fontWeight: 500,
              color: isActive ? '#D4A843' : '#9090a0',
              background: isActive ? 'rgba(212,168,67,0.08)' : 'transparent',
              border: isActive ? '1px solid rgba(212,168,67,0.15)' : '1px solid transparent',
              marginBottom: '0.25rem', textDecoration: 'none',
              minHeight: '44px',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={item.icon} /></svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #1e1e26' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', padding: '0.5rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: '#000',
          }}>U</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f0f0f2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: '0.6875rem', color: '#5a5a6a' }}>{user?.email || ''}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
          padding: '0.375rem 0.625rem', fontSize: '0.75rem', color: '#ef4444',
          border: '1px solid #1e1e26', borderRadius: '6px', background: 'transparent', cursor: 'pointer',
          minHeight: '36px',
        }}>Logout</button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#08080a' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside style={{
          width: '240px', background: '#0e0e12', borderRight: '1px solid #1e1e26',
          display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
          flexShrink: 0,
        }}>
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)',
        }} onClick={() => setMobileMenuOpen(false)}>
          <aside style={{
            width: '280px', height: '100vh', background: '#0e0e12',
            borderRight: '1px solid #1e1e26', display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, minHeight: '100vh', overflow: 'auto', minWidth: 0 }}>
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 1rem', borderBottom: '1px solid #1e1e26',
            background: '#0e0e12', position: 'sticky', top: 0, zIndex: 40,
          }}>
            <button onClick={() => setMobileMenuOpen(true)} style={{
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
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f0f0f2' }}>My Dashboard</span>
            </div>
            <div style={{ width: '44px' }} />
          </div>
        )}

        <div style={{ padding: isMobile ? '1rem' : '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
