import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/dashboard');
  
  const publicRoutes = ['/login', '/signup', '/'];

  const membi_admin_token = request.cookies.get('membi_admin_token');

  if (isProtectedRoute) {
    if (!membi_admin_token) {
      console.log('No membi_admin_token, redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await jose.jwtVerify(
        membi_admin_token.value,
        new TextEncoder().encode(process.env.MEMBI_ADMIN_SECRET!)
      );
      // membi_admin_token is valid; proceed with the request
    } catch (error) {
      console.log('Invalid membi_admin_token, redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Optional: Redirect authenticated users away from public routes
  if (publicRoutes.includes(path) && membi_admin_token) {
    try {
      await jose.jwtVerify(
        membi_admin_token.value,
        new TextEncoder().encode(process.env.MEMBI_ADMIN_SECRET!)
      );
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      // membi_admin_token is invalid; allow access to public routes
    }
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ['/dashboard/:path*'],
// };