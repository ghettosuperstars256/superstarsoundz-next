import { cookies } from 'next/headers';
import { parseSession } from '@/lib/session';
import { findUserById } from '@/lib/users';
import { NextResponse } from 'next/server';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('ssz_session')?.value;
  if (!token) return null;

  const session = await parseSession(token);
  if (!session) return null;

  const user = await findUserById(session.userId);
  if (!user) return null;

  // Session invalidation: if user's sessionVersion doesn't match the session's,
  // the password was changed after this session was created → reject
  if (user.sessionVersion !== session.sessionVersion) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
  return user;
}

// Helper to create auth error responses
export function authError(error: unknown) {
  const status = (error as any)?.status || 401;
  const message = error instanceof Error ? error.message : 'Unauthorized';
  return NextResponse.json({ error: message }, { status });
}
