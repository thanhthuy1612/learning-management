import { NextResponse } from 'next/server';

export async function POST(req) {
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'Lỗi' }, { status: 401 });
  }

  try {
    const response = await fetch('https://api.dethiai.org/api/v1/user/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const user = (await response.json()).data;

      // Tạo phản hồi và thiết lập cookie
      const res = NextResponse.json(user);
      res.cookies.set('accessToken', user.accessToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'Strict',
      });

      res.cookies.set('refreshToken', user.refreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'Strict',
      });

      return res;
    } else {
      return NextResponse.json({ error: 'Lỗi' }, { status: 401 });
    }
  } catch (error) {
    console.error('Lỗi làm mới mã thông báo:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
