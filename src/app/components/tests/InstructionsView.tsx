import { BookOpen, CheckCircle, Clock } from "lucide-react";
import { Test } from "./type";

interface InstructionsViewProps {
  test: Test;
  onBack: () => void;
  onStartTest: () => void;
}


export const InstructionsView = ({
  test,
  onStartTest,
}: InstructionsViewProps) => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20">
    {/* Header */}
    <div className="text-center mb-6 sm:mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
        {test.title}
      </h2>

      <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-4 sm:gap-8 text-blue-200 text-sm sm:text-base">
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          {test.duration || 30} minutes
        </div>
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          {test.totalQuestions || 50} questions
        </div>
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {test.difficulty}
        </div>
      </div>
    </div>

    {/* Instructions */}
    <div className="mb-6 sm:mb-8">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
        Instructions:
      </h3>
      <ul className="space-y-3 text-blue-200 text-sm sm:text-base">
        {test.instructions?.map((instruction, index) => (
          <li key={index} className="flex items-start">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm mr-3 mt-1 flex-shrink-0">
              {index + 1}
            </span>
            {instruction}
          </li>
        ))}
      </ul>
    </div>

    {/* Notes */}
    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
      <h4 className="text-yellow-300 font-semibold mb-2">Important Notes:</h4>
      <ul className="text-yellow-200 space-y-1 text-xs sm:text-sm">
        <li>• The timer will start as soon as you click "Begin Test"</li>
        <li>• Your progress will be saved automatically</li>
        <li>• You can review and change answers before final submission</li>
        <li>• Make sure you have a stable internet connection</li>
      </ul>
    </div>

    {/* Start Button */}
    <div className="text-center">
      <button
        onClick={onStartTest}
        className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-green-600 text-white cursor-pointer rounded-lg hover:bg-green-700 transition-colors font-semibold text-base sm:text-lg"
      >
        Begin Test
      </button>
    </div>
  </div>
);