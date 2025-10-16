"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "@/lib/Firebase";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { Select } from "antd";
// import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    college: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCollegeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      college: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.college ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    if (!validateForm()) {
      setIsCreating(false);
      return;
    }

    try {
      setError("");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      const fullName = `${formData.firstName} ${formData.lastName}`;

      await updateProfile(user, {
        displayName: fullName,
      });

      const idToken = await user.getIdToken();
      Cookies.set("token", idToken, { expires: 1 });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: fullName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        college: formData.college,
        createdAt: new Date().toISOString(),
        provider: "email",
      });

      toast.success("Registration successful!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Registration error:", error);

      let errorMessage = "Failed to create account. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setIsGoogleLoading(true);
    try {
      let selectedProvider;

      if (provider === "google") {
        selectedProvider = new GoogleAuthProvider();
      } else if (provider === "github") {
        selectedProvider = new GithubAuthProvider();
      } else {
        throw new Error("Unsupported provider");
      }

      const result = await signInWithPopup(auth, selectedProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      Cookies.set("token", idToken, { expires: 1 });
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
          provider,
        });
      }

      toast.success(`Registration with ${provider} successful!`);
      router.push("/dashboard");
    } catch (error: any) {
      console.error(`Error during ${provider} registration:`, error);
      toast.error(`Failed to register with ${provider}.`);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
          <p className="mt-1 text-sm text-blue-200">
            Join us and start your journey today
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 mb-4">
              <p className="text-red-200 text-xs">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-xs font-medium text-white mb-1"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-xs font-medium text-white mb-1"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-white mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="john@example.com"
                  required
                />
              </div>
              {/* <PhoneInput
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  // onChange={handleChange}
                  onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  placeholder="Enter your mobile number"
                  required
                /> */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-white mb-1"
                >
                  Phone Number
                </label>
                <PhoneInput
                //  id="phone"
                  enableSearch={true}
                  placeholder="Search"
                  disableSearchIcon
                  searchClass="new-search"
                  searchStyle={{
                    height: "100%",
                    padding: 0,
                    border: "none",
                    margin: "0",
                  }}
                  country={"us"}
                  // value={phone}
                  // onChange={(phone) => setPhone(phone || "")}
                  dropdownStyle={{
                    // top: "23px",
                    bottom: "100%",
                    position: "absolute",
                    zIndex: 9999, // Ensure it stays above other elements
                  }}
                  inputStyle={{
                    height: "44px",
                    width: "100%",
                    paddingLeft: "48px", // Adjust for flag and code inside input
                  }}
                  containerStyle={{ position: "relative" }}
                  buttonStyle={{
                    position: "absolute",
                    left: "10px", // Align flag and code inside input box
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    padding: "0",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="college"
                className="block text-xs font-medium text-white mb-1"
              >
                College Name
              </label>
              <Select
                // className="w-full"
                className="my-white-select"
                placeholder="Select your college"
                value={formData.college || undefined}
                onChange={handleCollegeChange}
                size="middle"
                dropdownStyle={{
                  background: "#653597",
                  // color: "white",
                  borderRadius: "8px",
                }}
                style={{
                  width: "100%",
                }}
                options={[
                  { value: "IIT Delhi", label: "IIT Delhi" },
                  { value: "IIT Bombay", label: "IIT Bombay" },
                  { value: "NIT Trichy", label: "NIT Trichy" },
                  { value: "BITS Pilani", label: "BITS Pilani" },
                  { value: "Other", label: "Other" },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-white mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 text-sm"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium text-white mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 text-sm"
                    placeholder="Confirm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isCreating ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="relative my-4">
            <div className="flex items-center justify-center w-full">
              <div className="flex-grow border-t border-white/20" />
              <span className="mx-3 text-xs text-gray-400">
                Or continue with
              </span>
              <div className="flex-grow border-t border-white/20" />
            </div>
          </div>

          <button
            onClick={() => handleSocialLogin("google")}
            disabled={loading}
            className="w-full cursor-pointer inline-flex justify-center py-2 px-4 border border-white/30 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-white hover:bg-white/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            ) : (
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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

          <p className="mt-4 text-center text-xs text-blue-200">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-300 hover:text-blue-200 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
