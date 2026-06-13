import type { User, SessionData } from '@/lib/types';

const SESSION_SECRET = process.env.SESSION_SECRET || (() => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET environment variable must be set in production');
  }
  return 'dev-only-insecure-secret-do-not-use-in-production';
})();
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

// ===== PASSWORD HASHING (PBKDF2 with per-user random salt) =====

const PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH = 32;

function arrayToHex(arr: Uint8Array): string {
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToArray(hex: string): Uint8Array {
  const result = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    result[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return result;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Generate cryptographically random salt
function generateSalt(): string {
  const salt = new Uint8Array(SALT_LENGTH);
  crypto.getRandomValues(salt);
  return arrayToHex(salt);
}

// Hash password with PBKDF2 + per-user random salt
// Format: pbkdf2$<iterations>$<salt>$<hash>
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();
  const saltBytes = hexToArray(salt) as unknown as Uint8Array<ArrayBuffer>;
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hash = arrayToHex(new Uint8Array(hashBuffer) as unknown as Uint8Array<ArrayBuffer>);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${salt}$${hash}`;
}

// Verify password against stored hash (supports both old SHA-256 and new PBKDF2)
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  // New PBKDF2 format: pbkdf2$<iterations>$<salt>$<hash>
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const expectedHash = parts[3];
    const saltBytes = hexToArray(salt) as unknown as Uint8Array<ArrayBuffer>;
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
    );
    const hashBuffer = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: saltBytes, iterations, hash: 'SHA-256' },
      keyMaterial,
      256
    );
    const computed = arrayToHex(new Uint8Array(hashBuffer));
    return constantTimeEqual(computed, expectedHash);
  }

  // Legacy SHA-256 format (migrate on next login)
  const salt = 'ssz-pwd-salt-v2-2026';
  const data = new TextEncoder().encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const computed = arrayToHex(new Uint8Array(hashBuffer));
  return constantTimeEqual(computed, storedHash);
}

// Check if hash needs migration from legacy SHA-256 to PBKDF2
export function needsPasswordMigration(storedHash: string): boolean {
  return !storedHash.startsWith('pbkdf2$');
}

// ===== SESSION MANAGEMENT =====

export async function createSession(user: User): Promise<string> {
  const session: SessionData = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + SESSION_MAX_AGE,
    sessionVersion: user.sessionVersion || 0, // For session invalidation
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

    // Verify HMAC signature (constant-time)
    const expectedSig = await hmacSign(payload, SESSION_SECRET);
    if (!constantTimeEqual(signature, expectedSig)) return null;

    // Decode and check expiry
    const session: SessionData = JSON.parse(atob(payload));
    if (session.exp < Date.now()) return null;

    return session;
  } catch {
    return null;
  }
}
