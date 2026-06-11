import Link from 'next/link';

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: '4.5rem 0 3.5rem', background: 'linear-gradient(135deg, #0e0e12 0%, #08080a 100%)', borderBottom: '1px solid #1e1e26' }}>
        <div className="container">
          <div style={{ maxWidth: '750px' }}>
            <p className="label" style={{ marginBottom: '0.75rem' }}>What We Offer</p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Gear Reviews & Production Services
            </h1>
            <p className="text-secondary" style={{ fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              Superstar Soundz helps you find the best audio equipment — and when you need professional production, we deliver that too. Two sides of the same expertise.
            </p>
            <p className="text-secondary" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
              We're musicians, audio engineers, and producers. We review gear because we use it. We provide production services because we've spent years doing it at the highest level.
            </p>
          </div>
        </div>
      </section>

      {/* Gear Reviews & Buying Guides */}
      <section className="section" style={{ paddingBottom: '4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '2.5rem' }}>
            <p className="label" style={{ marginBottom: '0.5rem' }}>Gear Reviews</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Honest Reviews & Buying Guides</h2>
            <p className="text-secondary" style={{ maxWidth: '650px', lineHeight: 1.7 }}>
              Every product we recommend is either something we've personally used or thoroughly researched. No paid placements. No biased picks. Just honest, thorough reviews that help you make informed decisions.
            </p>
          </div>
          <div className="grid-4" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
            {[
              {
                title: 'Curated Top Picks',
                description: 'We narrow down the best options in every category — from microphones and headphones to studio monitors and DJ controllers — so you don\'t have to sift through hundreds of options.',
              },
              {
                title: 'Comparison Tables',
                description: 'Side-by-side comparisons of key specs, features, and prices. We highlight the differences that actually matter for your use case.',
              },
              {
                title: 'Price-to-Performance',
                description: 'We identify the best value at every price point — from budget-friendly picks to professional-grade equipment worth the investment.',
              },
              {
                title: 'Real-World Testing',
                description: 'Our reviews are based on actual use in studios, on stages, and in the field — not just spec sheets and marketing copy.',
              },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.625rem' }}>{s.title}</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{s.description}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/gear" className="btn-primary">Browse All Gear</Link>
          </div>
        </div>
      </section>

      {/* Free AI Music Tools */}
      <section className="section bg-secondary" style={{ paddingBottom: '4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '2.5rem' }}>
            <p className="label" style={{ marginBottom: '0.5rem' }}>Free Tools</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Free AI Music Tools</h2>
            <p className="text-secondary" style={{ maxWidth: '650px', lineHeight: 1.7 }}>
              Browser-based tools for musicians — no downloads, no signups, no fees. Built by our team to give back to the music community.
            </p>
          </div>
          <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
            {[
              {
                title: 'BPM Detector',
                description: 'Detect the tempo of any audio file or live input. Perfect for DJs, producers, and musicians who need to find the BPM quickly.',
              },
              {
                title: 'Chord Identifier',
                description: 'Play or upload audio and identify the chords being used. Great for learning songs, transcribing, and understanding progressions.',
              },
              {
                title: 'Key Finder',
                description: 'Determine the musical key of any track. Essential for harmonic mixing, remixing, and understanding song structure.',
              },
              {
                title: 'Scale Explorer',
                description: 'Browse and hear scales from around the world. Find the right scale for your composition or improvisation.',
              },
              {
                title: 'Metronome',
                description: 'A precise, customizable metronome with visual feedback. Set any BPM, time signature, and subdivision.',
              },
              {
                title: 'Tuner',
                description: 'Tune your instrument with precision. Supports guitar, bass, violin, ukulele, and other instruments.',
              },
            ].map((tool, i) => (
              <div key={i} className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.625rem' }}>{tool.title}</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{tool.description}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/tools" className="btn-primary">Try Free Tools</Link>
          </div>
        </div>
      </section>

      {/* AV Production Services */}
      <section className="section" style={{ paddingBottom: '4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '2.5rem' }}>
            <p className="label" style={{ marginBottom: '0.5rem' }}>Production</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, marginBottom: '0.75rem' }}>AV Production Services</h2>
            <p className="text-secondary" style={{ maxWidth: '650px', lineHeight: 1.7 }}>
              Beyond gear reviews — we provide professional audio and visual production for events of every scale. From studio recording sessions to concerts, festivals, and corporate events.
            </p>
          </div>
          <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
            {[
              {
                title: 'Studio Recording & Production',
                description: 'Professional recording environments with industry-leading equipment. Multi-track recording, mixing, mastering, beat production, and podcast recording.',
                items: ['Multi-Track Recording', 'Mixing & Mastering', 'Beat Production', 'Podcast Recording'],
              },
              {
                title: 'Live Sound Engineering',
                description: 'Concert-grade audio systems and expert engineering for events of every scale — from intimate venues to outdoor festivals.',
                items: ['PA System Design', 'FOH & Monitor Engineering', 'Wireless Audio', 'Live Recording'],
              },
              {
                title: 'Video Production & Visuals',
                description: 'Cinematic video production and immersive visual design — music videos, corporate content, live event capture, and streaming.',
                items: ['Music Videos', 'Corporate Video', 'Live Streaming', 'Post-Production'],
              },
              {
                title: 'Event AV & Equipment',
                description: 'Full-service audio, lighting, and visual equipment rental with expert installation and operation.',
                items: ['Audio Equipment', 'Lighting & Stage', 'LED Walls', 'Full Production Management'],
              },
              {
                title: 'Creative Direction',
                description: 'Our creative team shapes the narrative — from visual effects and color grading to sound design and spatial audio.',
                items: ['Visual Effects', 'Sound Design', 'Color Grading', 'Motion Graphics'],
              },
              {
                title: 'Technical Consultation',
                description: 'Expert guidance on system design, acoustic treatment, equipment selection, and production workflows.',
                items: ['Studio Design', 'System Specification', 'Acoustic Analysis', 'Workflow Design'],
              },
            ].map((service, i) => (
              <div key={i} className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.625rem' }}>{service.title}</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1rem' }}>{service.description}</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {service.items.map((item, j) => (
                    <li key={j} style={{ fontSize: '0.8125rem', color: '#5a5a6a', padding: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#D4A843', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/contact" className="btn-primary">Request a Quote</Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-secondary" style={{ paddingBottom: '4rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="label" style={{ marginBottom: '0.5rem' }}>How We Work</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Our Production Process</h2>
            <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
              Excellence is not accidental — it's the result of a disciplined, proven process refined over years of real-world production experience.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Consultation & Discovery', description: 'We begin every project with a thorough understanding of your vision, audience, venue, and objectives.' },
              { step: '02', title: 'Technical Design & Planning', description: 'Our engineers create a detailed production plan — system schematics, equipment lists, signal flow diagrams, and logistics timelines.' },
              { step: '03', title: 'Equipment Preparation', description: 'Every piece of equipment is tested, configured, and packed by our technical team.' },
              { step: '04', title: 'Load-In & Installation', description: 'Our crew arrives on-site ahead of schedule to handle rigging, cabling, system tuning, and full technical rehearsal.' },
              { step: '05', title: 'Live Operation & Support', description: 'During your event, our engineers work behind the scenes — monitoring levels, managing cues, and solving challenges in real time.' },
              { step: '06', title: 'Post-Production & Follow-Through', description: 'After the event, we handle load-out, equipment return, and any post-production deliverables.' },
            ].map((step, i) => (
              <div key={i} className="card" style={{ padding: '1.75rem', position: 'relative' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'rgba(212, 168, 67, 0.08)', marginBottom: '0.5rem', lineHeight: 1 }}>{step.step}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{step.title}</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="bg-accent-dim border-accent" style={{ borderRadius: '12px', padding: '3.5rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Ready to Get Started?
            </h2>
            <p className="text-secondary" style={{ marginBottom: '2rem', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
              Whether you need help choosing the right gear or planning a production — we're here to help.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn-primary">Get in Touch</Link>
              <Link href="/gear" className="btn-secondary">Browse Gear</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
