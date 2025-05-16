import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token');
  const isAuthPage = request.nextUrl.pathname === '/';
  const isLogoutRequest = request.nextUrl.pathname === '/api/auth/logout';

  // Allow logout requests to proceed without redirection
  if (isLogoutRequest) {
    return NextResponse.next();
  }

  // If not authenticated and trying to access protected routes
  if (!authToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/api/auth/logout'],
};