// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import * as jose from 'jose';

// export default async function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;
//   const isProtectedRoute = path.startsWith('/dashboard');
  
//   const publicRoutes = ['/login', '/signup', '/'];

//   const token = request.cookies.get('token');

//   if (isProtectedRoute) {
//     if (!token) {
//       console.log('No token, redirecting to /login');
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     try {
//       await jose.jwtVerify(
//         token.value,
//         new TextEncoder().encode(process.env.JWT_SECRET!)
//       );
//       // Token is valid; proceed with the request
//     } catch (error) {
//       console.log('Invalid token, redirecting to /login');
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//   }

//   // Optional: Redirect authenticated users away from public routes
//   if (publicRoutes.includes(path) && token) {
//     try {
//       await jose.jwtVerify(
//         token.value,
//         new TextEncoder().encode(process.env.JWT_SECRET!)
//       );
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     } catch (error) {
//       // Token is invalid; allow access to public routes
//     }
//   }

//   return NextResponse.next();
// }

// // export const config = {
// //   matcher: ['/dashboard/:path*'],
// // };