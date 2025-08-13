

import { BarChart2, Award } from "lucide-react";
import { Test, TestResult } from "./type";

interface ResultsViewProps {
  test: Test;
  result: TestResult;
  onEndTest: () => void;
  onLogout: () => void;
}

export const ResultsView = ({
  test,
  result,
  onEndTest,
  onLogout,
}: ResultsViewProps) => {
  const totalQuestions = result.totalQuestions || test.questions.length;
  const percentage = Math.round((result.score / totalQuestions) * 100);

  let performance = "";
  let performanceColor = "";
  console.log(result);

  if (percentage >= 80) {
    performance = "Excellent!";
    performanceColor = "text-green-400";
  } else if (percentage >= 60) {
    performance = "Good Job!";
    performanceColor = "text-blue-400";
  } else if (percentage >= 40) {
    performance = "Not Bad";
    performanceColor = "text-yellow-400";
  } else {
    performance = "Keep Practicing";
    performanceColor = "text-red-400";
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{test.title}</h2>
        <p className="text-blue-200">Completed on {result.dateCompleted}</p>
      </div>

      <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl p-6 mb-8 border border-white/20">
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 mb-6">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-white/20"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className={`${performanceColor} transition-all duration-1000`}
                strokeWidth="8"
                strokeDasharray={`${percentage * 2.51} 251`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-white">
                {percentage}%
              </span>
              <span className="text-sm text-blue-200">Score</span>
            </div>
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${performanceColor}`}>
            {performance}
          </h3>
          <p className="text-white">
            You scored {result.score} out of {totalQuestions}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex items-center">
            <BarChart2 className="w-8 h-8 text-blue-400 mr-4" />
            <div>
              <p className="text-blue-200 text-sm">Correct Answers</p>
              <p className="text-2xl font-bold text-white">{result.score}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-purple-400 mr-4" />
            <div>
              <p className="text-blue-200 text-sm">Time Taken</p>
              <p className="text-2xl font-bold text-white">
                {result.timeTaken}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onEndTest}
          className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Back to Dashboard
        </button>
        <button
          onClick={onLogout}
          className="px-6 py-3 cursor-pointer bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-600/40 transition-colors font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};