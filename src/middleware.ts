import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { Role } from '@prisma/client';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/api/auth',
];

// Check if the current path is a public route
function isPublicRoute(path: string): boolean {
  return publicRoutes.some(route => 
    path === route || 
    path.startsWith('/api/auth/') || 
    path.startsWith('/_next/') ||
    path.startsWith('/favicon.ico')
  );
}

// Define route access by role
const roleRoutes: Record<Role, string[]> = {
  ADMIN: ['/admin', '/dashboard'],
  EDUCATOR: ['/educator', '/dashboard', '/assessment', '/curriculum', '/resources'],
  PROFESSIONAL: ['/professional', '/dashboard', '/assessment', '/resources'],
  PARENT: ['/parent', '/dashboard', '/resources'],
  STUDENT: ['/student', '/dashboard', '/learning', '/resources'],
  GUEST: ['/resources'],
};

// Check if the user has access to the current path based on their role
function hasRouteAccess(path: string, role: Role): boolean {
  // Admins have access to everything
  if (role === 'ADMIN') return true;
  
  // Check if the user's role has access to the path
  return roleRoutes[role].some(route => path.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow public routes
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }
  
  // Get the user's session
  const session = await auth();
  
  // If no session, redirect to sign in
  if (!session) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }
  
  // Check role-based access
  const userRole = session.user?.role as Role || 'GUEST';
  
  if (!hasRouteAccess(path, userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
