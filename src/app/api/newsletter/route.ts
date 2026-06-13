import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders } from '@/lib/cors';
import { newsletterRateLimiter } from '@/lib/rateLimit';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NEWSLETTER_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = newsletterRateLimiter(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 3600) } }
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

    if (NEWSLETTER_AUDIENCE_ID) {
      const res = await fetch(`https://api.resend.com/audiences/${NEWSLETTER_AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      });

      if (!res.ok && res.status !== 409) {
        const errorData = await res.text();
        console.error('Resend API error:', res.status, errorData);
        return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
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
