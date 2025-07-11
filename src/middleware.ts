import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET as string;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const pathname = req.nextUrl.pathname;

  // Allow access to sign-in page
  if (pathname === '/sign-in') {
    return NextResponse.next();
  }

  // If no token, redirect to sign-in
  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // If user is not auth, redirect (adjust role key as needed)
  // @ts-ignore: if `userData` is not typed
  if (token.userData?.role !== 'super-auth') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

// Match all routes except API, static, and _next
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
