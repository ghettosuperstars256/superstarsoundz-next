import type { User } from '@/lib/types';
import { hashPassword, verifyPassword } from './session';

// Pre-compute the admin hash synchronously at build time
// SHA-256 of 'ssz-pwd-salt-v2-2026Superstar2026!' = deterministic
const ADMIN_HASH = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'; // placeholder

// In-memory user store — initialized synchronously
const USERS: User[] = [];

// Initialize admin user with async hash
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
  return verifyPassword(password, user.passwordHash);
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
  };
  USERS.push(user);
  return user;
}
