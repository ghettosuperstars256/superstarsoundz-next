import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Superstar Soundz',
  description: 'Privacy Policy for Superstar Soundz. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section style={{ padding: '4rem 0 2rem', background: 'linear-gradient(135deg, #0e0e12 0%, #08080a 100%)', borderBottom: '1px solid #1e1e26' }}>
        <div className="container">
          <p className="label" style={{ marginBottom: '0.75rem' }}>Legal</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.1 }}>
            Privacy Policy
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>What Information We Collect</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  We collect information you provide directly to you when you use our contact form or subscribe to our newsletter. This includes your name and email address. We also collect anonymous usage data through cookies and analytics to improve our site.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>How We Use Your Information</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  We use your information to respond to your inquiries, send you newsletters (if you opt in), and improve our website. We do not sell, rent, or share your personal information with third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Cookies</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  We use cookies to improve your browsing experience and analyze site traffic. You can disable cookies in your browser settings, but some features of the site may not function properly without them.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Affiliate Links</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  Our site contains affiliate links, primarily through the Amazon Associates program. When you click on these links and make a purchase, we may earn a commission at no additional cost to you. These links are clearly marked and do not affect the price you pay.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Newsletter</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  If you subscribe to your newsletter, your email address is stored securely and used only to send you updates about new gear reviews, buying guides, and deals. You can unsubscribe at any time by clicking the link in any email.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Third-Party Services</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  We use third-party services including Vercel (hosting), Resend (email delivery), and Amazon Associates (affiliate program). Each of these services has their own privacy policy governing how they handle data.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Data Security</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Changes to This Policy</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of the site after changes constitutes acceptance of the new policy.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Contact</h2>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  If you have any questions about this Privacy Policy, please contact us at{' '}
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
