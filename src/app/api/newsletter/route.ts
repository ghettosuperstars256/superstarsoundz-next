import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NEWSLETTER_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

// Rate limiting
const newsletterAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_NEWSLETTER = 3;
const NEWSLETTER_WINDOW = 60 * 60 * 1000; // 1 hour

function checkNewsletterRate(ip: string): boolean {
  const now = Date.now();
  const record = newsletterAttempts.get(ip);
  if (!record || now > record.resetAt) {
    newsletterAttempts.set(ip, { count: 1, resetAt: now + NEWSLETTER_WINDOW });
    return true;
  }
  if (record.count >= MAX_NEWSLETTER) return false;
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkNewsletterRate(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Newsletter is not configured yet. Please try again later.' },
        { status: 503 }
      );
    }

    // Add to Resend audience if configured, otherwise just acknowledge
    if (NEWSLETTER_AUDIENCE_ID) {
      const res = await fetch(`https://api.resend.com/audiences/${NEWSLETTER_AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
        }),
      });

      if (!res.ok && res.status !== 409) {
        const errorData = await res.text();
        console.error('Resend API error:', res.status, errorData);
        return NextResponse.json(
          { error: 'Failed to subscribe. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "You're subscribed! Check your inbox for a welcome email.",
    });
  } catch (err) {
    console.error('Newsletter signup error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
