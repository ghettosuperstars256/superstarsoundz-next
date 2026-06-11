import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: '4rem 0 3rem', background: 'linear-gradient(135deg, #0e0e12 0%, #08080a 100%)', borderBottom: '1px solid #1e1e26' }}>
        <div className="container">
          <div style={{ maxWidth: '750px' }}>
            <p className="label" style={{ marginBottom: '0.75rem' }}>About Us</p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Honest Gear Reviews.<br />Built by Musicians.
            </h1>
            <p className="text-secondary" style={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
              Superstar Soundz is a curated audio gear review platform and production services company — created by musicians, audio engineers, and producers who believe you deserve honest recommendations and world-class production.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '4rem', alignItems: 'start' }}>
            <div>
              <p className="label" style={{ marginBottom: '0.75rem' }}>Our Origin</p>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, marginBottom: '1.5rem' }}>
                Born From Real-World Experience
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  Superstar Soundz was founded by a team of musicians, audio engineers, and producers who spent years working in studios, on stages, and at events — from intimate recording sessions to large-scale concerts and festivals.
                </p>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  Along the way, we noticed a problem: most affiliate gear review sites are written by people who've never used the products. They recommend whatever pays the highest commission. Comparison tables are thin. Reviews are shallow. And the "best picks" change every week based on who's paying.
                </p>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  We built Superstar Soundz to be different. Every product we recommend is either something we've personally used, thoroughly researched, or both. We compare top picks honestly. We tell you what's good, what's not, and what gives you the best value for your budget.
                </p>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  And because we're also professional audio engineers and producers, we offer AV production services too. When you need gear, we help you find it. When you need a production team, we bring the same expertise to your event.
                </p>
              </div>
            </div>
            <div>
              <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>By the Numbers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {[
                    { num: '21', label: 'Products Reviewed' },
                    { num: '20', label: 'Buying Guides' },
                    { num: '10', label: 'Categories Covered' },
                    { num: '6', label: 'Free AI Tools' },
                  ].map((s, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D4A843' }}>{s.num}</div>
                      <div className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>What We Do</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Curated gear reviews & buying guides',
                    'Free browser-based AI music tools',
                    'Professional AV production services',
                    'Honest, commission-independent recommendations',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#D4A843', flexShrink: 0 }}>✓</span>
                      <span className="text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="grid-2" style={{ gap: '3rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <p className="label" style={{ marginBottom: '0.5rem' }}>Our Mission</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Help You Make Better Decisions</h2>
              <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                To provide honest, thorough, and genuinely helpful gear reviews and buying guides — so musicians, producers, and audio engineers at every level can find the right equipment without wasting money on gear that doesn't deliver.
              </p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <p className="label" style={{ marginBottom: '0.5rem' }}>Our Vision</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>The Most Trusted Name in Audio Gear</h2>
              <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                To become the go-to resource for audio gear recommendations — known for integrity, depth, and expertise. A site where "Superstar Soundz recommended it" means you can buy with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="label" style={{ marginBottom: '0.5rem' }}>What Drives Us</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Built on Honesty & Expertise</h2>
          </div>
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {[
              {
                icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
                title: 'Honest Reviews',
                body: 'No paid placements. No biased recommendations. We tell you what\'s genuinely good and what\'s not — regardless of affiliate commissions.',
              },
              {
                icon: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
                title: 'Real Expertise',
                body: 'Our team includes working musicians, audio engineers, and producers. When we review gear, it\'s based on real-world experience — not spec sheets.',
              },
              {
                icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
                title: 'Thorough Research',
                body: 'We don\'t just list products — we compare them. Side-by-side comparisons, price-to-performance analysis, and real-world testing inform every recommendation.',
              },
              {
                icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
                title: 'Transparency',
                body: 'We clearly disclose our affiliate relationships. We explain how we choose products. And we\'re upfront about the limitations of any gear we review.',
              },
              {
                icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
                title: 'Free Tools',
                body: 'We build free browser-based tools for musicians — because we believe in giving back to the community, not just selling products.',
              },
              {
                icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
                title: 'Production Services',
                body: 'Beyond reviews — we provide professional AV production for events. Studio recording, live sound, video production, and full event management.',
              },
            ].map((value, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(212, 168, 67, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d={value.icon} stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.375rem', fontSize: '1rem' }}>{value.title}</h3>
                  <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{value.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-secondary">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Let Us Help You Find the Right Gear</h2>
          <p className="text-secondary" style={{ maxWidth: '550px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Browse our curated selection, read expert buying guides, or reach out if you need professional production services.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/gear" className="btn-primary">Shop Gear</Link>
            <Link href="/blog" className="btn-secondary">Read Guides</Link>
            <Link href="/contact" className="btn-secondary">Get a Quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
