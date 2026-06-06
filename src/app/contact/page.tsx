import Link from 'next/link';

export default function ContactPage() {
  return (
    <>
      <section style={{ padding: '4rem 0 2rem' }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#D4A843', marginBottom: '0.5rem' }}>
            Get in Touch
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>Contact Us</h1>
          <p style={{ color: '#888888', maxWidth: '600px', fontSize: '1.125rem', lineHeight: 1.6 }}>
            Have a question, suggestion, or collaboration idea? Drop us a line.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            {/* Contact Form */}
            <div>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#161616',
                      border: '1px solid #222222',
                      borderRadius: '6px',
                      color: '#e8e8e8',
                      fontSize: '0.9375rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#161616',
                      border: '1px solid #222222',
                      borderRadius: '6px',
                      color: '#e8e8e8',
                      fontSize: '0.9375rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</label>
                  <select
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#161616',
                      border: '1px solid #222222',
                      borderRadius: '6px',
                      color: '#e8e8e8',
                      fontSize: '0.9375rem',
                      outline: 'none',
                    }}
                  >
                    <option value="">Select a topic</option>
                    <option value="gear">Gear Question</option>
                    <option value="review">Product Review Request</option>
                    <option value="collab">Collaboration</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#161616',
                      border: '1px solid #222222',
                      borderRadius: '6px',
                      color: '#e8e8e8',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div style={{ background: '#161616', border: '1px solid #222222', borderRadius: '8px', padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#D4A843' }}>Contact Info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Email</div>
                    <a href="mailto:info@superstarsoundz.com" style={{ color: '#e8e8e8', fontSize: '0.9375rem' }}>info@superstarsoundz.com</a>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Location</div>
                    <div style={{ color: '#e8e8e8', fontSize: '0.9375rem' }}>Worldwide — Remote First</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Response Time</div>
                    <div style={{ color: '#e8e8e8', fontSize: '0.9375rem' }}>Within 24-48 hours</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(212, 168, 67, 0.1)', border: '1px solid #D4A843', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.5rem' }}>For Partnership Inquiries</h3>
                <p style={{ fontSize: '0.875rem', color: '#888888', lineHeight: 1.6 }}>
                  If you're a brand looking to partner with Superstar Soundz, please select "Partnership" in the subject field above. We review all partnership requests within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
