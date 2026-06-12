'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import SearchModal from '@/components/SearchModal';

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [blogDropdown, setBlogDropdown] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const shopRef = useRef<HTMLLIElement>(null);
  const blogRef = useRef<HTMLLIElement>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(prev => !prev); }
      if (e.key === '/') { const tag = (e.target as HTMLElement)?.tagName; if (tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); setSearchOpen(prev => !prev); } }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShopDropdown(false);
      if (blogRef.current && !blogRef.current.contains(e.target as Node)) setBlogDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setMobileOpen(false);
    setShopDropdown(false);
    setBlogDropdown(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const navLinks = [
    { href: '/', label: 'Home', exact: true },
    { href: '/services', label: 'Services' },
    { href: '/gear', label: 'Shop' },
    { href: '/blog', label: 'Blog' },
    { href: '/deals', label: 'Deals', color: '#ef4444', dot: true },
    { href: '/tools', label: 'Free AI Music Tools', color: '#3b82f6', dot: true },
    { href: '/plugins', label: 'Plugins', color: '#a855f7', dot: true },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="glass" style={{
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: scrolled ? '1px solid #1e1e26' : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Logo variant="dark" height={mobileOpen ? 28 : 32} className="header-logo" />

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
            <Link href="/" className="nav-link" data-active={pathname === '/'}>Home</Link>
            <Link href="/services" className="nav-link" data-active={isActive('/services')}>Services</Link>

            <ul style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', listStyle: 'none', padding: 0, margin: 0 }}>
              <li ref={shopRef} style={{ position: 'relative' }}>
                <button onClick={() => { setShopDropdown(!shopDropdown); setBlogDropdown(false); }}
                  className="nav-link"
                  data-active={isActive('/gear')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  aria-expanded={shopDropdown} aria-haspopup="true">
                  Shop
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: shopDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {shopDropdown && (
                  <div className="nav-dropdown" role="menu" style={{ marginTop: '0.5rem' }}>
                    <Link href="/gear" onClick={() => setShopDropdown(false)} style={{ display: 'block', padding: '0.625rem 1rem', fontWeight: 600, fontSize: '0.875rem', color: '#D4A843', borderRadius: '6px', textDecoration: 'none' }}>All Shop</Link>
                  </div>
                )}
              </li>

              <li ref={blogRef} style={{ position: 'relative' }}>
                <button onClick={() => { setBlogDropdown(!blogDropdown); setShopDropdown(false); }}
                  className="nav-link"
                  data-active={isActive('/blog')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  aria-expanded={blogDropdown} aria-haspopup="true">
                  Blog
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: blogDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {blogDropdown && (
                  <div className="nav-dropdown" role="menu" style={{ marginTop: '0.5rem' }}>
                    <Link href="/blog" onClick={() => setBlogDropdown(false)} style={{ display: 'block', padding: '0.625rem 1rem', fontWeight: 600, fontSize: '0.875rem', color: '#D4A843', borderRadius: '6px', textDecoration: 'none' }}>All Posts</Link>
                  </div>
                )}
              </li>
            </ul>

            <Link href="/deals" className="nav-link" data-active={isActive('/deals')} style={{ color: isActive('/deals') ? '#ff6b6b' : '#ef4444' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', marginRight: '0.25rem' }} />
              Deals
            </Link>
            <Link href="/tools" className="nav-link" data-active={isActive('/tools')}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block', marginRight: '0.25rem' }} />
              Free AI Music Tools
            </Link>
            <Link href="/plugins" className="nav-link" data-active={isActive('/plugins')}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', display: 'inline-block', marginRight: '0.25rem' }} />
              Plugins
            </Link>
            <Link href="/about" className="nav-link" data-active={isActive('/about')}>About</Link>
            <Link href="/contact" className="nav-link" data-active={isActive('/contact')}>Contact</Link>
            <Link href="/dashboard/admin" className="nav-link-dashboard">
              Dashboard
            </Link>

            <button onClick={() => setSearchOpen(true)} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Search (⌘K or /)" aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </nav>

          {/* Mobile controls */}
          <div className="mobile-controls" style={{ display: 'none', alignItems: 'center', gap: '0.25rem' }}>
            <button onClick={() => setSearchOpen(true)} style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)', color: '#D4A843', cursor: 'pointer', padding: '0.5rem', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M12.5 12.5L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#f0f0f2', cursor: 'pointer', padding: '0.5rem', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay drawer */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={closeMobile}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Logo variant="dark" height={24} />
              <button onClick={closeMobile} style={{ background: 'none', border: 'none', color: '#9090a0', cursor: 'pointer', padding: '0.5rem', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Close menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <nav className="mobile-nav">
              <Link href="/" onClick={closeMobile} className="mobile-nav-link" data-active={pathname === '/'}>Home</Link>
              <Link href="/services" onClick={closeMobile} className="mobile-nav-link" data-active={isActive('/services')}>Services</Link>

              {/* Shop accordion */}
              <div>
                <button
                  onClick={() => setMobileShopOpen(!mobileShopOpen)}
                  className="mobile-nav-link"
                  data-active={isActive('/gear')}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  aria-expanded={mobileShopOpen}
                >
                  Shop
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none" style={{ transform: mobileShopOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0, marginLeft: '0.5rem' }}>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {mobileShopOpen && (
                  <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <Link href="/gear" onClick={closeMobile} className="mobile-nav-link" data-active={isActive('/gear')} style={{ fontSize: '0.875rem', color: '#9090a0' }}>All Shop</Link>
                  </div>
                )}
              </div>

              {/* Blog accordion */}
              <div>
                <button
                  onClick={() => setMobileBlogOpen(!mobileBlogOpen)}
                  className="mobile-nav-link"
                  data-active={isActive('/blog')}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  aria-expanded={mobileBlogOpen}
                >
                  Blog
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none" style={{ transform: mobileBlogOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0, marginLeft: '0.5rem' }}>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {mobileBlogOpen && (
                  <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <Link href="/blog" onClick={closeMobile} className="mobile-nav-link" data-active={isActive('/blog')} style={{ fontSize: '0.875rem', color: '#9090a0' }}>All Posts</Link>
                  </div>
                )}
              </div>

              <Link href="/deals" onClick={closeMobile} className="mobile-nav-link" data-active={isActive('/deals')} style={{ color: isActive('/deals') ? '#ff6b6b' : '#ef4444' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', marginRight: '0.5rem', flexShrink: 0 }} />
                Deals
              </Link>
              <Link href="/tools" onClick={closeMobile} className="mobile-nav-link" data-active={isActive('/tools')}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block', marginRight: '0.5rem', flexShrink: 0 }} />
                Free AI Music Tools
              </Link>
              <Link href="/plugins" onClick={closeMobile} className="mobile-nav-link" data-active={isActive('/plugins')}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', display: 'inline-block', marginRight: '0.5rem', flexShrink: 0 }} />
                Plugins
              </Link>
              <Link href="/about" onClick={closeMobile} className="mobile-nav-link" data-active={isActive('/about')}>About</Link>
              <Link href="/contact" onClick={closeMobile} className="mobile-nav-link" data-active={isActive('/contact')}>Contact</Link>
            </nav>
          </div>
        </div>
      )}

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
