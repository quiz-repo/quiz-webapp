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

    const publicRoutes = [
      "/",
      "/homes",
      "/register",
      "/login",
      "/forgot-password",
    ];

    const protectedRoutes = ["/dashboard", "/adminPanel", "admin-panel"];

    const isPublic =
      publicRoutes.includes(pathname) ||
      publicRoutes.some((r) => r !== "/" && pathname.startsWith(r + "/"));

    const isProtected = protectedRoutes.some(
      (r) => pathname === r || pathname.startsWith(r + "/")
    );

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

    if (
      pathname.startsWith("/adminPanel") &&
      (!user || !token || user.email !== "admin@yopmail.com" || !isAdmin)
    ) {
      setIsNavigating(true);
      router.back();
      return;
    }

    if (
      pathname.startsWith("/dashboard") &&
      user?.email === "admin@yopmail.com" &&
      isAdmin
    ) {
      setIsNavigating(true);
      router.replace("/adminPanel");
      return;
    }

    const isGoingToPublic = publicRoutes.includes(pathname);

    if (user && token && isGoingToPublic) {
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
