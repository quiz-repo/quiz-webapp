// "use client";
// import { useEffect, useState } from "react";
// import { Eye, EyeOff, Mail, Lock } from "lucide-react";
// import { useRouter } from "next/navigation";
// import {
//   getRedirectResult,
//   GithubAuthProvider,
//   GoogleAuthProvider,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   signInWithRedirect,
// } from "firebase/auth";
// import { auth } from "@/lib/Firebase";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";

// interface FormData {
//   email: string;
//   password: string;
// }

// export default function LoginPage() {
//   const router = useRouter();
//   const [loading, SetLoading] = useState(true);
//   const [formData, setFormData] = useState<FormData>({
//     email: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   // const [isLoading, setIsLoading] = useState(false);
//   const [isUserLoading, setIsUserLoading] = useState(false);
//   const [isAdminLoading, setIsAdminLoading] = useState(false);
//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [rememberMe, setRememberMe] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   //     const validateEmail = (email: string): boolean => {
//   //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   //   return emailRegex.test(email);
//   // };
// // const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();

// //   if (!formData.email || !formData.password) return;

// //   setIsUserLoading(true);

// //   try {
// //     const userCredential = await signInWithEmailAndPassword(
// //       auth,
// //       formData.email,
// //       formData.password
// //     );
// //     const user = userCredential.user;
// //     const idToken = await user.getIdToken();
// //     Cookies.set("token", idToken, { expires: 1 });

// //     // ✅ Admin credentials check
// //     if (
// //       formData.email === "admin@yopmail.com" &&
// //       formData.password === "123456"
// //     ) {
// //       toast.success("Admin login successful");
// //       router.push("/adminPanel");
// //     } else {
// //       toast.success("Login successful");
// //       router.push("/dashboard");
// //     }
// //   } catch (error: any) {
// //     console.error("Login Error:", error);
// //     const backendMessage =
// //       error?.response?.data?.error?.message ||
// //       error?.response?.data?.errors?.[0]?.message ||
// //       error?.message ||
// //       "Login failed.";
// //     toast.error(backendMessage);
// //   } finally {
// //     setIsUserLoading(false);
// //   }
// // };

// //   const handleAdminLogin = () => {
// //     setIsAdminLoading(true);
// //     router.push("/adminPanel");
// //   };

// // Normal Sign In (for users only)
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!formData.email || !formData.password) return;
//   setIsUserLoading(true);

//   // Block admin credentials in user login
//   if (
//     formData.email === "admin@yopmail.com" &&
//     formData.password === "123456"
//   ) {
//     toast.error("Admin must login using the 'Sign in as a Admin' button");
//     setIsUserLoading(false);
//     return;
//   }

//   try {
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       formData.email,
//       formData.password
//     );
//     const user = userCredential.user;
//     const idToken = await user.getIdToken();
//     Cookies.set("token", idToken, { expires: 1 });

//     toast.success("User login successful");
//     router.push("/dashboard");
//   } catch (error: any) {
//     console.error("Login Error:", error);
//     toast.error(error.message || "Login failed");
//   } finally {
//     setIsUserLoading(false);
//   }
// };

// // Admin-only login (validates admin credentials strictly)
// const handleAdminLogin = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!formData.email || !formData.password) return;
//   setIsAdminLoading(true);

//   if (
//     formData.email !== "admin@yopmail.com" ||
//     formData.password !== "123456"
//   ) {
//     toast.error("Only admin can use this login");
//     setIsAdminLoading(false);
//     return;
//   }

//   try {
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       formData.email,
//       formData.password
//     );
//     const user = userCredential.user;
//     const idToken = await user.getIdToken();
//     Cookies.set("token", idToken, { expires: 1 });

//     toast.success("Admin login successful");
//     router.push("/adminPanel");
//   } catch (error: any) {
//     console.error("Admin Login Error:", error);
//     toast.error(error.message || "Admin login failed");
//   } finally {
//     setIsAdminLoading(false);
//   }
// };

//   const handleForgotPassword = () => {
//     router.push("forgot-password");
//   };

//   const handleRegister = () => {
//     window.location.replace("/register");
//   };

//   // const handleSocialLogin = async (provider: "google" | "github") => {
//   //   SetLoading(true);
//   //   try {
//   //     let selectedProvider;

//   //     if (provider === "google") {
//   //       selectedProvider = new GoogleAuthProvider();
//   //     } else if (provider === "github") {
//   //       selectedProvider = new GithubAuthProvider();
//   //     } else {
//   //       throw new Error("Unsupported provider");
//   //     }

//   //     // await signInWithPopup(auth, selectedProvider);
//   //     await signInWithRedirect(auth, selectedProvider);

