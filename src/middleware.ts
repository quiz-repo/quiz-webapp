
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  console.log("Token in middleware:", token ? "exists" : "undefined");
  console.log("Current path:", pathname);

  const publicRoutes = ["/", "/homes", "/register", "/login", "/forgot-password"];
  
  // Define admin routes
  const adminRoutes = ["/adminPanel"];
  
  // Define protected routes that require authentication
  const protectedRoutes = ["/dashboard"];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route === pathname) return true;
    if (route !== '/' && pathname.startsWith(route + '/')) return true;
    return false;
  });

  // Check if current path is admin route
  const isAdminRoute = adminRoutes.some(route => {
    if (route === pathname) return true;
    if (pathname.startsWith(route + '/')) return true;
    return false;
  });

  // Check if current path is protected route
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route === pathname) return true;
    if (pathname.startsWith(route + '/')) return true;
    return false;
  });

  // If user has token and tries to access public auth routes, redirect to dashboard
  if (token && (pathname === "/" || pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user doesn't have token and tries to access protected routes, redirect to homes
  if (!token && (isProtectedRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/homes", request.url));
  }

  // If user without token tries to access root, redirect to homes
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/homes", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

