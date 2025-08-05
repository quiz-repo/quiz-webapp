"use client";
import { useAuth } from "@/lib/context/AuthContext";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
        <p className="text-white mt-4 text-lg">Loading...</p>
      </div>
    </div>
  );
}

export function RouteProtector({ children }: any) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = Cookies.get("token");

      if (!token && user) {
        console.log("Token expired — redirecting to login");
        localStorage.setItem("sessionExpired", "true");
        router.replace("/login");
      }
    }, 60000); // every 1 minute

    return () => clearInterval(interval);
  }, [user, router]);

  useEffect(() => {
    if (loading) return;

    const publicRoutes = [
      "/",
      "/homes",
      "/register",
      "/login",
      "/forgot-password",
    ];
    const protectedRoutes = ["/dashboard", "/adminPanel"];

    const isPublicRoute =
      publicRoutes.includes(pathname) ||
      publicRoutes.some(
        (route) => route !== "/" && pathname.startsWith(route + "/")
      );

    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (!user && isProtectedRoute) {
      setIsNavigating(true);
      router.replace("/homes");
      return;
    }

    if (
      user &&
      (pathname === "/login" || pathname === "/register" || pathname === "/")
    ) {
      setIsNavigating(true);
      router.replace("/dashboard");
      return;
    }

    setIsNavigating(false);
  }, [pathname, user, loading, router]);

  if (loading || isNavigating) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}


// "use client";
// import { useAuth } from "@/lib/context/AuthContext";
// import Cookies from "js-cookie";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// function LoadingSpinner() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//       <div className="text-center">
//         <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
//         <p className="text-white mt-4 text-lg">Loading...</p>
//       </div>
//     </div>
//   );
// }

// export function RouteProtector({ children }: { children: React.ReactNode }) {
//   const { user, loading } = useAuth();
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isNavigating, setIsNavigating] = useState(false);

//   // Check for expired token every minute
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const token = Cookies.get("token");

//       if (!token && user) {
//         console.log("Token expired — redirecting to login");
//         localStorage.setItem("sessionExpired", "true");
//         router.replace("/login");
//       }
//     }, 60000);

//     return () => clearInterval(interval);
//   }, [user, router]);

//   // Route protection logic
//   useEffect(() => {
//     if (loading) return;

//     const publicRoutes = [
//       "/",
//       "/homes",
//       "/register",
//       "/login",
//       "/forgot-password",
//     ];

//     const protectedRoutes = ["/dashboard", "/adminPanel"];
//     const isPublicRoute =
//       publicRoutes.includes(pathname) ||
//       publicRoutes.some(
//         (route) => route !== "/" && pathname.startsWith(route + "/")
//       );

//     const isProtectedRoute =
//       protectedRoutes.some(
//         (route) => pathname === route || pathname.startsWith(route + "/")
//       );

//     const isAdmin = localStorage.getItem("isAdmin") === "true";

//     // Redirect unauthenticated users
//     if (!user && isProtectedRoute) {
//       setIsNavigating(true);
//       router.replace("/homes");
//       return;
//     }

//     // Block non-admin users
//     if (pathname.startsWith("/adminPanel") && !isAdmin) {
//       console.log("Non-admin tried to access adminPanel, redirecting...");
//       setIsNavigating(true);
//       router.replace("/homes");
//       return;
//     }

//     // Prevent authenticated users from accessing login/register/home
//     if (
//       user &&
//       ["/login", "/register", "/"].includes(pathname)
//     ) {
//       setIsNavigating(true);
//       router.replace("/dashboard");
//       return;
//     }

//     setIsNavigating(false);
//   }, [pathname, user, loading, router]);

//   // Render loading or children
//   if (loading || isNavigating) {
//     return <LoadingSpinner />;
//   }

//   return <>{children}</>;
// }
