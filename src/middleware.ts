// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    "/",
    "/homes",
    "/register",
    "/login",
    "/forgot-password",
  ];
  const adminRoutes = ["/adminPanel"];
  const protectedRoutes = ["/dashboard"];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!token && (isProtectedRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/homes", request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (token) {
    try {
      const decoded = jwt.decode(token) as { email?: string };

      if (isAdminRoute && decoded?.email !== "admin@yopmail.com") {
        return NextResponse.redirect(new URL("/homes", request.url));
      }

      if (
        pathname.startsWith("/dashboard") &&
        decoded?.email === "admin@yopmail.com"
      ) {
        return NextResponse.redirect(new URL("/adminPanel", request.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
