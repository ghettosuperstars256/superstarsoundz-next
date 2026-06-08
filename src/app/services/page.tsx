import Link from 'next/link';

const services = [
  {
    id: 'dj-services',
    number: '01',
    title: 'Professional DJ Services',
    subtitle: 'The Right DJ Equipment for Every Event',
    icon: '🎧',
    content: `
      <p>Whether you're planning an intimate birthday celebration or a massive outdoor festival, the right DJ setup makes all the difference. We review and recommend the gear that professional DJs rely on to deliver unforgettable performances.</p>

      <h3>DJ Gear by Event Type</h3>

      <h4>Small Gatherings (Birthdays, Private Parties)</h4>
      <p>You need a compact, easy-to-transport setup that still fills the room with energy:</p>
      <ul>
        <li>All-in-one DJ controllers (Pioneer DDJ-FLX4, Numark Mixtrack Pro FX)</li>
        <li>Portable powered speakers (10–12" drivers)</li>
        <li>Wireless handheld microphone for announcements</li>
        <li><strong>Budget range: $500–$1,500</strong></li>
      </ul>

      <h4>Weddings & Formal Events</h4>
      <p>Reliability is everything. Your wedding DJ setup needs backup systems and versatile audio for both the ceremony and reception:</p>
      <ul>
        <li>Professional 2-channel mixer with effects</li>
        <li>Dual wireless microphone systems (ceremony + reception)</li>
        <li>Full-range PA system with subwoofer</li>
        <li>Backup equipment (second mixer, spare cables)</li>
        <li><strong>Budget range: $2,000–$5,000</strong></li>
      </ul>

      <h4>Corporate Events & Conferences</h4>
      <p>Clean, professional audio serving multiple zones and presentation needs:</p>
      <ul>
        <li>Multi-zone PA system with DSP</li>
        <li>Podium microphones and wireless lapel mics</li>
        <li>Background music system separate from presentation audio</li>
        <li><strong>Budget range: $3,000–$10,000+</strong></li>
      </ul>

      <h4>Nightclubs & Bars</h4>
      <p>High-output systems built for extended performance and heavy bass:</p>
      <ul>
        <li>Club-grade CDJs or professional controllers</li>
        <li>High-wattage PA system (10,000W+)</li>
        <li>Booth monitors and DJ headphones</li>
        <li>Beat-synced lighting controller</li>
        <li><strong>Budget range: $5,000–$20,000+</strong></li>
      </ul>

      <h4>School Events & Proms</h4>
      <p>Youth-friendly setups with quick-swap capabilities and clean-content filtering. High-energy output that keeps students engaged with professional, age-appropriate song selection and equipment that handles rapid transitions between activities.</p>

      <h4>Festivals & Outdoor Events</h4>
      <p>Weather-resistant, high-power systems for large crowds:</p>
      <ul>
        <li>Line array PA system</li>
        <li>High-capacity amplifiers and stage monitors</li>
        <li>Weather protection for all equipment</li>
        <li><strong>Budget range: $10,000–$100,000+</strong></li>
      </ul>

      <h4>Sporting Events</h4>
      <p>High-impact audio with instant cue capabilities for walk-on music, halftime shows, and victory celebrations.</p>

      <h3>DJ Equipment We Review</h3>
      <p>Controllers, turntables, mixers, DJ headphones, PA speakers, wireless microphones, DJ software (Rekordbox, Serato DJ Pro, Traktor Pro 3, Virtual DJ, Engine OS), and all accessories that complete a professional setup.</p>
    `,
  },
  {
    id: 'audio-services',
    number: '02',
    title: 'Professional Audio Services',
    subtitle: 'Sound Systems & Audio Equipment Reviews',
    icon: '🔊',
    content: `
      <p>Crystal-clear audio is the backbone of any successful event. We test and review the sound equipment that audio engineers and event organizers trust — from compact portable PA systems to full-scale concert rigs.</p>

      <h3>Event Sound & PA Systems</h3>
      <p>We compare the top brands to help you find the right fit for every event size:</p>

      <table>
        <thead>
          <tr>
            <th>Brand/Model</th>
            <th>Power</th>
            <th>Driver</th>
            <th>Weight</th>
            <th>Best For</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>JBL EON715</td><td>1300W</td><td>15"</td><td>17.6 kg</td><td>Mid-size events</td></tr>
          <tr><td>QSC K12.2</td><td>2000W</td><td>12"</td><td>14.5 kg</td><td>Versatile all-rounder</td></tr>
          <tr><td>EV EKX-15P</td><td>1500W</td><td>15"</td><td>21.4 kg</td><td>High-output applications</td></tr>
          <tr><td>Yamaha DXR12</td><td>1100W</td><td>12"</td><td>19.3 kg</td><td>Budget-conscious pros</td></tr>
          <tr><td>Bose L1 Pro32</td><td>Array</td><td>32 drivers</td><td>17.2 kg</td><td>Premium portable</td></tr>
        </tbody>
      </table>

      <p><strong>Subwoofers:</strong> JBL EON718S, QSC KS118, EV ELX200-18SP, Yamaha DXS18</p>

      <h3>Silent Disco Systems</h3>
      <p>The ultimate solution for noise-restricted events. Wireless headphones with multi-channel capability let every guest choose their own music. We review transmitter range, battery life, and sound quality across top brands (Silent Party, Silent Disco, Airhead). An eco-friendly option — no heavy amplifiers or large speakers needed.</p>

      <h3>Mixing Consoles</h3>
      <ul>
        <li><strong>Analog:</strong> Yamaha MG series, Soundcraft Signature, Allen & Heath ZED</li>
        <li><strong>Digital:</strong> Yamaha TF series, Behringer X32, Allen & Heath SQ series, Soundcraft Ui series</li>
        <li><strong>DJ mixers:</strong> Pioneer DJM series, Allen & Heath Xone, Rane, Denon</li>
      </ul>

      <h3>Wireless Microphone Systems</h3>
      <ul>
        <li><strong>Entry:</strong> Shure BLX, Sennheiser XSW</li>
        <li><strong>Mid-range:</strong> Shure SLX-D, Sennheiser EW 100</li>
        <li><strong>Professional:</strong> Shure ULX-D, Sennheiser EW 300/500, Lectrosonics</li>
      </ul>

      <h3>Signal Processing & System Management</h3>
      <ul>
        <li><strong>DSP:</strong> dbx DriveRack, Ashly Protea, QSC Q-SYS</li>
        <li><strong>System tuning:</strong> SMAART, measurement mics (Behringer ECM8000, Dayton Audio iMM-6)</li>
        <li><strong>Power conditioning:</strong> Furman, SurgeX</li>
      </ul>

      <h3>Sound Equipment Rentals & Installations</h3>
      <p>Not ready to buy? We break down what to look for in rental packages — speaker wattage, mixer channels, microphone types, and cable management. For permanent installations (venues, houses of worship, theaters, schools), we cover distributed speaker systems, DSP processors, amplifier racks, and best practices.</p>

      <p><strong>Key specs we evaluate:</strong> frequency response, SPL output, impedance, amplifier class, DSP capabilities, wireless frequency range, and build quality.</p>
    `,
  },
  {
    id: 'lighting',
    number: '03',
    title: 'Lighting & Visual Solutions',
    subtitle: 'Stage Lighting, Effects & Visual Equipment Reviews',
    icon: '💡',
    content: `
      <p>Lighting transforms a good event into a spectacular one. We review the lighting and visual equipment that creates atmosphere, directs attention, and elevates the entire experience.</p>

      <h3>Moving Head Lights & Beam Lights</h3>
      <p>DMX-controlled fixtures for dynamic stage effects. We compare lumens, beam angle, color mixing, and pan/tilt range. Top picks: Chauvet DJ Intimidator, Chauvet Rogue R2X, Elation Platinum Beam 5R.</p>

      <h3>LED Lighting Systems</h3>
      <p>Energy-efficient LED pars, strips, and panels for ambient lighting, stage wash, and architectural accent. RGB vs RGBW, pixel mapping, and control protocols. Top picks: Chauvet COLORdash, ADJ Mega Par, Elation SixBar.</p>

      <h3>Laser Systems</h3>
      <p>High-impact laser projectors for clubs, festivals, and large venues. Safety ratings, scan speed, and pattern variety. Top picks: Chauvet DJ Radius, Kvant Club, Kvant Atom.</p>

      <h3>LED Screens & Projection</h3>
      <p>Large-format displays and projectors for visual content, live feeds, and branding. Resolution, brightness (nits), and outdoor visibility. Top picks: Unilumin Usign, ROE Visual Carbon, Novastar processors.</p>

      <h3>Special Effects</h3>
      <p>Fog machines (water-based vs. oil-based), haze machines, bubble machines, and CO2 cannons. Fluid consumption, heat-up time, DMX compatibility, and safety considerations. Top picks: MDG theONE, Chauvet DJ Hurricane, Antari F-80.</p>

      <h3>Lighting Control</h3>
      <p>DMX512, Art-Net, sACN, and wireless DMX systems. Controller options from simple 4-channel faders to full lighting consoles (ChamSys MagicQ, ONYX, Hog 4, GrandMA3 onPC).</p>

      <p><strong>We help you choose based on:</strong> venue size, power availability, DMX channel requirements, budget, and the specific atmosphere you want to create.</p>
    `,
  },
  {
    id: 'event-planning',
    number: '04',
    title: 'Creative Event Planning',
    subtitle: 'Event Planning Resources & Equipment Guides',
    icon: '📋',
    content: `
      <p>Great events don't happen by accident — they're planned with precision. We provide the gear knowledge and technical insights that event planners need to execute flawlessly.</p>

      <h3>What We Cover</h3>
      <ul>
        <li><strong>Event Website & Registration Tools</strong> — Platforms and templates for professional event pages, ticketing, and attendee management.</li>
        <li><strong>Graphics & Print Solutions</strong> — Large-format printing, banner materials, and design tools for event branding and signage.</li>
        <li><strong>Technical Production Planning</strong> — Power distribution, rigging basics, stage design, and equipment load-in logistics.</li>
        <li><strong>Budget Optimization</strong> — Cost-effective equipment alternatives, rental vs. buy analysis, and multi-use gear recommendations.</li>
        <li><strong>Content Creation Support</strong> — Graphics design, promotional material design, and vendor referrals for large-scale productions.</li>
      </ul>
    `,
  },
  {
    id: 'mc-host',
    number: '05',
    title: 'Professional MC & Entertainment Services',
    subtitle: 'MC Equipment & Performance Gear Reviews',
    icon: '🎤',
    content: `
      <p>A great MC needs more than charisma — they need reliable gear. The MC is the voice of the event, and their equipment needs to be reliable, comfortable, and invisible to the audience.</p>

      <h3>Microphone Systems</h3>
      <ul>
        <li><strong>Handheld wireless:</strong> Shure BLX288/PG58, Sennheiser XSW 2-835, Shure SM58 wireless</li>
        <li><strong>Headset wireless:</strong> Shure BLX14/CVL, Sennheiser XSW 2-ME3</li>
        <li><strong>Lavalier:</strong> Sennheiser MKE 2, Rode Lavalier GO, DPA 4060</li>
      </ul>

      <h3>Monitoring</h3>
      <ul>
        <li><strong>In-ear monitors:</strong> Shure SE215, Sennheiser IE 100 Pro, Westone UM Pro 10</li>
        <li><strong>Beltpack receivers:</strong> Shure PSM 300, Sennheiser EW IEM G4</li>
        <li><strong>Antenna distribution systems</strong> for multi-channel wireless setups</li>
      </ul>

      <h3>Portable PA for MCs</h3>
      <ul>
        <li><strong>Battery-powered:</strong> Bose S1 Pro, JBL EON ONE Compact, EV Evolve 30M</li>
        <li><strong>Wired options:</strong> Yamaha STAGEPAS 1K, LD Systems Maui 44</li>
      </ul>

      <p><strong>Performance accessories:</strong> In-ear monitors, belt packs, antenna distribution systems, and backup microphone strategies.</p>
    `,
  },
  {
    id: 'photography',
    number: '06',
    title: 'Professional Photography Services',
    subtitle: 'Camera Gear & Photography Equipment Reviews',
    icon: '📸',
    content: `
      <p>Capturing life's important moments demands the right camera equipment. We review the cameras, lenses, and lighting gear that professional photographers use across every specialty.</p>

      <h3>Camera Bodies</h3>
      <ul>
        <li><strong>Full-frame mirrorless:</strong> Sony A7 IV, Canon R6 II, Nikon Z6 III, Sony A7R V</li>
        <li><strong>High-resolution:</strong> Sony A1, Canon R5, Nikon Z8/Z9</li>
        <li><strong>Budget full-frame:</strong> Sony A7 III (used), Canon R8, Nikon Z5</li>
      </ul>

      <h3>Lenses for Event Work</h3>
      <ul>
        <li><strong>Workhorse zoom:</strong> 24-70mm f/2.8 (Sony GM II, Canon RF, Nikon Z)</li>
        <li><strong>Telephoto:</strong> 70-200mm f/2.8 for ceremony and stage coverage</li>
        <li><strong>Fast prime:</strong> 35mm f/1.4, 50mm f/1.4, 85mm f/1.4 for portraits and low light</li>
        <li><strong>Macro:</strong> 100mm f/2.8 for detail shots (rings, flowers, table settings)</li>
      </ul>

      <h3>Photography by Event Type</h3>
      <ul>
        <li><strong>Wedding Photography</strong> — Full-frame mirrorless, fast f/1.4–1.8 primes, off-camera flash systems, dual-card-slot reliability</li>
        <li><strong>Portrait & Family Photography</strong> — Soft-focus lenses, studio lighting kits</li>
        <li><strong>Event & Corporate Photography</strong> — Versatile zooms (24-70mm f/2.8), high-ISO performance, wireless flash systems</li>
        <li><strong>Sports & Action Photography</strong> — High burst rates (20+ fps), super-telephoto lenses, weather-sealed gear</li>
        <li><strong>Newborn & Maternity Photography</strong> — Soft lighting equipment, macro lenses, safe setups</li>
        <li><strong>Travel Photography</strong> — Lightweight mirrorless systems, versatile zooms, rugged build quality</li>
      </ul>

      <h3>Lighting for Photography</h3>
      <ul>
        <li><strong>On-camera flash:</strong> Godox V1, Canon EL-1, Nikon SB-5000</li>
        <li><strong>Off-camera flash:</strong> Godox AD200Pro, AD600Pro, Profoto A10</li>
        <li><strong>Continuous lighting:</strong> Aputure 300d, Nanlite Forza, Godox SL200II</li>
        <li><strong>Modifiers:</strong> Softboxes, umbrellas, beauty dishes, reflectors</li>
      </ul>

      <p><strong>Key specs we evaluate:</strong> sensor size, autofocus speed, ISO range, burst rate, lens sharpness, and low-light performance.</p>
    `,
  },
  {
    id: 'dj-academy',
    number: '07',
    title: 'DJ Academy & Music Production',
    subtitle: 'DJ Training Equipment & Music Production Gear',
    icon: '🎓',
    content: `
      <p>Ready to start your DJ journey or take your skills to the next level? We review the equipment and software that DJs and producers use to learn, practice, and perform.</p>

      <h3>DJ Setups by Skill Level</h3>

      <h4>Beginner ($300–$800)</h4>
      <ul>
        <li>Controller: Pioneer DDJ-FLX4, Hercules Inpulse 500, Numark Mixtrack Pro FX</li>
        <li>Headphones: Audio-Technica ATH-M20x, Sennheiser HD 206</li>
        <li>Software: Included with controller (Rekordbox, Serato DJ Lite, Virtual DJ)</li>
        <li>Nearfield monitors or good headphones for practice</li>
      </ul>
      <p><em>Perfect for anyone new to DJing who wants to learn the fundamentals.</em></p>

      <h4>Intermediate ($800–$2,500)</h4>
      <ul>
        <li>Controller: Pioneer DDJ-800, DDJ-1000, Denon DJ SC Live 2</li>
        <li>Headphones: Audio-Technica ATH-M50x, Sennheiser HD 25</li>
        <li>Studio monitors for accurate mixing</li>
        <li>Acoustic treatment for your practice space</li>
      </ul>
      <p><em>For DJs ready to go from beginner to crowd-ready.</em></p>

      <h4>Advanced/Professional ($2,500+)</h4>
      <ul>
        <li>Setup: Pioneer CDJ-3000 x2 + DJM-900NXS2, or XDJ-XZ</li>
        <li>Headphones: Pioneer HDJ-X10, Sennheiser HD 25</li>
        <li>Professional studio monitors</li>
        <li>Full acoustic treatment</li>
        <li>Music production setup (audio interface, MIDI controller, DAW)</li>
      </ul>
      <p><em>Built for serious performers and working professionals.</em></p>

      <h3>Music Production Add-Ons</h3>
      <ul>
        <li><strong>Audio interface:</strong> Focusrite Scarlett 2i2, Universal Audio Volt 276, Audient iD14</li>
        <li><strong>Studio monitors:</strong> Yamaha HS series, KRK Rokit, Adam Audio T-series</li>
        <li><strong>MIDI controller:</strong> Akai MPK Mini, Novation Launchkey, Arturia KeyStep</li>
        <li><strong>DAW software:</strong> Ableton Live, FL Studio, Logic Pro, Reaper</li>
        <li><strong>Acoustic treatment:</strong> Reflection filters, bass traps, diffusers</li>
      </ul>

      <h3>DJ Software Compared</h3>
      <ul>
        <li><strong>Rekordbox</strong> — Pioneer ecosystem, USB export for CDJs</li>
        <li><strong>Serato DJ Pro</strong> — Industry standard, DVS support</li>
        <li><strong>Traktor Pro 3</strong> — Native Instruments, remix decks</li>
        <li><strong>Virtual DJ</strong> — Broad hardware compatibility</li>
        <li><strong>Engine OS</strong> — Denon standalone ecosystem</li>
      </ul>

      <h3>Headphones & Monitoring</h3>
      <ul>
        <li><strong>Closed-back DJ headphones</strong> (for performance isolation): Pioneer HDJ-X10, Sennheiser HD 25, Audio-Technica ATH-M50x</li>
        <li><strong>Open-back studio headphones</strong> (for production/mixing): Beyerdynamic DT 770 Pro, V-Moda Crossfade</li>
      </ul>

      <h3>Learning Paths We Cover</h3>
      <ul>
        <li><strong>Beginner fundamentals:</strong> equipment setup, beatmatching, mixing basics, DJ culture history</li>
        <li><strong>Intermediate techniques:</strong> beat juggling, effects manipulation, EQ, song structure, scratching, mixing in key</li>
        <li><strong>Advanced skills:</strong> music production, sound engineering, acoustics, cable management</li>
        <li><strong>Business & marketing:</strong> promoting yourself, booking gigs, negotiating contracts</li>
        <li><strong>Performance & psychology:</strong> crowd reading, stage presence, mental preparation, crowd interaction</li>
      </ul>
    `,
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '420px', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '4rem 0' }}>
          <div style={{ maxWidth: '720px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', borderRadius: '100px', border: '1px solid var(--accent)', background: 'var(--accent-dim)', marginBottom: '1.5rem' }}>
              <span className="pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Event Production Resource</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.08, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Our Services<br />
              <span className="text-accent">Gear Guides & Reviews</span>
            </h1>
            <p className="text-secondary" style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '560px', lineHeight: 1.7 }}>
              Expert equipment reviews, buying guides, and gear recommendations for DJs, audio engineers, photographers, and event professionals.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link href="/gear" className="btn-primary">Shop All Gear</Link>
              <Link href="/blog" className="btn-secondary">Read Buying Guides</Link>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l2.5 5 5.5.8-4 3.9.9 5.3L8 13.5 3.1 16l.9-5.3-4-3.9 5.5-.8z" fill="var(--accent)"/></svg>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>7 Service Categories</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="var(--accent)" strokeWidth="1.5"/><path d="M8 5v3l2 1" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Updated Regularly</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="10" rx="2" stroke="var(--accent)" strokeWidth="1.5"/><path d="M2 7h12" stroke="var(--accent)" strokeWidth="1.5"/></svg>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Amazon Associate</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', right: '6%', top: '15%', width: '140px', height: '140px', borderRadius: '50%', border: '1px solid var(--accent-glow)', opacity: 0.25, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '12%', bottom: '20%', width: '90px', height: '90px', borderRadius: '50%', background: 'var(--accent-glow)', opacity: 0.1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '3%', top: '30%', width: '60px', height: '60px', borderRadius: '50%', border: '1px solid var(--accent-glow)', opacity: 0.15, pointerEvents: 'none' }} />
      </section>

      {/* Stats */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="stats-bar" style={{ padding: '2rem 0' }}>
            <div className="stat-item">
              <div className="stat-number">7</div>
              <div className="stat-label">Service Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Brands Reviewed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Products Compared</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">$300–$100K</div>
              <div className="stat-label">Budget Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Sections */}
      {services.map((service, i) => (
        <section
          key={service.id}
          id={service.id}
          className={i % 2 === 1 ? 'bg-secondary' : ''}
          style={{ padding: '5rem 0', borderBottom: '1px solid var(--border)' }}
        >
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem' }}>
              {/* Sidebar */}
              <aside>
                <div style={{ position: 'sticky', top: '80px' }}>
                  {/* Service number + icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: 'var(--accent-dim)', border: '1px solid rgba(212,168,67,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.25rem',
                    }}>
                      {service.icon}
                    </div>
                    <span className="text-accent" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                      {service.number}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>{service.title}</h2>
                  <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>{service.subtitle}</p>

                  {/* Nav */}
                  <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: '0.25rem' }}>
                    <p className="text-muted" style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
                      All Services
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                      {services.map((s) => (
                        <a
                          key={s.id}
                          href={`#${s.id}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            fontSize: '0.8125rem',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            background: s.id === service.id ? 'var(--accent-dim)' : 'transparent',
                            color: s.id === service.id ? 'var(--accent)' : 'var(--text-secondary)',
                            fontWeight: s.id === service.id ? 600 : 400,
                            transition: 'all 0.15s',
                            borderLeft: s.id === service.id ? '2px solid var(--accent)' : '2px solid transparent',
                            marginLeft: '-2px',
                          }}
                        >
                          <span style={{ fontSize: '0.6875rem', opacity: 0.6, minWidth: '18px' }}>{s.number}</span>
                          <span>{s.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Content */}
              <div className="prose" dangerouslySetInnerHTML={{ __html: service.content }} />
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section-sm bg-secondary">
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875px', borderRadius: '100px', border: '1px solid var(--accent)', background: 'var(--accent-dim)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Get Started</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '1rem' }}>Ready to Find Your Perfect Gear?</h2>
          <p className="text-secondary" style={{ marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem', fontSize: '1.0625rem' }}>
            Browse our curated selection of professional audio equipment, or reach out for personalized recommendations.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/gear" className="btn-primary">Shop All Gear</Link>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
