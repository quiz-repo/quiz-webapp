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
import {
  getDocByFirebase,
  signOut,
  addTestResult,
  getUserTestResults,
} from "@/lib/Firebase";
import { auth } from "@/lib/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import UserModal from "../components/modals/UserModal";

type ViewType = "dashboard" | "instructions" | "test" | "results";
type UserAnswer = string | number | { answer: string | number } | null | undefined;

export default function TestDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
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
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
const [activeTestsCount, setActiveTestsCount] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserName(user.displayName || user.email || "User");
      } else {
        setIsAuthenticated(false);
        setUserName(null);
        router.push("/");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

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

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      loadData();
    }
  }, [isAuthenticated, isLoading]);

  const loadData = async () => {
    try {
      console.log("📚 Starting data load process");
      setError(null);

      const [testsResult, resultsResult] = await Promise.allSettled([
        fetchTests(),
        fetchUserTestResults(),
      ]);

      if (testsResult.status === "rejected") {
     
        setError("Failed to load tests. Please refresh the page.");
      }

      if (resultsResult.status === "rejected") {
        console.error("  Failed to fetch results:", resultsResult.reason);
      }

  
    } catch (error) {

      setError("An unexpected error occurred. Please refresh the page.");
    }
  };

  const fetchTests = async (): Promise<void> => {
    try {
      console.log("🔍 Fetching tests from Firestore...");
      const testData = await getDocByFirebase();
      console.log(testData, 'sdfsdf');

      testData.forEach((test: any, index: number) => {
        console.log(`Test ${index + 1} (${test.id}):`, {
          title: test.title,
          questionsCount: test.questions?.length || 0,
          hasQuestions: !!test.questions,
        });
      });

      setTests(testData as Test[]);
    } catch (error) {
      console.error(" Failed to fetch tests:", error);
      throw error;
    }
  };

  const fetchUserTestResults = async (): Promise<void> => {
    try {
      console.log("📊 Fetching user test results...");
      const results = await getUserTestResults();
      console.log(`✅ Received ${results.length} test results`);
      const mappedResults = results.map((result: any) => ({
        ...result,
        userAnswers: result.userAnswers ?? [],
        totalQuestions: result.totalQuestions ?? 0,
        percentage:
          result.percentage ??
          (result.totalQuestions && result.score != null
            ? Math.round((result.score / result.totalQuestions) * 100)
            : 0),
      }));
      setTestResults(mappedResults);
   
    } catch (error) {
      console.error("Failed to fetch test results:", error);
    }
  };
