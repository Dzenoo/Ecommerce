import { NextResponse, NextRequest } from 'next/server';

import { getValidUserRole } from '@shared/lib/utils';

type UserRole = 'admin' | 'user' | null;

const config_ = {
  protectedRoutes: [
    {
      pattern: /^\/cart(\/.*)?$/,
      allowedRoles: new Set(['user']),
      redirect: '/',
    },
    {
      pattern: /^\/profile(\/.*)?$/,
      allowedRoles: new Set(['user']),
      redirect: '/',
    },
    {
      pattern: /^\/wishlist(\/.*)?$/,
      allowedRoles: new Set(['user']),
      redirect: '/',
    },
  ],
  authPages: new Set(['/login', '/signup']),
  defaultRedirect: '/',
  authRedirect: '/login',
} as const;

export default function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;
  const token = req.cookies.get('access_token')?.value;
  const userRole = getValidUserRole(token);

  if (!token) return handleUnauthenticated(currentPath, req);

  if (isAuthPage(currentPath)) {
    return NextResponse.redirect(new URL(config_.defaultRedirect, req.url));
  }

  const routeAccess = checkRouteAccess(currentPath, userRole);
  if (!routeAccess.isAllowed) {
    return NextResponse.redirect(
      new URL(routeAccess.redirectPath || config_.authRedirect, req.url),
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

function checkRouteAccess(
  path: string,
  role: UserRole,
): {
  isAllowed: boolean;
  redirectPath?: string;
} {
  for (const route of config_.protectedRoutes) {
    if (route.pattern.test(path)) {
      return {
        isAllowed: route.allowedRoles.has(role || ''),
        redirectPath: route.redirect,
      };
    }
  }
  return { isAllowed: true };
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/cart/:path*',
    '/profile/:path*',
    '/wishlist/:path*',
  ],
};
