import Link from 'next/link';

export default function ContactPage() {
  return (
    <>
      <section className="py-16 md:py-20 text-center" style={{ background: 'linear-gradient(180deg, rgba(212,168,67,0.05) 0%, transparent 100%)' }}>
        <div className="container">
          <span className="section-label">Contact</span>
          <h1 className="section-title mb-4">Get in Touch</h1>
          <p className="section-desc">Have a question about gear, our services, or a collaboration? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container max-w-2xl">
          <div className="card p-8 md:p-12">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#C0C0CC] mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-[#0C0C12] border border-white/[0.06] text-white text-sm outline-none focus:border-[rgba(212,168,67,0.4)] transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#C0C0CC] mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-[#0C0C12] border border-white/[0.06] text-white text-sm outline-none focus:border-[rgba(212,168,67,0.4)] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#C0C0CC] mb-2">Subject</label>
                <select className="w-full px-4 py-3 rounded-lg bg-[#0C0C12] border border-white/[0.06] text-white text-sm outline-none focus:border-[rgba(212,168,67,0.4)] transition-colors">
                  <option>General Inquiry</option>
                  <option>Gear Consultation</option>
                  <option>Studio Design</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#C0C0CC] mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-[#0C0C12] border border-white/[0.06] text-white text-sm outline-none focus:border-[rgba(212,168,67,0.4)] transition-colors resize-none"
                  placeholder="Tell us what you're looking for..."
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full justify-center">
                Send Message
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/[0.06] text-center">
              <p className="text-[#8888A0] text-sm mb-2">Or reach us directly:</p>
              <a href="mailto:hello@superstarsoundz.com" className="text-[#D4A843] font-semibold hover:text-[#E8C76A] transition-colors">
                hello@superstarsoundz.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
