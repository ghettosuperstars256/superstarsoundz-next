import Link from 'next/link';

const products = [
  { name: 'beyerdynamic DT 990 PRO', category: 'Headphones', price: '$199.99', slug: 'beyerdynamic-dt-990-pro', emoji: '🎧' },
  { name: 'beyerdynamic DT 1770 PRO MKII', category: 'Headphones', price: '$649.99', slug: 'beyerdynamic-dt-1770-pro-mkii', emoji: '🎧' },
  { name: 'Behringer X32 Digital Mixer', category: 'Mixers', price: '$2,099', slug: 'behringer-x32-digital-mixer', emoji: '🎛️' },
  { name: 'RX-8D Powered Audio Mixer', category: 'Mixers', price: '$199.98', slug: 'rx-8d-powered-audio-mixer', emoji: '🎛️' },
  { name: 'Edifier T5s Active Subwoofer', category: 'Studio Subwoofers', price: '$199.99', slug: 'edifier-t5s-active-subwoofer', emoji: '🔊' },
  { name: 'Sonos Sub 4 Wireless Subwoofer', category: 'Studio Subwoofers', price: '$759', slug: 'sonos-sub-4-wireless-subwoofer', emoji: '🔊' },
  { name: 'Focusrite Scarlett Solo 3rd Gen', category: 'Audio Interfaces', price: '$119.99', slug: 'focusrite-scarlett-solo-3rd-gen', emoji: '🎸' },
  { name: 'Audio-Technica ATH-M50x', category: 'Headphones', price: '$179', slug: 'audio-technica-ath-m50x', emoji: '🎧' },
  { name: 'Pioneer DJ DDJ-FLX4', category: 'DJ Controllers', price: '$328.95', slug: 'pioneer-dj-ddj-flx4', emoji: '🎛️' },
  { name: 'JBL 305P MkII Studio Monitors', category: 'Studio Monitors', price: '$239', slug: 'jbl-305p-mkii-studio-monitors', emoji: '🔊' },
  { name: 'Shure SM58 Dynamic Microphone', category: 'Microphones', price: '$99', slug: 'shure-sm58-dynamic-microphone', emoji: '🎤' },
  { name: 'Rode NT1-A Condenser Microphone', category: 'Microphones', price: '$229', slug: 'rode-nt1-a-condenser-microphone', emoji: '🎤' },
];

const categories = ['All', 'Headphones', 'Microphones', 'Studio Monitors', 'DJ Controllers', 'Audio Interfaces', 'Mixers', 'Studio Subwoofers'];

export default function GearPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-20 text-center" style={{ background: 'linear-gradient(180deg, rgba(212,168,67,0.05) 0%, transparent 100%)' }}>
        <div className="container">
          <span className="section-label">Catalog</span>
          <h1 className="section-title mb-4">Shop Pro Audio Gear</h1>
          <p className="section-desc">Browse our curated selection of professional audio equipment. Every product is hand-picked and tested by our team.</p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="container">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 text-[13px] font-medium rounded-lg border border-white/[0.06] text-[#8888A0] hover:text-white hover:border-[rgba(212,168,67,0.3)] transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-16">
        <div className="container">
          <p className="text-[#8888A0] text-sm mb-6">Showing 1–{products.length} of {products.length} results</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/gear/${product.slug}`}
                className="card group"
              >
                <div className="aspect-square bg-gradient-to-br from-[#12121C] to-[#0C0C12] flex items-center justify-center text-5xl">
                  {product.emoji}
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#D4A843]">{product.category}</span>
                  <h3 className="text-sm font-bold mt-1 mb-2 group-hover:text-[#D4A843] transition-colors leading-tight">{product.name}</h3>
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
    </>
  );
}
