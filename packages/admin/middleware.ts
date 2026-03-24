import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAuthRoute = createRouteMatcher(['/sign-in(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const currentPath = request.nextUrl.pathname;

  // Redirect root to dashboard or sign-in
  if (currentPath === '/') {
    const target = userId ? '/dashboard' : '/sign-in';
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Authenticated user trying to access sign-in → redirect to dashboard
  if (userId && isAuthRoute(request)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Unauthenticated user trying to access anything except sign-in → redirect to sign-in
  if (!userId && !isAuthRoute(request)) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
