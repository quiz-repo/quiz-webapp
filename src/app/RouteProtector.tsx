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
    const adminEmail = "admin@yopmail.com";
    const publicRoutes = [
      "/",
      "/homes",
      "/register",
      "/login",
      "/forgot-password",
      "/admin-panel",
    ];
    const protectedRoutes = ["/dashboard", "/adminPanel"]; 

    const isPublic =
      publicRoutes.includes(pathname) ||
      publicRoutes.some((r) => r !== "/" && pathname.startsWith(r + "/"));

    const isProtected = protectedRoutes.some(
      (r) => pathname === r || pathname.startsWith(r + "/")
    );
    if (user?.email === adminEmail && pathname.startsWith("/dashboard")) {
      toast.error("Email not valid for admin login");
      setIsNavigating(true);
      router.replace("/homes");
      return;
    }
    if (pathname.startsWith("/adminPanel")) {
      if (!user || !token || !isAdmin || user.email !== adminEmail) {
        setIsNavigating(true);
        router.replace("/homes"); 
        return;
      }
    }
    if (pathname.startsWith("/admin-panel")) {
      if (user && token && isAdmin && user.email === adminEmail) {
        router.replace("/adminPanel");
        return;
      }
      if (user?.email && user.email !== adminEmail) {
        toast.error("Email not valid for admin login");
        setIsNavigating(true);
        router.replace("/homes");
        return;
      }
    }
    if (isProtected && (!user || !token)) {
      const sessionExpired = localStorage.getItem("sessionExpired");
      if (sessionExpired) {
        localStorage.removeItem("sessionExpired");
        toast.error("Session expired. Please log in again.");
      }
      setIsNavigating(true);
      router.replace("/homes");
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
