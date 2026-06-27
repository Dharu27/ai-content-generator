import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Since we are using client-side JWT storage, the server just acknowledges the logout.
  // The frontend should remove the JWT from local storage/session storage upon receiving this success response.
  return NextResponse.json({
    success: true,
    message: 'Logout successful',
  }, { status: 200 });
}
