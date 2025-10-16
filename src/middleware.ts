// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

// ---------------- Constants ----------------
const PUBLIC_ROUTES = ["/", "/home", "/register", "/login", "/forgot-password"];
const ADMIN_ROUTES = ["/adminPanel"];
const PROTECTED_ROUTES = ["/dashboard"];

// Firebase Project ID - used to verify tokens
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;

// Cache for JWKS (JSON Web Key Set)
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

// ---------------- Helpers ----------------

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function getRouteType(pathname: string): "public" | "admin" | "protected" | "other" {
  if (matchesRoute(pathname, ADMIN_ROUTES)) return "admin";
  if (matchesRoute(pathname, PROTECTED_ROUTES)) return "protected";
  if (matchesRoute(pathname, PUBLIC_ROUTES)) return "public";
  return "other";
}

async function verifyFirebaseToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });
    
    return payload;
  } catch (error) {
    console.error("Token verification error:", error);
    throw error;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const routeType = getRouteType(pathname);

  // If a public route is accessed, allow it without any checks.
  if (routeType === "public") {
    return NextResponse.next();
  }

  // Handle protected and admin routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decodedToken = await verifyFirebaseToken(token);
    const isAdmin = decodedToken.email === "admin@yopmail.com";

    // If a user is not an admin but tries to access an admin route, redirect them.
    if (routeType === "admin" && !isAdmin) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    
    if (routeType === "protected" && !isAdmin) {
      return NextResponse.next();
    }

    // If an admin user tries to access the dashboard, redirect them to the admin panel.
    if (pathname.startsWith("/dashboard") && isAdmin) {
      return NextResponse.redirect(new URL("/adminPanel", request.url));
    }

    // Allow the request to proceed if no redirect is needed.
    return NextResponse.next();
  } catch (error) {
    // If the token is invalid or expired, redirect to login page and clear the cookie.
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};