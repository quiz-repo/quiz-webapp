// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import jwt from "jsonwebtoken";

// It's a good practice to initialize the Firebase Admin SDK once.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

// ---------------- Constants ----------------
const PUBLIC_ROUTES = ["/", "/home", "/register", "/login", "/forgot-password"];
const ADMIN_ROUTES = ["/adminPanel"];
const PROTECTED_ROUTES = ["/dashboard"];

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
    const decodedToken = await getAuth().verifyIdToken(token);
    const isAdmin = decodedToken.email === "admin@yopmail.com";

    // If a user is not an admin but tries to access an admin route, redirect them.
    if (routeType === "admin" && !isAdmin) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    
    // If a non-admin user tries to access a protected route, allow it.
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

// You will also need to update the .env.local file to include the JWT_SECRET
// used in the middleware.

// .env.local
// NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDpnBusw0FWGY0qqQd-rtuljkC_2XlEH10
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=newproject-f0d20.firebaseapp.com
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=newproject-f0d20
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=newproject-f0d20.appspot.com
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=863958675589
// NEXT_PUBLIC_FIREBASE_APP_ID=1:863958675589:web:4f6f20e0ea62c8003c39ec
// JWT_SECRET=your_super_secret_jwt_key