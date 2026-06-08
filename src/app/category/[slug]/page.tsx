import { notFound } from 'next/navigation';
import Link from 'next/link';
import products from '@/data/products.json';
import productCategories from '@/data/product-categories.json';
import type { Metadata } from 'next';

interface Props { params: { slug: string } };

const categoryHeroImages: Record<string, string> = {
  'shop-audio-interfaces': '🎛️',
  'shop-dj-controllers': '🎧',
  'shop-headphones-and-iems': '🎧',
  'shop-keyboards-and-synthesizers': '🎹',
  'shop-microphones': '🎙️',
  'shop-midi-controllers': '🎛️',
  'shop-mixers': '🔊',
  'shop-pa-systems': '📢',
  'shop-studio-monitors': '🔈',
  'shop-turntables': '💿',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = productCategories.find(c => c.slug === params.slug);
  if (!cat) return { title: 'Category Not Found' };
  return {
    title: `${cat.name} — Professional Audio Equipment | Superstar Soundz`,
    description: cat.description || `Browse the best ${cat.name.toLowerCase()} for musicians, DJs, and producers.`,
    openGraph: { title: cat.name, description: cat.description, type: 'website' },
  };
}

export async function generateStaticParams() {
  return productCategories.map(c => ({ slug: c.slug }));
}

export default function CategoryPage({ params }: Props) {
  const cat = productCategories.find(c => c.slug === params.slug);
  if (!cat) notFound();

  const filtered = products.filter(p =>
    p.categories.some(c => c.toLowerCase().includes(cat.name.toLowerCase()))
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.name} — Professional Audio Equipment`,
    description: cat.description,
    url: `https://superstarsoundz.com/category/${params.slug}`,
  };

  const emoji = categoryHeroImages[cat.slug] || '🎵';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Category Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '3rem 0 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)',
          fontSize: '8rem', opacity: 0.06, pointerEvents: 'none',
        }}>{emoji}</div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-muted" style={{ marginBottom: '0.75rem', fontSize: '0.8125rem' }}>
            <Link href="/" className="text-muted">Home</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <Link href="/gear" className="text-muted">Gear</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span className="text-primary">{cat.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2.5rem' }}>{emoji}</span>
            <div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, lineHeight: 1.1 }}>{cat.name}</h1>
            </div>
          </div>
          {cat.description && (
            <p className="text-secondary" style={{ maxWidth: '550px', lineHeight: 1.6 }}>{cat.description}</p>
          )}
          <p className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.75rem' }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Category pills */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
        <div className="container" style={{ padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', overflowX: 'auto' }}>
            <Link href="/gear" className="badge" style={{ textDecoration: 'none', opacity: 0.7, whiteSpace: 'nowrap' }}>All Gear</Link>
            <Link href="/deals" className="badge" style={{ textDecoration: 'none', opacity: 0.7, whiteSpace: 'nowrap', background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>🔥 Deals</Link>
            {productCategories.filter(c => c.slug !== params.slug).map(c => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="badge" style={{ textDecoration: 'none', opacity: 0.7, whiteSpace: 'nowrap' }}>{c.name}</Link>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="grid-3">
            {filtered.map(product => (
              <Link key={product.id} href={`/gear/${product.slug}`} className="card product-card" style={{ position: 'relative', overflow: 'visible' }}>
                {/* Deal badge */}
                {product.badge && (
                  <div style={{
                    position: 'absolute', top: '-8px', right: '1rem', zIndex: 2,
                    padding: '0.25rem 0.625rem', borderRadius: '4px',
                    background: product.badge === 'Best Value' ? 'rgba(34,197,94,0.15)' : product.badge === "Editor's Choice" ? 'rgba(212,168,67,0.15)' : 'rgba(168,85,247,0.15)',
                    color: product.badge === 'Best Value' ? '#22c55e' : product.badge === "Editor's Choice" ? '#D4A843' : '#a855f7',
                    fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {product.badge}
                  </div>
                )}
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
                  <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'none', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.short_description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-accent" style={{ fontSize: '1rem', fontWeight: 700 }}>${product.price}</span>
                    <span className="text-accent" style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>View Deal →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-muted" style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>No products found. <Link href="/gear" className="text-accent">Browse all gear →</Link></p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
