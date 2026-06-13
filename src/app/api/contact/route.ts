import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders } from '@/lib/cors';
import { contactRateLimiter } from '@/lib/rateLimit';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = contactRateLimiter(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 3600) } }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Sanitize inputs
    const cleanName = name.trim().slice(0, 100);
    const cleanEmail = email.trim().slice(0, 254);
    const cleanMessage = message.trim().slice(0, 5000);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (cleanMessage.length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters.' }, { status: 400 });
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
        replyTo: cleanEmail,
        subject: `Contact: ${cleanName}`.slice(0, 200),
        text: `From: ${cleanName} <${cleanEmail}>\n\n${cleanMessage}`,
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