//   //     message.success(`${provider.toUpperCase()} login successful! `);
//   //     router.push("/dashboard");
//   //   } catch (error) {
//   //     console.error(`Error during ${provider} login:`, error);
//   //     message.error(`Failed to login with ${provider}.`);
//   //   } finally {
//   //     SetLoading(false);
//   //   }
//   // };

//   //  const handleSocialLogin = async (provider: "google" | "github") => {
//   //   SetLoading(true);
//   //   try {
//   //     let selectedProvider;

//   //     if (provider === "google") {
//   //       selectedProvider = new GoogleAuthProvider();
//   //     } else if (provider === "github") {
//   //       selectedProvider = new GithubAuthProvider();
//   //     } else {
//   //       throw new Error("Unsupported provider");
//   //     }

//   //     await signInWithRedirect(auth, selectedProvider); // Safari-safe login
//   //   } catch (error) {
//   //     console.error(`Error during ${provider} login:`, error);
//   //     message.error(`Failed to login with ${provider}.`);
//   //     SetLoading(false);
//   //   }
//   // };

//   //   useEffect(() => {
//   //   getRedirectResult(auth)
//   //     .then((result) => {
//   //       if (result?.user) {
//   //         message.success("Login successful!");
//   //         router.push("/dashboard");
//   //       }
//   //     })
//   //     .catch((error) => {
//   //       console.error("Redirect login failed", error);
//   //       message.error("Login failed.");
//   //     });
//   // }, []);

//   // const handleSocialLogin = async (provider: "google" | "github") => {
//   //   SetLoading(true);
//   //   let selectedProvider;

//   //   if (provider === "google") {
//   //     selectedProvider = new GoogleAuthProvider();
//   //   } else {
//   //     selectedProvider = new GithubAuthProvider();
//   //   }

//   //   const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

//   //   try {
//   //     if (isSafari) {
//   //       await signInWithRedirect(auth, selectedProvider);
//   //     } else {
//   //       await signInWithPopup(auth, selectedProvider);
//   //       toast.success("Login successful!");
//   //       router.push("/dashboard");
//   //     }
//   //   } catch (error:any) {
//   //       console.log("Caught error:awwwww", error);
//   //      toast.error(error.message || "Login failed");
//   //   } finally {
//   //     SetLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   getRedirectResult(auth)
//   //     .then((result) => {
//   //       if (result?.user) {
//   //         message.success("Login successful!");
//   //         router.push("/dashboard");1
//   //       }
//   //     })
//   //     .catch((error) => {
//   //       console.error("Login error:", error);
//   //     })
//   //     .finally(() => {
//   //       SetLoading(false);
//   //     });
//   // }, []);

//   // useEffect(() => {
//   //   getRedirectResult(auth)
//   //     .then((result) => {
//   //       if (result?.user) {
//   //         message.success("Login successful!");
//   //         router.push("/dashboard");
//   //       }
//   //     })
//   //     .catch((error) => {
//   //       console.error("Redirect login failed:", error);
//   //       message.error("Login failed.");
//   //     });
//   // }, []);

//   const handleSocialLogin = async (provider: "google" | "github") => {
//     SetLoading(true);
//     let selectedProvider;

//     if (provider === "google") {
//       selectedProvider = new GoogleAuthProvider();
//     } else {
//       selectedProvider = new GithubAuthProvider();
//     }

//     const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

//     try {
//       if (isSafari) {
//         console.log(isSafari, "ddddddd");
//         // For Safari, redirect will handle success/error on return
//         await signInWithRedirect(auth, selectedProvider);
//         // Code after this won't execute due to redirect
//       } else {
//         const result = await signInWithPopup(auth, selectedProvider);
//         // toast.success(backendMessage);
//         router.push("/dashboard");
//       }
//     } catch (error: any) {
//       console.log("Caught error:", error);
//       toast.error(error.message || "Login failed");
//     } finally {
//       // Only runs for popup flow
//       if (!isSafari) {
//         SetLoading(false);
//       }
//     }
//   };
//   useEffect(() => {
//     const handleRedirectResult = async () => {
//       try {
//         const result = await getRedirectResult(auth);
//         if (result) {
//           // console.log(result,"uhguiuig")
//           // User just completed redirect authentication
//           // toast.success(backendMessage);
//           // toast.success()
//           router.push("/dashboard");
//         }
//       } catch (error: any) {
//         console.log("Redirect error:", error);
//         // toast.error(backendMessage);
//       }
//     };

//     handleRedirectResult();
//   }, []);
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//         <div
//           className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
//           style={{ animationDelay: "2s" }}
//         ></div>
//         <div
//           className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
//           style={{ animationDelay: "4s" }}
//         ></div>
//       </div>

