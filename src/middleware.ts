import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || "default_super_secret_key_change_me_in_prod";
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /api/generate and any future protected routes
  if (pathname.startsWith('/api/generate')) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Missing token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Verify token
      await jwtVerify(token, getJwtSecretKey());
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or expired token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/generate/:path*'],
};
