import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'experimental-edge';

// Paths that don't require auth
const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('ssz_session')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For edge runtime, we do a simple structural check here
  // Full HMAC verification happens in the API routes and page-level auth
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = JSON.parse(atob(parts[0]));
    if (payload.exp < Date.now()) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin routes
    if (pathname.startsWith('/dashboard/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
