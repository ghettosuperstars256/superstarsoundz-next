// CSRF protection using double-submit cookie pattern
import { NextRequest, NextResponse } from 'next/server';

const CSRF_COOKIE_NAME = 'ssz_csrf';
const CSRF_HEADER_NAME = 'x-csrf-token';

// Generate a random token
export function generateCsrfToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Set CSRF cookie (called from login/session creation)
export function setCsrfCookie(response: NextResponse, token: string) {
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false,  // JS needs to read this to send in header
    secure: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60,
    path: '/',
  });
}

// Validate CSRF token from request
export function validateCsrfToken(request: NextRequest): boolean {
  // Skip for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return true;

  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length !== headerToken.length) return false;

  // Constant-time comparison
  let result = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    result |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }
  return result === 0;
}
