'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/gear', label: 'Gear', dropdown: [
    { href: '/gear/microphones', label: 'Microphones' },
    { href: '/gear/headphones', label: 'Headphones' },
    { href: '/gear/studio-monitors', label: 'Studio Monitors' },
    { href: '/gear/dj-controllers', label: 'DJ Controllers' },
    { href: '/gear/audio-interfaces', label: 'Audio Interfaces' },
    { href: '/gear/pa-systems', label: 'PA Systems' },
    { href: '/gear/midi-controllers', label: 'MIDI Controllers' },
    { href: '/gear/instruments', label: 'Instruments' },
  ]},
  { href: '/blog', label: 'Guides' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" style={{ background: 'rgba(6,6,10,0.85)' }}>
      <div className="container flex items-center justify-between h-[60px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect x="2" y="2" width="36" height="36" rx="10" fill="#0e0e14" stroke="#D4A843" strokeWidth="2"/>
            <path d="M13 28V16l7 12 7-12v12" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="12" r="3" fill="#D4A843"/>
          </svg>
          <span className="text-lg font-bold tracking-tight">
            Super<span style={{ color: '#D4A843' }}>star</span> Soundz
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.dropdown && setDropdownOpen(link.label)}
              onMouseLeave={() => setDropdownOpen(null)}
            >
              <Link
                href={link.href}
                className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium rounded-md transition-colors hover:bg-white/[0.06] text-[#C0C0CC] hover:text-white"
              >
                {link.label}
                {link.dropdown && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-50">
                    <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </Link>
              {link.dropdown && dropdownOpen === link.label && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[#1A1A28] border border-white/[0.1] rounded-lg py-2 min-w-[200px] shadow-xl">
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-[13px] text-[#C0C0CC] hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Search + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <form action="/gear" className="hidden md:flex items-center bg-[#1A1A28] border border-white/[0.06] rounded-lg px-3 h-[34px] focus-within:border-[rgba(212,168,67,0.4)] transition-colors">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-[#5A5A70]">
              <path d="M8.5 2a6.5 6.5 0 104.2 11.2l3.6 3.6 1.4-1.4-3.6-3.6A6.5 6.5 0 008.5 2zm0 2a4.5 4.5 0 110 9 4.5 4.5 0 010-9z"/>
            </svg>
            <input
              type="search"
              name="s"
              placeholder="Search gear…"
              className="bg-transparent border-none text-[13px] text-white outline-none w-[140px] ml-2 placeholder:text-[#5A5A70]"
            />
          </form>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-[#C0C0CC] transition-all ${mobileOpen ? 'rotate-45 translate-y-[4px]' : ''}`}/>
            <span className={`block w-5 h-0.5 bg-[#C0C0CC] transition-all ${mobileOpen ? 'opacity-0' : ''}`}/>
            <span className={`block w-5 h-0.5 bg-[#C0C0CC] transition-all ${mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''}`}/>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-[#0C0C12] border-t border-white/[0.06] px-6 py-4">
          {navLinks.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className="block py-3 text-[15px] font-medium border-b border-white/[0.06] text-[#C0C0CC] hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
              {link.dropdown && (
                <div className="pl-4 pb-2">
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2 text-[13px] text-[#8888A0] hover:text-[#D4A843]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
