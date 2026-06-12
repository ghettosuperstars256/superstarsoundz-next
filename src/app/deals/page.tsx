import Link from 'next/link';
import products from '@/data/products.json';

export const metadata = {
  title: 'Deals & Discounts',
  description: 'Find the best deals on professional audio equipment — DJ controllers, microphones, studio monitors, headphones, and more at discounted prices.',
};

export default function DealsPage() {
  // Show products with "Best Value" badge as deals, plus any under $200
  const dealProducts = products.filter(p =>
    p.badge === 'Best Value' || p.price < 200
  ).sort((a, b) => a.price - b.price);

  const budgetPicks = products.filter(p => p.price < 100);
  const midRange = products.filter(p => p.price >= 100 && p.price < 500);
  const premium = products.filter(p => p.price >= 500);

  return (
    <>
      {/* Hero */}
      <section style={{ padding: '4.5rem 0 3.5rem', background: 'linear-gradient(135deg, #0e0e12 0%, #08080a 100%)', borderBottom: '1px solid #1e1e26' }}>
        <div className="container">
          <div style={{ maxWidth: '750px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', borderRadius: '100px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '1.25rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', letterSpacing: '0.04em' }}>Best Prices on Professional Gear</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Deals & Discounts
            </h1>
            <p className="text-secondary" style={{ fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              Hand-picked audio equipment at prices that make sense. Every product here offers genuine value — whether you're on a tight budget or investing in professional-grade gear.
            </p>
            <p className="text-secondary" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
              Prices sourced from Amazon. Last updated regularly.
            </p>
          </div>
        </div>
      </section>

      {/* Budget Picks */}
      <section className="section" style={{ paddingBottom: '4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>💰</span>
              <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800 }}>Budget-Friendly Picks</h2>
            </div>
            <p className="text-secondary" style={{ maxWidth: '600px', lineHeight: 1.7 }}>
              Professional-quality gear under $100. Perfect for beginners, home studios, and anyone starting out.
            </p>
          </div>
          <div className="grid-3">
            {budgetPicks.map(product => (
              <Link key={product.id} href={`/gear/${product.slug}`} className="card product-card" style={{ position: 'relative', overflow: 'visible' }}>
                {product.badge && (
                  <div style={{
                    position: 'absolute', top: '-8px', right: '1rem', zIndex: 2,
                    padding: '0.25rem 0.625rem', borderRadius: '4px',
                    background: product.badge === 'Best Value' ? 'rgba(34,197,94,0.15)' : 'rgba(212,168,67,0.15)',
                    color: product.badge === 'Best Value' ? '#22c55e' : '#D4A843',
                    fontSize: '0.625rem', fontWeight: 700,
                  }}>
                    {product.badge}
                  </div>
                )}
                <div className="product-card-image" style={{ borderRadius: '8px 8px 0 0' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.short_name} loading="lazy" />
                  ) : (
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>No Image</span>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <p className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {product.categories[0]?.replace('Shop: ', '') || 'Shop'}
                  </p>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.short_name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-accent" style={{ fontSize: '1rem', fontWeight: 700 }}>${product.price}</span>
                    <span className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600 }}>View</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-Range */}
      <section className="section bg-secondary" style={{ paddingBottom: '4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>⭐</span>
              <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800 }}>Mid-Range Value</h2>
            </div>
            <p className="text-secondary" style={{ maxWidth: '600px', lineHeight: 1.7 }}>
              The sweet spot for serious producers and working professionals — $100 to $500.
            </p>
          </div>
          <div className="grid-3">
            {midRange.map(product => (
              <Link key={product.id} href={`/gear/${product.slug}`} className="card product-card" style={{ position: 'relative', overflow: 'visible' }}>
                {product.badge && (
                  <div style={{
                    position: 'absolute', top: '-8px', right: '1rem', zIndex: 2,
                    padding: '0.25rem 0.625rem', borderRadius: '4px',
                    background: product.badge === 'Best Value' ? 'rgba(34,197,94,0.15)' : 'rgba(212,168,67,0.15)',
                    color: product.badge === 'Best Value' ? '#22c55e' : '#D4A843',
                    fontSize: '0.625rem', fontWeight: 700,
                  }}>
                    {product.badge}
                  </div>
                )}
                <div className="product-card-image" style={{ borderRadius: '8px 8px 0 0' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.short_name} loading="lazy" />
                  ) : (
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>No Image</span>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <p className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {product.categories[0]?.replace('Shop: ', '') || 'Shop'}
                  </p>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.short_name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-accent" style={{ fontSize: '1rem', fontWeight: 700 }}>${product.price}</span>
                    <span className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600 }}>View</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium */}
      {premium.length > 0 && (
        <section className="section" style={{ paddingBottom: '4rem' }}>
          <div className="container">
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🏆</span>
                <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800 }}>Premium Picks</h2>
              </div>
              <p className="text-secondary" style={{ maxWidth: '600px', lineHeight: 1.7 }}>
                Professional-grade gear for those who demand the best — $500 and above.
              </p>
            </div>
            <div className="grid-3">
              {premium.map(product => (
                <Link key={product.id} href={`/gear/${product.slug}`} className="card product-card" style={{ position: 'relative', overflow: 'visible' }}>
                  {product.badge && (
                    <div style={{
                      position: 'absolute', top: '-8px', right: '1rem', zIndex: 2,
                      padding: '0.25rem 0.625rem', borderRadius: '4px',
                      background: product.badge === "Editor's Choice" ? 'rgba(212,168,67,0.15)' : 'rgba(212,168,67,0.15)',
                      color: '#D4A843',
                      fontSize: '0.625rem', fontWeight: 700,
                    }}>
                      {product.badge}
                    </div>
                  )}
                  <div className="product-card-image" style={{ borderRadius: '8px 8px 0 0' }}>
                    {product.image ? (
                      <img src={product.image} alt={product.short_name} loading="lazy" />
                    ) : (
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>No Image</span>
                    )}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {product.categories[0]?.replace('Shop: ', '') || 'Shop'}
                    </p>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.short_name}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="text-accent" style={{ fontSize: '1rem', fontWeight: 700 }}>${product.price}</span>
                      <span className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600 }}>View</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="bg-accent-dim border-accent" style={{ borderRadius: '12px', padding: '3rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Need Help Choosing?
            </h2>
            <p className="text-secondary" style={{ marginBottom: '1.5rem', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
              Tell us about your event or project — we'll recommend the right gear and handle the production.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn-primary">Contact Us</Link>
              <Link href="/blog" className="btn-secondary">Read Our Guides</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
