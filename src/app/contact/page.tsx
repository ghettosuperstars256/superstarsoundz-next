'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('sent');
        setStatusMsg(data.message);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setStatusMsg(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setStatusMsg('Network error. Please try again.');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#121216',
    border: '1px solid #1e1e26',
    borderRadius: '6px',
    color: '#f0f0f2',
    fontSize: '0.9375rem',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 600,
    marginBottom: '0.375rem',
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
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <select name="subject" value={form.subject} onChange={handleChange} style={inputStyle}>
                    <option value="">Select a topic</option>
                    <option value="shop">Shop Question</option>
                    <option value="review">Product Review Request</option>
                    <option value="collab">Collaboration</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us what's on your mind..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} required />
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }} disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status !== 'idle' && (
                  <p style={{ fontSize: '0.875rem', padding: '0.75rem', borderRadius: '6px', background: status === 'sent' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: status === 'sent' ? '#22c55e' : '#ef4444' }}>
                    {statusMsg}
                  </p>
                )}
              </form>
            </div>

            <div>
              <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 className="text-accent" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Contact Info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Email</div>
                    <a href="mailto:info@superstarsoundz.com" style={{ color: '#f0f0f2', fontSize: '0.9375rem' }}>info@superstarsoundz.com</a>
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Location</div>
                    <div style={{ color: '#f0f0f2', fontSize: '0.9375rem' }}>Worldwide — Remote First</div>
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Response Time</div>
                    <div style={{ color: '#f0f0f2', fontSize: '0.9375rem' }}>Within 24-48 hours</div>
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
