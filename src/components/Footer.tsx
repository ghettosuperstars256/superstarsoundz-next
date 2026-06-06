import Link from 'next/link';

const gearLinks = [
  { href: '/gear/microphones', label: 'Microphones' },
  { href: '/gear/headphones', label: 'Headphones' },
  { href: '/gear/studio-monitors', label: 'Studio Monitors' },
  { href: '/gear/dj-controllers', label: 'DJ Controllers' },
  { href: '/gear/audio-interfaces', label: 'Audio Interfaces' },
  { href: '/gear/pa-systems', label: 'PA Systems' },
];

const resourceLinks = [
  { href: '/blog', label: 'Buying Guides' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0C0C12] border-t border-white/[0.06]">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect x="2" y="2" width="36" height="36" rx="10" fill="#0e0e14" stroke="#D4A843" strokeWidth="2"/>
                <path d="M13 28V16l7 12 7-12v12" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="12" r="3" fill="#D4A843"/>
              </svg>
              <span className="text-base font-bold">
                Super<span style={{ color: '#D4A843' }}>star</span> Soundz
              </span>
            </Link>
            <p className="text-[#8888A0] text-sm leading-relaxed">
              Expert reviews, buying guides, and professional audio equipment. Trusted by musicians, DJs, and producers worldwide.
            </p>
          </div>

          {/* Gear */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#C0C0CC] mb-4">Gear</h4>
            <ul className="space-y-2">
              {gearLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#8888A0] text-sm hover:text-[#D4A843] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#C0C0CC] mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#8888A0] text-sm hover:text-[#D4A843] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#C0C0CC] mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#8888A0] text-sm hover:text-[#D4A843] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-6 border-t border-white/[0.06] text-[#5A5A70] text-xs">
          <p>&copy; 2026 Superstar Soundz. All rights reserved.</p>
          <p>As an Amazon Associate, we earn from qualifying purchases.</p>
        </div>
      </div>
    </footer>
  );
}
