import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#111111', borderTop: '1px solid #222222', padding: '3rem 0 1.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#D4A843' }}>SS</span>
              <span>Superstar Soundz</span>
            </Link>
            <p style={{ fontSize: '0.8125rem', color: '#555555', lineHeight: 1.6 }}>
              Expert reviews, buying guides, and professional audio equipment. Trusted by musicians, DJs, and producers worldwide.
            </p>
          </div>

          {/* Gear */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D4A843', marginBottom: '0.75rem' }}>Gear</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <Link href="/gear?cat=microphones" style={{ fontSize: '0.8125rem', color: '#555555' }}>Microphones</Link>
              <Link href="/gear?cat=headphones-and-iems" style={{ fontSize: '0.8125rem', color: '#555555' }}>Headphones</Link>
              <Link href="/gear?cat=studio-monitors" style={{ fontSize: '0.8125rem', color: '#555555' }}>Studio Monitors</Link>
              <Link href="/gear?cat=audio-interfaces" style={{ fontSize: '0.8125rem', color: '#555555' }}>Audio Interfaces</Link>
              <Link href="/gear?cat=dj-controllers" style={{ fontSize: '0.8125rem', color: '#555555' }}>DJ Controllers</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D4A843', marginBottom: '0.75rem' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <Link href="/blog" style={{ fontSize: '0.8125rem', color: '#555555' }}>Buying Guides</Link>
              <Link href="/services" style={{ fontSize: '0.8125rem', color: '#555555' }}>Services</Link>
              <Link href="/about" style={{ fontSize: '0.8125rem', color: '#555555' }}>About Us</Link>
              <Link href="/contact" style={{ fontSize: '0.8125rem', color: '#555555' }}>Contact</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D4A843', marginBottom: '0.75rem' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <Link href="/privacy-policy" style={{ fontSize: '0.8125rem', color: '#555555' }}>Privacy Policy</Link>
              <Link href="/terms-of-service" style={{ fontSize: '0.8125rem', color: '#555555' }}>Terms of Service</Link>
              <Link href="/affiliate-disclosure" style={{ fontSize: '0.8125rem', color: '#555555' }}>Affiliate Disclosure</Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #222222', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#555555' }}>
            © {new Date().getFullYear()} Superstar Soundz. All rights reserved.
          </p>
          <p style={{ fontSize: '0.75rem', color: '#555555' }}>
            As an Amazon Associate we earn from qualifying purchases.
          </p>
        </div>
      </div>
    </footer>
  );
}
