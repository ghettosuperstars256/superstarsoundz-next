import { notFound } from 'next/navigation';
import Link from 'next/link';
import products from '@/data/products.json';
import type { Metadata } from 'next';

interface Props { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = products.find(p => p.slug === params.slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.short_name} — $${product.price} | Superstar Soundz`,
    description: product.short_description.replace(/\n/g, ' ').trim(),
    openGraph: {
      title: product.short_name,
      description: product.short_description.replace(/\n/g, ' ').trim(),
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export default function ProductPage({ params }: Props) {
  const product = products.find(p => p.slug === params.slug);
  if (!product) notFound();

  const related = products.filter(p => p.id !== product.id && p.categories.some(c => product.categories.includes(c))).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.short_name,
    description: product.short_description.replace(/\n/g, ' ').trim(),
    image: product.image ? `https://superstarsoundz.com${product.image}` : undefined,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: product.external_url || `https://superstarsoundz.com/gear/${product.slug}`,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://superstarsoundz.com' },
      { '@type': 'ListItem', position: 2, name: 'Gear', item: 'https://superstarsoundz.com/gear' },
      { '@type': 'ListItem', position: 3, name: product.short_name, item: `https://superstarsoundz.com/gear/${product.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="section">
        <div className="container">
          {/* Breadcrumb */}
          <div className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.8125rem' }}>
            <Link href="/" className="text-muted">Home</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <Link href="/gear" className="text-muted">Gear</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span className="text-primary">{product.short_name}</span>
          </div>

          {/* Product Hero */}
          <div className="grid-2" style={{ gap: '3rem', marginBottom: '3rem' }}>
            <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
              {product.image ? (
                <img src={product.image} alt={product.short_name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <span className="text-muted">No Image Available</span>
              )}
            </div>

            <div>
              <p className="text-accent" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                {product.categories[0]?.replace('Shop: ', '') || 'Gear'}
              </p>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>{product.name}</h1>
              <div className="text-accent" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>${product.price}</div>
              <p className="text-secondary" style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>{product.short_description}</p>

              {product.external_url && (
                <a href={product.external_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem', fontSize: '1rem', padding: '1rem' }}>
                  View on Amazon →
                </a>
              )}

              <div className="text-muted" style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8125rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ color: product.in_stock ? 'var(--success)' : 'var(--danger)' }}>●</span>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ color: 'var(--accent)' }}>★</span>
                  Amazon Customer Favorite
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>About This Product</h2>
              <div className="prose" style={{ maxWidth: '100%' }}>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>{product.description}</p>
              </div>
            </div>
          )}

          {/* Disclosure */}
          <div className="card" style={{ padding: '1rem 1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
            <strong className="text-primary">Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. This does not affect the price you pay.
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Related Products</h2>
              <div className="grid-4">
                {related.map(p => (
                  <Link key={p.id} href={`/gear/${p.slug}`} className="card product-card">
                    <div className="product-card-image" style={{ aspectRatio: '1' }}>
                      {p.image ? <img src={p.image} alt={p.short_name} loading="lazy" /> : <span className="text-muted" style={{ fontSize: '0.75rem' }}>No Image</span>}
                    </div>
                    <div style={{ padding: '0.75rem' }}>
                      <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.short_name}</h3>
                      <span className="text-accent" style={{ fontSize: '0.875rem', fontWeight: 700 }}>${p.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
