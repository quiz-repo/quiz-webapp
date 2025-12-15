"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Test, TestResult } from "../components/tests/type";
import { ArrowLeft, LogOutIcon } from "lucide-react";
import { DashboardView } from "../components/tests/DashboardView";
import { InstructionsView } from "../components/tests/InstructionsView";

import { ResultsView } from "../components/tests/ResultsView";
import ConfirmModal from "../components/modals/ConfirmModal";
import {
  getDocByFirebase,
  signOut,
  addTestResult,
  getUserTestResults,
  db,
  getResults,
} from "@/lib/Firebase";
import { auth } from "@/lib/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import UserModal from "../components/modals/UserModal";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { TestView } from "../components/tests/TestView";

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
  const [timerReady, setTimerReady] = useState(false);


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

  // useEffect(() => {
  //   let timer: NodeJS.Timeout | undefined;
  //   if (testStarted && timeRemaining > 0) {
  //     timer = setInterval(() => {
  //       setTimeRemaining((prev) => {
  //         if (prev <= 1) {
  //           handleSubmitTest();
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);
  //   }
  //   return () => {
  //     if (timer) {
  //       clearInterval(timer);
  //     }
  //   };
  // }, [testStarted, timeRemaining]);

  // Load data when authenticated

  useEffect(() => {
    console.log("Timer ticktimeRemaining =", timeRemaining);

    // only start timer when both flags are true
    if (!testStarted || !timerReady) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timerReady]);


  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      loadData();
    }
  }, [isAuthenticated, isLoading]);

  const loadData = async () => {
    try {

      setError(null);

      const [testsResult, resultsResult] = await Promise.allSettled([
        fetchTests(),
        fetchUserTestResults(),
      ]);

      if (testsResult.status === "rejected") {

        setError("Failed to load tests. Please refresh the page.");
      }

      if (resultsResult.status === "rejected") {

      }


    } catch (error) {

      setError("An unexpected error occurred. Please refresh the page.");
    }
  };

  const fetchTests = async (): Promise<void> => {
    try {

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
      const results = await getUserTestResults();
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
  const sanitizeForFirestore = (value: any): any => {

    if (value === undefined) return null;
    if (value === null) return null;
    if (Array.isArray(value)) return value.map(sanitizeForFirestore);
    if (typeof value === "object") {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        out[k] = sanitizeForFirestore(v);
      }
      return out;
    }
    return value;
  };

  const handleSubmitTest = async (): Promise<void> => {
    setIsSubmitted(true);
    setTimerReady(false);

    if (!selectedTest || !selectedTest.questions?.length) return;

    try {
      const questionsLength = selectedTest.questions.length;

      // Prepare user answers first
      const userAnswers = selectedTest.questions.map((q) => {
        const rawUserAnswer = answers[q.id];
        const userAnswerValue =
          typeof rawUserAnswer === "object" && rawUserAnswer && "answer" in rawUserAnswer
            ? (rawUserAnswer as { answer: string | number }).answer
            : rawUserAnswer;

        const attemptValue =
          userAnswerValue !== undefined && userAnswerValue !== null
            ? String(userAnswerValue)
            : null;

        return {
          questionId: q.id,
          attempt: attemptValue,
        };
      });

      // ankush
      const correct = await getResults();
      console.log("All answer keys from Firebase:", correct);

      const correctForTest = correct.find(c => c.id === selectedTest.id);
      console.log("Answer key for this test:", correctForTest);

      let correctCount = 0;

      userAnswers.forEach((ans: any) => {
        if (correctForTest) {
          const correctAnswer = (correctForTest as any)[ans.questionId];
          const userAnswer = Number(ans.attempt);

          console.log(`Question ${ans.questionId}: User answered ${userAnswer}, Correct is ${correctAnswer}`);

          if (correctAnswer !== undefined && Number(correctAnswer) === userAnswer) {
            correctCount++;
          }
        }
      });

      console.log("Total Correct Count:", correctCount);

      // Use correctCount as the actual score
      const score = correctCount;

      // Calculate time taken
      await new Promise((resolve) => setTimeout(resolve, 10));

      const durationMinutes = Number(selectedTest.duration);
      const totalTestDurationInSeconds = Number.isFinite(durationMinutes)
        ? durationMinutes * 60
        : 0;

      const safeRemaining = Number.isFinite(Number(timeRemaining)) ? Number(timeRemaining) : 0;
      const timeTakenInSeconds = Math.max(0, totalTestDurationInSeconds - safeRemaining);

      const minutes = Math.floor(timeTakenInSeconds / 60);
      const seconds = timeTakenInSeconds % 60;

      const formattedTime =
        `${minutes.toString().padStart(2, "0")}:` + `${seconds.toString().padStart(2, "0")}`;

      console.log("User Time Taken:", formattedTime);

      const userId = auth.currentUser?.uid || "guest";
      const dateCompleted = new Date().toLocaleDateString();

      const percentage =
        questionsLength > 0 ? Math.round((score / questionsLength) * 100) : 0;

      const newResult: Omit<TestResult, "id"> = {
        score,
        timeTaken: timeTakenInSeconds,
        formattedTime,
        testId: selectedTest.id ?? null,
        dateCompleted,
        userId,
        userAnswers,
        totalQuestions: questionsLength,
        percentage,
      };

      const sanitized = sanitizeForFirestore(newResult);
      console.log("Final result to save:", sanitized);

      const resultId = await addTestResult(sanitized as any);
      const resultWithId: TestResult = {
        id: resultId,
        ...newResult,
      };

      setTestResults((prev) => [...prev, resultWithId]);
      setCurrentResult(resultWithId);
      setTestStarted(false);
      setCurrentView("results");
    } catch (error) {
      console.error("Error saving test results:", error);
      setError("Failed to save test results. Please try again.");
    }
  };

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
    setTimerReady(false);
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

  const handleSelectTest = async (test: Test): Promise<void> => {
    try {
      console.log("Selected test:", test.id);

      const ref = doc(db, "tests", test.id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        toast.error("Test could not be loaded. Please try again.");
        return;
      }

      const freshTest = { id: snap.id, ...(snap.data() as any) };

      if (!Array.isArray(freshTest.questions) || freshTest.questions.length === 0) {
        toast.error("No questions available for this test.");
        return;
      }

      console.log("Loaded questions:", freshTest.questions.length);

      setSelectedTest(freshTest);
      setCurrentView("instructions");
      setAnswers({});
      setCurrentQuestionIndex(0);
      setCurrentResult(null);

    } catch (error) {
      console.error("Error selecting test:", error);
      toast.error("Failed to open test. Check console.");
    }
  };

  const handleStartTest = (): void => {
    if (!selectedTest) return;

    let duration = parseInt(String(selectedTest.duration), 10);

    // fallback if invalid
    if (isNaN(duration) || duration <= 0) {
      duration = 30;
    }

    console.log("Final duration used:", duration);

    // set time first
    setTimeRemaining(duration * 60);

    // tell timer that timeRemaining is ready
    setTimerReady(true);

    setTestStarted(true);
    setCurrentView("test");
  };

  const handleAnswerSelect = (
    questionId: number,
    answerIndex: number
  ): void => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: answerIndex }));
  };

  const handleShowResults = (test: Test): void => {
    console.log("sssss", test.id);
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
      <div className="min-h-screen bg-gradient to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-purple-900 to-indigo-900">

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
                  className={`text-xl sm:text-2xl font-bold text-white ${currentView !== "dashboard"
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
