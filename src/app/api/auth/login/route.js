import { NextResponse } from 'next/server';

export async function POST(req) {
  const { userName, password } = await req.json();

  if (userName && password) {
    const response = await fetch('https://api.dethiai.org/api/v1/guest/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, password }), // Chuyển đổi body thành chuỗi JSON
    });

    if (response.ok) {
      const user = await response.json();

      if (user.data) {
        // Tạo phản hồi và thiết lập cookie
        const res = NextResponse.json(user);
        res.cookies.set('accessToken', user.data.accessToken, {
          httpOnly: true,
          path: '/',
          sameSite: 'Strict',
        });

        res.cookies.set('refreshToken', user.data.refreshToken, {
          httpOnly: true,
          path: '/',
          sameSite: 'Strict',
        });

        return res;
      }
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ error: 'Lỗi đăng nhập' }, { status: 401 });
    }
  } else {
    return NextResponse.json({ error: 'Thông tin đăng nhập không hợp lệ' }, { status: 401 });
  }
}
