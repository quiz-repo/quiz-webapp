import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

// ---------------- Constants ----------------
const PUBLIC_ROUTES = [
  "/", 
  "/home", 
  "/register", 
  "/login", 
  "/forgot-password",
  "/admin-login" 
];

const ADMIN_ROUTES = ["/adminPanel"];
const PROTECTED_ROUTES = ["/dashboard"];

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;

// Cache for JWKS (JSON Web Key Set)
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

// ---------------- Helpers ----------------
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function getRouteType(
  pathname: string
): "public" | "admin" | "protected" | "other" {
  if (matchesRoute(pathname, PUBLIC_ROUTES)) return "public";
  if (matchesRoute(pathname, ADMIN_ROUTES)) return "admin";
  if (matchesRoute(pathname, PROTECTED_ROUTES)) return "protected";
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

// ---------------- Middleware ----------------
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ------------------ FIX: Allow OPTIONS Preflight ------------------
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Max-Age", "86400");

    return response;
  }
  // ------------------------------------------------------------------

  const token = request.cookies.get("token")?.value;
  const routeType = getRouteType(pathname);

  // -------- PUBLIC ROUTES (always allowed) --------
  if (routeType === "public") {
    return NextResponse.next();
  }

  // -------- PROTECTED & ADMIN ROUTES (token required) --------
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decodedToken = await verifyFirebaseToken(token);
    const isAdmin = decodedToken.email ===  process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    // ❗ admin-only routes
    if (routeType === "admin" && !isAdmin) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    // ❗ if admin tries to access /dashboard, redirect to admin panel
    if (pathname.startsWith("/dashboard") && isAdmin) {
      return NextResponse.redirect(new URL("/adminPanel", request.url));
    }

    // All good → allow request
    return NextResponse.next();
  } catch (error) {
    // Token invalid → redirect to login & delete cookie
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

// ---------------- Middleware Config ----------------
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
