import { cookies } from 'next/headers';
import { parseSession } from '@/lib/session';
import { findUserById } from '@/lib/users';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('ssz_session')?.value;
  if (!token) return null;

  const session = await parseSession(token);
  if (!session) return null;

  const user = await findUserById(session.userId);
  if (!user) return null;

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
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new Error('Forbidden');
  }
  return user;
}
