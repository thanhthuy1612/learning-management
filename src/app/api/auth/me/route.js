import { NextResponse } from 'next/server';

export async function GET(req) {
  const accessToken = req.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(null);
  }

  try {
    const response = await fetch('https://api.dethiai.org/api/v1/me', {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      const resSuccess = await response.json();

      return NextResponse.json({ ...resSuccess.data, accessToken });
    } else {
      return NextResponse.json({ error: 'Lỗi' }, { status: 401 });
    }
  } catch (error) {
    console.error('Lỗi làm mới mã thông báo:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