//       <div className="relative z-10 w-full max-w-md">
//         {/* Login Card */}
//         <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl mb-4 transform transition-transform duration-300 hover:rotate-12">
//               <Lock className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
//             <p className="text-gray-300">Sign in to your account</p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email Field */}
//             <div className="relative group">
//               <div
//                 className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur transition-all duration-300 ${
//                   focusedField === "email" ? "opacity-100" : "opacity-0"
//                 }`}
//               ></div>
//               <div className="relative">
//                 <Mail
//                   className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
//                     focusedField === "email"
//                       ? "text-purple-400"
//                       : "text-gray-400"
//                   }`}
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email address"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   onFocus={() => setFocusedField("email")}
//                   onBlur={() => setFocusedField(null)}
//                   className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div className="relative group">
//               <div
//                 className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur transition-all duration-300 ${
//                   focusedField === "password" ? "opacity-100" : "opacity-0"
//                 }`}
//               ></div>
//               <div className="relative">
//                 <Lock
//                   className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
//                     focusedField === "password"
//                       ? "text-purple-400"
//                       : "text-gray-400"
//                   }`}
//                 />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   onFocus={() => setFocusedField("password")}
//                   onBlur={() => setFocusedField(null)}
//                   className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Remember & Forgot */}
//             <div className="flex items-center justify-between text-sm">
//               <label className="flex items-center text-gray-300 cursor-pointer group">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="sr-only"
//                 />
//                 <div className="relative">
//                   <div
//                     className={`w-4 h-4 border rounded transition-all duration-300 ${
//                       rememberMe
//                         ? "bg-gradient-to-r from-purple-500 to-cyan-500 border-purple-400"
//                         : "bg-white/10 border-white/20 group-hover:border-purple-400"
//                     }`}
//                   >
//                     {rememberMe && (
//                       <svg
//                         className="w-3 h-3 text-white absolute top-0.5 left-0.5"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                 </div>
//                 <span className="ml-2 group-hover:text-white transition-colors duration-300">
//                   Remember me
//                 </span>
//               </label>
//               <button
//                 onClick={handleForgotPassword}
//                 type="button"
//                 className=" cursor-pointer text-purple-400 hover:text-purple-300 transition-colors duration-300"
//               >
//                 Forgot password?
//               </button>
//             </div>

//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit}
//               type="button"
//               disabled={isUserLoading}
//               className="w-full relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl"></div>
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative px-6 py-4 text-white font-semibold text-lg rounded-xl transform transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
//                 {isUserLoading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
//                     Signing in...
//                   </div>
//                 ) : (
//                   "Sign In"
//                 )}
//               </div>
//             </button>

//             <button
//               onClick={handleAdminLogin}
//               type="submit"
//               disabled={isAdminLoading}
//               className="w-full relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl"></div>
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative px-6 py-4 text-white font-semibold text-lg rounded-xl transform transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
//                 {isAdminLoading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
//                     Signing in...
//                   </div>
//                 ) : (
//                   "Sign in as a Admin"
//                 )}
//               </div>
//             </button>
//           </form>

//           <div className="relative my-8">
//             <div className="flex items-center justify-center w-full">
//               <div className="flex-grow border-t border-white/20" />
//               <span className="mx-4 text-sm text-gray-400 bg-transparent z-10">
//                 Or continue with
//               </span>
//               <div className="flex-grow border-t border-white/20" />
//             </div>
//           </div>

//           <div className="mt-6">
//             <div className="mt-6">
//               <button
//                 onClick={() => handleSocialLogin("google")}
//                 className="w-full inline-flex justify-center py-3 px-4 border border-white/30 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-white hover:bg-white/20 transition-all"
//               >
//                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                   <path
//                     fill="currentColor"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//                 Continue with Google
//               </button>
//             </div>
//           </div>

