// "use client";

// import { ArrowLeft, ArrowRight } from "lucide-react";
// import { Test } from "./type";
// import { QuestionNavigator } from "./QuestionNavigator";
// import { TestTimer } from "./common/Timer";
// import { db } from "@/lib/Firebase";
// import { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";

// type Question = {
//   id: number;
//   question: string;
//   options: string[];
//   difficulty?: string;
// };

// interface TestViewProps {
//   test: Test;
//   timeRemaining: number;
//   onAnswerSelect: (questionId: number, answerIndex: number) => void;
//   onPreviousQuestion: () => void;
//   onNextQuestion: () => void;
//   onSubmitTest: () => void;
//   answers: Record<number, number>;
//   currentQuestionIndex: number;
//   setCurrentQuestionIndex: (index: number) => void;
// }

// export const TestView = ({
//   test,
//   timeRemaining,
//   onAnswerSelect,
//   onPreviousQuestion,
//   onNextQuestion,
//   onSubmitTest,
//   answers,
//   currentQuestionIndex,
//   setCurrentQuestionIndex,
// }: TestViewProps) => {
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const currentQuestion = questions[currentQuestionIndex];
//   const answeredCount = Object.keys(answers).length;
//   const progress = (answeredCount / questions.length) * 100;

//   // function shuffleArray(array: any[]) {
//   //   const arr = [...array];
//   //   for (let i = arr.length - 1; i > 0; i--) {
//   //     const j = Math.floor(Math.random() * (i + 1));
//   //     [arr[i], arr[j]] = [arr[j], arr[i]];
//   //   }
//   //   return arr;
//   // }

//   function shuffleArray(array: any[]) {
//     const arr = [...array];
//     for (let i = arr.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [arr[i], arr[j]] = [arr[j], arr[i]];
//     }
//     return arr;
//   }

//   const fetchQuestion = async () => {
//     if (!test?.id) return;

//     try {
//       const docRef = doc(db, "tests", test.id);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         const originalQuestions = data.questions || [];
//         const shuffledQuestions = shuffleArray(originalQuestions);
//         setQuestions(shuffledQuestions);
//       } else {
//         console.warn("No such test document!");
//       }
//     } catch (error) {
//       console.error("Failed to fetch test questions:", error);
//     }
//   };

//   useEffect(() => {
//     fetchQuestion();
//   }, []);

//   return (
//     <div className="space-y-6 px-4 sm:px-6 md:px-10">
//       {/* Header */}
//       <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 space-y-4">
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-white">
//             <TestTimer timeRemaining={timeRemaining} />
//             <div>
//               <span className="text-sm text-blue-200">Progress: </span>
//               <span className="font-semibold">
//                 {answeredCount} of {questions.length}
//               </span>
//             </div>
//             <div>
//               <span className="text-sm text-blue-200">Answered: </span>
//               <span className="font-semibold text-green-300">
//                 {answeredCount}/{questions.length}
//               </span>
//             </div>
//           </div>
//         </div>
//         <div className="w-full bg-white/20 rounded-full h-3">
//           <div
//             className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>
//       <QuestionNavigator
//         questions={questions}
//         currentQuestionIndex={currentQuestionIndex}
//         answers={answers}
//         onQuestionSelect={setCurrentQuestionIndex}
//       />

//       {/* Question Section */}
//       {currentQuestion && (
//         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 space-y-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
//             <h3 className="text-xl sm:text-2xl font-semibold text-white flex-1">
//               Question {currentQuestionIndex + 1}: {currentQuestion.question}
//             </h3>
//             <span className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-sm">
//               {currentQuestion.difficulty || "Medium"}
//             </span>
//           </div>

//           {/* Options */}
//           <div className="space-y-3">
//             {currentQuestion.options.map((option, index) => (
//               <label
//                 key={index}
//                 className={`block p-3 sm:p-4 rounded-xl border transition-all duration-200 text-sm sm:text-base cursor-pointer ${
//                   answers[currentQuestion.id] === index
//                     ? "bg-blue-600/30 border-blue-400 text-white shadow-lg scale-[1.01]"
//                     : "bg-white/5 border-white/20 text-blue-100 hover:bg-white/10 hover:border-white/30"
//                 }`}
//               >
//                 {" "}
//                 {/* <div className="flex items-center">
//                   <input
//                     type="radio"
//                     name={`question-${currentQuestion.id}`}
//                     value={index}
//                     checked={answers[currentQuestion.id] === index}
//                     onChange={() => onAnswerSelect(currentQuestion.id, index)}
//                     className="sr-only"
//                   />
//                   <div
//                     className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
//                       answers[currentQuestion.id] === index
//                         ? "border-blue-400 bg-blue-600"
//                         : "border-white/40"
//                     }`}
//                   >
//                     {answers[currentQuestion.id] === index && (
//                       <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white"></div>
//                     )}
//                   </div>
//                   <span>{option}</span>
//                 </div> */}
//                 <div className="flex items-start">
//                   <input
//                     type="radio"
//                     name={`question-${currentQuestion.id}`}
//                     value={index}
//                     checked={answers[currentQuestion.id] === index}
//                     onChange={() => onAnswerSelect(currentQuestion.id, index)}
//                     className="sr-only"
//                   />
//                   <div
//                     className={`flex-shrink-0 w-6 h-6 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center mr-4 mt-0.5 transition-all duration-200 ${
//                       answers[currentQuestion.id] === index
//                         ? "border-blue-400 bg-blue-600 shadow-lg"
//                         : "border-white/60"
//                     }`}
//                   >
//                     {answers[currentQuestion.id] === index && (
//                       <div className="w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full bg-white"></div>
//                     )}
//                   </div>
//                   <span className="text-base sm:text-base leading-relaxed flex-1 select-none">
//                     {option}
//                   </span>
//                 </div>
//               </label>
//             ))}
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-4 sm:space-y-0 sm:gap-4">
//             <button
//               onClick={onPreviousQuestion}
//               disabled={currentQuestionIndex === 0}
//               className="px-5 cursor-pointer py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Previous
//             </button>

