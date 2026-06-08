import { notFound } from 'next/navigation';
import Link from 'next/link';
import products from '@/data/products.json';
import productCategories from '@/data/product-categories.json';
import type { Metadata } from 'next';

interface Props { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = productCategories.find(c => c.slug === params.slug);
  if (!cat) return { title: 'Category Not Found' };
  return {
    title: `${cat.name} — Professional Audio Equipment | Superstar Soundz`,
    description: `Browse the best ${cat.name.toLowerCase()} for musicians, DJs, and producers. Expert reviews, price comparisons, and buying guides.`,
    openGraph: { title: cat.name, description: `Best ${cat.name.toLowerCase()} reviews`, type: 'website' },
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
    description: `Browse the best ${cat.name.toLowerCase()} for musicians, DJs, and producers.`,
    url: `https://superstarsoundz.com/category/${params.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="section">
        <div className="container">
          <div className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.8125rem' }}>
            <Link href="/" className="text-muted">Home</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <Link href="/gear" className="text-muted">Gear</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span className="text-primary">{cat.name}</span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p className="label" style={{ marginBottom: '0.5rem' }}>Shop by Category</p>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{cat.name}</h1>
            <p className="text-secondary">{filtered.length} product{filtered.length !== 1 ? 's' : ''} in this category</p>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link href="/gear" className="badge" style={{ textDecoration: 'none', opacity: 0.7 }}>All Gear</Link>
            {productCategories.filter(c => c.slug !== params.slug).map(c => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="badge" style={{ textDecoration: 'none', opacity: 0.7 }}>{c.name}</Link>
            ))}
          </div>

          <div className="grid-3">
            {filtered.map(product => (
              <Link key={product.id} href={`/gear/${product.slug}`} className="card product-card">
                <div className="product-card-image">
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
                  <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.short_description}</p>
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
