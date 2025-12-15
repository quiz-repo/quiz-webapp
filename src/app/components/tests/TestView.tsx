
"use client";

import { ArrowRight } from "lucide-react";
import { Test } from "./type";
import { QuestionNavigator } from "./QuestionNavigator";
import { TestTimer } from "./common/Timer";
import { db } from "@/lib/Firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";


type Question = {
  id: number;
  question: string;
  options: string[];
  difficulty?: string;
};

interface TestViewProps {
  test: Test;
  timeRemaining: number;
  onAnswerSelect: (questionId: number, answerIndex: number) => void;
  onPreviousQuestion: () => void; // Included for completeness, though not used in the UI buttons provided
  onNextQuestion: () => void;
  onSubmitTest: () => void;
  answers: Record<number, number>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
}
// ------------------------------------

export const TestView = ({
  test,
  timeRemaining,
  onAnswerSelect,
  onNextQuestion,
  onSubmitTest,
  answers,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}: TestViewProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progress =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;


  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }


  const fetchQuestions = async () => {
    if (!test?.id) {
      console.warn(" No test ID provided. Skipping fetch.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("📘 Fetching test data for ID:", test.id);

      const docRef = doc(db, "tests", test.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.warn("No such test document found in Firestore!");
        setQuestions([]);
        return;
      }

      const data = docSnap.data();
      console.log("Firestore test data fetched:", data);


      let originalQuestions =
        data.questions ||
        data.questionList ||
        data.testQuestions ||
        data.data?.questions || 
        [];

      // Parse if stored as stringified JSON
      if (typeof originalQuestions === "string") {
        try {
          originalQuestions = JSON.parse(originalQuestions);
        } catch (err) {
          console.error(" Failed to parse questions JSON string:", err);
          originalQuestions = [];
        }
      }

      // Validate questions array
      if (!Array.isArray(originalQuestions) || originalQuestions.length === 0) {
        console.warn(
          `⚠️ No valid questions found in Firestore for test ID: ${test.id}`
        );
        setQuestions([]);
        return;
      }

      const shuffled = shuffleArray(originalQuestions);

      const selectedQuestions = shuffled.slice(0, 50);

      console.log(
        `Loaded ${selectedQuestions.length} questions (out of ${originalQuestions.length})`
      );

      setQuestions(selectedQuestions);
    } catch (error) {
      console.error("🔥 Failed to fetch test questions:", error);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSelect = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };


  const onSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test?.id]);


  // useEffect(() => {
  //   if (timeRemaining <= 0 && !isLoading) {
  //     console.log(" Time up! Auto-submitting test.");
  //     onSubmitTest();
  //   }
  // }, [timeRemaining, onSubmitTest, isLoading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const currentAnswer = answers[currentQuestion?.id];

        if (currentAnswer !== undefined && currentAnswer !== null) {
          if (currentQuestionIndex === questions.length - 1) {
            onSubmitTest();
          } else {
            onNextQuestion();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    answers,
    currentQuestion?.id,
    currentQuestionIndex,
    questions.length,
    onNextQuestion,
    onSubmitTest,
  ]);

  if (isLoading) {
    return (
      <div className="space-y-6 px-4 sm:px-6 md:px-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="text-center text-white/70">
            Loading test questions...
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="space-y-6 px-4 sm:px-6 md:px-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="text-center text-red-400">
            No questions available for this test. Please contact support.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-10">

      <div className="flex-shrink:0">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4  border border-white/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-white">
              <TestTimer timeRemaining={timeRemaining} />
              <div>
                <span className="text-sm text-blue-200">Progress: </span>
                <span className="font-semibold">
                  {answeredCount} of {questions.length}
                </span>
              </div>
              <div>
                <span className="text-sm text-blue-200">Answered: </span>
                <span className="font-semibold text-green-300">
                  {answeredCount}/{questions.length}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-linear-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>

      <div className="flex flex-col lg:flex-row gap-6">


        <div className="flex-1">
          {currentQuestion && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                <h3 className="text-xl sm:text-2xl font-semibold text-white flex-1">
                  Question {currentQuestionIndex + 1}: {currentQuestion.question}
                </h3>
                <span className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-sm">
                  {currentQuestion.difficulty || "Medium"}
                </span>
              </div>

              {/* Options/Answer Selection */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const optionLabels = ["A", "B", "C", "D"]; // <-- Added labels
                  return (
                    <label
                      key={index}
                      className={`block p-3 sm:p-4 rounded-xl border transition-all duration-200 text-sm sm:text-base cursor-pointer ${answers[currentQuestion.id] === index
                          ? "bg-blue-600/30 border-blue-400 text-white shadow-lg scale-[1.01]"
                          : "bg-white/5 border-white/20 text-blue-100 hover:bg-white/10 hover:border-white/30"
                        }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={index}
                          checked={answers[currentQuestion.id] === index}
                          onChange={() => onAnswerSelect(currentQuestion.id, index)}
                          className="sr-only"
                        />

                        {/* Radio Circle */}
                        <div
                          className={`flex-shrink:0 w-6 h-6 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center mr-4 mt-0.5 transition-all duration-200 ${answers[currentQuestion.id] === index
                              ? "border-blue-400 bg-blue-600 shadow-lg"
                              : "border-white/60"
                            }`}
                        >
                          {answers[currentQuestion.id] === index && (
                            <div className="w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full bg-white"></div>
                          )}
                        </div>


                        <span className="text-base sm:text-base leading-relaxed flex-1 select-none flex gap-3">
                          <span className="font-bold">{optionLabels[index]}.</span>
                          {option}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>


              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:gap-6 p-3 bg-linear-to-r from-purple-900/30 to-purple-800/30 backdrop-blur-sm rounded-xl border border-purple-500/20">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/30">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span className="text-blue-200 font-medium">
                        {answeredCount} of {questions.length} completed
                      </span>
                    </div>

                    {answeredCount < questions.length && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-400/30">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                        <span className="text-amber-200 font-medium">
                          {questions.length - answeredCount} remaining
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex  items-center justify-between mt-6 w-full sm:w-auto">

                  {currentQuestionIndex < questions.length - 1 && (
                    <button
                      onClick={onSkipQuestion} // Uses the local skip function to just advance the index
                      className="px-6 py-3 rounded-xl cursor-pointer font-semibold bg-linear-to-r from-gray-500 to-gray-600 
                                  text-white shadow-md hover:scale-105 transition-all duration-200 flex items-center gap-2 mr-4"
                    >
                      Skip
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {currentQuestionIndex === questions.length - 1 ? (
                    <button
                      onClick={onSubmitTest}
                      className={`px-8 cursor-pointer py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 transform hover:scale-105 ${answeredCount === questions.length
                          ? "bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25"
                          : "bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/25"
                        }`}
                    >
                      {answeredCount === questions.length ? "Submit Test" : "Submit Anyway"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={onNextQuestion}
                      // disabled={answers[currentQuestion?.id] === undefined}
                      className={` cursor-pointer px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 ${answers[currentQuestion?.id] !== undefined
                          ? "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25 transform hover:scale-105"
                          : "bg-purple-800/50 text-purple-300 cursor-not-allowed opacity-50 border border-purple-600/30"
                        }`}
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

            </div>
          )}
        </div>

        <div className="sticky top-6">
          <QuestionNavigator
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onQuestionSelect={handleQuestionSelect}
          />
        </div>
      </div>
    </div>
  );
};