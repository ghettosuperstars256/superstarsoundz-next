'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const productCategories = [
  { name: 'Microphones', slug: 'microphones', href: '/gear?cat=microphones' },
  { name: 'Headphones', slug: 'headphones', href: '/gear?cat=headphones-and-iems' },
  { name: 'Studio Monitors', slug: 'studio-monitors', href: '/gear?cat=studio-monitors' },
  { name: 'Audio Interfaces', slug: 'audio-interfaces', href: '/gear?cat=audio-interfaces' },
  { name: 'DJ Controllers', slug: 'dj-controllers', href: '/gear?cat=dj-controllers' },
  { name: 'Mixers', slug: 'mixers', href: '/gear?cat=mixers' },
  { name: 'MIDI Controllers', slug: 'midi-controllers', href: '/gear?cat=midi-controllers' },
  { name: 'PA Systems', slug: 'pa-systems', href: '/gear?cat=pa-systems' },
  { name: 'Keyboards & Synths', slug: 'keyboards-and-synthesizers', href: '/gear?cat=keyboards-and-synthesizers' },
  { name: 'Turntables', slug: 'turntables', href: '/gear?cat=turntables' },
];

const guideCategories = [
  { name: 'Studio Recording', slug: 'studio-recording', href: '/blog' },
  { name: 'Music Production', slug: 'music-production', href: '/blog' },
  { name: 'Live Sound', slug: 'live-sound', href: '/blog' },
  { name: 'DJ Gear', slug: 'dj-gear', href: '/blog' },
  { name: 'Guitars & Bass', slug: 'guitars-bass', href: '/blog' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gearDropdown, setGearDropdown] = useState(false);
  const [guidesDropdown, setGuidesDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const gearRef = useRef<HTMLLIElement>(null);
  const guidesRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (gearRef.current && !gearRef.current.contains(e.target as Node)) setGearDropdown(false);
      if (guidesRef.current && !guidesRef.current.contains(e.target as Node)) setGuidesDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(10,10,10,0.95)' : '#0a0a0a',
        borderBottom: '1px solid #222222',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span style={{ color: '#D4A843' }}>S</span>
          <span>S</span>
          <span style={{ color: '#555555', fontWeight: 400, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Superstar Soundz</span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
          <Link href="/" className={isActive('/') && pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>

          <li ref={gearRef} style={{ position: 'relative', listStyle: 'none' }}>
            <button
              onClick={() => { setGearDropdown(!gearDropdown); setGuidesDropdown(false); }}
              className={isActive('/gear') ? 'nav-link active' : 'nav-link'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              Gear
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: gearDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {gearDropdown && (
              <div className="nav-dropdown">
                {productCategories.map(cat => (
                  <Link key={cat.slug} href={cat.href} onClick={() => setGearDropdown(false)}>{cat.name}</Link>
                ))}
              </div>
            )}
          </li>

          <li ref={guidesRef} style={{ position: 'relative', listStyle: 'none' }}>
            <button
              onClick={() => { setGuidesDropdown(!guidesDropdown); setGearDropdown(false); }}
              className={isActive('/blog') ? 'nav-link active' : 'nav-link'}
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
                  <Link key={cat.slug} href={cat.href} onClick={() => setGuidesDropdown(false)}>{cat.name}</Link>
                ))}
              </div>
            )}
          </li>

          <Link href="/services" className={isActive('/services') ? 'nav-link active' : 'nav-link'}>Services</Link>
          <Link href="/about" className={isActive('/about') ? 'nav-link active' : 'nav-link'}>About</Link>
          <Link href="/contact" className={isActive('/contact') ? 'nav-link active' : 'nav-link'}>Contact</Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: '#e8e8e8', cursor: 'pointer', padding: '0.5rem' }}
          className="mobile-toggle"
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div style={{ borderTop: '1px solid #222222', padding: '1rem 0', background: '#111111' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/" onClick={() => setMobileOpen(false)} style={{ padding: '0.75rem', borderRadius: '6px', color: isActive('/') ? '#D4A843' : '#e8e8e8' }}>Home</Link>
            <div style={{ padding: '0.75rem 0' }}>
              <div style={{ color: '#555555', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Gear</div>
              {productCategories.map(cat => (
                <Link key={cat.slug} href={cat.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '0.5rem 1rem', color: '#888888', fontSize: '0.875rem' }}>{cat.name}</Link>
              ))}
            </div>
            <Link href="/blog" onClick={() => setMobileOpen(false)} style={{ padding: '0.75rem', borderRadius: '6px', color: isActive('/blog') ? '#D4A843' : '#e8e8e8' }}>Guides</Link>
            <Link href="/services" onClick={() => setMobileOpen(false)} style={{ padding: '0.75rem', borderRadius: '6px', color: isActive('/services') ? '#D4A843' : '#e8e8e8' }}>Services</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} style={{ padding: '0.75rem', borderRadius: '6px', color: isActive('/about') ? '#D4A843' : '#e8e8e8' }}>About</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} style={{ padding: '0.75rem', borderRadius: '6px', color: isActive('/contact') ? '#D4A843' : '#e8e8e8' }}>Contact</Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .nav-link {
          padding: 0.5rem 0.75rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #888888;
          border-radius: 4px;
          transition: all 0.15s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .nav-link:hover, .nav-link.active {
          color: #D4A843;
          background: rgba(212, 168, 67, 0.1);
        }
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
