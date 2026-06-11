import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Superstar Soundz',
  description: 'Terms of Service for Superstar Soundz. Read our terms and conditions for using this website.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <section style={{ padding: '4rem 0 2rem', background: 'linear-gradient(135deg, #0e0e12 0%, #08080a 100%)', borderBottom: '1px solid #1e1e26' }}>
        <div className="container">
          <p className="label" style={{ marginBottom: '0.75rem' }}>Legal</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.1 }}>
            Terms of Service
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

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Acceptance of Terms</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  By accessing and using Superstar Soundz ("the Site"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Site.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Use of the Site</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  You may use the Site for lawful purposes only. You agree not to use the Site in any way that could damage, disable, or impair the Site or interfere with any other party's use of the Site.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Affiliate Disclosure</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  Superstar Soundz participates in the Amazon Associates Program and other affiliate advertising programs. This means we earn commissions from qualifying purchases made through links on this site. This comes at no additional cost to you. Our product recommendations and reviews are based on our independent research and assessment.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Product Information</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  We make every effort to provide accurate product information, pricing, and availability. However, we do not guarantee that product descriptions, prices, or other content on the Site is accurate, complete, or current. Prices and availability are subject to change without notice. Always verify current pricing on the retailer's website before making a purchase.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Intellectual Property</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  All content on the Site — including text, graphics, logos, images, and software — is the property of Superstar Soundz and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Limitation of Liability</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  Superstar Soundz is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Site or purchases made through affiliate links. We are not responsible for the products, services, or practices of any third-party retailers.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>External Links</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  The Site contains links to external websites that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Governing Law</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from your use of the Site shall be resolved in accordance with applicable dispute resolution procedures.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Changes to Terms</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on the Site. Your continued use of the Site after changes constitutes acceptance of the new terms.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Contact</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  If you have any questions about these Terms of Service, please contact us at{' '}
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
