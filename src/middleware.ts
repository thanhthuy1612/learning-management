import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

const editRegex = /^\/user\/\d+\/edit$/;

export function middleware(request: NextRequest) {
  // const token = request.cookies.get('token');

  // if (!token) {
  //   return NextResponse.redirect(new URL('/auth/jwt/sign-in', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
