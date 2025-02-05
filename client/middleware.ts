import { NextResponse, NextRequest } from 'next/server';

import { getValidUserRole } from './lib/utils';

type UserRole = 'admin' | 'user' | null;

const rootConfig = {
  protectedRoutes: [
    {
      pattern: /^\/dashboard(\/.*)?$/,
      allowedRoles: new Set(['admin']),
      redirect: '/login',
    },
  ],
  authPages: new Set(['/login', '/signup']),
  roleRedirects: new Map([
    ['admin', '/dashboard'],
    ['user', '/'],
  ]),
  defaultRedirect: '/',
  authRedirect: '/login',
} as const;

// ==================== Middleware ====================
export default function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;
  const token = req.cookies.get('access_token')?.value;
  const userRole = getValidUserRole(token);

  if (!token) return handleUnauthenticated(currentPath, req);

  if (isAuthPage(currentPath)) {
    return redirectAuthenticatedUser(userRole, req);
  }

  const routeAccess = checkRouteAccess(currentPath, userRole);
  if (!routeAccess.isAllowed) {
    return NextResponse.redirect(
      new URL(routeAccess.redirectPath || rootConfig.authRedirect, req.url),
    );
  }

  return NextResponse.next();
}

function isAuthPage(path: string): boolean {
  return rootConfig.authPages.has(path);
}

function handleUnauthenticated(path: string, req: NextRequest): NextResponse {
  return isAuthPage(path)
    ? NextResponse.next()
    : NextResponse.redirect(new URL(rootConfig.authRedirect, req.url));
}

function redirectAuthenticatedUser(
  role: UserRole,
  req: NextRequest,
): NextResponse {
  const redirectPath =
    rootConfig.roleRedirects.get(role || 'user') || rootConfig.defaultRedirect;
  return NextResponse.redirect(new URL(redirectPath, req.url));
}

function checkRouteAccess(
  path: string,
  role: UserRole,
): {
  isAllowed: boolean;
  redirectPath?: string;
} {
  for (const route of rootConfig.protectedRoutes) {
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
  matcher: ['/login', '/signup', '/dashboard/:path*'],
};
