import Link from 'next/link';

interface BlogPostPageProps {
  params: { slug: string };
}

// Sample blog post content — in production this would come from WP REST API
function getPost(slug: string) {
  const posts: Record<string, { title: string; content: string; category: string; date: string }> = {
    'best-guitar-amps-for-electric-guitars-tube-vs-solid-state-in-2026': {
      title: 'Best Guitar Amps for Electric Guitars: Tube vs Solid State in 2026',
      category: 'Topic: Guitar Amps',
      date: '2026-06-04',
      content: `
        <h2>Best Guitar Amps: A Complete Guide to Choosing Your Sound</h2>
        <p>Your amplifier is just as important as your guitar. A great amp can transform a cheap guitar into a tone machine, while a bad amp can make even the finest instrument sound lifeless. Whether you're a beginner looking for your first practice amp or an experienced player upgrading your rig, this guide covers everything you need to know about choosing the best guitar amp.</p>

        <h2>Tube Amps vs Solid State vs Digital Modeling</h2>

        <h3>Tube Amps: The Gold Standard</h3>
        <p>Tube amplifiers use vacuum tubes to amplify your signal, producing warm, natural overdrive that responds dynamically to your playing. They're the choice of most professional guitarists. The downsides: they're heavy, expensive, and require maintenance (tube replacement).</p>
        <p><strong>Best for:</strong> Blues, classic rock, jazz, players who want natural amp overdrive</p>

        <h3>Solid State Amps: Reliable & Affordable</h3>
        <p>Solid state amps use transistors instead of tubes. They're lighter, cheaper, and maintenance-free. Modern solid state amps have improved dramatically — some are remarkably close to tube tone. Many include built-in effects.</p>
        <p><strong>Best for:</strong> Beginners, gigging musicians, jazz, clean tones</p>

        <h3>Digital Modeling Amps: Maximum Versatility</h3>
        <p>Modeling amps use digital processing to emulate dozens of classic amplifiers, cabinets, and effects in one unit. Modern modelers like the Line 6 Helix and Fractal FM9 are incredibly realistic.</p>
        <p><strong>Best for:</strong> Home recording, players who need multiple amp sounds, versatility</p>

        <h2>Best Guitar Amps by Category</h2>

        <h3>Best Beginner Amp: Fender Frontman 10G</h3>
        <p>$59 — Simple, reliable, loud enough for practice. Clean and overdrive channels, 3-band EQ, headphone jack for silent practice. It's the universal recommendation for new guitarists.</p>
        <a href="https://www.amazon.com/s?k=Fender+Frontman+10G&tag=superstarsoundz-20" class="btn btn-primary" target="_blank" rel="nofollow noopener">Check Price →</a>

        <h3>Best Under $300: Boss Katana 50 MkII</h3>
        <p>$259 — The Katana series is a phenomenon for good reason. Boss's Tube Logic modeling delivers remarkably authentic amp tones, plus 60+ Boss effects, USB recording access, and footswitch control. Extraordinary value.</p>
        <a href="https://www.amazon.com/s?k=Boss+Katana+50+MkII&tag=superstarsoundz-20" class="btn btn-primary" target="_blank" rel="nofollow noopener">Check Price →</a>

        <h3>Best Tube Amp Under $800: Fender Blues Junior IV</h3>
        <p>$699 — This 15-watt tube combo is loud enough for small gigs while delivering beautiful Fender clean and overdrive tones. FAT switch adds beef, and the 12″ speaker fills a room. A genuine classic.</p>
        <a href="https://www.amazon.com/s?k=Fender+Blues+Junior+IV&tag=superstarsoundz-20" class="btn btn-primary" target="_blank" rel="nofollow noopener">Check Price →</a>

        <h3>Best High-End: Line 6 Helix Floor</h3>
        <p>$1,599 — The Helix is the industry standard for guitar modeling. Dual DSP processors power hundreds of amp models and effects with stunning realism. Use it as a standalone amp, a pedalboard, or a recording interface. It's a complete rig in one unit.</p>
        <a href="https://www.amazon.com/s?k=Line+6+Helix+Floor&tag=superstarsoundz-20" class="btn btn-primary" target="_blank" rel="nofollow noopener">Check Price →</a>

        <h2>Choosing the Right Amp for Your Genre</h2>
        <table>
          <thead><tr><th>Genre</th><th>Best Amp Type</th><th>Recommended Amp</th></tr></thead>
          <tbody>
            <tr><td>Blues / Classic Rock</td><td>Small tube</td><td>Fender Blues Junior</td></tr>
            <tr><td>Heavy Metal</td><td>High-gain tube or modeler</td><td>Line 6 Helix / 5150</td></tr>
            <tr><td>Jazz</td><td>Clean tube / solid state</td><td>Roland JC-40</td></tr>
            <tr><td>Home practice</td><td>Modeling / small solid state</td><td>Boss Katana 50</td></tr>
            <tr><td>Gigging (all genres)</td><td>Modeling / large tube</td><td>Helix / Twin Reverb</td></tr>
          </tbody>
        </table>

        <h2>Frequently Asked Questions</h2>

        <h3>Can I use a guitar amp for bass?</h3>
        <p>It's not recommended. Bass frequencies can damage guitar speakers. Some players do it for a gritty, overdriven bass tone (Jack White, early Modest Mouse), but you're risking speaker damage at higher volumes.</p>

        <h3>Do I need a headphone jack for silent practice?</h3>
        <p>Headphone jacks are essential if you practice in apartments or late at night. The Boss Katana series includes a headphone/record out. Alternatively, a dedicated headphone amp like the Vox amPlug ($40) works with any amp.</p>

        <h3>What's better — combo amp or head + cabinet?</h3>
        <p>Combo amps (all-in-one) are more convenient for practice and small gigs. Separate heads and cabinets offer more flexibility and volume for serious gigging. Most guitarists start with a combo and upgrade later.</p>

        <h2>The Bottom Line</h2>
        <p>For beginners, the <strong>Boss Katana 50 MkII</strong> is the best all-around choice — versatile, great-sounding, and affordable. For blues and classic rock players who want real tube tone, the <strong>Fender Blues Junior IV</strong> is legendary. For players who need every amp sound imaginable, the <strong>Line 6 Helix Floor</strong> is the ultimate solution.</p>
      `,
    },
  };
  return posts[slug] || null;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPost(params.slug);

  if (!post) {
    return (
      <section className="py-20 text-center">
        <div className="container">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-[#8888A0] mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="btn btn-primary">← Back to Blog</Link>
        </div>
      </section>
    );
  }

  return (
    <article>
      {/* Hero */}
      <section className="py-16 md:py-20 text-center" style={{ background: 'linear-gradient(180deg, rgba(212,168,67,0.05) 0%, transparent 100%)' }}>
        <div className="container max-w-3xl">
          <span className="section-label">{post.category}</span>
          <h1 className="section-title mb-4">{post.title}</h1>
          <p className="text-[#8888A0] text-sm">{post.date}</p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16">
        <div className="container max-w-3xl">
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <hr className="divider my-12" />
          <div className="text-center">
            <Link href="/blog" className="btn btn-outline">← Back to All Guides</Link>
          </div>
        </div>
      </section>
    </article>
  );
}
