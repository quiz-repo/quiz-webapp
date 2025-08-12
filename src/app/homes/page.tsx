"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const OnlineTestLandingPage = () => {
  const router = useRouter();
  const handleRegister = () => {
    router.push("register");
  };

  return (
    <div className="font-sans text-white bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 min-h-screen px-4 py-8">
      {/* Hero Section */}
      <section className="bg-white/10 backdrop-blur-sm rounded-xl p-10 text-center shadow-lg border border-white/20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Ace Your Exams with Confidence
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto text-white/80">
          Take practice tests, track your progress, and improve your performance
          with our smart test platform.
        </p>
        <Link href="/register">
          <button className="bg-white cursor-pointer  text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition">
            Get Started
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-2">Timed Mock Tests</h3>
          <p className="text-white/80">
            Simulate real exam conditions with timed tests to improve your speed
            and accuracy.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
          <p className="text-white/80">
            Track your performance, spot weak areas, and watch your progress
            over time.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-2">
            Expert-Curated Questions
          </h3>
          <p className="text-white/80">
            Access questions designed by industry professionals to help you
            prepare better.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Test Your Skills?</h2>
        <p className="mb-6 text-lg text-white/80">
          Join thousands of students using our platform to succeed in their
          exams.
        </p>
        <button
          onClick={handleRegister}
          className="bg-indigo-600 cursor-pointer text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700 transition"
        >
          Start Practicing Now
        </button>
      </section>
    </div>
  );
};

export default OnlineTestLandingPage;
