
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
      <div className="mt-6 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 backdrop-blur-xl rounded-3xl p-6 border-l border-r border-b border-white/30 shadow-2xl">
        <div className="text-center text-white/70">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 backdrop-blur-xl rounded-3xl p-6 border-l border-r border-b border-white/30 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h4 className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
          Question Navigator
        </h4>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-400/30">
            <div className="relative mr-3">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg"></div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-blue-100 font-semibold">Current</span>
          </div>

          <div className="flex items-center bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-green-400/30">
            <div className="relative mr-3">
              <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg"></div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center">
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
            </div>
            <span className="text-green-100 font-semibold">Answered</span>
          </div>

          <div className="flex items-center bg-gradient-to-r from-gray-500/20 to-gray-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-400/30">
            <div className="w-5 h-5 bg-gradient-to-br from-white/30 to-white/20 border border-white/40 rounded-full mr-3 shadow-lg"></div>
            <span className="text-gray-200 font-semibold">Not Answered</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-blue-400/50 hover:scrollbar-thumb-blue-400/70">
          {questions.map((question, index) => {
            const isCurrent = index === currentQuestionIndex;
            const hasAnswer = answers[question.id] !== undefined;
            const canNavigate = index <= currentQuestionIndex;
            let buttonStyle = "";

            if (isCurrent) {
              buttonStyle =
                "bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-300/50 shadow-lg";
            } else if (hasAnswer) {
              buttonStyle =
                "bg-gradient-to-br from-green-500 to-green-700 text-white border-green-300/50 shadow-lg";
            } else {
              buttonStyle =
                "bg-gradient-to-br from-white/20 to-white/10 text-white/70 border-white/20";
            }

            return (
              <button
                key={question.id}
                disabled={!canNavigate}
                className={`relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-sm sm:text-base font-bold 
                  transition-all duration-300 transform border flex items-center justify-center
                  ${buttonStyle}
                  ${
                    canNavigate
                      ? "cursor-pointer hover:scale-105 active:scale-95 hover:shadow-xl"
                      : "opacity-40 cursor-not-allowed"
                  }`}
              >
                <span className="relative z-10">{index + 1}</span>
                {isCurrent && (
                  <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                )}
                {hasAnswer && !isCurrent && (
                  <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-2.5 h-2.5 text-green-600"
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
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-purple-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-purple-900/20 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};
const Demo = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [questions, setQuestions] = React.useState<any[]>([]);
  React.useEffect(() => {
    const simulateFirebaseData = () => {
      const allQuestions = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        question: `What is the answer to question ${i + 1}?`,
        options: [`Option A for Q${i + 1}`, `Option B for Q${i + 1}`, `Option C for Q${i + 1}`],
        difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)]
      }));
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      const selected50 = shuffled.slice(0, 50);
      
      setTimeout(() => {
        setQuestions(selected50);
      }, 1000); 
    };

    simulateFirebaseData();
  }, []);

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleAnswerQuestion = (answerId: number) => {
    if (questions[currentQuestionIndex]) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestionIndex].id]: answerId,
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {currentQuestion ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-6">
                Question {currentQuestionIndex + 1}: {currentQuestion.question}
              </h2>

              <div className="flex flex-wrap gap-4 mb-6">
                {currentQuestion.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerQuestion(index)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      currentAnswer === index
                        ? "bg-green-500 text-white shadow-lg"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {currentAnswer !== undefined && (
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex >= questions.length - 1}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestionIndex >= questions.length - 1
                    ? "Completed"
                    : "Next Question"}
                </button>
              )}
            </>
          ) : (
            <div className="text-center text-white/70">Loading questions...</div>
          )}
        </div>

        <QuestionNavigator
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          onQuestionSelect={handleQuestionSelect}
        />
        <div className="mt-6 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
          <p className="text-white/80 text-sm">
            <strong>Instructions:</strong> Answer questions to see them turn green. 
            You can navigate back to any previously visited question. 
            Total questions: {questions.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Demo;
