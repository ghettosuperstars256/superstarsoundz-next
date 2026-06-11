import Link from 'next/link';

const AI_TOOLS = [
  {
    name: 'Suno AI',
    category: 'Music Generation',
    description: 'Create full songs with vocals and instrumentation from text prompts. Generate professional-quality music in any genre for free.',
    url: 'https://suno.com',
    features: ['Text-to-song', 'Vocals + instruments', 'Multiple genres', 'Free tier available'],
    rating: 4.8,
    pricing: 'Free tier + Pro',
    image: '🎵',
  },
  {
    name: 'Udio',
    category: 'Music Generation',
    description: 'AI music studio that creates realistic songs from descriptions. Produce studio-quality tracks with natural vocals and rich production.',
    url: 'https://udio.com',
    features: ['Studio quality', 'Realistic vocals', 'Genre blending', 'Free generation'],
    rating: 4.7,
    pricing: 'Free tier + Pro',
    image: '🎶',
  },
  {
    name: 'LANDR',
category: 'Mastering',
    description: 'Professional AI-powered audio mastering. Get broadcast-ready masters in minutes with intelligent processing and format delivery.',
    url: 'https://landr.com',
    features: ['AI mastering', 'Format delivery', 'Loudness optimization', 'Free masters'],
    rating: 4.5,
    pricing: 'Free masters + Subscription',
    image: '🎚️',
  },
  {
    name: 'LALAL.AI',
    category: 'Stem Separation',
    description: 'Extract vocals, drums, bass, and other instruments from any track. High-quality AI stem separation for remixing and sampling.',
    url: 'https://lalal.ai',
    features: ['Vocal extraction', 'Stem splitting', 'High quality', 'Free minutes'],
    rating: 4.6,
    pricing: 'Free minutes + Credits',
    image: '🎤',
  },
  {
    name: 'Moises',
    category: 'Music Analysis',
    description: 'AI music app that separates tracks, detects chords, adjusts tempo and pitch. Perfect for musicians learning and practicing.',
    url: 'https://moises.ai',
    features: ['Track separation', 'Chord detection', 'Tempo control', 'Pitch shift', 'Free plan'],
    rating: 4.7,
    pricing: 'Free plan + Premium',
    image: '🎸',
  },
  {
    name: 'BandLab',
    category: 'DAW + Collaboration',
    description: 'Free cloud-based DAW with AI mastering, loops, and collaboration tools. Write, record, and mix music from any device.',
    url: 'https://bandlab.com',
    features: ['Full DAW', 'AI mastering', 'Collaboration', 'Free loops', '100% free'],
    rating: 4.6,
    pricing: '100% Free',
    image: '🎧',
  },
  {
    name: 'Splice',
    category: 'Samples + AI',
    description: 'Massive sample library with AI-powered search and Creator Tools. Find the perfect sounds for your productions.',
    url: 'https://splice.com',
    features: ['Sample library', 'AI search', 'Creator tools', 'Rent-to-own plugins'],
    rating: 4.5,
    pricing: 'Free account + Credits',
    image: '🔊',
  },
  {
    name: 'iZotope Neutron Elements',
    category: 'Mixing',
    description: 'AI-powered mixing assistant that analyzes your tracks and suggests professional mixing settings. Free version available.',
    url: 'https://izotope.com',
    features: ['AI mixing', 'Track assistant', 'Visual mix', 'Free elements'],
    rating: 4.4,
    pricing: 'Free Elements + Paid',
    image: '🎛️',
  },
  {
    name: 'AIVA',
    category: 'Composition',
    description: 'AI composer that creates original music for games, films, and content. Generate royalty-free compositions in any style.',
    url: 'https://aiva.ai',
    features: ['Original compositions', 'Royalty-free', 'Multiple styles', 'Free plan'],
    rating: 4.3,
    pricing: 'Free plan + Pro',
    image: '🎹',
  },
  {
    name: 'Krisp',
    category: 'Noise Removal',
    description: 'AI noise cancellation for voice calls and recording. Remove background noise in real-time with one click.',
    url: 'https://krisp.ai',
    features: ['Real-time noise removal', 'Voice clarity', 'Works with any app', 'Free daily'],
    rating: 4.7,
    pricing: 'Free daily hours + Pro',
    image: '🔇',
  },
  {
    name: 'Descript',
    category: 'Audio/Video Editing',
    description: 'Edit audio by editing text. Transcribe, overdub, and remove filler words. Perfect for podcast and content creators.',
    url: 'https://descript.com',
    features: ['Text-based editing', 'Transcription', 'Overdub voice', 'Filler word removal', 'Free plan'],
    rating: 4.6,
    pricing: 'Free plan + Pro',
    image: '📝',
  },
  {
    name: 'PhonicMind',
    category: 'Stem Separation',
    description: 'High-quality AI stem separation service. Isolate vocals, drums, bass, and other instruments with minimal artifacts.',
    url: 'https://phonicmind.com',
    features: ['4-stem separation', 'High quality', 'Fast processing', 'Free previews'],
    rating: 4.4,
    pricing: 'Pay per track + Free previews',
    image: '🎼',
  },
];

