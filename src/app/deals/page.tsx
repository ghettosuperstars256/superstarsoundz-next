import Link from 'next/link';
import products from '@/data/products.json';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Audio Gear Deals — Sales, Discounts & Top Picks | Superstar Soundz',
  description: 'Find the best deals on professional audio equipment. Curated discounts on microphones, headphones, DJ controllers, studio monitors, and more.',
};

const badgeColors: Record<string, { bg: string; text: string }> = {
  'Best Value': { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  "Editor's Choice": { bg: 'rgba(212,168,67,0.15)', text: '#D4A843' },
  'Top Pick': { bg: 'rgba(168,85,247,0.15)', text: '#a855f7' },
  'Limited Deal': { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
};

const badgeOrder = ['Best Value', "Editor's Choice", 'Top Pick', 'Limited Deal'];

const dealProducts = products
  .filter(p => p.badge && badgeOrder.includes(p.badge))
  .sort((a, b) => badgeOrder.indexOf(a.badge!) - badgeOrder.indexOf(b.badge!));

export default function DealsPage() {
  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <p className="label" style={{ marginBottom: '0.5rem' }}>Save Money</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Best Audio Gear Deals</h1>
          <p className="text-secondary" style={{ maxWidth: '550px', margin: '0 auto' }}>
            Hand-picked deals on professional audio equipment. Updated regularly with the best prices across all categories.
          </p>
        </div>

        {badgeOrder.map(badge => {
          const items = dealProducts.filter(p => p.badge === badge);
          if (items.length === 0) return null;
          const colors = badgeColors[badge];
          return (
            <div key={badge} style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.375rem 0.875rem', borderRadius: '100px',
                  background: colors.bg, color: colors.text,
                  fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {badge === 'Best Value' && '★ '}
                  {badge === "Editor's Choice" && '♦ '}
                  {badge === 'Top Pick' && '⚡ '}
                  {badge === 'Limited Deal' && '🔥 '}
                  {badge}
                </span>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid-3">
                {items.map(product => (
                  <Link key={product.id} href={`/gear/${product.slug}`} className="card product-card" style={{ position: 'relative', overflow: 'visible' }}>
                    {/* Badge ribbon */}
                    <div style={{
                      position: 'absolute', top: '-8px', right: '1rem', zIndex: 2,
                      padding: '0.25rem 0.625rem', borderRadius: '4px',
                      background: colors.bg, color: colors.text,
                      fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      boxShadow: `0 2px 8px ${colors.bg}`,
                    }}>
                      {badge}
                    </div>
                    <div className="product-card-image" style={{ borderRadius: '8px 8px 0 0' }}>
                      {product.image ? <img src={product.image} alt={product.short_name} loading="lazy" /> : <span className="text-muted" style={{ fontSize: '0.75rem' }}>No Image</span>}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <p className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                        {product.categories[0]?.replace('Shop: ', '') || 'Gear'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.375rem' }}>
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9l-3 1.5.5-3.5L1 4.5 4.5 4z" fill={i < 4 ? 'var(--accent)' : 'var(--border)'} />
                          </svg>
                        ))}
                      </div>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.short_name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-accent" style={{ fontSize: '1rem', fontWeight: 700 }}>${product.price}</span>
                        <span className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>View Deal →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {dealProducts.length === 0 && (
          <div className="text-muted" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p>No deals available right now. Check back soon!</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-accent-dim border-accent" style={{ borderRadius: '12px', padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Can't Find What You Need?</h2>
          <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Browse our full catalog or read our buying guides.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/gear" className="btn-primary">All Gear</Link>
            <Link href="/blog" className="btn-secondary">Buying Guides</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
