import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, validatePassword, updateUserPassword, updateUserEmail } from '@/lib/users';
import { requireAdmin, authError } from '@/lib/auth';
import { apiRateLimiter } from '@/lib/rateLimit';
import { auditLog } from '@/lib/audit';
import { corsHeaders } from '@/lib/cors';

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const rateCheck = apiRateLimiter(getClientIp(request));
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateCheck.retryAfter },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 60) } }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword, newEmail } = body;

    // Verify current password
    const user = await findUserByEmail(admin.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const valid = await validatePassword(user, currentPassword);
    if (!valid) {
      auditLog({
        action: 'password_change_failed',
        userId: admin.id,
        userEmail: admin.email,
        ip: getClientIp(request),
        details: 'Failed password change — incorrect current password',
        severity: 'warning',
      });
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    const results: string[] = [];

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
      }
      await updateUserPassword(user.id, newPassword);
      results.push('Password updated');
    }

    if (newEmail && newEmail !== user.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
      }
      await updateUserEmail(user.id, newEmail);
      results.push('Email updated');
    }

    auditLog({
      action: 'account_update',
      userId: admin.id,
      userEmail: admin.email,
      ip: getClientIp(request),
      details: results.join(', ') || 'No changes',
      severity: 'critical',
    });

    return NextResponse.json({ success: true, message: results.join(', ') || 'No changes made' });
  } catch (error) {
    return authError(error);
  }
}
