import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, validatePassword, updateLastLogin } from '@/lib/users';
import { createSession } from '@/lib/session';

// Rate limiting
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);
  if (!record || now > record.resetAt) {
    loginAttempts.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }
  if (record.count >= MAX_ATTEMPTS) return { allowed: false, remaining: 0 };
  record.count++;
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await validatePassword(user, password);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    await updateLastLogin(user.id);
    const sessionToken = await createSession(user);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    response.cookies.set('ssz_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('ssz_session');
  return response;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('ssz_session')?.value;
  if (!token) return NextResponse.json({ authenticated: false });

  try {
    const { parseSession } = await import('@/lib/session');
    const session = await parseSession(token);
    if (!session) return NextResponse.json({ authenticated: false });
    return NextResponse.json({
      authenticated: true,
      user: { id: session.userId, email: session.email, name: session.name, role: session.role },
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
