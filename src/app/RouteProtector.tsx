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

  useEffect(() => {
    if (loading) return;

    const token = Cookies.get("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const publicRoutes = [
      "/",
      "/home",
      "/register",
      "/login",
      "/forgot-password",
      "/admin-panel", 
    ];

    const protectedRoutes = ["/dashboard", "/adminPanel"];

    const isPublic = publicRoutes.includes(pathname);
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
        router.replace("/home");
        return;
      }
      setIsAllowed(true);
      return;
    }
    if (isPublic) {
      if (isAdmin && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.replace("/adminPanel");
      } else {
        router.replace("/dashboard");
      }
      return;
    }
    if (
      pathname.startsWith("/dashboard") &&
      isAdmin &&
      user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      router.replace("/adminPanel");
      return;
    }
    if (
      (pathname.startsWith("/adminPanel") ||
        pathname.startsWith("/admin-panel")) &&
      (!isAdmin || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
    ) {
      router.replace("/dashboard");
      return;
    }
    setIsAllowed(true);
  }, [pathname, user, loading, router]);

  if (loading || !isAllowed) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
