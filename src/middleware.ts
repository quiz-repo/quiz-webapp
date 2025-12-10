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

const ADMIN_ROUTES = ["/admin-panel"]; // ✅ correct lowercase route
const PROTECTED_ROUTES = ["/dashboard"];

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

// ---------------- Helpers ----------------
function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function getRouteType(pathname: string) {
  if (matchesRoute(pathname, PUBLIC_ROUTES)) return "public";
  if (matchesRoute(pathname, ADMIN_ROUTES)) return "admin";
  if (matchesRoute(pathname, PROTECTED_ROUTES)) return "protected";
  return "other";
}

async function verifyFirebaseToken(token: string) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
    audience: FIREBASE_PROJECT_ID,
  });
  return payload;
}

// ---------------- Middleware ----------------
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow OPTIONS (CORS)
  if (request.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Max-Age", "86400");
    return res;
  }

  const token = request.cookies.get("token")?.value;
  const routeType = getRouteType(pathname);

  // Public routes always allowed
  if (routeType === "public") return NextResponse.next();

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decodedToken = await verifyFirebaseToken(token);
    const isAdmin = decodedToken.email === process.env.ADMIN_EMAIL;

    if (routeType === "admin" && !isAdmin) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    if (pathname === "/admin-login" && isAdmin) {
      return NextResponse.redirect(new URL("/admin-panel", request.url));
    }
    if (routeType === "protected" && isAdmin) {
      return NextResponse.redirect(new URL("/admin-panel", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("token");
    return res;
  }
}

// ---------------- Config ----------------
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};




// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify, createRemoteJWKSet } from "jose";

// const PUBLIC_ROUTES = [
//   "/", "/home", "/register", "/login",
//   "/forgot-password", "/admin-login"
// ];

// const ADMIN_ROUTES = ["/adminPanel"];
// const PROTECTED_ROUTES = ["/dashboard"];

// const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;

// // JWKS CACHE
// const JWKS = createRemoteJWKSet(
//   new URL(
//     "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
//   )
// );

// function matchesRoute(pathname: string, routes: string[]) {
//   return routes.some((route) => pathname === route || pathname.startsWith(route + "/"));
// }

// function getRouteType(pathname: string) {
//   if (matchesRoute(pathname, PUBLIC_ROUTES)) return "public";
//   if (matchesRoute(pathname, ADMIN_ROUTES)) return "admin";
//   if (matchesRoute(pathname, PROTECTED_ROUTES)) return "protected";
//   return "other";
// }

// async function verifyFirebaseToken(token: string) {
//   const { payload } = await jwtVerify(token, JWKS, {
//     issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
//     audience: FIREBASE_PROJECT_ID,
//   });
//   return payload;
// }

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const token = request.cookies.get("token")?.value;
//   const routeType = getRouteType(pathname);

//   // ---------------- PUBLIC ROUTES ----------------
//   if (routeType === "public") {
//     return NextResponse.next();
//   }

//   // ---------------- NO TOKEN → LOGIN ----------------
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   try {
//     const decodedToken = await verifyFirebaseToken(token);

//     // FIXED ADMIN EMAIL CHECK
//     const isAdmin = decodedToken.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

//     // ---------------- BLOCK USERS FROM ADMIN ROUTES ----------------
//     if (routeType === "admin" && !isAdmin) {
//       return NextResponse.redirect(new URL("/home", request.url));
//     }

//     // ---------------- BLOCK ADMINS FROM USER DASHBOARD ----------------
//     if (pathname.startsWith("/dashboard") && isAdmin) {
//       return NextResponse.redirect(new URL("/adminPanel", request.url));
//     }

//     // ---------------- NO MANUAL BACK ----------------
//     // If logged-in user tries to return to /login or /register
//     if (["/login", "/register", "/admin-login"].includes(pathname)) {
//       return NextResponse.redirect(new URL(isAdmin ? "/adminPanel" : "/dashboard", request.url));
//     }

//     return NextResponse.next();
//   } catch (err) {
//     const response = NextResponse.redirect(new URL("/login", request.url));
//     response.cookies.delete("token");
//     return response;
//   }
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

