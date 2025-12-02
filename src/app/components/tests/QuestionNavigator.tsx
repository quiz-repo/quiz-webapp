"use client";
import React from "react";

interface QuestionNavigatorProps {
  questions: any[];
  currentQuestionIndex: number;
  answers: Record<number, number>;
  onQuestionSelect: (index: number) => void;
}

export const QuestionNavigator = ({
  questions,
  currentQuestionIndex,
  answers,
  onQuestionSelect,
}: QuestionNavigatorProps) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <div className="text-center text-white/60 animate-pulse">
          Loading questions...
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl w-full max-h-[72.5vh] overflow-hidden flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col gap-5 mb-6">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Question Navigator
          </h4>
          <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/30">
            <span className="text-xs font-semibold text-blue-300">
              {answeredCount}/{questions.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 right-0 w-8 h-full bg-white/30 blur-sm"></div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2 border border-white/10">
            <div className="relative">
              <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/50"></div>
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-blue-200 text-[14px]">Current</span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2 border border-white/10">
            <div className="relative">
              <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-lg shadow-green-500/50"></div>
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="text-green-200  text-[14px]">Done</span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2 border border-white/10">
            <div className="w-3 h-3 bg-white/20 border border-white/40 rounded-full"></div>
            <span className="text-gray-300  text-[14px]">Pending</span>
          </div>
        </div>
      </div>

      <div className=" flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div className="grid grid-cols-4 gap-4">
          {questions.map((question, index) => {
            const isCurrent = index === currentQuestionIndex;
            const hasAnswer = answers[question.id] !== undefined;

            return (
              <button
                key={question.id}
                onClick={() => onQuestionSelect(index)}
                className={`cursor-pointer group relative h-16 w-16 rounded-xl text-1xl font-bold 
          transition-all duration-300 transform border-2 flex items-center justify-center
          hover:scale-105 active:scale-95
          ${
            isCurrent
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-xl"
              : ""
          }
          ${
            hasAnswer && !isCurrent
              ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-400 shadow-lg"
              : ""
          }
          ${
            !hasAnswer && !isCurrent
              ? "bg-white/10 text-white/70 border-white/20 hover:bg-white/15"
              : ""
          }
        `}
              >
                <span className="relative z-10">{index + 1}</span>

                {isCurrent && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}

                {hasAnswer && !isCurrent && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
