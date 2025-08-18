"use clent";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { Test } from "./type";
import ConfirmModal from "../modals/ConfirmModal";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TestCardProps {
  test: Test;
  onClick: () => void;
}

export const TestCard = ({ test, onClick }: TestCardProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/dashboard");
  };
  return (
    <div
      className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">
            {test.title}
          </h3>
          <p className="text-blue-200 mb-3">{test.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-purple-300">
              <Clock className="w-4 h-4 inline mr-1" />
              {30}minutes
            </span>
            <span className="text-green-300">
              <BookOpen className="w-4 h-4 inline mr-1" />
              {
                test.questions
                  .sort(() => 0.5 - Math.random()) 
                  .slice(0, 50).length
              }{" "}
              questions
            </span>
            <span className="text-yellow-300">Level: {test.difficulty}</span>
            <span className="text-blue-300">Subject: {test.subject}</span>
          </div>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center sm:items-start gap-2 mt-4 sm:mt-0">
          <button
            className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            onClick={handleClick}
          >
            Start Test
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
