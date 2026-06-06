import Link from 'next/link';

const services = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 017 7c0 2.4-1.2 4.5-3 5.7V17a2 2 0 01-2 2H10a2 2 0 01-2-2v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 017-7z"/>
        <path d="M9 21h6"/>
      </svg>
    ),
    title: 'Gear Consultation',
    desc: 'Not sure what to buy? Our audio experts help you choose the right microphones, headphones, interfaces, and studio gear based on your specific needs, genre, and budget. Get personalized recommendations from professionals who actually use the gear.',
    cta: 'Get a Consultation →',
    href: '/contact',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 3v18"/>
      </svg>
    ),
    title: 'Studio Design',
    desc: 'Planning a home studio or professional recording space? We provide layout recommendations, acoustic treatment guidance, and equipment placement advice to help you build a studio that sounds great and fits your workflow.',
    cta: 'Plan Your Studio →',
    href: '/contact',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    title: 'Equipment Reviews',
    desc: 'We test and review professional audio equipment — from budget interfaces to high-end studio monitors. Our hands-on reviews cover sound quality, build, features, and value so you can make informed buying decisions.',
    cta: 'Read Our Reviews →',
    href: '/blog',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Artist & Label Services',
    desc: 'We work with artists, producers, and record labels to source, set up, and optimize professional audio gear. Whether you need a full studio package or specific recommendations, we deliver solutions tailored to your creative process.',
    cta: 'Work With Us →',
    href: '/contact',
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-20 text-center" style={{ background: 'linear-gradient(180deg, rgba(212,168,67,0.05) 0%, transparent 100%)' }}>
        <div className="container">
          <span className="section-label">What We Offer</span>
          <h1 className="section-title mb-4">Professional Audio Services</h1>
          <p className="section-desc">From gear selection to studio build-out, we help musicians, producers, and creators get the right equipment for their needs and budget.</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div key={service.title} className="card p-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(212,168,67,0.1)', color: '#D4A843' }}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-[#8888A0] leading-relaxed mb-5">{service.desc}</p>
                <Link href={service.href} className="text-[#D4A843] font-semibold text-sm inline-flex items-center gap-2 hover:text-[#E8C76A] transition-colors">
                  {service.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="container">
          <div className="text-center py-16 px-8 rounded-2xl border border-[rgba(212,168,67,0.15)]" style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.08), rgba(212,168,67,0.02))' }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-[#8888A0] max-w-[480px] mx-auto mb-8 leading-relaxed">
              Whether you need help choosing your first audio interface or designing a full studio, we are here to help.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">Contact Us Today →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
