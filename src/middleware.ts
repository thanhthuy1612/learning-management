import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

const editRegex = /^\/user\/\d+\/edit$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