//             <div className="text-center text-sm text-blue-200">
//               <div>
//                 {answeredCount} of {questions.length} answered
//               </div>
//               {answeredCount < questions.length && (
//                 <div className="text-yellow-300 text-xs">
//                   {questions.length - answeredCount} questions remaining
//                 </div>
//               )}
//             </div>

//             {currentQuestionIndex === questions.length - 1 ? (
//               <button
//                 onClick={onSubmitTest}
//                 className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center ${
//                   answeredCount === questions.length
//                     ? "bg-green-600 hover:bg-green-700"
//                     : "bg-orange-600 hover:bg-orange-700"
//                 } text-white`}
//               >
//                 {answeredCount === questions.length
//                   ? "Submit Test"
//                   : "Submit Anyway"}
//                 <ArrowRight className="w-4 h-4 ml-2" />
//               </button>
//             ) : (
//               <button
//                 onClick={onNextQuestion}
//                 disabled={answers[currentQuestion?.id] === undefined}
//                 className={`px-6 py-3 cursor-pointer rounded-lg font-medium flex items-center justify-center ${
//                   answers[currentQuestion?.id] !== undefined
//                     ? "bg-blue-600 text-white hover:bg-blue-700"
//                     : "bg-gray-600 text-white opacity-50 cursor-not-allowed"
//                 }`}
//               >
//                 Next
//                 <ArrowRight className="w-4 h-4 ml-2" />
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Question Navigator */}
//       {/* <QuestionNavigator
//         questions={questions}
//         currentQuestionIndex={currentQuestionIndex}
//         answers={answers}
//         onQuestionSelect={setCurrentQuestionIndex}
//       /> */}
//     </div>
//   );
// };


"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
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
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onSubmitTest: () => void;
  answers: Record<number, number>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
}

export const TestView = ({
  test,
  timeRemaining,
  onAnswerSelect,
  onPreviousQuestion,
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
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // Shuffle array function
  function shuffleArray(array: any[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Fetch questions from Firebase
  const fetchQuestions = async () => {
    if (!test?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const docRef = doc(db, "tests", test.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const originalQuestions = data.questions || [];

        if (originalQuestions.length === 0) {
          console.warn("No questions found in test document");
          setQuestions([]);
          setIsLoading(false);
          return;
        }

        // Shuffle all questions and select only 50
        const shuffled = shuffleArray(originalQuestions);
        const selected50Questions = shuffled.slice(0, 50);
        
        console.log(`Loaded ${selected50Questions.length} questions out of ${originalQuestions.length} total questions`);
        setQuestions(selected50Questions);
      } else {
        console.warn("No such test document!");
        setQuestions([]);
      }
    } catch (error) {
      console.error("Failed to fetch test questions:", error);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [test?.id]);

  // Handle navigation to specific question
  const handleQuestionSelect = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6 px-4 sm:px-6 md:px-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="text-center text-white/70">Loading test questions...</div>
        </div>
      </div>
    );
  }

  // Show error state if no questions
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
      {/* Header with progress and timer */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 space-y-4">
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
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Navigator */}
      <QuestionNavigator
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        onQuestionSelect={handleQuestionSelect}
      />

      {/* Current Question Display */}
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

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`block p-3 sm:p-4 rounded-xl border transition-all duration-200 text-sm sm:text-base cursor-pointer ${
                  answers[currentQuestion.id] === index
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
                    onChange={() =>
                      onAnswerSelect(currentQuestion.id, index)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`flex-shrink-0 w-6 h-6 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center mr-4 mt-0.5 transition-all duration-200 ${
                      answers[currentQuestion.id] === index
                        ? "border-blue-400 bg-blue-600 shadow-lg"
                        : "border-white/60"
                    }`}
                  >
                    {answers[currentQuestion.id] === index && (
                      <div className="w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-base sm:text-base leading-relaxed flex-1 select-none">
                    {option}
                  </span>
                </div>
              </label>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-4 sm:space-y-0 sm:gap-4">
            <button
              onClick={onPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-5 cursor-pointer py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <div className="text-center text-sm text-blue-200">
              <div>
                {answeredCount} of {questions.length} answered
              </div>
              {answeredCount < questions.length && (
                <div className="text-yellow-300 text-xs">
                  {questions.length - answeredCount} questions remaining
                </div>
              )}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={onSubmitTest}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 ${
                  answeredCount === questions.length
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-600 hover:bg-orange-700"
                } text-white`}
              >
                {answeredCount === questions.length
                  ? "Submit Test"
                  : "Submit Anyway"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={onNextQuestion}
                disabled={answers[currentQuestion?.id] === undefined}
                className={`px-6 py-3 cursor-pointer rounded-lg font-medium flex items-center justify-center transition-all duration-200 ${
                  answers[currentQuestion?.id] !== undefined
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-600 text-white opacity-50 cursor-not-allowed"
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


