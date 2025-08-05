// "use client";
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import {
//   User,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   signInWithPopup,
//   GoogleAuthProvider,
//   GithubAuthProvider,
// } from "firebase/auth";
// import { auth } from "@/lib/Firebase";
// import { useRouter } from "next/navigation";

// interface AuthContextType {
//   user: User | null;
//   register: (email: string, password: string) => Promise<void>;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   loading: boolean;
//   handleSocialLogin: (provider: "google" | "github") => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// export function useAuth() {
//   return useContext(AuthContext);
// }

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
// const router =useRouter()
//   const login = async (email: string, password: string) => {
//     await signInWithEmailAndPassword(auth, email, password);
//   };

//   const register = async (email: string, password: string) => {
//     await createUserWithEmailAndPassword(auth, email, password);
//   };

//   const handleSocialLogin = async (provider: "google" | "github") => {
//     setLoading(true);
//     try {
//       let selectedProvider;
//       if (provider === "google") {
//         selectedProvider = new GoogleAuthProvider();
//       } else if (provider === "github") {
//         selectedProvider = new GithubAuthProvider();
//       } else {
//         throw new Error("Unsupported provider");
//       }

//       await signInWithPopup(auth, selectedProvider);
//     } catch (error) {
//       console.error("Social login error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     await signOut(auth);
//   };

//   // useEffect(() => {
//   //   const unsubscribe = onAuthStateChanged(auth, (user) => {
//   //     setUser(user);
//   //     setLoading(false);
//   //   });

//   //   return unsubscribe;
//   // }, []);
// //   useEffect(() => {
// //   const unsubscribe = onAuthStateChanged(auth, (user) => {
// //     setUser(user);          // sets Firebase user
// //     setLoading(false);      // important: only false when done
// //   });

// //   return unsubscribe;
// // }, []);

// useEffect(() => {
//   const unsubscribe = auth.onAuthStateChanged((user) => {
//     if (!user) {
//       router.replace("/"); // 👈 send to home if not authenticated
//     }
//   });

//   return () => unsubscribe(); // Clean up on unmount
// }, []);


//   const value = {
//     login,
//     user,
//     register,
//     logout,
//     loading,
//     handleSocialLogin,
//   };

//   return (
//      <AuthContext.Provider value={value}>
//     {!loading && children}
//   </AuthContext.Provider>
//   );
// }

// lib/context/AuthContext.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../Firebase";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setUser(user);
        try {
          const token = await user.getIdToken();
          Cookies.set("token", token, { expires: 1 }); // 1 day expiry
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else {
        // User is signed out
        setUser(null);
        Cookies.remove("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // This will be handled by the login page directly
    throw new Error("Use login page directly");
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    // This will be handled by the register page directly
    throw new Error("Use register page directly");
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      Cookies.remove("token");
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/homes");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}