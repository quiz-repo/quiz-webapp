"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Question, Test, TestResult } from "../components/tests/type";
import { ArrowLeft, LogOutIcon } from "lucide-react";
import { DashboardView } from "../components/tests/DashboardView";
import { InstructionsView } from "../components/tests/InstructionsView";
import { TestView } from "../components/tests/TestView";
import { ResultsView } from "../components/tests/ResultsView";
import ConfirmModal from "../components/modals/ConfirmModal";
import { getDocByFirebase, signOut } from "@/lib/Firebase";
import { auth } from "@/lib/Firebase";
import UserModal from "../components/modals/UserModal";
import Cookies from "js-cookie";
type ViewType = "dashboard" | "instructions" | "test" | "results";

export default function TestDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // const [answers, setAnswers] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] =
    useState<boolean>(false);
  const [isNavigationModalVisible, setIsNavigationModalVisible] =
    useState<boolean>(false);
  const [tests, setTests] = useState<Test[]>([]);
  // const [fetchedQuestions, setFetchedQuestions] = useState<any[]>([]);
  const [fetchedQuestions, setFetchedQuestions] = useState<Question[]>([]);

  const [userName, setUserName] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (testStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [testStarted, timeRemaining]);

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || user.email || "User");
    }
  }, []);

  // After fetching questions
  // const fetchQuestion = async (): Promise<void> => {
  //   try {
  //     const data = await getDocByFirebase();
  //     setFetchedQuestions(data);
  //   } catch (error) {
  //     console.error("Failed to fetch tests:", error);
  //   }
  // };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const fetchQuestion = async (): Promise<void> => {
    try {
      const data = await getDocByFirebase();

      const formattedData: Question[] = data.map((item: any) => ({
        id: item.id,
        question: item.question ?? "",
        options: item.options ?? [],
        correctAnswer: item.correctAnswer ?? "",
      }));

      setFetchedQuestions(formattedData);
    } catch (error) {
      console.error("Failed to fetch tests:", error);
    }
  };

  const fetchTests = async (): Promise<void> => {
    try {
      const testData = await getDocByFirebase();
      setTests(testData as Test[]);
    } catch (error) {
      console.error("Failed to fetch tests:", error);
    }
  };

  //   const handleSubmitTest = (): void => {
  //     if (!selectedTest) return;
  //     let score = 0;

  //     selectedTest.questions.forEach((question) => {
  //       const questionId = String(question.id);
  //       const userAnswer = answers[questionId];

  //       console.log(
  //         "Checking:",
  //         questionId,
  //         "UserAnswer:",
  //         userAnswer,
  //         "Correct:",
  //         question.correctAnswer
  //       );

  //       // const isCorrect =
  //       //   typeof userAnswer !== "undefined" &&
  //       //   userAnswer === question.correctAnswer;
  //       const isCorrect =
  //         typeof userAnswer !== "undefined" &&
  //         String(userAnswer) === String(question.correctAnswer);

  //       if (isCorrect) {
  //         score++;
  //       }
  //     });

  //     const timeTakenInSeconds = selectedTest.duration * 60 - timeRemaining;
  //     const minutes = Math.floor(timeTakenInSeconds / 60);
  //     const seconds = timeTakenInSeconds % 60;
  //     const timeTaken = `${minutes.toString().padStart(2, "0")}:${seconds
  //       .toString()
  //       .padStart(2, "0")}`;

  //     // const newResult: TestResult = {
  //     //   score,
  //     //   timeTaken,
  //     //   testId: selectedTest.id,
  //     //   dateCompleted: new Date().toLocaleDateString(),
  //     // };

  //     const newResult: TestResult = {
  //   score,
  //   timeTaken,
  //   testId: selectedTest.id,
  //   dateCompleted: new Date().toLocaleDateString(),
  //   userId:auth.currentUser?.uid || "guest",
  //   userAnswers,
  //   totalQuestions: selectedTest.questions.length,
  //   percentage: Math.round((score / selectedTest.questions.length) * 100),
  // };

  //     console.log("Newresultbeingsaved", newResult);

  //     setTestResults((prev) => [...prev, newResult]);
  //     setCurrentResult(newResult);
  //     setTestStarted(false);
  //     setCurrentView("results");
  //   };

  const handleSubmitTest = (): void => {
    if (!selectedTest) return;

    let score = 0;

    selectedTest.questions.forEach((question) => {
      const questionId = String(question.id);
      const userAnswer = answers[questionId];

      const isCorrect =
        typeof userAnswer !== "undefined" &&
        String(userAnswer) === String(question.correctAnswer);

      if (isCorrect) {
        score++;
      }
    });

    const timeTakenInSeconds = selectedTest.duration * 30 - timeRemaining;
    const minutes = Math.floor(timeTakenInSeconds / 60);
    const seconds = timeTakenInSeconds % 60;
    const timeTaken = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    const userId = auth.currentUser?.uid || "guest";

    const userAnswers = Object.entries(answers).map(
      ([questionId, selectedOption]) => ({
        questionId: Number(questionId),
        selectedOption,
      })
    );

    const newResult: TestResult = {
      score,
      timeTaken,
      testId: selectedTest.id,
      dateCompleted: new Date().toLocaleDateString(),
      userId,
      userAnswers: Object.values(answers),
      totalQuestions: selectedTest.questions.length,
      percentage: Math.round((score / selectedTest.questions.length) * 100),
    };

    console.log("New result being saved", newResult);

    setTestResults((prev) => [...prev, newResult]);
    setCurrentResult(newResult);
    setTestStarted(false);
    setCurrentView("results");
  };

  const handleLogout = (): void => setIsLogoutModalVisible(true);
  const cancelLogout = (): void => setIsLogoutModalVisible(false);

  // New functions for navigation modal
  const handleHeaderTitleClick = (): void => {
    if (currentView !== "dashboard") {
      setIsNavigationModalVisible(true);
    }
  };

  const confirmNavigation = (): void => {
    setIsNavigationModalVisible(false);
    resetTestState();
  };

  const cancelNavigation = (): void => {
    setIsNavigationModalVisible(false);
  };

  const resetTestState = (): void => {
    setCurrentView("dashboard");
    setSelectedTest(null);
    setCurrentResult(null); // Reset current result
    setTestStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  // const confirmLogout = (): void => {
  //   setIsLogoutModalVisible(false);
  //   router.push("homes");
  //   resetTestState();
  // };

  const confirmLogout = async (): Promise<void> => {
    try {
      await signOut(auth); 
      setIsLogoutModalVisible(false); 
      resetTestState(); 
      router.push("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
   
    }
  };

  const handleSelectTest = (test: Test): void => {
    setSelectedTest(test);
    setCurrentView("instructions");
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentResult(null); //  Clear previous result when selecting new test
  };

  const handleStartTest = (): void => {
    if (!selectedTest) return;
    // console.log(selectedTest, "selectedTestdsfgdg");
    setCurrentView("test");
    setTimeRemaining(30 * 60);
    setTestStarted(true);
  };

  const handleAnswerSelect = (
    questionId: number,
    answerIndex: number
  ): void => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: answerIndex }));
  };

  //  handleShowResults to properly set both test and result
  const handleShowResults = (test: Test): void => {
    console.log("=== SHOWING RESULTS ===", testResults, test);

    // Find the latest result for this test
    const testResult = testResults
      .filter((result) => result.testId === test.id)
      .sort(
        (a, b) =>
          new Date(b.dateCompleted).getTime() -
          new Date(a.dateCompleted).getTime()
      )[0];

    console.log("Found result:", testResult);
    console.log("All test results:", testResults);

    if (testResult) {
      setSelectedTest(test);
      setCurrentResult(testResult);
      setCurrentView("results");
    } else {
      console.error("No result found for test ID:", test.id);
    }
    console.log(testResult, "selectedTest");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-4">
              {currentView !== "dashboard" && (
                <button
                  onClick={() => setIsNavigationModalVisible(true)}
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 cursor-pointer" />
                </button>
              )}
              <h1
                className={`text-xl sm:text-2xl font-bold text-white ${
                  currentView !== "dashboard"
                    ? "cursor-pointer hover:text-blue-300 transition-colors"
                    : ""
                }`}
                onClick={handleHeaderTitleClick}
              >
                {currentView === "dashboard"
                  ? "Test Portal"
                  : currentView === "instructions"
                  ? "Test Instructions"
                  : currentView === "test"
                  ? selectedTest?.title || "Test"
                  : "Test Results"}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <UserModal />
              </div>

              {currentView === "dashboard" && (
                <div className="w-full sm:w-auto">
                  <button
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer justify-center text-white hover:text-red-400 bg-white/10 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-all duration-300 w-full sm:w-auto"
                  >
                    <LogOutIcon className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === "dashboard" && (
          <DashboardView
            tests={tests}
            testResults={testResults}
            onSelectTest={handleSelectTest}
            onShowResults={handleShowResults}
            onLogout={handleLogout}
          />
        )}

        {currentView === "instructions" && selectedTest && (
          <InstructionsView
            test={selectedTest}
            onBack={resetTestState}
            onStartTest={handleStartTest}
          />
        )}

        {currentView === "test" && selectedTest && (
          <TestView
            test={selectedTest}
            timeRemaining={timeRemaining}
            onAnswerSelect={handleAnswerSelect}
            onPreviousQuestion={() =>
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
            }
            onNextQuestion={() => setCurrentQuestionIndex((prev) => prev + 1)}
            onSubmitTest={handleSubmitTest}
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
        )}

        {/*  results view condition */}
        {currentView === "results" && selectedTest && currentResult && (
          <ResultsView
            test={selectedTest}
            result={currentResult}
            onEndTest={resetTestState}
            onLogout={handleLogout}
          />
        )}
      </main>
      <ConfirmModal
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        visible={isLogoutModalVisible}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
      <ConfirmModal
        title="End Test"
        message="Are you sure you want to end the test? Any unsaved progress will be lost."
        visible={isNavigationModalVisible}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </div>
  );
}
