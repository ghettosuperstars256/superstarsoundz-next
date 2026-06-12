import BpmDetector from '@/components/tools/BpmDetector';
import ChordIdentifier from '@/components/tools/ChordIdentifier';
import KeyFinder from '@/components/tools/KeyFinder';
import ScaleExplorer from '@/components/tools/ScaleExplorer';
import Metronome from '@/components/tools/Metronome';
import Tuner from '@/components/tools/Tuner';

const TOOLS = [
  {
    id: 'bpm-detector',
    name: 'BPM Detector',
    description: 'Detect the tempo of any song. Tap along or let the microphone analyze the audio in real time.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    component: BpmDetector,
  },
  {
    id: 'chord-identifier',
    name: 'Chord Identifier',
    description: 'Play a chord and this tool will tell you what it is. Supports major, minor, 7th, and 30+ chord types.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2"/></svg>
    ),
    component: ChordIdentifier,
  },
  {
    id: 'key-finder',
    name: 'Key Finder',
    description: 'Find the musical key of any song. Play or hum a track and get the key with confidence score.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    component: KeyFinder,
  },
  {
    id: 'scale-explorer',
    name: 'Scale Explorer',
    description: 'Browse 12 scale types across all 12 root notes. See notes on piano and guitar fretboard.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M16 19V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M20 19V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    component: ScaleExplorer,
  },
  {
    id: 'metronome',
    name: 'Metronome',
    description: 'Precision metronome with visual beat indicator, tap tempo, and multiple time signatures.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="14" r="8" stroke="currentColor" strokeWidth="2"/><path d="M12 10V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 14l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8 14h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    component: Metronome,
  },
  {
    id: 'tuner',
    name: 'Tuner',
    description: 'Chromatic instrument tuner with guitar, bass, and ukulele presets. Works with microphone.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    component: Tuner,
  },
];

export const metadata = {
  title: 'Free AI Music Tools',
  description: 'Free browser-based AI music tools — BPM detector, chord identifier, key finder, scale explorer, metronome, and tuner. No downloads, no sign-ups.',
};

export default function ToolsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#08080a' }}>
      {/* Hero */}
      <div style={{
        padding: '4rem 2rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #0e0e12 0%, #08080a 100%)',
        borderBottom: '1px solid #1e1e26',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.375rem 1rem', borderRadius: '20px',
            background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)',
            marginBottom: '1.5rem',
          }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#D4A843' }}>Free for the Community</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900,
            letterSpacing: '-0.03em', marginBottom: '1rem', color: '#f0f0f2', lineHeight: 1.1,
          }}>
            Free AI Music Tools
          </h1>
          <p style={{
            fontSize: '1.125rem', color: '#9090a0', maxWidth: '600px',
            margin: '0 auto 2rem', lineHeight: 1.6,
          }}>
            Free, browser-based AI tools for musicians, producers, and creators. No downloads, no sign-ups — just open and play.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', color: '#5a5a6a' }}>6 tools</span>
            <span style={{ color: '#5a5a6a' }}>·</span>
            <span style={{ fontSize: '0.875rem', color: '#5a5a6a' }}>100% free</span>
            <span style={{ color: '#5a5a6a' }}>·</span>
            <span style={{ fontSize: '0.875rem', color: '#5a5a6a' }}>Works in your browser</span>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {TOOLS.map((tool) => {
          const ToolComponent = tool.component;
          return (
            <div key={tool.id} id={tool.id} style={{
              marginBottom: '3rem',
              background: '#121216',
              borderRadius: '20px',
              border: '1px solid #1e1e26',
              overflow: 'hidden',
            }}>
              {/* Tool Header */}
              <div style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid #1e1e26',
                display: 'flex', alignItems: 'center', gap: '1rem',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(212,168,67,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#D4A843',
                }}>{tool.icon}</div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f0f0f2', marginBottom: '0.25rem' }}>
                    {tool.name}
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#9090a0' }}>{tool.description}</p>
                </div>
              </div>

              {/* Tool Component */}
              <div style={{ padding: '2rem' }}>
                <ToolComponent />
              </div>
            </div>
          );
        })}

        {/* Bottom CTA */}
        <div style={{
          marginTop: '3rem', padding: '2.5rem',
          background: '#121216', borderRadius: '20px',
          border: '1px solid #1e1e26', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0f0f2', marginBottom: '0.75rem' }}>
            Need Professional Gear?
          </h2>
          <p style={{ color: '#9090a0', marginBottom: '1.5rem', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Check out our curated plugin and software picks and professional audio equipment.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/plugins" className="btn-primary" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0.875rem 2rem', borderRadius: '10px',
              background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)',
              color: '#000', fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none',
            }}>
              Browse Plugins & Software
            </a>
            <a href="/gear" className="btn-secondary" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0.875rem 2rem', borderRadius: '10px',
              background: 'transparent', color: '#D4A843', fontWeight: 700, fontSize: '0.9375rem',
              textDecoration: 'none', border: '1px solid rgba(212,168,67,0.3)',
            }}>
              Shop Audio Gear
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
