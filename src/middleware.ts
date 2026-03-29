import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Age verification check
  const ageVerified = request.cookies.get('age_verified');
  const pathname = request.nextUrl.pathname;

  // Exclude static files and API routes from age gate
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname === '/age-verification'
  ) {
    return NextResponse.next();
  }

  // Redirect to age verification if not verified
  if (!ageVerified) {
    return NextResponse.redirect(new URL('/age-verification', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
