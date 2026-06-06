import Link from 'next/link';

const stats = [
  { value: '23', label: 'Products' },
  { value: '10', label: 'Categories' },
  { value: '15', label: 'Brands' },
  { value: '4', label: 'Continents' },
];

const categories = [
  { name: 'Microphones', desc: 'Condenser, dynamic, ribbon', href: '/gear/microphones', emoji: '🎤' },
  { name: 'Headphones', desc: 'Studio, DJ, audiophile', href: '/gear/headphones', emoji: '🎧' },
  { name: 'Studio Monitors', desc: 'Hear every detail', href: '/gear/studio-monitors', emoji: '🔊' },
  { name: 'DJ Controllers', desc: 'Mix and perform', href: '/gear/dj-controllers', emoji: '🎛️' },
  { name: 'Audio Interfaces', desc: 'Record pristine audio', href: '/gear/audio-interfaces', emoji: '🎸' },
  { name: 'PA Systems', desc: 'Powerful live sound', href: '/gear/pa-systems', emoji: '📢' },
  { name: 'MIDI Controllers', desc: 'Keys, pads, and knobs', href: '/gear/midi-controllers', emoji: '🎹' },
];

const featuredProducts = [
  { name: 'beyerdynamic DT 990 PRO', category: 'Headphones', price: '$199.99', href: '/gear/headphones', emoji: '🎧' },
  { name: 'beyerdynamic DT 1770 PRO MKII', category: 'Headphones', price: '$649.99', href: '/gear/headphones', emoji: '🎧' },
  { name: 'Behringer X32 Digital Mixer', category: 'Mixers', price: '$2,099', href: '/gear', emoji: '🎛️' },
  { name: 'Focusrite Scarlett Solo 3rd Gen', category: 'Audio Interfaces', price: '$119.99', href: '/gear/audio-interfaces', emoji: '🎸' },
  { name: 'Audio-Technica ATH-M50x', category: 'Headphones', price: '$179', href: '/gear/headphones', emoji: '🎧' },
  { name: 'Pioneer DJ DDJ-FLX4', category: 'DJ Controllers', price: '$328.95', href: '/gear/dj-controllers', emoji: '🎛️' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-[-50%] right-[-20%] w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)' }} />
        <div className="container text-center relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] uppercase text-[#D4A843] mb-5">
            <span className="w-2 h-2 rounded-full bg-[#D4A843] animate-pulse" />
            Trusted by Audio Professionals
          </div>
          <h1 className="font-bold mb-4 leading-[1.08]">
            Professional Sound Gear<br />
            <span className="gold-text">Curated For Pros</span>
          </h1>
          <p className="text-[#8888A0] text-lg max-w-[520px] mx-auto mb-8 leading-relaxed">
            Honest buying guides, expert reviews, and the best prices on studio monitors, headphones, DJ gear, and pro audio equipment.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/gear" className="btn btn-primary btn-lg">
              Shop All Gear
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/blog" className="btn btn-outline btn-lg">
              Read Buying Guides
            </Link>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Stats */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-[#D4A843] mb-1">{stat.value}</div>
                <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#8888A0]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Browse</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-desc">Find the perfect gear for your setup — from studio to stage</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="card p-6 group"
              >
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-[#D4A843] transition-colors">{cat.name}</h3>
                <p className="text-[#8888A0] text-sm mb-3">{cat.desc}</p>
                <span className="text-[#D4A843] text-sm font-semibold inline-flex items-center gap-1">
                  Browse →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Featured Gear */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Top Picks</span>
            <h2 className="section-title">Featured Gear</h2>
            <p className="section-desc">Hand-picked by our audio engineers — the best gear at every budget</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="card group"
              >
                <div className="aspect-square bg-gradient-to-br from-[#12121C] to-[#0C0C12] flex items-center justify-center text-5xl">
                  {product.emoji}
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#D4A843]">{product.category}</span>
                  <h3 className="text-base font-bold mt-1 mb-2 group-hover:text-[#D4A843] transition-colors leading-tight">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">{product.price}</span>
                    <span className="btn btn-primary text-xs py-2 px-4">View Deal</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="text-center py-16 px-8 rounded-2xl border border-[rgba(212,168,67,0.15)]" style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.08), rgba(212,168,67,0.02))' }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Find Your Perfect Sound</h2>
            <p className="text-[#8888A0] max-w-[480px] mx-auto mb-8 leading-relaxed">
              Whether you&apos;re building a home studio or upgrading your live setup, we&apos;ve got the gear and guides to help you decide.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/gear" className="btn btn-primary btn-lg">Shop All Gear</Link>
              <Link href="/blog" className="btn btn-outline btn-lg">Read Guides</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
