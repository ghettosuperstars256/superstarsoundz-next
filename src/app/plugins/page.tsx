import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Music Plugins & Software — 2026 Buying Guide',
  description:
    'Our curated picks for the best DAWs, mixing plugins, mastering suites, virtual instruments, guitar plugins, and vocal processing tools in 2026. Honest reviews with affiliate links.',
  openGraph: {
    title: 'Best Music Plugins & Software — 2026 Buying Guide',
    description:
      'Curated picks for DAWs, mixing, mastering, virtual instruments, guitar & vocal plugins.',
    type: 'website',
  },
};

interface Product {
  name: string;
  description: string;
  price: string;
  affiliateUrl: string;
  features: string[];
  badge?: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  products: Product[];
}

const categories: Category[] = [
  {
    id: 'daws',
    label: 'DAWs',
    icon: 'DAW',
    products: [
      {
        name: 'Ableton Live 12 Suite',
        description:
          'The industry-standard DAW for electronic music production and live performance. Session View enables non-linear composition, while Arrangement View handles traditional timeline editing.',
        price: '$749',
        affiliateUrl:
          'https://www.pluginboutique.com/products/10427?ref=superstarsoundz',
        features: [
          'Session & Arrangement Views',
          'Max for Live included',
          '26+ instruments & effects',
          'MPE support',
          'Link protocol for sync',
        ],
        badge: 'Editor\'s Choice',
      },
      {
        name: 'FL Studio 24 Producer',
        description:
          'Lifetime free updates make FL Studio one of the best-value DAWs. Known for its intuitive piano roll, step sequencer, and massive plugin bundle.',
        price: '$199',
        affiliateUrl:
          'https://www.pluginboutique.com/products/1?ref=superstarsoundz',
        features: [
          'Lifetime free updates',
          'Piano roll & step sequencer',
          '100+ plugins included',
          'Pattern-based workflow',
          'Strong MIDI support',
        ],
        badge: 'Best Value',
      },
      {
        name: 'Logic Pro',
        description:
          'Apple\'s professional DAW packed with an enormous library of instruments, loops, and effects. The best bang-for-buck DAW for Mac users.',
        price: '$199',
        affiliateUrl:
          'https://www.apple.com/logic-pro/',
        features: [
          '1,000+ instrument patches',
          'Spatial Audio mixing',
          'Live Loops grid',
          'Drummer AI session player',
          'Mac-only optimization',
        ],
      },
      {
        name: 'Studio One 7 Professional',
        description:
          'PreSonus\'s modern DAW with drag-and-drop workflow, integrated mastering suite, and excellent notation view.',
        price: '$399',
        affiliateUrl:
          'https://www.pluginboutique.com/products/8392?ref=superstarsoundz',
        features: [
          'Drag-and-drop everything',
          'Integrated mastering project',
          'Notation & chord track',
          'Show Page for live sets',
          'Native Apple Silicon',
        ],
      },
      {
        name: 'Bitwig Studio 5',
        description:
          'A modular DAW built for sound design and electronic music. The Grid modular environment and CLAP plugin support set it apart.',
        price: '$399',
        affiliateUrl:
          'https://www.pluginboutique.com/products/7265?ref=superstarsoundz',
        features: [
          'The Grid modular synth',
          'CLAP plugin format support',
          'Unified modulation system',
          'Multi-touch & MPE',
          'Sandbox plugin isolation',
        ],
      },
    ],
  },
  {
    id: 'mixing',
    label: 'Mixing Plugins',
    icon: 'MIX',
    products: [
      {
        name: 'FabFilter Pro-Q 4',
        description:
          'The gold-standard EQ with a gorgeous interface, dynamic EQ bands, and AI-assisted spectrum analysis. Essential on every mix bus.',
        price: '$179',
        affiliateUrl:
          'https://www.pluginboutique.com/products/7354?ref=superstarsoundz',
        features: [
          'Up to 24 bands',
          'Dynamic EQ per band',
          'AI spectrum analyzer',
          'Natural Phase mode',
          'Surround & Dolby Atmos',
        ],
        badge: 'Must-Have',
      },
      {
        name: 'Waves SSL E-Channel',
        description:
          'Emulation of the legendary SSL 4000 E-series channel strip. The go-to for punchy, analog-sounding mixes.',
        price: '$29 (sale)',
        affiliateUrl:
          'https://www.waves.com/plugins/ssl-e-channel?ref=superstarsoundz',
        features: [
          'SSL 4000 E preamp model',
          '4-band EQ with filters',
          'Compressor/limiter',
          'Gate/expander',
          'Analog character',
        ],
      },
      {
        name: 'Soundtoys 5 Bundle',
        description:
          'A creative effects playground — EchoBoy, Decapitator, Little AlterBoy, and 18 more. Adds character and vibe to any mix.',
        price: '$249',
        affiliateUrl:
          'https://www.pluginboutique.com/products/6721?ref=superstarsoundz',
        features: [
          '21 creative effects',
          'EchoBoy tape delay',
          'Decapitator saturation',
          'Effect Rack combos',
          'Analog-modeled warmth',
        ],
        badge: 'Creative Pick',
      },
      {
        name: 'Plugin Alliance Brainworx bx_console SSL 4000 G',
        description:
          'Component-level modeling of the SSL 4000 G console. Tolerance Matching Technology captures unit-to-unit variation.',
        price: '$299',
        affiliateUrl:
          'https://www.plugin-alliance.com/en/products/bx_console_ssl_4000_g.html?ref=superstarsoundz',
        features: [
          'TMT component modeling',
          'Full channel strip',
          'Stereo bus compressor',
          'THD & crosstalk emulated',
          'Mono & stereo versions',
        ],
      },
      {
        name: 'Slate Digital All Access Pass',
        description:
          'Subscription bundle with FG-Stress, FG-Red, Virtual Mix Rack, and more. Analog console emulation at your fingertips.',
        price: '$14.99/mo',
        affiliateUrl:
          'https://slatedigital.com/all-access-pass/?ref=superstarsoundz',
        features: [
          'Virtual Mix Rack',
          'FG-Stress compressor',
          'FG-Red console EQ',
          'Fresh Air exciter',
          'All plugins included',
        ],
      },
    ],
  },
  {
    id: 'mastering',
    label: 'Mastering Plugins',
    icon: 'MSTR',
    products: [
      {
        name: 'iZotope Ozone 11 Advanced',
        description:
          'The complete mastering suite with AI-powered Master Assistant, low-end clarity tools, and codec preview for streaming platforms.',
        price: '$499',
        affiliateUrl:
          'https://www.pluginboutique.com/products/9876?ref=superstarsoundz',
        features: [
          'AI Master Assistant',
          'Low End Focus module',
          'Codec Preview & Export',
          'Stem Focus processing',
          'Tonal Balance Control',
        ],
        badge: 'Top Pick',
      },
      {
        name: 'FabFilter Pro-L 2',
        description:
          'A transparent, versatile limiter with 8 algorithms, true peak limiting, and a gorgeous real-time display.',
        price: '$169',
        affiliateUrl:
          'https://www.pluginboutique.com/products/7356?ref=superstarsoundz',
        features: [
          '8 limiting algorithms',
          'True peak limiting',
          'Surround & Atmos support',
          'Real-time loudness display',
          'Transparent to aggressive',
        ],
      },
      {
        name: 'Waves L3 Multimaximizer',
        description:
          'Industry-standard multiband limiter used on countless commercial releases. Delivers loud, clean masters.',
        price: '$49 (sale)',
        affiliateUrl:
          'https://www.waves.com/plugins/l3-multimaximizer?ref=superstarsoundz',
        features: [
          '5-band limiting',
          'Linear Phase EQ',
          'Auto release control',
          'IDR dithering',
          'ARC auto gain',
        ],
      },
      {
        name: 'Plugin Alliance SPL Iron',
        description:
          'Variable-Mu style mastering compressor with Opto and FET modes. Adds glue and warmth to the master bus.',
        price: '$179',
        affiliateUrl:
          'https://www.plugin-alliance.com/en/products/spl_iron.html?ref=superstarsoundz',
        features: [
          'Variable-Mu design',
          'Opto & FET modes',
          'Mid-side processing',
          'Auto gain compensation',
          'Analog hardware model',
        ],
      },
    ],
  },
  {
    id: 'instruments',
    label: 'Virtual Instruments',
    icon: 'INST',
    products: [
      {
        name: 'Native Instruments Komplete 15 Ultimate',
        description:
          'The ultimate production bundle — 100+ instruments and effects including Kontakt 8, Massive X, Reaktor 7, and Symphony Series.',
        price: '$1,599',
        affiliateUrl:
          'https://www.native-instruments.com/en/products/komplete/bundles/komplete-15-ultimate/?ref=superstarsoundz',
        features: [
          '100+ instruments & effects',
          'Kontakt 8 sampler',
          'Massive X synth',
          'Symphony Series orchestrals',
          '60,000+ sounds',
        ],
        badge: 'Ultimate Bundle',
      },
      {
        name: 'Arturia V Collection X',
        description:
          '29 meticulously modeled classic keyboards — Minimoog, Jupiter-8, ARP 2600, Mellotron, and more. The definitive vintage synth collection.',
        price: '$599',
        affiliateUrl:
          'https://www.arturia.com/products/software-instruments/v-collection/overview?ref=superstarsoundz',
        features: [
          '29 classic instruments',
          'TAE analog modeling',
          'MPE compatible',
          'Huge preset library',
          'Standalone & plugin',
        ],
      },
      {
        name: 'Spectrasonics Omnisphere 2',
        description:
          'The powerhouse synth with an 14,000+ sound library, granular synthesis, and hardware synth integration.',
        price: '$499',
        affiliateUrl:
          'https://www.spectrasonics.net/products/omnisphere/?ref=superstarsoundz',
        features: [
          '14,000+ sounds',
          'Granular synthesis',
          'Hardware synth integration',
          'Orb circular controller',
          'Deep modulation matrix',
        ],
        badge: 'Sound Design King',
      },
      {
        name: 'Xfer Records Serum',
        description:
          'The wavetable synth that defined a decade of electronic music. Visual wavetable editing, ultra-clean sound, and massive preset ecosystem.',
        price: '$189',
        affiliateUrl:
          'https://xferrecords.com/products/serum?ref=superstarsoundz',
        features: [
          'Visual wavetable editor',
          'Ultra-clean oscillators',
          '140+ built-in wavetables',
          'Massive preset community',
          'Wavetable import',
        ],
      },
      {
        name: 'Spitfire Audio LABS',
        description:
          'A constantly growing collection of free, beautifully sampled instruments. Strings, choirs, pianos, textures, and more.',
        price: 'Free',
        affiliateUrl:
          'https://labs.spitfireaudio.com/?ref=superstarsoundz',
        features: [
          '100% free',
          'New instruments monthly',
          'Professional recordings',
          'Easy-to-use interface',
          'No account required',
        ],
        badge: 'Free Pick',
      },
    ],
  },
  {
    id: 'guitar',
    label: 'Guitar Plugins',
    icon: 'GTR',
    products: [
      {
        name: 'Neural DSP Archetype: Plini X',
        description:
          'A signature suite for progressive guitar tones — amps, pedals, and effects crafted with Plini. Crystal cleans to soaring leads.',
        price: '$119',
        affiliateUrl:
          'https://www.neuraldsp.com/plugins/archetype-plini?ref=superstarsoundz',
        features: [
          '3 custom amp models',
          '9 studio-quality effects',
          'Signature Plini tones',
          'Low-latency tracking',
          'Standalone & plugin',
        ],
        badge: 'Top Guitar Pick',
      },
      {
        name: 'Neural DSP Archetype: Cory Wong',
        description:
          'Funk, fusion, and clean tones galore. Cory Wong\'s signature plugin delivers pristine cleans, chorus, and envelope filter magic.',
        price: '$119',
        affiliateUrl:
          'https://www.neuraldsp.com/plugins/archetype-cory-wong?ref=superstarsoundz',
        features: [
          'Clean & funk amp models',
          'Chorus & vibrato',
          'Envelope filter',
          'Cory Wong presets',
          'DI & reamp support',
        ],
      },
      {
        name: 'Line 6 Helix Native',
        description:
          'The full Helix DSP engine as a plugin. 100+ amps, 30+ cabs, and 70+ effects — the most comprehensive guitar plugin available.',
        price: '$99 (sale)',
        affiliateUrl:
          'https://line6.com/helix/native.html?ref=superstarsoundz',
        features: [
          '100+ amp models',
          '30+ cab models',
          '70+ effects',
          'Snapshots & presets',
          'Same engine as hardware',
        ],
      },
      {
        name: 'IK Multimedia TONEX',
        description:
          'AI-powered tone modeling that captures real amps, cabs, and pedals. Access thousands of user-created Tone Models.',
        price: '$199',
        affiliateUrl:
          'https://www.ikmultimedia.com/products/tonex/?ref=superstarsoundz',
        features: [
          'AI Machine Modeling',
          '1,000+ Tone Models',
          'Capture your own gear',
          'ToneNET community',
          'Standalone & plugin',
        ],
      },
    ],
  },
  {
    id: 'vocal',
    label: 'Vocal Plugins',
    icon: 'VOC',
    products: [
      {
        name: 'iZotope Nectar 4 Plus',
        description:
          'All-in-one vocal processing suite with AI Vocal Assistant, pitch correction, harmony generation, and vocal unmixing.',
        price: '$249',
        affiliateUrl:
          'https://www.pluginboutique.com/products/9878?ref=superstarsoundz',
        features: [
          'AI Vocal Assistant',
          'Pitch correction',
          'Harmony generator',
          'Vocal Unmix technology',
          'Breath control',
        ],
        badge: 'Vocal Swiss Army Knife',
      },
      {
        name: 'Antares Auto-Tune Pro X',
        description:
          'The industry-standard pitch correction. Graph Mode for surgical editing, Auto Mode for real-time correction, and the classic Auto-Tune effect.',
        price: '$399',
        affiliateUrl:
          'https://www.antarestech.com/products/auto-tune-pro-x.html?ref=superstarsoundz',
        features: [
          'Graph Mode editing',
          'Auto Mode real-time',
          'Classic Auto-Tune effect',
          'ARA2 integration',
          'Low-latency processing',
        ],
      },
      {
        name: 'Waves CLA Vocals',
        description:
          'Chris Lord-Alge\'s go-to vocal chain in a single plugin. One-knob simplicity for radio-ready vocal sound.',
        price: '$29 (sale)',
        affiliateUrl:
          'https://www.waves.com/plugins/cla-vocals?ref=superstarsoundz',
        features: [
          'CLA signature chain',
          'One-knob simplicity',
          'Compression + EQ + reverb',
          'Delay throw control',
          'Radio-ready sound',
        ],
      },
      {
        name: 'Soundtoys Little AlterBoy',
        description:
          'Pitch shifting and formant manipulation made fun. Create harmonies, robot voices, and gender-bending vocal effects.',
        price: '$129',
        affiliateUrl:
          'https://www.pluginboutique.com/products/6723?ref=superstarsoundz',
        features: [
          'Pitch & formant shifting',
          'Quantize to scale',
          'Drive & distortion',
          'Robot mode',
          'Simple 3-knob interface',
        ],
      },
      {
        name: 'FabFilter Pro-DS',
        description:
          'The most transparent de-esser available. Single-knob simplicity with advanced sidechain and wideband/midband modes.',
        price: '$169',
        affiliateUrl:
          'https://www.pluginboutique.com/products/7358?ref=superstarsoundz',
        features: [
          'Single-knob de-essing',
          'Wideband & midband modes',
          'Sidechain filter',
          'Real-time display',
          'Transparent processing',
        ],
      },
    ],
  },
];


