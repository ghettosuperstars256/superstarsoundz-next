import { notFound } from 'next/navigation';
import Link from 'next/link';
import products from '@/data/products.json';
import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ product: string }> }): Promise<Metadata> {
  const { product: slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) return { title: 'Product Not Found' };
  const cleanDesc = product.short_description.replace(/\n/g, ' ').trim();
  return {
    title: `${product.short_name} — $${product.price} | Superstar Soundz`,
    description: cleanDesc,
    openGraph: {
      title: `${product.short_name} — $${product.price}`,
      description: cleanDesc,
      type: 'website',
      images: product.image ? [{ url: `https://superstarsoundz.com${product.image}`, alt: product.short_name }] : undefined,
    },
    alternates: {
      canonical: `https://superstarsoundz.com/gear/${product.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return products.map(p => ({ product: p.slug }));
}

function generateFaqSchema(product: typeof products[0]) {
  const catName = product.categories[0]?.replace('Shop: ', '') || 'Audio Equipment';
  const faqs = [
    {
      question: `Is the ${product.short_name} good for professional use?`,
      answer: `Yes. The ${product.short_name} is designed for professional and enthusiast use. ${product.short_description.replace(/\n/g, ' ').trim()}`,
    },
    {
      question: `What is the price of the ${product.short_name}?`,
      answer: `The ${product.short_name} is currently priced at $${product.price}. Check the link above for the latest pricing and availability.`,
    },
    {
      question: `Where can I buy the ${product.short_name}?`,
      answer: `You can purchase the ${product.short_name} through our affiliate link on Amazon. This helps support Superstar Soundz at no additional cost to you.`,
    },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) notFound();

  const related = products.filter(p => p.id !== product.id && p.categories.some(c => product.categories.includes(c))).slice(0, 4);
  const sameBrand = products.filter(p => p.id !== product.id && p.short_name.split(' ')[0] === product.short_name.split(' ')[0]).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.short_name,
    description: product.short_description.replace(/\n/g, ' ').trim(),
    image: product.image ? `https://superstarsoundz.com${product.image}` : undefined,
    brand: { '@type': 'Brand', name: product.short_name.split(' ')[0] },
    sku: String(product.id),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: product.external_url || `https://superstarsoundz.com/gear/${product.slug}`,
      seller: { '@type': 'Organization', name: 'Amazon' },
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://superstarsoundz.com' },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://superstarsoundz.com/gear' },
      { '@type': 'ListItem', position: 3, name: product.short_name, item: `https://superstarsoundz.com/gear/${product.slug}` },
    ],
  };

  const faqLd = generateFaqSchema(product);
  const catName = product.categories[0]?.replace('Shop: ', '') || 'Shop';
  const catSlug = product.categories[0]?.replace('Shop: ', '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-and-/, '-').replace(/^-|-$/g, '');
  const brandName = product.short_name.split(' ')[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* ===== PRODUCT HERO ===== */}
      <section style={{ padding: '3rem 0 0' }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ marginBottom: '2rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#5a5a6a', transition: 'color 0.15s' }}>Home</Link>
            <span style={{ color: '#3a3a48' }}>/</span>
            <Link href="/gear" style={{ color: '#5a5a6a', transition: 'color 0.15s' }}>Shop</Link>
            <span style={{ color: '#3a3a48' }}>/</span>
            <Link href={`/category/${catSlug}`} style={{ color: '#5a5a6a', transition: 'color 0.15s' }}>{catName}</Link>
            <span style={{ color: '#3a3a48' }}>/</span>
            <span style={{ color: '#f0f0f2', fontWeight: 500 }}>{product.short_name}</span>
          </nav>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '3rem' }}>
            {/* Left: Image */}
            <div>
              <div className="img-zoom" style={{
                background: 'linear-gradient(145deg, #0e0e12 0%, #141418 100%)',
                borderRadius: '24px',
                border: '1px solid #1e1e26',
                padding: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '480px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Subtle grid pattern */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                  pointerEvents: 'none',
                }} />
                {product.image ? (
                  <img src={product.image} alt={product.short_name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
                ) : (
                  <span style={{ color: '#5a5a6a', fontSize: '0.875rem' }}>No Image Available</span>
                )}

                {/* Badge overlay */}
                {product.badge && (
                  <div style={{
                    position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 2,
                    padding: '0.5rem 1rem', borderRadius: '100px',
                    background: product.badge === 'Best Value' ? 'rgba(34,197,94,0.15)' : product.badge === "Editor's Choice" ? 'rgba(212,168,67,0.15)' : 'rgba(168,85,247,0.15)',
                    color: product.badge === 'Best Value' ? '#22c55e' : product.badge === "Editor's Choice" ? '#D4A843' : '#a855f7',
                    fontSize: '0.75rem', fontWeight: 700,
                    border: `1px solid ${product.badge === 'Best Value' ? 'rgba(34,197,94,0.3)' : product.badge === "Editor's Choice" ? 'rgba(212,168,67,0.3)' : 'rgba(168,85,247,0.3)'}`,
                    backdropFilter: 'blur(8px)',
                  }}>
                    {product.badge}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div style={{ position: 'sticky', top: '6rem', alignSelf: 'start' }}>
              {/* Brand + Category */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#D4A843', letterSpacing: '0.04em' }}>{brandName}</span>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#3a3a48' }} />
                <Link href={`/category/${catSlug}`} className="badge" style={{ textDecoration: 'none' }}>{catName}</Link>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                {product.short_name}
              </h1>

              {/* Short description */}
              <p style={{ color: '#9090a0', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {product.short_description}
              </p>

              {/* Price */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#D4A843', letterSpacing: '-0.02em' }}>${product.price}</span>
                  <span style={{ fontSize: '0.875rem', color: '#5a5a6a' }}>USD</span>
                </div>
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
                {product.external_url && (
                  <a
                    href={product.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      width: '100%', padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: 700,
                      background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)',
                      color: '#000', borderRadius: '12px', textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(212,168,67,0.25)',
                    }}
                  >
                    Check Price on Amazon
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                )}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={`https://www.amazon.com/s?k=${encodeURIComponent(product.short_name)}&tag=ghettosuper02-20`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1, padding: '0.625rem 1rem', fontSize: '0.8125rem', fontWeight: 600,
                      background: '#1a1a22', color: '#9090a0', borderRadius: '10px',
                      border: '1px solid #1e1e26', textDecoration: 'none', textAlign: 'center',
                    }}
                  >
                    Search Amazon
                  </a>
                  <a
                    href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(product.short_name)}&campid=5339097698`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1, padding: '0.625rem 1rem', fontSize: '0.8125rem', fontWeight: 600,
                      background: '#1a1a22', color: '#9090a0', borderRadius: '10px',
                      border: '1px solid #1e1e26', textDecoration: 'none', textAlign: 'center',
                    }}
                  >
                    Search eBay
                  </a>
                </div>
                <p style={{ fontSize: '0.6875rem', color: '#5a5a6a', textAlign: 'center', marginTop: '0.25rem' }}>
                  Prices may vary. Last checked: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Trust signals */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem',
                padding: '1.25rem', background: '#121216', borderRadius: '10px', border: '1px solid #1e1e26',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#22c55e', fontSize: '0.75rem' }} className="pulse-dot">●</span>
                  <span style={{ fontSize: '0.8125rem', color: '#9090a0' }}>In Stock</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="10" rx="2" stroke='#D4A843' strokeWidth="1.5"/><path d="M2 7h12" stroke='#D4A843' strokeWidth="1.5"/></svg>
                  <span style={{ fontSize: '0.8125rem', color: '#9090a0' }}>Free Returns</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1l2.2 4.5 5 .7-3.6 3.5.8 5L8 12.4 3.6 14.7l.8-5L.8 6.2l5-.7z" stroke='#D4A843' strokeWidth="1.5"/></svg>
                  <span style={{ fontSize: '0.8125rem', color: '#9090a0' }}>Amazon Verified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke='#D4A843' strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <span style={{ fontSize: '0.8125rem', color: '#9090a0' }}>Fast Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DESCRIPTION ===== */}
      {product.description && (
        <section className="section-sm" style={{ paddingTop: '4rem' }}>
          <div className="container">
            <div style={{ maxWidth: '800px' }}>
              <div className="label" style={{ marginBottom: '1.25rem' }}>Overview</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                About the {product.short_name}
              </h2>
              <div className="prose" style={{ maxWidth: '100%' }} dangerouslySetInnerHTML={{ __html: product.description }} />
              {product.name !== product.short_name && (
                <p style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: '#5a5a6a' }}>
                  <strong style={{ color: '#9090a0' }}>Full Name:</strong> {product.name}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== SPECS ===== */}
      <section className="section-sm" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <div className="label" style={{ marginBottom: '1.25rem' }}>Specifications</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Quick Specs</h2>
            <div className="specs-grid">
              <div className="specs-cell">
                <div className="specs-label">Brand</div>
                <div className="specs-value">{brandName}</div>
              </div>
              <div className="specs-cell">
                <div className="specs-label">Category</div>
                <div className="specs-value">{catName}</div>
              </div>
              <div className="specs-cell">
                <div className="specs-label">Price</div>
                <div className="specs-value" style={{ color: '#D4A843' }}>${product.price}</div>
              </div>
              <div className="specs-cell">
                <div className="specs-label">Availability</div>
                <div className="specs-value" style={{ color: '#22c55e' }}>In Stock</div>
              </div>
              {product.badge && (
                <div className="specs-cell">
                  <div className="specs-label">Editor Rating</div>
                  <div className="specs-value" style={{ color: product.badge === 'Best Value' ? '#22c55e' : product.badge === "Editor's Choice" ? '#D4A843' : '#a855f7' }}>{product.badge}</div>
                </div>
              )}
              <div className="specs-cell">
                <div className="specs-label">SKU</div>
                <div className="specs-value" style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{product.id}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section-sm" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <div className="label" style={{ marginBottom: '1.25rem' }}>Questions</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { q: `Is the ${product.short_name} good for professional use?`, a: `Yes. The ${product.short_name} is designed for professional and enthusiast use. ${product.short_description.replace(/\n/g, ' ').trim()}` },
                { q: `What is the price of the ${product.short_name}?`, a: `The ${product.short_name} is currently priced at $${product.price}. Check the Amazon link above for the latest pricing and availability.` },
                { q: `Where can I buy the ${product.short_name}?`, a: `You can purchase the ${product.short_name} through our affiliate link on Amazon. This helps support Superstar Soundz at no additional cost to you.` },
              ].map((faq, i) => (
                <div key={i} style={{
                  padding: '1.5rem', background: '#121216', borderRadius: '16px',
                  border: '1px solid #1e1e26', transition: 'all 0.2s',
                }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.625rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212, 168, 67, 0.08)',
                      color: '#D4A843', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                    }}>{i + 1}</span>
                    {faq.q}
                  </h3>
                  <p style={{ color: '#9090a0', lineHeight: 1.7, fontSize: '0.9375rem', paddingLeft: '2.5rem' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DISCLOSURE ===== */}
      <section style={{ padding: '0 0 2rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <div style={{
              padding: '1rem 1.25rem', fontSize: '0.8125rem', color: '#5a5a6a',
              background: '#121216', borderRadius: '10px', border: '1px solid #1e1e26',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><circle cx="8" cy="8" r="6.5" stroke='#5a5a6a' strokeWidth="1.5"/><path d="M8 7v3M8 11v.5" stroke='#5a5a6a' strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span><strong style={{ color: '#9090a0' }}>Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. Prices and availability are subject to change.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RELATED PRODUCTS ===== */}
      {related.length > 0 && (
        <section className="section-sm" style={{ background: '#0e0e12', borderTop: '1px solid #1e1e26' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <div className="label" style={{ marginBottom: '0.75rem' }}>Similar</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Related Products</h2>
              </div>
              <Link href={`/category/${catSlug}`} className="btn-ghost" style={{ fontSize: '0.8125rem' }}>
                View All {catName}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
            <div className="grid-4 stagger-children">
              {related.map(p => (
                <Link key={p.id} href={`/gear/${p.slug}`} className="card product-card">
                  <div className="product-card-image">
                    {p.image ? <img src={p.image} alt={p.short_name} loading="lazy" /> : <span style={{ fontSize: '0.75rem', color: '#5a5a6a' }}>No Image</span>}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#D4A843', marginBottom: '0.375rem', letterSpacing: '0.02em' }}>
                      {p.short_name.split(' ')[0]}
                    </p>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.short_name}</h3>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#D4A843' }}>${p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== SAME BRAND ===== */}
      {sameBrand.length > 0 && (
        <section className="section-sm">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <div className="label" style={{ marginBottom: '0.75rem' }}>More from {brandName}</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>You Might Also Like</h2>
              </div>
            </div>
            <div className="grid-4 stagger-children">
              {sameBrand.map(p => (
                <Link key={p.id} href={`/gear/${p.slug}`} className="card product-card">
                  <div className="product-card-image">
                    {p.image ? <img src={p.image} alt={p.short_name} loading="lazy" /> : <span style={{ fontSize: '0.75rem', color: '#5a5a6a' }}>No Image</span>}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#D4A843', marginBottom: '0.375rem' }}>{p.short_name.split(' ')[0]}</p>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.short_name}</h3>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#D4A843' }}>${p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