const handleSubmitTest = async (): Promise<void> => {
  setIsSubmitted(true);
  // Ensure we have a test to submit
  if (!selectedTest || !selectedTest.questions || selectedTest.questions.length === 0) {
    console.warn("Attempted to submit test without a valid selectedTest or questions.");
    return;
  }

  try {
    console.log(" Building userAnswers and calculating score...");

    const questionsLength = selectedTest.questions.length;
    let score = 0;

    // --- 1. Clean and Prepare userAnswers & Calculate Score Simultaneously ---
    const userAnswers = selectedTest.questions.map((q) => {
      // const rawUserAnswer = answers[q?.id];

      // Standardize the answer value: check if it's an object with an 'answer' property, otherwise use the value directly.
     const rawUserAnswer: UserAnswer =  answers[q?.id];

const userAnswerValue =
  (typeof rawUserAnswer === "object" && rawUserAnswer !== null && 'answer' in rawUserAnswer)
    ? (rawUserAnswer as { answer: string | number }).answer // type assertion here
    : rawUserAnswer; // Use the raw value (which should be the index/option)

      // Convert to string for consistent comparison, ignore null/undefined attempts
      const attemptValue = userAnswerValue !== undefined && userAnswerValue !== null ? String(userAnswerValue) : undefined;
      
      const isCorrect =
        attemptValue !== undefined &&
        String(attemptValue) === String(q.correctAnswer);

      if (isCorrect) {
        score++;
      }
      
      // Ensure 'attempt' is explicitly set to null/0/-1 or excluded if not answered, 
      // but if included, must not be 'undefined' for Firestore.
      // We'll use 'null' for the attempt if it was skipped/unanswered.
      return {
        questionId: q.id,
        // The attempt field MUST NOT be undefined. Use null if unanswered.
        attempt: attemptValue !== undefined ? attemptValue : null, 
        // We'll store the correct answer for reference
        correctAnswer: q.correctAnswer, 
      };
    });

    console.log(" Score calculated:", score);

    // --- 2. Calculate Time Taken ---
    const totalTestDurationInSeconds = selectedTest.duration * 60;
    const timeTakenInSeconds = Math.max(
      0,
      totalTestDurationInSeconds - timeRemaining
    );
    const minutes = Math.floor(timeTakenInSeconds / 60);
    const seconds = timeTakenInSeconds % 60;

    const timeTaken = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    // --- 3. Prepare Final Result Object (Preventing 'undefined') ---

    // Safely get userId, defaulting to "guest"
    const userId = auth.currentUser?.uid || "guest";
    
    // Safely get dateCompleted string, ensuring it's not undefined.
    const dateCompleted = new Date().toLocaleDateString() || new Date().toISOString().split('T')[0];

    const newResult: Omit<TestResult, "id"> = {
      score,
      timeTaken,
      testId: selectedTest.id,
      dateCompleted, // Use the safely generated string
      userId,
      userAnswers,
      totalQuestions: questionsLength,
      percentage: Math.round((score / questionsLength) * 100),
      // Ensure any optional fields not shown here are explicitly handled (e.g., set to null if intended to be stored).
    };

    // --- 4. Save to Firestore via addTestResult ---
    const resultId = await addTestResult(newResult);

    console.log(" Firebase returned ID:", resultId);

    const resultWithId: TestResult = {
      id: resultId,
      ...newResult,
    };

    console.log("✅ Test result saved successfully:", resultWithId);

    // --- 5. State Updates ---
    setTestResults((prev) => [...prev, resultWithId]);
    setCurrentResult(resultWithId);
    setTestStarted(false);
    setCurrentView("results");

  } catch (error) {
    console.error("🔥 Error saving test result:", error);
    setError("Failed to save test results. Please try again.");
  }
};

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleLogout = (): void => setIsLogoutModalVisible(true);
  const cancelLogout = (): void => setIsLogoutModalVisible(false);

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
    setCurrentResult(null);
    setTestStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSubmitted(false);
  };

  const confirmLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setIsLogoutModalVisible(false);
      resetTestState();
      router.push("/");
    } catch (error) {
      setError("Logout failed. Please try again.");
    }
  };

  const handleSelectTest = (test: Test): void => {
    console.log("Selected test:", {
      id: test.id,
      title: test.title,
      questionsCount: test.questions?.length || 0,
    });

   
    if (!test.questions || test.questions.length === 0) {
      return;
    }

    setSelectedTest(test);
    setCurrentView("instructions");
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentResult(null);
  };

  const handleStartTest = (): void => {
    if (!selectedTest) return;

   

    const durationInSeconds = selectedTest.duration * 60;
    setCurrentView("test");
    setTimeRemaining(durationInSeconds);
    setTestStarted(true);
  };

  const handleAnswerSelect = (
    questionId: number,
    answerIndex: number
  ): void => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: answerIndex }));
  };

  const handleShowResults = (test: Test): void => {
    console.log("📊 Showing results for test:", test.id);
    const testResult = testResults
      .filter((result) => result.testId === test.id)
      .sort(
        (a, b) =>
          new Date(b.dateCompleted).getTime() -
          new Date(a.dateCompleted).getTime()
      )[0];

    if (testResult) {
      setSelectedTest(test);
      setCurrentResult(testResult);
      setCurrentView("results");
    } else {
      console.warn("  No result found for test ID:", test.id);
      setError("No results found for this test.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {!isSubmitted && (
        <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
         <div className="w-[93%] mx-auto px-4 py-4">

            <div className="flex flex-row items-center justify-between gap-3">

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
      )}

      {/* {error && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <strong>Error:</strong> {error}
                <br />
                <small className="text-red-300 mt-1 block">
                  Check the browser console for more details.
                </small>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-4 text-red-300 hover:text-red-100 text-xl leading-none"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )} */}

      <main className="overflow-hidden h-82vh mx-auto px-6 py-8">
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
