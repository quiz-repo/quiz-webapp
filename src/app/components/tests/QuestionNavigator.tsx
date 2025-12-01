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

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl relative top-[20px]">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-lg text-cyan-300">Question Navigator</h4>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-blue-200">Current</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-1.5 h-1.5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <span className="text-green-200">Answered</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/20 border border-white/40 rounded-full"></div>
            <span className="text-gray-300">Not Answered</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-blue-500/30">
          {questions.map((question, index) => {
            const isCurrent = index === currentQuestionIndex;
            const hasAnswer = answers[question.id] !== undefined;

            return (
              <button
                key={question.id}
                onClick={() => onQuestionSelect(index)} // ✅ ALWAYS ALLOW NAVIGATION
                className={`relative flex-shrink-0 w-11 h-11 rounded-lg text-sm font-bold 
        transition-all duration-200 transform border flex items-center justify-center
        ${
          isCurrent
            ? "bg-blue-500 text-white border-blue-400 scale-110 shadow-lg shadow-blue-500/50"
            : ""
        }
        ${
          hasAnswer && !isCurrent
            ? "bg-green-500 text-white border-green-400 shadow-md"
            : ""
        }
        ${
          !hasAnswer && !isCurrent
            ? "bg-white/10 text-white/50 border-white/20"
            : ""
        }
        cursor-pointer hover:scale-105 active:scale-95   // ✅ ALWAYS CLICKABLE
      `}
              >
                <span className="relative z-10">{index + 1}</span>

                {isCurrent && (
                  <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}

                {hasAnswer && !isCurrent && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-2 h-2 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
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
