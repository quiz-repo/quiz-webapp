import { BookOpen, CheckCircle, Clock } from "lucide-react";
import { Test } from "./type";

interface InstructionsViewProps {
  test: Test;
  onBack: () => void;
  onStartTest: () => void;
}


export const InstructionsView = ({ test, onStartTest  }: InstructionsViewProps) => (

  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 max-h-screen overflow-hidden">

 
    <div className="text-center mb-4">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
        {test.title}
      </h2>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-blue-200 text-xs sm:text-sm">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {test.duration || 30} mins
        </div>
        <div className="flex items-center">
          <BookOpen className="w-4 h-4 mr-1" />
         {test.questions?.length || 50} questions
        </div>
        <div className="flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" />
          {test.difficulty}
        </div>
      </div>
    </div>

    {/* Instructions */}
    <div className="mb-4">
      <h3 className="text-base font-semibold text-white mb-2">Instructions:</h3>
      <ul className="space-y-2 text-blue-200 text-xs sm:text-sm">
        {test.instructions?.map((instruction, index) => (
          <li key={index} className="flex items-start">
            <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
              {index + 1}
            </span>
            {instruction}
          </li>
        ))}
      </ul>
    </div>

    {/* Notes */}
    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
      <h4 className="text-yellow-300 font-semibold mb-1 text-sm">Important Notes:</h4>
      <ul className="text-yellow-200 space-y-1 text-xs">
        <li>• Timer starts after clicking "Begin Test"</li>
        <li>• Progress auto-saves</li>
        <li>• You can modify answers before submission</li>
        <li>• Ensure stable internet</li>
      </ul>
    </div>

    {/* Start Button */}
    <div className="text-center">
      <button
        onClick={onStartTest}
        className="cursor-pointer w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base"
      >
        Begin Test
      </button>
    </div>

  </div>
);
