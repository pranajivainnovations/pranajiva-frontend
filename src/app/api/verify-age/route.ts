import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { verified } = await request.json();

  if (verified) {
    const response = NextResponse.json({ success: true });
    
    // Set cookie for 30 days
    response.cookies.set('age_verified', 'true', {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 400 });
}
