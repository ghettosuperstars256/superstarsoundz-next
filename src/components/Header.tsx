'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchModal from '@/components/SearchModal';

const productCategories = [
  { name: 'Microphones', href: '/category/shop-microphones' },
  { name: 'Headphones', href: '/category/shop-headphones-and-iems' },
  { name: 'Studio Monitors', href: '/category/shop-studio-monitors' },
  { name: 'Audio Interfaces', href: '/category/shop-audio-interfaces' },
  { name: 'DJ Controllers', href: '/category/shop-dj-controllers' },
  { name: 'Mixers', href: '/category/shop-mixers' },
  { name: 'MIDI Controllers', href: '/category/shop-midi-controllers' },
  { name: 'PA Systems', href: '/category/shop-pa-systems' },
  { name: 'Keyboards & Synths', href: '/category/shop-keyboards-and-synthesizers' },
  { name: 'Turntables', href: '/category/shop-turntables' },
];

const guideCategories = [
  { name: 'Studio Recording', href: '/blog' },
  { name: 'Music Production', href: '/blog' },
  { name: 'Live Sound', href: '/blog' },
  { name: 'DJ Gear', href: '/blog' },
  { name: 'Guitars & Bass', href: '/blog' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gearDropdown, setGearDropdown] = useState(false);
  const [guidesDropdown, setGuidesDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const gearRef = useRef<HTMLLIElement>(null);
  const guidesRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === '/') {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          setSearchOpen(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (gearRef.current && !gearRef.current.contains(e.target as Node)) setGearDropdown(false);
      if (guidesRef.current && !guidesRef.current.contains(e.target as Node)) setGuidesDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setSearchOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <header
        className="bg-primary"
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          borderBottom: '1px solid var(--border)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          background: scrolled ? 'rgba(10,10,10,0.95)' : 'var(--bg-primary)',
          transition: 'all 0.2s',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            <span className="text-accent">S</span>
            <span>S</span>
            <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Superstar Soundz</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Link href="/" className={`nav-link ${isActive('/') && pathname === '/' ? 'active' : ''}`}>Home</Link>

            <li ref={gearRef} style={{ position: 'relative', listStyle: 'none' }}>
              <button
                onClick={() => { setGearDropdown(!gearDropdown); setGuidesDropdown(false); }}
                className={`nav-link ${isActive('/gear') ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                Gear
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: gearDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {gearDropdown && (
                <div className="nav-dropdown">
                  <Link href="/gear" onClick={() => setGearDropdown(false)} style={{ fontWeight: 700 }}>All Gear</Link>
                  {productCategories.map(cat => (
                    <Link key={cat.name} href={cat.href} onClick={() => setGearDropdown(false)}>{cat.name}</Link>
                  ))}
                </div>
              )}
            </li>

            <li ref={guidesRef} style={{ position: 'relative', listStyle: 'none' }}>
              <button
                onClick={() => { setGuidesDropdown(!guidesDropdown); setGearDropdown(false); }}
                className={`nav-link ${isActive('/blog') ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                Guides
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: guidesDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {guidesDropdown && (
                <div className="nav-dropdown">
                  {guideCategories.map(cat => (
                    <Link key={cat.name} href={cat.href} onClick={() => setGuidesDropdown(false)}>{cat.name}</Link>
                  ))}
                </div>
              )}
            </li>

            <Link href="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`}>Services</Link>
            <Link href="/deals" className={`nav-link ${isActive('/deals') ? 'active' : ''}`} style={{ color: '#ef4444' }}>🔥 Deals</Link>
            <Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
            <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
              title="Search (⌘K or /)"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <kbd style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontFamily: 'monospace', border: '1px solid var(--border)', padding: '0 0.25rem', borderRadius: '3px' }}>⌘K</kbd>
            </button>
          </nav>

          {/* Mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setSearchOpen(true)}
              className="mobile-search"
              style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12.5 12.5L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-toggle"
              style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}
            >
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="bg-secondary mobile-drawer" style={{ borderTop: '1px solid var(--border)', padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/" onClick={() => setMobileOpen(false)} className={isActive('/') ? 'text-accent' : ''} style={{ padding: '0.75rem', borderRadius: '6px' }}>Home</Link>
              <div style={{ padding: '0.75rem 0' }}>
                <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Gear</div>
                <Link href="/gear" onClick={() => setMobileOpen(false)} className="text-accent" style={{ display: 'block', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 700 }}>All Gear</Link>
                {productCategories.map(cat => (
                  <Link key={cat.name} href={cat.href} onClick={() => setMobileOpen(false)} className="text-secondary" style={{ display: 'block', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>{cat.name}</Link>
                ))}
              </div>
              <Link href="/blog" onClick={() => setMobileOpen(false)} className={isActive('/blog') ? 'text-accent' : ''} style={{ padding: '0.75rem', borderRadius: '6px' }}>Guides</Link>
              <Link href="/services" onClick={() => setMobileOpen(false)} className={isActive('/services') ? 'text-accent' : ''} style={{ padding: '0.75rem', borderRadius: '6px' }}>Services</Link>
              <Link href="/deals" onClick={() => setMobileOpen(false)} className={isActive('/deals') ? 'text-accent' : ''} style={{ padding: '0.75rem', borderRadius: '6px' }}>🔥 Deals</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className={isActive('/about') ? 'text-accent' : ''} style={{ padding: '0.75rem', borderRadius: '6px' }}>About</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className={isActive('/contact') ? 'text-accent' : ''} style={{ padding: '0.75rem', borderRadius: '6px' }}>Contact</Link>
            </div>
          </div>
        )}

        <style jsx>{`
          .nav-link {
            padding: 0.5rem 0.75rem;
            font-size: 0.8125rem;
            font-weight: 500;
            color: var(--text-secondary);
            border-radius: 4px;
            transition: all 0.15s;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .nav-link:hover, .nav-link.active {
            color: var(--accent);
            background: var(--accent-dim);
          }
          @media (max-width: 1024px) {
            .desktop-nav { display: none !important; }
            .mobile-toggle { display: block !important; }
            .mobile-search { display: block !important; }
          }
        `}</style>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
