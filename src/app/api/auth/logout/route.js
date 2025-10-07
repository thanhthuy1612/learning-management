import { NextResponse } from 'next/server';

export async function POST(req) {
  const res = NextResponse.json({});
  res.cookies.set('accessToken', null, {
    httpOnly: true,
    path: '/',
    sameSite: 'Strict',
  });

  res.cookies.set('refreshToken', null, {
    httpOnly: true,
    path: '/',
    sameSite: 'Strict',
  });

  return res;
}
