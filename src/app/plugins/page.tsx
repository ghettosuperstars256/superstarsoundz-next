import Link from 'next/link';

export const metadata = {
  title: 'Plugins & Software',
  description: 'Essential audio plugins and software for music production, mixing, mastering, and sound design — curated by the Superstar Soundz team.',
};

export default function PluginsPage() {
  const pluginCategories = [
    {
      title: 'DAWs & Production',
      description: 'Complete production environments for recording, mixing, and creating music.',
      items: [
        { name: 'Ableton Live 12 Intro', desc: 'Intuitive DAW for live performance and studio production. Session View for non-linear creativity.', price: '$99', tag: 'Popular' },
        { name: 'FL Studio Fruity Edition', desc: 'Beat-making powerhouse with step sequencer, piano roll, and lifetime free updates.', price: '$99', tag: 'Best Seller' },
        { name: 'Reaper', desc: 'Full-featured DAW with unlimited tracks, deep customization, and an unbeatable price.', price: '$60', tag: 'Best Value' },
        { name: 'GarageBand', desc: 'Free DAW for Mac/iOS — surprisingly powerful for beginners and quick ideas.', price: 'Free', tag: null },
        { name: 'Logic Pro', desc: "Apple's professional DAW with world-class instruments, effects, and mixing tools.", price: '$199', tag: 'Pro Pick' },
        { name: 'BandLab Cakewalk', desc: 'Full professional DAW — completely free. Unlimited tracks, pro mixing console.', price: 'Free', tag: 'Free' },
      ],
    },
    {
      title: 'Mixing & Mastering',
      description: 'Professional-grade plugins for polishing your mixes and masters.',
      items: [
        { name: 'iZotope Ozone Elements', desc: 'AI-powered mastering suite with assistant that analyzes your track and suggests settings.', price: '$49', tag: 'Editor\'s Choice' },
        { name: 'FabFilter Pro-Q 3', desc: 'The industry-standard EQ — surgical precision, gorgeous interface, dynamic EQ bands.', price: '$149', tag: 'Pro Pick' },
        { name: 'Valhalla Supermassive', desc: 'Lush reverbs and delays from one of the most respected names in audio plugins. Free.', price: 'Free', tag: 'Free' },
        { name: 'TDR Nova', desc: 'Dynamic EQ that compresses and expands by frequency band. Surprisingly powerful for free.', price: 'Free', tag: 'Free' },
        { name: 'iZotope Neutron Elements', desc: 'Mixing suite with AI assistant, EQ, compressor, exciter, and transient shaper.', price: '$49', tag: null },
        { name: 'Youlean Loudness Meter', desc: 'Essential for streaming delivery — measures LUFS, true peak, and dynamic range.', price: 'Free', tag: 'Essential' },
      ],
    },
    {
      title: 'Instruments & Synths',
      description: 'Virtual instruments and synthesizers for every genre and style.',
      items: [
        { name: 'Spitfire LABS', desc: 'Beautifully recorded instruments — strings, pads, pianos, and textures. All free.', price: 'Free', tag: 'Free' },
        { name: 'Vital', desc: 'Wavetable synth with visual modulation, spectral warping, and an incredible free tier.', price: 'Free', tag: 'Best Value' },
        { name: 'Dexed', desc: 'Faithful emulation of the classic Yamaha DX7 FM synth. Completely free.', price: 'Free', tag: 'Free' },
        { name: 'Surge XT', desc: 'Open-source hybrid synth with 3 oscillators, 12 filter types, and massive modulation.', price: 'Free', tag: 'Free' },
        { name: 'u-he Diva', desc: 'Analog-modeled synth that sounds incredibly real. CPU-hungry but worth it.', price: '$179', tag: 'Pro Pick' },
        { name: 'Arturia V Collection', desc: '30+ legendary synthesizers and keyboards emulated in stunning detail.', price: '$299/yr', tag: 'Premium' },
      ],
    },
    {
      title: 'Effects & Utilities',
      description: 'Creative effects, utilities, and tools to enhance your workflow.',
      items: [
        { name: 'Valhalla VintageVerb', desc: 'Classic algorithmic reverb spanning the 70s through early digital. Warm and musical.', price: '$50', tag: 'Best Value' },
        { name: 'Valhalla Delay', desc: 'Tape, digital, and BBD-style delays with modulation. Clean and characterful.', price: '$50', tag: null },
        { name: 'Camel Crusher', desc: 'Legendary free distortion and compression plugin. Still hard to beat for grit.', price: 'Free', tag: 'Classic' },
        { name: 'Aberrant DSP SketchCassette II', desc: 'Lo-fi tape and cassette emulation — wow, flutter, saturation, and degradation.', price: '$30', tag: null },
        { name: 'Analog Obsession', desc: 'Entire suite of vintage console, tape, and compressor emulations — all free.', price: 'Free', tag: 'Free' },
        { name: 'MeldaProduction MFreeFXBundle', desc: '40+ free plugins including EQ, compressor, tuner, spectrum analyzer, and more.', price: 'Free', tag: 'Free' },
      ],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section style={{ padding: '4.5rem 0 3.5rem', background: 'linear-gradient(135deg, #0e0e12 0%, #08080a 100%)', borderBottom: '1px solid #1e1e26' }}>
        <div className="container">
          <div style={{ maxWidth: '750px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', borderRadius: '100px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', marginBottom: '1.25rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a855f7', letterSpacing: '0.04em' }}>Curated Software & Plugins</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Plugins & Software
            </h1>
            <p className="text-secondary" style={{ fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              The best audio plugins and software for music production — from free essentials to professional-grade tools. Every recommendation here is something our production team actually uses.
            </p>
            <p className="text-secondary" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
              Mix of free and paid options. No affiliate links — just honest picks.
            </p>
          </div>
        </div>
      </section>

      {/* Plugin Categories */}
      {pluginCategories.map((cat, ci) => (
        <section key={ci} className={`section${ci % 2 === 1 ? ' bg-secondary' : ''}`} style={{ paddingBottom: '3rem' }}>
          <div className="container">
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>{cat.title}</h2>
              <p className="text-secondary" style={{ maxWidth: '600px', lineHeight: 1.7 }}>{cat.description}</p>
            </div>
            <div className="grid-3">
              {cat.items.map((item, i) => (
                <div key={i} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, flex: 1 }}>{item.name}</h3>
                    {item.tag && (
                      <span style={{
                        fontSize: '0.625rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '4px',
                        background: item.tag === 'Free' ? 'rgba(34,197,94,0.1)' : item.tag === 'Pro Pick' ? 'rgba(212,168,67,0.1)' : 'rgba(168,85,247,0.1)',
                        color: item.tag === 'Free' ? '#22c55e' : item.tag === 'Pro Pick' ? '#D4A843' : '#a855f7',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-secondary" style={{ fontSize: '0.8125rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>{item.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#D4A843' }}>{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Free Roundup CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="bg-accent-dim border-accent" style={{ borderRadius: '12px', padding: '3rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Start with Free Tools
            </h2>
            <p className="text-secondary" style={{ marginBottom: '1.5rem', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
              You don't need to spend money to make professional music. Combine Reaper, Vital, Spitfire LABS, and the free plugins listed above — and you've got a world-class setup for $0.
            </p>
            <Link href="/tools" className="btn-primary">Try Our Free AI Music Tools</Link>
          </div>
        </div>
      </section>
    </>
  );
}
