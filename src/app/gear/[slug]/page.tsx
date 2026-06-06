import { notFound } from 'next/navigation';
import Link from 'next/link';
import products from '@/data/products.json';

interface Props {
  params: { slug: string };
}

export default function ProductPage({ params }: Props) {
  const product = products.find(p => p.slug === params.slug);
  if (!product) notFound();

  // Get related products from same category
  const related = products
    .filter(p => p.id !== product.id && p.categories.some(c => product.categories.includes(c)))
    .slice(0, 4);

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.8125rem', color: '#555555' }}>
          <Link href="/" style={{ color: '#555555' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <Link href="/gear" style={{ color: '#555555' }}>Gear</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span style={{ color: '#e8e8e8' }}>{product.short_name}</span>
        </div>

        {/* Product Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          {/* Image */}
          <div style={{ background: '#161616', border: '1px solid #222222', borderRadius: '8px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            {product.image ? (
              <img src={product.image} alt={product.short_name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ color: '#555555' }}>No Image Available</div>
            )}
          </div>

          {/* Details */}
          <div>
            <p style={{ fontSize: '0.75rem', color: '#D4A843', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              {product.categories[0]?.replace('Shop: ', '') || 'Gear'}
            </p>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>{product.name}</h1>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D4A843', marginBottom: '1.5rem' }}>
              ${product.price}
            </div>
            <p style={{ color: '#888888', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              {product.short_description}
            </p>

            {product.external_url && (
              <a
                href={product.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem', fontSize: '1rem', padding: '1rem' }}
              >
                View on Amazon →
              </a>
            )}

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: '#555555' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ color: product.in_stock ? '#22c55e' : '#ef4444' }}>●</span>
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </span>
              <span>•</span>
              <span>Free shipping on eligible orders</span>
            </div>
          </div>
        </div>

        {/* Full Description */}
        {product.description && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #222222' }}>
              About This Product
            </h2>
            <div className="prose" style={{ maxWidth: '100%' }}>
              <p style={{ color: '#888888', lineHeight: 1.8 }}>{product.description}</p>
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Related Products</h2>
            <div className="grid-4">
              {related.map(p => (
                <Link key={p.id} href={`/gear/${p.slug}`} className="card product-card">
                  <div className="product-card-image" style={{ aspectRatio: '1' }}>
                    {p.image ? (
                      <img src={p.image} alt={p.short_name} loading="lazy" />
                    ) : (
                      <div style={{ color: '#555555', fontSize: '0.75rem' }}>No Image</div>
                    )}
                  </div>
                  <div style={{ padding: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.short_name}
                    </h3>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#D4A843' }}>${p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Generate static params for all products
export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}
