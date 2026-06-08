import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid #222222', padding: '3rem 0 1.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--accent)' }}>SS</span>
              <span>Superstar Soundz</span>
            </Link>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Expert reviews, buying guides, and professional audio equipment. Trusted by musicians, DJs, and producers worldwide.
            </p>
          </div>

          {/* Gear */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.75rem' }}>Gear</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <Link href="/category/shop-microphones" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Microphones</Link>
              <Link href="/category/shop-headphones-and-iems" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Headphones</Link>
              <Link href="/category/shop-studio-monitors" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Studio Monitors</Link>
              <Link href="/category/shop-audio-interfaces" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Audio Interfaces</Link>
              <Link href="/category/shop-dj-controllers" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>DJ Controllers</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.75rem' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <Link href="/blog" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Buying Guides</Link>
              <Link href="/services" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Services</Link>
              <Link href="/about" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>About Us</Link>
              <Link href="/contact" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Contact</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.75rem' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <Link href="/privacy-policy" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Privacy Policy</Link>
              <Link href="/terms-of-service" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Terms of Service</Link>
              <Link href="/affiliate-disclosure" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Affiliate Disclosure</Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #222222', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Superstar Soundz. All rights reserved.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            As an Amazon Associate we earn from qualifying purchases.
          </p>
        </div>
      </div>
    </footer>
  );
}