const CATEGORIES = [...new Set(AI_TOOLS.map(t => t.category))];

export default async function FreeAIToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const params = await searchParams;
  const activeCat = params.cat || '';
  const query = params.q || '';

  let filtered = AI_TOOLS;
  if (activeCat) filtered = filtered.filter(t => t.category === activeCat);
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, #0e0e12 0%, var(--bg-primary) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1rem', borderRadius: '20px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#3b82f6' }}>100% Free Tools</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            Free AI Tools for <br />
            <span style={{ color: '#D4A843' }}>Music Production</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            The best free AI tools for musicians, producers, and creators. Music generation, stem separation, mixing, mastering, and more.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{AI_TOOLS.length} tools listed</span>
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{CATEGORIES.length} categories</span>
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Updated regularly</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <form method="GET" style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '600px' }}>
            <input type="text" name="q" defaultValue={query} placeholder="Search AI tools..."
              style={{ flex: 1, padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none' }} />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}>Search</button>
          </form>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <a href="/ai-tools" style={{
            padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
            background: !activeCat ? 'rgba(212,168,67,0.1)' : 'var(--bg-card)',
            color: !activeCat ? '#D4A843' : 'var(--text-secondary)',
            border: !activeCat ? '1px solid rgba(212,168,67,0.25)' : '1px solid var(--border)',
            textDecoration: 'none',
          }}>All</a>
          {CATEGORIES.map(cat => (
            <a key={cat} href={`/ai-tools?cat=${encodeURIComponent(cat)}`} style={{
              padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
              background: activeCat === cat ? 'rgba(212,168,67,0.1)' : 'var(--bg-card)',
              color: activeCat === cat ? '#D4A843' : 'var(--text-secondary)',
              border: activeCat === cat ? '1px solid rgba(212,168,67,0.25)' : '1px solid var(--border)',
              textDecoration: 'none',
            }}>{cat}</a>
          ))}
        </div>

        {/* Tools Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            No tools found matching your criteria.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
            {filtered.map((tool, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', overflow: 'hidden', transition: 'all 0.15s',
              }}>
                <div style={{ padding: '1.5rem' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem',
                      }}>{tool.image}</div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{tool.name}</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tool.category}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#f59e0b' }}>★</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{tool.rating}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
                    {tool.features.map((f, fi) => (
                      <span key={fi} style={{
                        fontSize: '0.6875rem', padding: '0.25rem 0.625rem', borderRadius: '4px',
                        background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                      }}>{f}</span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '4px',
                      background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)',
                    }}>{tool.pricing}</span>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                      Visit Tool →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Want full dashboard access?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
            Sign up for free to save your favorite tools, track usage, and get personalized recommendations.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/login" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.75rem 1.5rem' }}>Sign In</Link>
            <Link href="/" className="btn-ghost" style={{ fontSize: '0.875rem', padding: '0.75rem 1.5rem' }}>Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
