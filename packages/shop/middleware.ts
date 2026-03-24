import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/(.*)']);

const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

const isPublicRoute = createRouteMatcher(['/', '/products(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Skip Clerk checks entirely for embed routes
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access protected route
  if (!userId && isProtectedRoute(request) && !isAuthRoute(request)) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If user is authenticated and trying to access auth pages
  if (userId && isAuthRoute(request)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
