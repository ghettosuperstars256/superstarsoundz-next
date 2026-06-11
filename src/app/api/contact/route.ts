import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Rate limiting — shared with newsletter
const contactAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_CONTACT = 3;
const CONTACT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkContactRate(ip: string): boolean {
  const now = Date.now();
  const record = contactAttempts.get(ip);
  if (!record || now > record.resetAt) {
    contactAttempts.set(ip, { count: 1, resetAt: now + CONTACT_WINDOW });
    return true;
  }
  if (record.count >= MAX_CONTACT) return false;
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkContactRate(ip)) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
    }

    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Contact form is not configured yet. Please email us directly.' },
        { status: 503 }
      );
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Superstar Soundz <hello@superstarsoundz.com>',
        to: 'ghettosuperstars256@gmail.com',
        replyTo: email,
        subject: `Contact: ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Resend error:', res.status, errorText);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully. We will get back to you soon.' });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
