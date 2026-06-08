import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.375rem' }}>Get Gear Deals in Your Inbox</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>New deals, buying guides, and product reviews. No spam.</p>
            </div>
            <form style={{ display: 'flex', gap: '0.5rem', flex: '0 1 360px' }} onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" style={{ flex: 1, padding: '0.625rem 1rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }} required />
              <button type="submit" className="btn-primary" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <Link href="/" style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--accent)' }}>SS</span><span>Superstar Soundz</span>
            </Link>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Expert reviews, buying guides, and professional audio equipment. Trusted by musicians, DJs, and producers worldwide.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.75rem' }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/gear" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>All Shop</Link>
              <Link href="/category/shop-microphones" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Microphones</Link>
              <Link href="/category/shop-headphones-and-iems" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Headphones</Link>
              <Link href="/category/shop-studio-monitors" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Studio Monitors</Link>
              <Link href="/category/shop-dj-controllers" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>DJ Controllers</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.75rem' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/blog" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Blog</Link>
              <Link href="/services" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Services</Link>
              <Link href="/about" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>About Us</Link>
              <Link href="/contact" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Contact</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.75rem' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/privacy-policy" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Privacy Policy</Link>
              <Link href="/terms-of-service" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Terms of Service</Link>
              <Link href="/affiliate-disclosure" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Affiliate Disclosure</Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Superstar Soundz. All rights reserved.</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>As an Amazon Associate we earn from qualifying purchases.</p>
        </div>
      </div>
    </footer>
  );
}
