import Link from 'next/link';

const services = [
  {
    title: 'Audio Equipment Consulting',
    description: 'Expert advice on selecting the right gear for your studio, live setup, or production workflow. We help you make informed decisions.',
    features: ['Gear selection guidance', 'Budget optimization', 'Setup recommendations', 'Brand comparisons'],
  },
  {
    title: 'Studio Design & Setup',
    description: 'Complete studio design services from acoustic treatment to equipment installation. Build a space that sounds professional.',
    features: ['Acoustic treatment planning', 'Equipment layout', 'Cable management', 'Signal flow optimization'],
  },
  {
    title: 'Content Creation',
    description: 'Professional content for your audio brand — reviews, tutorials, buying guides, and social media content that converts.',
    features: ['Product reviews', 'Buying guides', 'Video scripts', 'Social media content'],
  },
  {
    title: 'Affiliate Partnership',
    description: 'Partner with Superstar Soundz to promote your audio products. We connect brands with serious buyers.',
    features: ['Product placements', 'Honest reviews', 'Audience reach', 'Performance tracking'],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: '4rem 0 2rem' }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#D4A843', marginBottom: '0.5rem' }}>
            What We Do
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>Our Services</h1>
          <p style={{ color: '#888888', maxWidth: '600px', fontSize: '1.125rem', lineHeight: 1.6 }}>
            From gear consulting to content creation, we help musicians, producers, and brands get the most out of their audio journey.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-sm">
        <div className="container">
          <div className="grid-2">
            {services.map((service, i) => (
              <div key={i} className="card" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#D4A843', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                  Service {String(i + 1).padStart(2, '0')}
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{service.title}</h2>
                <p style={{ color: '#888888', marginBottom: '1.25rem', lineHeight: 1.6 }}>{service.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {service.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#888888' }}>
                      <span style={{ color: '#D4A843', fontSize: '0.625rem' }}>●</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ background: '#111111' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Get Started?</h2>
          <p style={{ color: '#888888', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Let's talk about your project. Whether you need gear advice, studio design, or content creation, we're here to help.
          </p>
          <Link href="/contact" className="btn-primary">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
