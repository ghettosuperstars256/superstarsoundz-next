import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <section style={{ padding: '4rem 0 2rem' }}>
        <div className="container">
          <p className="label" style={{ marginBottom: '0.5rem' }}>About</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>About Superstar Soundz</h1>
          <p className="text-secondary" style={{ maxWidth: '600px', fontSize: '1.125rem', lineHeight: 1.6 }}>
            We're a team of audio professionals dedicated to helping you find the perfect gear.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Our Mission</h2>
              <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
                Superstar Soundz was founded to cut through the noise in the audio equipment market. With so many options available, finding the right gear can be overwhelming. We simplify the process with honest, expert reviews and curated product selections.
              </p>
              <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
                Whether you're a musician, DJ, producer, or audio engineer, we help you make informed decisions about the tools that matter most to your craft.
              </p>
              <p className="text-secondary" style={{ lineHeight: 1.7 }}>
                Every product we recommend has been carefully evaluated for quality, value, and performance.
              </p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 className="text-accent" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>What We Do</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'Expert Reviews', desc: 'In-depth analysis of professional audio equipment' },
                  { title: 'Buying Guides', desc: 'Category-specific guides to help you choose' },
                  { title: 'Gear Curation', desc: 'Hand-picked products across all price ranges' },
                  { title: 'Industry Insights', desc: 'News and trends in professional audio' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem' }}>
                    <span className="text-accent" style={{ fontWeight: 700, fontSize: '0.875rem' }}>{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{item.title}</div>
                      <div className="text-muted" style={{ fontSize: '0.8125rem' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-secondary">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Let's Connect</h2>
          <p className="text-secondary" style={{ marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Have questions about gear? Want to collaborate? We'd love to hear from you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary">Contact Us</Link>
            <Link href="/blog" className="btn-secondary">Read Our Guides</Link>
          </div>
        </div>
      </section>
    </>
  );
}
