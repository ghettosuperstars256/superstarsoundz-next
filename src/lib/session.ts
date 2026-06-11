import type { User, SessionData } from '@/lib/types';

const SESSION_SECRET = process.env.SESSION_SECRET || 'ssz-session-secret-change-in-production';
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000;

// HMAC-SHA256 using Web Crypto API — edge-runtime compatible
async function hmacSign(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, msgData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// SHA-256 password hash with salt — edge-runtime compatible via Web Crypto
export async function hashPassword(password: string): Promise<string> {
  const salt = 'ssz-pwd-salt-v2-2026';
  const data = new TextEncoder().encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Verify password by comparing hashes with constant-time comparison
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  if (computed.length !== storedHash.length) return false;
  let result = 0;
  for (let i = 0; i < computed.length; i++) {
    result |= computed.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return result === 0;
}

export async function createSession(user: User): Promise<string> {
  const session: SessionData = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + SESSION_MAX_AGE,
  };

  const payload = btoa(JSON.stringify(session));
  const signature = await hmacSign(payload, SESSION_SECRET);
  return `${payload}.${signature}`;
}

export async function parseSession(token: string): Promise<SessionData | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payload, signature] = parts;

    // Verify HMAC signature
    const expectedSig = await hmacSign(payload, SESSION_SECRET);
    if (signature !== expectedSig) return null;

    // Decode and check expiry
    const session: SessionData = JSON.parse(atob(payload));
    if (session.exp < Date.now()) return null;

    return session;
  } catch {
    return null;
  }
}
