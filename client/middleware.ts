import { NextResponse, NextRequest } from 'next/server';

import { decodeToken } from './lib/utils';

const protectedRoutes = {
  '/dashboard': ['admin'],
  '/products': ['user'],
};

export default function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token');

  const userType = token ? decodeToken(token.value)?.role : null;
  const pathname = req.nextUrl.pathname;

  if (!token) {
    return handleUnauthenticatedAccess(pathname, req);
  }

  if (isAuthPage(pathname)) {
    return redirectLoggedInUser(userType, req);
  }

  return handleProtectedRoutes(pathname, userType, req);
}

function handleUnauthenticatedAccess(pathname: string, req: NextRequest) {
  if (isAuthPage(pathname)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL('/login', req.url));
}

function isAuthPage(pathname: string) {
  return pathname === '/login' || pathname === '/signup';
}

function redirectLoggedInUser(userType: string, req: NextRequest) {
  const redirectUrl = userType === 'admin' ? '/dashboard' : '/';
  return NextResponse.redirect(new URL(redirectUrl, req.url));
}

function handleProtectedRoutes(
  pathname: string,
  userType: string,
  req: NextRequest,
) {
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route) && !roles.includes(userType)) {
      const redirectUrl = userType === 'admin' ? '/dashboard' : '/';
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup'],
};
