export default function ContactPage() {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '0.9375rem',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 600,
    marginBottom: '0.375rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <>
      <section style={{ padding: '4rem 0 2rem' }}>
        <div className="container">
          <p className="label" style={{ marginBottom: '0.5rem' }}>Get in Touch</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>Contact Us</h1>
          <p className="text-secondary" style={{ maxWidth: '600px', fontSize: '1.125rem', lineHeight: 1.6 }}>
            Have a question, suggestion, or collaboration idea? Drop us a line.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="grid-2">
            <div>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input type="text" placeholder="Your name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" placeholder="your@email.com" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <select style={inputStyle}>
                    <option value="">Select a topic</option>
                    <option value="gear">Gear Question</option>
                    <option value="review">Product Review Request</option>
                    <option value="collab">Collaboration</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea rows={5} placeholder="Tell us what's on your mind..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Send Message</button>
              </form>
            </div>

            <div>
              <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 className="text-accent" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Contact Info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Email</div>
                    <a href="mailto:info@superstarsoundz.com" style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>info@superstarsoundz.com</a>
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Location</div>
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>Worldwide — Remote First</div>
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Response Time</div>
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>Within 24-48 hours</div>
                  </div>
                </div>
              </div>

              <div className="bg-accent-dim border-accent" style={{ borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.5rem' }}>For Partnership Inquiries</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                  If you're a brand looking to partner with Superstar Soundz, please select "Partnership" in the subject field. We review all requests within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
