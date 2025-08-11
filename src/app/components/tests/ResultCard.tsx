import { ArrowRight } from "lucide-react";
import { Test, TestResult } from "./type";

interface ResultCardProps {
  test: Test;
  result: TestResult;
  onClick: () => void;
}

export const ResultCard = ({ test, result, onClick }: ResultCardProps) => {
  // const percentage = Math.round((result.score / test.questions) * 100);
  const percentage = Math.round((result.score / test.questions.length) * 100);

  // ✅ Add debugging to check data consistency
  console.log("ResultCard Debug:", {
    testTitle: test.title,
    testId: test.id,
    resultTestId: result.testId,
    score: result.score,
    totalQuestions: test.questions,
    percentage: percentage,
    result: result,
  });

  return (
    <div
      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer flex justify-between items-center"
      onClick={onClick}
    >
      <div>
        <h3 className="text-lg font-semibold text-white">{test.title}</h3>
        <p className="text-blue-200 text-sm">
          Completed on {result.dateCompleted}
        </p>
        <p className="text-green-300 text-sm mt-1">
          Score: {result.score}/{test.questions.length} ({percentage}%)
        </p>
      </div>
      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
        View Details
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
};
