import { NextResponse, NextRequest } from 'next/server';

import { getValidUserRole } from '@shared/lib/utils';

type UserRole = 'admin' | 'user' | null;

const config_ = {
  protectedRoutes: [
    {
      pattern: /^\/dashboard(\/.*)?$/,
      allowedRoles: new Set(['admin']),
      redirect: '/login',
    },
  ],
  authPages: new Set(['/login']),
  defaultRedirect: '/dashboard',
  authRedirect: '/login',
} as const;

export default function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;
  const token = req.cookies.get('access_token')?.value;
  const userRole = getValidUserRole(token);

  // Redirect root to dashboard
  if (currentPath === '/') {
    const target = token && userRole === 'admin'
      ? config_.defaultRedirect
      : config_.authRedirect;
    return NextResponse.redirect(new URL(target, req.url));
  }

  if (!token) return handleUnauthenticated(currentPath, req);

  // Only allow admin role
  if (userRole !== 'admin') {
    const response = NextResponse.redirect(
      new URL(config_.authRedirect, req.url),
    );
    response.cookies.delete('access_token');
    return response;
  }

  if (isAuthPage(currentPath)) {
    return NextResponse.redirect(
      new URL(config_.defaultRedirect, req.url),
    );
  }

  return NextResponse.next();
}

function isAuthPage(path: string): boolean {
  return config_.authPages.has(path);
}

function handleUnauthenticated(path: string, req: NextRequest): NextResponse {
  return isAuthPage(path)
    ? NextResponse.next()
    : NextResponse.redirect(new URL(config_.authRedirect, req.url));
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};
