// "use client";

// import { useAuth } from "@/lib/context/AuthContext";
// import Cookies from "js-cookie";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState, ReactNode } from "react";
// import { toast } from "react-toastify";

// function LoadingSpinner() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <div className="text-center">
//         <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
//         <p className="text-white mt-4 text-lg">Loading...</p>
//       </div>
//     </div>
//   );
// }

// export function RouteProtector({ children }: { children: ReactNode }) {
//   const { user, loading } = useAuth();
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isAllowed, setIsAllowed] = useState(false);

//   useEffect(() => {
//     if (loading) return;

//     const token = Cookies.get("token");
//     const isAdmin = localStorage.getItem("isAdmin") === "true";

//     const publicRoutes = [
//       "/",
//       "/home",
//       "/register",
//       "/login",
//       "/forgot-password",
//       "/admin-login", 
//     ];

//     const protectedRoutes = ["/dashboard", "/admin-panel"];

//     const isPublic = publicRoutes.includes(pathname);
//     const isProtected = protectedRoutes.some(
//       (r) => pathname === r || pathname.startsWith(r + "/")
//     );
//     if (!user || !token) {
//       if (isProtected) {
//         const sessionExpired = localStorage.getItem("sessionExpired");
//         if (sessionExpired) {
//           localStorage.removeItem("sessionExpired");
//           toast.error("Session expired. Please log in again.");
//         }
//         router.replace("/home");
//         return;
//       }
//       setIsAllowed(true);
//       return;
//     }
//     if (isPublic) {
//       if (isAdmin && user.email === process.env.ADMIN_EMAIL) {
//         router.replace("/admin-panel");
//       } else {
//         router.replace("/dashboard");
//       }
//       return;
//     }
//     if (
//       pathname.startsWith("/dashboard") &&
//       isAdmin &&
//       user.email === process.env.ADMIN_EMAIL
//     ) {
//       router.replace("/admin-panel");
//       return;
//     }
//     if (
//       (pathname.startsWith("/admin-panel") ||
//         pathname.startsWith("/admin-panel")) &&
//       (!isAdmin || user.email !== process.env.ADMIN_EMAIL)
//     ) {
//       router.replace("/dashboard");
//       return;
//     }
//     setIsAllowed(true);
//   }, [pathname, user, loading, router]);

//   if (loading || !isAllowed) {
//     return <LoadingSpinner />;
//   }

//   return <>{children}</>;
// }

"use client";

import { useAuth } from "@/lib/context/AuthContext";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
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
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    const publicRoutes = [
      "/",
      "/home",
      "/register",
      "/login",
      "/forgot-password",
      "/admin-login",
    ];

    const isPublic = publicRoutes.includes(pathname);

    const isUserDashboard = pathname.startsWith("/dashboard");
    const isAdminPanel = pathname.startsWith("/admin-panel");

 
    if (!user || !token) {
      if (isUserDashboard || isAdminPanel) {
        const exp = localStorage.getItem("sessionExpired");
        if (exp) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("sessionExpired");
        }
        router.replace("/home");
        return;
      }

      setIsAllowed(true);
      return;
    }

   
    if (isPublic) {
      if (isAdmin && user.email === adminEmail) {
        router.replace("/admin-panel");
      } else {
        router.replace("/dashboard");
      }
      return;
    }

    if (isAdminPanel && (!isAdmin || user.email !== adminEmail)) {
      router.replace("/dashboard");
      return;
    }

    // -------------------------------------------------------
    // 4️⃣ ADMIN TRYING TO ACCESS USER DASHBOARD → Redirect
    // -------------------------------------------------------
    if (isUserDashboard && isAdmin && user.email === adminEmail) {
      router.replace("/admin-panel");
      return;
    }


    setIsAllowed(true);
  }, [pathname, user, loading]);

  // if (loading || !isAllowed) return <LoadingSpinner />;

  return <>{children}</>;
}

