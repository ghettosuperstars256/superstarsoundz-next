import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | Superstar Soundz',
  description: 'FTC-compliant affiliate disclosure for Superstar Soundz. Learn how we earn commissions through affiliate links.',
};

export default function AffiliateDisclosurePage() {
  return (
    <>
      <section style={{ padding: '4rem 0 2rem', background: 'linear-gradient(135deg, #0e0e12 0%, #08080a 100%)', borderBottom: '1px solid #1e1e26' }}>
        <div className="container">
          <p className="label" style={{ marginBottom: '0.75rem' }}>Legal</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.1 }}>
            Affiliate Disclosure
          </h1>
          <p className="text-secondary" style={{ marginTop: '0.75rem', fontSize: '0.9375rem' }}>
            Last updated: June 2026
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

              <div className="bg-accent-dim border-accent" style={{ borderRadius: '12px', padding: '1.5rem 2rem' }}>
                <p style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.7 }}>
                  Superstar Soundz is a participant in the Amazon Services LLC Associates Program and other affiliate advertising programs. This means we earn advertising fees by linking to Amazon.com and other retailer sites. <strong>This comes at no additional cost to you.</strong>
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>What Are Affiliate Links?</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  Affiliate links are special URLs that contain a tracking code. When you click on one of these links and make a purchase, we earn a small commission from the retailer. The price you pay is exactly the same whether you use our link or go directly to the retailer's site.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Our Affiliate Partners</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8, marginBottom: '1rem' }}>
                  We work with the following affiliate programs:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { name: 'Amazon Associates', desc: 'We earn from qualifying purchases made through Amazon links on our product pages and blog posts.' },
                    { name: 'Plugin Boutique', desc: 'We earn commissions on music software and plugin purchases made through our affiliate links.' },
                    { name: 'eBay Partner Network', desc: 'We may earn commissions on eBay purchases made through our links.' },
                  ].map((partner, i) => (
                    <div key={i} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ color: '#D4A843', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>—</span>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{partner.name}</span>
                        <p className="text-secondary" style={{ fontSize: '0.8125rem', marginTop: '0.25rem', lineHeight: 1.6 }}>{partner.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Editorial Independence</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  Our product recommendations, reviews, and buying guides are based on our independent research and assessment. Affiliate relationships do not influence our editorial content. We only recommend products we believe will genuinely help our readers. If a product doesn't meet our standards, we won't recommend it — regardless of potential commission.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>FTC Compliance</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  This disclosure is made in accordance with the Federal Trade Commission's (FTC) guidelines concerning the use of endorsements and testimonials in advertising (16 CFR Part 255). We are committed to transparency and want you to understand how we sustain our site.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>How We Use Commissions</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  Affiliate commissions help us maintain and improve Superstar Soundz — covering hosting costs, content creation, and tool development. By using our affiliate links, you're directly supporting our ability to continue providing free, high-quality buying guides and gear reviews.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Questions?</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  If you have any questions about our affiliate relationships or this disclosure, please don't hesitate to contact us at{' '}
                  <a href="mailto:info@superstarsoundz.com" style={{ color: '#D4A843' }}>info@superstarsoundz.com</a>.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
