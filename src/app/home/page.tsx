"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const OnlineTestLandingPage = () => {
  const router = useRouter();
  const handleRegister = () => {
    router.push("register");
  };
  const handleAdminLogin = () => {
    router.push("/admin-login"); 
  };

  return (
    <div className="font-sans text-white bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 min-h-screen px-4 py-8 relative">
      <div className="absolute top-[41px] right-6 z-[9999]">
        <button
          onClick={handleAdminLogin}
          className="bg-white/10 backdrop-blur-sm cursor-pointer text-white font-medium px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg"
        >
          Admin Login
        </button>
      </div>

   
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



//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {questions.map((q:any) => {
//             const userQ = detailedResults.find((d:any) => d.questionId === q.id);
//     
//             return (
//               <div
//                 key={q.id}
//                 className={`p-4 rounded-lg shadow-sm border ${
//                   userQ
//                     ? userQ.isCorrect
//                       ? "bg-emerald-50 border-emerald-300"
//                       : "bg-rose-50 border-rose-300"
//                     : "bg-slate-100 border-slate-300"
//                 }`}
//               >
//                 <p className="font-bold text-sm mb-2 text-slate-700">
//                   {q.question}
//                 </p>

//                 {/* ---------------- USER ATTEMPTED ---------------- */}
//                 {userQ ? (
//                   <div className="text-xs space-y-2">
//                     {/* USER ANSWER */}
//                     <p
//                       className={
//                         userQ.isCorrect ? "text-emerald-700" : "text-rose-700"
//                       }
//                     >
//                       {userQ.isCorrect ? (
//                         <CheckCircle2 className="w-3 h-3 inline mr-1" />
//                       ) : (
//                         <XCircle className="w-3 h-3 inline mr-1" />
//                       )}
//                       <strong>Your Answer:</strong> {q.options[userQ.attempt]}
//                     </p>

//                     {/* CORRECT ANSWER ALWAYS SHOWN */}
//                     {!userQ.isCorrect && (
//                       <p className="text-emerald-700">
//                         <strong>Correct Answer:</strong>{" "}
//                         {q.options[q.correctAnswer]}
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   /* ---------------- NOT ATTEMPTED ---------------- */
//                   <div className="text-xs space-y-2">
//                     {/* <p className="text-rose-700 font-semibold">
//                       ❌ You did not attempt this question
//                     </p> */}

//                     {/* Show all options */}
//                     {q.options?.map((opt:any, idx:any) => (
//                       <p
//                         key={idx}
//                         className={`px-2 py-1 rounded ${
//                           q.options[q.correctAnswer] === opt
//                             ? "bg-emerald-200 text-emerald-800 font-bold"
//                             : "bg-white text-slate-700"
//                         }`}
//                       >
//                         {opt}
//                       </p>
//                     ))}

//                     <p className="text-emerald-700 font-semibold">
//                       Correct Answer: {q.options[q.correctAnswer]}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
// correct my complete div 