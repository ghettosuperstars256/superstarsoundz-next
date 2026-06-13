import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, validatePassword, updateLastLogin } from '@/lib/users';
import { createSession } from '@/lib/session';
import { loginRateLimiter } from '@/lib/rateLimit';
import { auditLog } from '@/lib/audit';
import { generateCsrfToken, setCsrfCookie } from '@/lib/csrf';
import { corsHeaders } from '@/lib/cors';
import { handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateCheck = loginRateLimiter(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 900) } }
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
      auditLog({
        action: 'login_failed',
        userEmail: email,
        ip,
        details: `Failed login attempt for ${email}`,
        severity: 'warning',
      });
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    await updateLastLogin(user.id);
    const sessionToken = await createSession(user);
    const csrfToken = generateCsrfToken();

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

    setCsrfCookie(response, csrfToken);

    auditLog({
      action: 'login_success',
      userId: user.id,
      userEmail: user.email,
      ip,
      details: `Successful login for ${user.email}`,
      severity: 'info',
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