//           <div className="text-center mt-8">
//             <p className="text-gray-300">
//               Don't have an account?{" "}
//               <button
//                 onClick={handleRegister}
//                 type="button"
//                 className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
//               >
//                 Sign up
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getRedirectResult,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "@/lib/Firebase";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Normal Sign In (for users only)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsUserLoading(true);

    // Block admin credentials in user login
    if (
      formData.email === "admin@yopmail.com" &&
      formData.password === "123456"
    ) {
      toast.error("Admin must login using the 'Sign in as Admin' button");
      setIsUserLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const expires = rememberMe ? 7 : 1; // 7 days if remember me, else 1 day
    
      Cookies.set("token", idToken, {
        expires, 
        path: "/",
        secure: process.env.NODE_ENV === "production", 
      });

      toast.success("User login successful");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);
      let errorMessage = "Login failed";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later";
      }

      toast.error(errorMessage);
    } finally {
      setIsUserLoading(false);
    }
  };

  // Admin-only login (validates admin credentials strictly)
  // const handleAdminLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.email || !formData.password) {
  //     toast.error("Please fill in all fields");
  //     return;
  //   }

  //   setIsAdminLoading(true);

  //   if (
  //     formData.email !== "admin@yopmail.com" ||
  //     formData.password !== "123456"
  //   ) {
  //     toast.error("Invalid admin credentials");
  //     setIsAdminLoading(false);
  //     return;
  //   }

  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       formData.email,
  //       formData.password
  //     );
  //     const user = userCredential.user;
  //     const idToken = await user.getIdToken();
  //     Cookies.set("token", idToken, { expires: 1 });

  //     toast.success("Admin login successful");
  //     router.push("/adminPanel");
  //   } catch (error: any) {
  //     console.error("Admin Login Error:", error);
  //     toast.error("Admin login failed");
  //   } finally {
  //     setIsAdminLoading(false);
  //   }
  // };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (
      formData.email !== "admin@yopmail.com" ||
      formData.password !== "123456"
    ) {
      toast.error("Invalid admin credentials");
      return;
    }

    try {
      setIsAdminLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      Cookies.set("token", idToken, { expires: 1 });

      toast.success("Admin login successful");

      setTimeout(() => {
        router.push("/adminPanel");
      }, 100); // slight delay to ensure cookie is set
    } catch (error) {
      console.error("Admin Login Error:", error);
      toast.error("Admin login failed");
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setLoading(true);
    let selectedProvider;

    if (provider === "google") {
      selectedProvider = new GoogleAuthProvider();
    } else {
      selectedProvider = new GithubAuthProvider();
    }

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    try {
      if (isSafari) {
        console.log("Using redirect for Safari");
        await signInWithRedirect(auth, selectedProvider);
        // Code after this won't execute due to redirect
      } else {
        const result = await signInWithPopup(auth, selectedProvider);
        const user = result.user;
        const idToken = await user.getIdToken();
        Cookies.set("token", idToken, { expires: 1 });

        toast.success(`${provider} login successful!`);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log("Social login error:", error);
      toast.error(error.message || `${provider} login failed`);
    } finally {
      if (!isSafari) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          const idToken = await user.getIdToken();
          Cookies.set("token", idToken, { expires: 1 });

          toast.success("Login successful!");
          router.push("/dashboard");
        }
      } catch (error: any) {
        console.log("Redirect error:", error);
        toast.error("Login failed");
      }
    };

    handleRedirectResult();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl mb-4 transform transition-transform duration-300 hover:rotate-12">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur transition-all duration-300 ${
                  focusedField === "email" ? "opacity-100" : "opacity-0"
                }`}
              ></div>
              <div className="relative">
                <Mail
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "email"
                      ? "text-purple-400"
                      : "text-gray-400"
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur transition-all duration-300 ${
                  focusedField === "password" ? "opacity-100" : "opacity-0"
                }`}
              ></div>
              <div className="relative">
                <Lock
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "password"
                      ? "text-purple-400"
                      : "text-gray-400"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-300 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className="relative">
                  <div
                    className={`w-4 h-4 border rounded transition-all duration-300 ${
                      rememberMe
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 border-purple-400"
                        : "bg-white/10 border-white/20 group-hover:border-purple-400"
                    }`}
                  >
                    {rememberMe && (
                      <svg
                        className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-2 group-hover:text-white transition-colors duration-300">
                  Remember me
                </span>
              </label>
              <button
                onClick={handleForgotPassword}
                type="button"
                className="cursor-pointer text-purple-400 hover:text-purple-300 transition-colors duration-300"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUserLoading}
              className="w-full cursor-pointer relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative px-6 py-4 text-white font-semibold text-lg rounded-xl transform transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                {isUserLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </div>
            </button>

            <button
              onClick={handleAdminLogin}
              type="button"
              disabled={isAdminLoading}
              className="w-full cursor-pointer relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative px-6 py-4 text-white font-semibold text-lg rounded-xl transform transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                {isAdminLoading ? (
                  <div className="flex cursor-pointer items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in as Admin"
                )}
              </div>
            </button>
          </form>

          <div className="relative my-8">
            <div className="flex items-center justify-center w-full">
              <div className="flex-grow border-t border-white/20" />
              <span className="mx-4 text-sm text-gray-400 bg-transparent z-10">
                Or continue with
              </span>
              <div className="flex-grow border-t border-white/20" />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              className="w-full cursor-pointer inline-flex justify-center py-3 px-4 border border-white/30 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-white hover:bg-white/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continue with Google
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-300">
              Don't have an account?{" "}
              <button
                onClick={handleRegister}
                type="button"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
