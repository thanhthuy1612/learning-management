import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  // const { pathname } = request.nextUrl;

  if (!accessToken && refreshToken) {
    const response = await fetch('https://api.dethiai.org/api/v1/user/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = (await response.json()).data;
      // Lưu token mới vào cookie
      const res = NextResponse.next();
      res.cookies.set('accessToken', data.accessToken, { httpOnly: true });
      res.cookies.set('refreshToken', data.refreshToken, { httpOnly: true }); // Đặt cookie httpOnly
      return res;
    }

    return NextResponse.redirect(new URL('/auth/jwt/sign-in', request.url));
  }
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/auth/jwt/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
