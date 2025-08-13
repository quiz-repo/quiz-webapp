"use client";

import { useAuth } from "@/lib/context/AuthContext";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
        <p className="text-white mt-4 text-lg">Loading...</p>
      </div>
    </div>
  );
}

export function RouteProtector({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (loading) return;

    const token = Cookies.get("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    // Public routes — /admin-panel is only public for NON-logged-in users
    const publicRoutes = [
      "/",
      "/homes",
      "/register",
      "/login",
      "/forgot-password",
      "/admin-panel", // Admin login page
    ];

    const protectedRoutes = ["/dashboard", "/adminPanel"];

    const isPublic =
      publicRoutes.includes(pathname) ||
      publicRoutes.some((r) => r !== "/" && pathname.startsWith(r + "/"));

    const isProtected = protectedRoutes.some(
      (r) => pathname === r || pathname.startsWith(r + "/")
    );

    // If not logged in → block protected routes
    if (!user || !token) {
      if (isProtected) {
        const sessionExpired = localStorage.getItem("sessionExpired");
        if (sessionExpired) {
          localStorage.removeItem("sessionExpired");
          toast.error("Session expired. Please log in again.");
        }
        setIsNavigating(true);
        router.replace("/homes");
        return;
      }
    }

    // If logged in as admin and trying to access admin login → redirect to adminPanel
    if (
      pathname.startsWith("/admin-panel") &&
      user &&
      token &&
      isAdmin &&
      user.email === "admin@yopmail.com"
    ) {
      setIsNavigating(true);
      router.replace("/adminPanel");
      return;
    }

    // If trying to open /adminPanel without admin access → redirect out
    if (
      pathname.startsWith("/adminPanel") &&
      (!user || !token || !isAdmin || user.email !== "admin@yopmail.com")
    ) {
      setIsNavigating(true);
      router.replace("/homes");
      return;
    }

    // If admin tries to go to dashboard → send to adminPanel
    if (
      pathname.startsWith("/dashboard") &&
      isAdmin &&
      user?.email === "admin@yopmail.com"
    ) {
      setIsNavigating(true);
      router.replace("/adminPanel");
      return;
    }

    // Redirect logged-in users from public pages to correct dashboard
    if (user && token && isPublic) {
      setIsNavigating(true);
      if (isAdmin && user.email === "admin@yopmail.com") {
        router.replace("/adminPanel");
      } else {
        router.replace("/dashboard");
      }
      return;
    }

    setIsNavigating(false);
    setIsAllowed(true);
  }, [pathname, user, loading, router]);

  if (
    !pathname.startsWith("/admin-panel") &&
    !pathname.startsWith("/adminPanel")
  ) {
    if (loading || isNavigating || !isAllowed) {
      return <LoadingSpinner />;
    }
  }

  return <>{children}</>;
}
