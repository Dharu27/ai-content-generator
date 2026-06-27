import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export function middleware(request: NextRequest) {
  // Only protect the profile route
  if (request.nextUrl.pathname.startsWith('/api/auth/profile')) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Missing or invalid token format' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid or expired token' },
        { status: 401 }
      );
    }

    // Pass the decoded user info to the request headers so the route handler can use it
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', (decoded as any).id);
    requestHeaders.set('x-user-email', (decoded as any).email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/profile'],
};