const categoryIntros: Record<string, { title: string; content: string }> = {
  daws: {
    title: 'How to Choose a DAW in 2026',
    content: 'Your DAW is the centerpiece of your production workflow. The best DAW is the one that matches how you think — loop-based creators thrive in Ableton, composers love Logic’s score editor, beatmakers swear by FL Studio’s piano roll, and engineers tracking live bands prefer Studio One’s console-style workflow. All four options here are professional-grade. Your ear, your OS, and your budget should drive the decision — not the brand name.'
  },
  mixing: {
    title: 'Mixing Plugins That Actually Matter',
    content: 'A channel strip, two or three good reverbs, and a solid EQ are 90% of a professional mix. The plugins we’ve selected here are the ones working engineers actually put on their master bus and stem groups — not flashy demos. FabFilter Pro-Q 4 is on virtually every mixing console we encounter. The Waves SSL remains the fastest way to add analog punch. Soundtoys remains the secret sauce for depth and character.'
  },
  mastering: {
    title: 'Mastering Tools for the Modern Producer',
    content: 'If you’re releasing music independently, iZotope Ozone 11 is the most complete mastering suite you can buy. For label-ready results, combine it with FabFilter Pro-L 2 for transparent limiting. Waves L3 is our go-to for broadcast and streaming loudness compliance. SPL Iron adds the analog warmth that digital masters often lack. Every option here has been used on commercial releases — this is not speculation.'
  },
  instruments: {
    title: 'Virtual Instruments That Replace Hardware',
    content: 'Native Instruments Komplete 15 Ultimate is the single largest collection of professional sounds available. Arturia V Collection X covers every classic keyboard that defined pop music. Serum remains the most popular wavetable synth in electronic music. Omnisphere is the choice when you need sounds that exist nowhere else. And Spitfire LABS — completely free with no account required — delivers world-class orchestration at zero cost.'
  },
  guitar: {
    title: 'Guitar Plugins for Recording and Re-amping',
    content: 'Neural DSP has set the standard for amp modeling accuracy Archetype Cory Wong covers funk cleans, while Archetype Plini covers progressive leads. Line 6 Helix Native is the most comprehensive modeler with the same engine as its hardware unit. IK Multimedia TONEX uses AI to capture real amps, with a community library of over a thousand tone models. Every plugin here can handle DI tracking, re-amping, and live performance.'
  },
  vocal: {
    title: 'Vocal Processing That Saves Takes',
    content: 'iZotope Nectar 4 Plus handles pitch, dynamics, harmony, and de-essing in one plugin — ideal for歌手s recording at home. Auto-Tune Pro X remains the industry standard for transparent pitch correction and the classic effect. CLA Vocals is the fastest path to radio-ready vocal sound. Little AlterBoy adds creative pitch-shifting and robotic textures. FabFilter Pro-DS removes sibilance transparently. Track here is a capable free alternative for budget-conscious creators.'
  },
};


