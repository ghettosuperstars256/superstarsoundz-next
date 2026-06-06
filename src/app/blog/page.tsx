import Link from 'next/link';

const posts = [
  { title: 'Best Guitar Amps for Electric Guitars: Tube vs Solid State in 2026', category: 'Topic: Guitar Amps', date: '2026-06-04', excerpt: 'Your amplifier is just as important as your guitar. A great amp can transform a cheap guitar into a tone machine...', slug: 'best-guitar-amps-for-electric-guitars-tube-vs-solid-state-in-2026', emoji: '🎸' },
  { title: 'Fender Jazz Bass vs Precision Bass: Which Is Right for You?', category: 'Shop: Bass Guitars', date: '2026-06-04', excerpt: 'Jazz Bass vs Precision Bass: The Ultimate Comparison. Two basses. Sixty years of music history...', slug: 'fender-jazz-bass-vs-precision-bass-which-is-right-for-you', emoji: '🎹' },
  { title: 'Best Bass Guitars Under $500 in 2026: Top Picks for Every Style', category: 'Shop: Bass Guitars', date: '2026-06-04', excerpt: 'A great bass guitar doesn\'t have to cost a fortune. The under $500 market is packed with quality options...', slug: 'best-bass-guitars-under-500-in-2026-top-picks-for-every-style', emoji: '🎧' },
  { title: 'Best Acoustic Guitars Under $500 in 2026: Top Budget Picks', category: 'Shop: Acoustic Guitars', date: '2026-06-04', excerpt: 'Finding a quality acoustic guitar under $500 is easier than ever. Today\'s budget guitars are remarkably good...', slug: 'best-acoustic-guitars-under-500-in-2026-top-budget-picks', emoji: '🎤' },
  { title: 'Best Electric Guitars Under $300 in 2026: Top 5 Budget Picks', category: 'Shop: Electric Guitars', date: '2026-06-04', excerpt: 'Looking for a quality electric guitar without breaking the bank? The under $300 range has never been better...', slug: 'best-electric-guitars-under-300-in-2026-top-5-budget-picks', emoji: '🎛️' },
  { title: 'Best Audio Gear Deals & Sales: Save Money on Professional Equipment', category: 'Music Production', date: '2026-06-04', excerpt: 'Save big on professional audio equipment with our curated deals and sales roundup...', slug: 'best-audio-gear-deals-sales-save-money-on-professional-equipment', emoji: '🎵' },
  { title: 'Pioneer DJ DDJ-FLX4 vs AlphaTheta DDJ-FLX2: Which Should You Buy?', category: 'Topic: DJ Controllers', date: '2026-06-04', excerpt: 'Two popular beginner DJ controllers go head-to-head. We compare features, software, and value...', slug: 'pioneer-dj-ddj-flx4-vs-alphatheta-ddj-flx2-which-should-you-buy', emoji: '🎧' },
  { title: 'Best Streaming Setup in 2026: Complete Gear Guide for Musicians', category: 'Topic: Home Studio', date: '2026-06-04', excerpt: 'Start streaming your music with the right gear. From microphones to cameras, we cover everything you need...', slug: 'best-streaming-setup-in-2026-complete-gear-guide-for-musicians', emoji: '🎤' },
  { title: 'Best AI Music Tools in 2026: Creation, Mastering & Production', category: 'Music Production', date: '2026-06-04', excerpt: 'AI is transforming music production. Here are the best tools for creation, mixing, and mastering...', slug: 'best-ai-music-tools-in-2026-creation-mastering-production', emoji: '🎛️' },
  { title: 'Best Music Software & Plugins in 2026: DAWs, VSTs & AI Tools', category: 'Music Production', date: '2026-06-04', excerpt: 'The best DAWs, VST plugins, and AI tools for music production in 2026...', slug: 'best-music-software-plugins-in-2026-daws-vsts-ai-tools-2', emoji: '🎵' },
  { title: 'Best Studio Subwoofers for Accurate Low End in 2026', category: 'Topic: Studio Subwoofers', date: '2026-06-04', excerpt: 'Add deep, accurate bass to your studio with these top subwoofer picks...', slug: 'best-studio-subwoofers', emoji: '🔊' },
  { title: 'Best DJ Mixers Under $500 in 2026: Club & Battle Ready', category: 'Topic: DJ Mixers', date: '2026-06-04', excerpt: 'The best DJ mixers under $500 for club performances and battle DJing...', slug: 'best-dj-mixers-under-500', emoji: '🎛️' },
  { title: 'Best Turntables for DJs in 2026: Scratch, Mix & Perform', category: 'Topic: Turntables & Vinyl', date: '2026-06-04', excerpt: 'The best turntables for DJs in 2026, from budget to professional...', slug: 'best-turntables-djs', emoji: '🎧' },
  { title: 'Best MIDI Controllers for Music Production in 2026', category: 'Topic: MIDI Controllers', date: '2026-06-04', excerpt: 'The best MIDI controllers for music production, from compact keys to full production stations...', slug: 'best-midi-controllers-music-production', emoji: '🎹' },
  { title: 'Best Headphones Under $200 in 2026: Studio, DJ & Casual', category: 'Topic: Headphones', date: '2026-06-04', excerpt: 'The best headphones under $200 for studio monitoring, DJing, and casual listening...', slug: 'best-headphones-under-200', emoji: '🎧' },
  { title: 'Best DJ Controllers Under $500 in 2026: From Beginner to Pro', category: 'Topic: DJ Controllers', date: '2026-06-04', excerpt: 'The best DJ controllers under $500 for beginners and intermediate DJs...', slug: 'best-dj-controllers-under-500', emoji: '🎛️' },
  { title: 'Best PA Systems for Live Sound in 2026: Venue Guide', category: 'Topic: PA Systems', date: '2026-06-04', excerpt: 'The best PA systems for live sound, from small venues to large stages...', slug: 'best-pa-systems-live-sound', emoji: '📢' },
  { title: 'Best Microphones Under $100: Dynamic Mics That Mean Business', category: 'Topic: Microphones', date: '2026-06-04', excerpt: 'The best dynamic microphones under $100 for streaming, podcasting, and live performance...', slug: 'best-microphones-under-100', emoji: '🎤' },
  { title: 'Best Audio Interfaces Under $200 in 2026: Top Picks for Every Budget', category: 'Topic: Audio Interfaces', date: '2026-06-04', excerpt: 'The best audio interfaces under $2026 for home recording and podcasting...', slug: 'best-audio-interfaces-under-200', emoji: '🎸' },
  { title: 'Best Studio Monitors Under $500 in 2026: Complete Guide', category: 'Topic: Studio Monitors', date: '2026-06-04', excerpt: 'The best studio monitors under $500 for accurate mixing and mastering...', slug: 'best-studio-monitors-under-500', emoji: '🔊' },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-20 text-center" style={{ background: 'linear-gradient(180deg, rgba(212,168,67,0.05) 0%, transparent 100%)' }}>
        <div className="container">
          <span className="section-label">Learn</span>
          <h1 className="section-title mb-4">Buying Guides</h1>
          <p className="section-desc">In-depth guides to help you make the right choice — written by audio professionals who test and use the gear we recommend.</p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card group"
              >
                <div className="aspect-video bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center text-4xl">
                  {post.emoji}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#D4A843] mb-2">{post.category}</span>
                  <h2 className="text-base font-bold mb-2 leading-tight group-hover:text-[#D4A843] transition-colors flex-1">{post.title}</h2>
                  <p className="text-[#5A5A70] text-sm leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-[#5A5A70] border-t border-white/[0.06] pt-3 mt-auto">
                    <span>{post.date}</span>
                    <span className="text-[#D4A843] font-semibold">Read More →</span>
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
