"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../Firebase";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          console.log(currentUser, ":yfuyfffffy");
          // const newObj = {
          //   user_id: currentUser.uid,
          // };
          const token = await currentUser.getIdToken();
          Cookies.set("token", token, { expires: 1 });
          localStorage.setItem("token", token);

          try {
            const res = await fetch("/api/check-admin", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              // We need to pass the ID token so the server can verify it
              body: JSON.stringify({ token }),
            });
            const data = await res.json();
            const isAdmin = data.isAdmin === true;
            localStorage.setItem("isAdmin", isAdmin.toString());
          } catch (error) {
            console.error("Failed to verify admin status:", error);
            // Default to false if check fails, but don't overwrite if it was already true? 
            // Better to be safe:
            localStorage.setItem("isAdmin", "false");
          }
        } else {
          setUser(null);
          Cookies.remove("token");
          localStorage.removeItem("token");
          localStorage.removeItem("isAdmin");
        }
      } catch (err) {
        console.error("Error during auth state check:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    throw new Error("Use login page directly");
  };

  const register = async () => {
    throw new Error("Use register page directly");
  };

  const logout = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);

      setUser(null);
      Cookies.remove("token");
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      localStorage.setItem("sessionExpired", "true");
      sessionStorage.clear();

      toast.success("Logout successful");
      router.replace("/home");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