export default async function PluginsPage() {
  return (
    <main style={styles.main}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>
            Best Music Plugins &amp; Software
          </h1>
          <p style={styles.heroSubtitle}>2026 Buying Guide</p>
          <p style={styles.heroDescription}>
            We&apos;ve tested hundreds of plugins and DAWs so you don&apos;t have to.
            Below are our top picks across every category — from professional DAWs
            to mixing, mastering, virtual instruments, guitar, and vocal tools.
            Every product here is one we genuinely recommend.
          </p>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <div style={styles.disclosure}>
        <div style={styles.disclosureInner}>
          <span style={styles.disclosureIcon}>ℹ️</span>
          <p style={styles.disclosureText}>
            <strong>Affiliate Disclosure:</strong> This page contains affiliate
            links. If you purchase through our links, we may earn a small
            commission at no extra cost to you. This helps us keep Superstar
            Soundz running and creating honest, independent reviews. We only
            recommend products we truly believe in.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div style={styles.filterBar}>
        <div style={styles.filterInner}>
          <span style={styles.filterLabel}>Jump to:</span>
          <div style={styles.filterChips}>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                style={styles.filterChip}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.map((category) => (
        <section key={category.id} id={category.id} style={styles.categorySection}>
          <div style={styles.categoryHeader}>
            <span style={styles.categoryIcon}>{category.icon}</span>
            <h2 style={styles.categoryTitle}>{category.label}</h2>
            <span style={styles.categoryCount}>
              {category.products.length} picks
            </span>
          </div>

          {/* Category Buying Guide */}
          {categoryIntros[category.id] && (
            <div style={{
              marginBottom: '2rem', padding: '1.5rem',
              background: '#121216', borderRadius: '16px', border: '1px solid #1e1e26',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#D4A843', marginBottom: '0.75rem' }}>
                {categoryIntros[category.id].title}
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#9090a0', lineHeight: 1.7 }}>
                {categoryIntros[category.id].content}
              </p>
            </div>
          )}

          <div style={styles.productGrid}>
            {category.products.map((product) => (
              <article key={product.name} style={styles.productCard}>
                {product.badge && (
                  <span style={styles.badge}>{product.badge}</span>
                )}
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.productDescription}>{product.description}</p>
                <div style={styles.productPrice}>{product.price}</div>
                <ul style={styles.featureList}>
                  {product.features.map((feature) => (
                    <li key={feature} style={styles.featureItem}>
                      <span style={styles.featureCheck}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.ctaButton}
                >
                  Check Price →
                </a>
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* Bottom CTA */}
      <section style={styles.bottomCta}>
        <h2 style={styles.bottomCtaTitle}>Need Help Choosing?</h2>
        <p style={styles.bottomCtaText}>
          Every producer&apos;s workflow is different. If you&apos;re unsure which
          plugin or DAW is right for you, reach out through our{' '}
          <a href="/contact" style={styles.inlineLink}>contact page</a> and
          we&apos;ll give you a personalized recommendation — no strings attached.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    backgroundColor: '#08080a',
    color: '#f0f0f2',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },

  /* Hero */
  hero: {
    background:
      'linear-gradient(135deg, #08080a 0%, #121216 50%, #1a1028 100%)',
    padding: '80px 24px 60px',
    textAlign: 'center',
    borderBottom: '1px solid #1e1e24',
  },
  heroInner: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    fontWeight: 800,
    margin: '0 0 8px',
    background: 'linear-gradient(135deg, #D4A843 0%, #f0d078 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.15,
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
    color: '#D4A843',
    fontWeight: 600,
    margin: '0 0 20px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  heroDescription: {
    fontSize: '1.05rem',
    lineHeight: 1.7,
    color: '#a0a0b0',
    maxWidth: '640px',
    margin: '0 auto',
  },

  /* Disclosure */
  disclosure: {
    backgroundColor: '#0e0e12',
    borderBottom: '1px solid #1e1e24',
    padding: '20px 24px',
  },
  disclosureInner: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  disclosureIcon: {
    fontSize: '1.2rem',
    flexShrink: 0,
    marginTop: '2px',
  },
  disclosureText: {
    fontSize: '0.88rem',
    lineHeight: 1.6,
    color: '#8888a0',
    margin: 0,
  },

  /* Filter Bar */
  filterBar: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: 'rgba(8, 8, 10, 0.92)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid #1e1e24',
    padding: '12px 24px',
  },
  filterInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '0.85rem',
    color: '#666680',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  filterChips: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '20px',
    backgroundColor: '#121216',
    border: '1px solid #2a2a32',
    color: '#c0c0d0',
    fontSize: '0.85rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },

  /* Category */
  categorySection: {
    padding: '48px 24px',
    maxWidth: '1200px',
    margin: '0 auto',
    scrollMarginTop: '80px',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '28px',
    paddingBottom: '16px',
    borderBottom: '1px solid #1e1e24',
  },
  categoryIcon: {
    fontSize: '1.6rem',
  },
  categoryTitle: {
    fontSize: '1.6rem',
    fontWeight: 700,
    margin: 0,
    color: '#f0f0f2',
  },
  categoryCount: {
    fontSize: '0.8rem',
    color: '#666680',
    backgroundColor: '#121216',
    padding: '3px 10px',
    borderRadius: '12px',
    fontWeight: 500,
  },

  /* Product Grid */
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },

  /* Product Card */
  productCard: {
    position: 'relative',
    backgroundColor: '#121216',
    border: '1px solid #1e1e24',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'border-color 0.2s ease, transform 0.2s ease',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#D4A843',
    color: '#08080a',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  productName: {
    fontSize: '1.15rem',
    fontWeight: 700,
    margin: 0,
    color: '#f0f0f2',
    paddingRight: '80px',
  },
  productDescription: {
    fontSize: '0.88rem',
    lineHeight: 1.6,
    color: '#8888a0',
    margin: 0,
  },
  productPrice: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#D4A843',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: '4px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  featureItem: {
    fontSize: '0.85rem',
    color: '#a0a0b0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  featureCheck: {
    color: '#D4A843',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  ctaButton: {
    display: 'inline-block',
    textAlign: 'center',
    backgroundColor: '#D4A843',
    color: '#08080a',
    fontWeight: 700,
    fontSize: '0.95rem',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    marginTop: '8px',
    transition: 'background-color 0.2s ease',
  },

  /* Bottom CTA */
  bottomCta: {
    textAlign: 'center',
    padding: '60px 24px 80px',
    maxWidth: '640px',
    margin: '0 auto',
  },
  bottomCtaTitle: {
    fontSize: '1.6rem',
    fontWeight: 700,
    margin: '0 0 12px',
    color: '#f0f0f2',
  },
  bottomCtaText: {
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: '#8888a0',
    margin: 0,
  },
  inlineLink: {
    color: '#D4A843',
    textDecoration: 'none',
    fontWeight: 600,
  },
};
