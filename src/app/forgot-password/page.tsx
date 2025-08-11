"use client";
import { useState } from "react";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      alert("Failed to send reset email. Please check the email address.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setIsSubmitted(false);
    setIsLoading(false);
  };

  const goBack = () => {
    resetForm();
  };

  const handleback = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-purple-800/40 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-purple-500/20">
        {!isSubmitted ? (
          <>
            <div className="flex items-center space-x-3 mb-6">
              <button
                onClick={goBack}
                className="text-purple-300 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-white">Reset Password</h1>
            </div>

            <p className="text-purple-200 mb-6 leading-relaxed">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <div className="space-y-6">
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-purple-700/30 border border-purple-500/30 rounded-xl py-4 pl-12 pr-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-purple-700 disabled:to-blue-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handleback}
                className="text-purple-300 hover:text-white transition-colors duration-200"
              >
                Back to Sign In
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>

              <h1 className="text-2xl font-bold text-white mb-4">
                Check Your Email
              </h1>

              <p className="text-purple-200 mb-6 leading-relaxed">
                We've sent a password reset link to{" "}
                <span className="text-white font-medium">{email}</span>
              </p>

              <p className="text-sm text-purple-300 mb-8">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-purple-700/50 hover:bg-purple-600/50 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  Try Another Email
                </button>

                <button
                  onClick={goBack}
                  className="w-full text-purple-300 hover:text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
