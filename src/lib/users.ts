import type { User } from '@/lib/types';
import { hashPassword, verifyPassword, needsPasswordMigration } from './session';

// In-memory user store
const USERS: User[] = [];

let initDone = false;
let initPromise: Promise<void> | null = null;

async function ensureInit() {
  if (initDone) return;
  if (!initPromise) {
    initPromise = (async () => {
      const adminHash = await hashPassword('Superstar2026!');
      USERS.push({
        id: 'admin-001',
        email: 'ghettosuperstars256@gmail.com',
        name: 'Mainman',
        passwordHash: adminHash,
        role: 'admin',
        createdAt: '2026-06-08T00:00:00Z',
        sessionVersion: 0,
      });
      initDone = true;
    })();
  }
  await initPromise;
}

// Kick off initialization immediately
ensureInit();

export async function findUserByEmail(email: string): Promise<User | null> {
  await ensureInit();
  return USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserById(id: string): Promise<User | null> {
  await ensureInit();
  return USERS.find(u => u.id === id) || null;
}

export async function validatePassword(user: User, password: string): Promise<boolean> {
  const valid = await verifyPassword(password, user.passwordHash);

  // Auto-migrate legacy SHA-256 hashes to PBKDF2 on successful login
  if (valid && needsPasswordMigration(user.passwordHash)) {
    user.passwordHash = await hashPassword(password);
  }

  return valid;
}

export async function updateLastLogin(userId: string): Promise<void> {
  await ensureInit();
  const user = USERS.find(u => u.id === userId);
  if (user) {
    user.lastLogin = new Date().toISOString();
  }
}

export function listUsers(): Omit<User, 'passwordHash'>[] {
  return USERS.map(u => {
    const { passwordHash: _, ...safe } = u;
    return safe;
  });
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
  await ensureInit();
  const user = USERS.find(u => u.id === userId);
  if (user) {
    user.passwordHash = await hashPassword(newPassword);
    // Invalidate all existing sessions by bumping sessionVersion
    user.sessionVersion = (user.sessionVersion || 0) + 1;
    return true;
  }
  return false;
}

export async function updateUserEmail(userId: string, newEmail: string): Promise<boolean> {
  await ensureInit();
  const user = USERS.find(u => u.id === userId);
  if (user) {
    user.email = newEmail;
    return true;
  }
  return false;
}

export async function addUser(data: {
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'user';
}): Promise<User> {
  await ensureInit();
  const hash = await hashPassword(data.password);
  const user: User = {
    id: `user-${Date.now()}`,
    email: data.email,
    name: data.name,
    passwordHash: hash,
    role: data.role,
    createdAt: new Date().toISOString(),
    sessionVersion: 0,
  };
  USERS.push(user);
  return user;
}
