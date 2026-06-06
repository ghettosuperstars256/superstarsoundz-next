import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <section className="py-16 md:py-20 text-center" style={{ background: 'linear-gradient(180deg, rgba(212,168,67,0.05) 0%, transparent 100%)' }}>
        <div className="container">
          <span className="section-label">About</span>
          <h1 className="section-title mb-4">About Superstar Soundz</h1>
        </div>
      </section>

      <section className="pb-16">
        <div className="container max-w-3xl">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-[#C0C0CC] leading-relaxed mb-6">
              We are audio professionals dedicated to helping you find the best gear. Founded in 2024, Superstar Soundz has become a trusted resource for musicians, DJs, and producers worldwide.
            </p>
            <p className="text-[#8888A0] leading-relaxed mb-6">
              Our team of audio engineers and producers personally test and review every product we recommend. We don't just read spec sheets — we use the gear in real studios, on real stages, and in real recording sessions.
            </p>
            <p className="text-[#8888A0] leading-relaxed mb-6">
              Whether you're building your first home studio, upgrading your live sound setup, or looking for the perfect pair of headphones, we've done the research so you don't have to.
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4">Our Mission</h2>
            <p className="text-[#8888A0] leading-relaxed mb-6">
              To provide honest, expert reviews and buying guides that help musicians at every level make informed decisions about professional audio equipment.
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4">What We Do</h2>
            <ul className="text-[#8888A0] leading-relaxed space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-[#D4A843] mt-1">▸</span>
                <span>In-depth product reviews and comparisons</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D4A843] mt-1">▸</span>
                <span>Buying guides for every budget and use case</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D4A843] mt-1">▸</span>
                <span>Studio design and acoustic treatment advice</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D4A843] mt-1">▸</span>
                <span>Artist and label gear consultation services</span>
              </li>
            </ul>
            <div className="text-center mt-12">
              <Link href="/contact" className="btn btn-primary btn-lg">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
