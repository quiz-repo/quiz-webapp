"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Pagination } from "antd";
import {
  BarChart3,
  ArrowLeft,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Mail,
  User,
  Zap,
  Star,
  Trophy,
  Eye,
} from "lucide-react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/Firebase";

interface QuestionResult {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface UserTestResult {
  id: string;
  testId: string;
  userAnswers: any;
  userId: string;
  startTime?: Date;
  endTime?: Date;
  correctAnswers?: number;
  wrongAnswers?: number;
  totalQuestions: number;
  score: number;
  durationMs?: number;
  status?: "Passed" | "Failed" | "In-Progress";
  detailedResults?: QuestionResult[];
  percentage: number;
  timeTaken: string;
  userDetails?: {
    displayName: string;
    email: string;
  };
  resultStatus: string;
}

interface TestDetails {
  title: string;
  subject?: string;
  passedCount: number;
  failedCount: number;
  avgTimeTaken: string;
  passRate: string;
  questions?: Array<{
    id: string;
    question: string;
    correctAnswer: string;
    options?: string[];
  }>;
}

interface TestEntry {
  testId: string;
  testDetails: TestDetails;
  testResults: UserTestResult[];
}

interface UserAttemptDetailProps {
  result: UserTestResult;
  onBack: () => void;
}

const timeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;

  const parts = timeStr.split(":")?.map(Number);

  if (parts.length === 2) {
    const [m, s] = parts;
    return m * 60 + s;
  }

  if (parts.length === 3) {
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
  }

  return 0;
};

const secondsToTime = (totalSec: number): string => {
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};



const getTestsWithResults = async (): Promise<TestEntry[]> => {
  try {
    const testsSnap = await getDocs(collection(db, "tests"));

    const promises = testsSnap.docs?.map(async (testDoc) => {
      const testData = testDoc.data();
      const testId = testDoc.id;

      const resultsQuery = query(
        collection(db, "testResults"),
        where("testId", "==", testId)
      );
      const resultsSnap = await getDocs(resultsQuery);

      const testResults = await Promise.all(
        resultsSnap.docs.map(async (r) => {
          const resultData: any = r.data();

          let userDetails = null;
          if (resultData.userId) {
            const userRef = doc(db, "users", resultData.userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              userDetails = userSnap.data();
            }
          }

          const resultStatus = resultData.percentage >= 33 ? "Pass" : "Fail";

          return {
            id: r.id,
            ...resultData,
            userDetails,
            resultStatus,
          };
        })
      );

      const passedCount = testResults.filter(
        (r: any) => r.percentage >= 33
      ).length;

      const failedCount = testResults.filter(
        (r: any) => r.percentage < 33
      ).length;

      const total = testResults.length;

      const totalSeconds = testResults.reduce((acc, r: any) => {
        return acc + timeToSeconds(r.timeTaken);
      }, 0);

      const passRate =
        total > 0 ? ((passedCount / total) * 100).toFixed(1) : "0";
      const avgTimeTaken =
        total > 0 ? secondsToTime(Math.floor(totalSeconds / total)) : "00:00";

      return {
        testId,
        testDetails: {
          title: testData.title || "",
          subject: testData.subject || "",
          ...testData,
          passedCount,
          failedCount,
          avgTimeTaken,
          passRate,
        },
        testResults,
      };
    });

    return Promise.all(promises);
  } catch (error) {
    console.error("Error fetching tests with results:", error);
    return [];
  }
};

// --- COMPONENTS ---

const StatCard = ({
  icon: Icon,
  title,
  value,
  colorClass,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  colorClass: string;
}) => (
  <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 flex items-center transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
    <div
      className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center mr-4 shrink-0`}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const TestSummaryList: React.FC<{
  allTestResults: TestEntry[];
  onSelectTest: (data: TestEntry) => void;
}> = ({ allTestResults, onSelectTest }) => {
  const totalTests = allTestResults.length;

  const uniqueUsers = new Set(
    allTestResults.flatMap((test) =>
      test.testResults.map((result) => result.userId)
    )
  ).size;

  const totalAttempts = allTestResults.reduce(
    (acc, test) => acc + test.testResults.length,
    0
  );

  const totalPassedAttempts = allTestResults.reduce(
    (acc, test) => acc + test.testDetails.passedCount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          title="Total Tests"
          value={totalTests}
          colorClass="bg-blue-500 shadow-blue-300"
        />
        <StatCard
          icon={Users}
          title="Total Users"
          value={uniqueUsers}
          colorClass="bg-purple-500 shadow-purple-300"
        />
        <StatCard
          icon={Zap}
          title="Total Attempts"
          value={totalAttempts}
          colorClass="bg-orange-500 shadow-orange-300"
        />
        <StatCard
          icon={Trophy}
          title="Avg Attempt Pass Rate"
          value={`${(
            (totalPassedAttempts / (totalAttempts || 1)) *
            100
          ).toFixed(1)}%`}
          colorClass="bg-emerald-500 shadow-emerald-300"
        />
      </div>

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" /> Test-Level
            Aggregates
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider min-w-[200px]">
                  Test Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Total Attempts
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Total Passed
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Pass Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Avg Time Taken
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {allTestResults?.map((summary) => (
                <tr
                  key={summary.testId}
                  className="hover:bg-blue-50 transition duration-150"
                >
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 cursor-pointer hover:underline"
                    onClick={() => onSelectTest(summary)}
                  >
                    {summary.testDetails.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                    {summary.testResults.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 font-bold">
                    {summary.testDetails.passedCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        parseFloat(summary.testDetails.passRate) >= 50
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {summary.testDetails.passRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {summary.testDetails.avgTimeTaken}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onSelectTest(summary)}
                      className="text-blue-600 cursor-pointer hover:text-blue-900 bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UserAttemptDetailView: React.FC<UserAttemptDetailProps> = ({
  result,
  onBack,
}) => {
  const [allTestResults, setAllTestResults] = useState<TestEntry[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const results = await getTestsWithResults();
      setAllTestResults(results);
    };

    fetchResults();
  }, []);

  const detailedResults = result?.userAnswers || [];
  const wrongQuestions = detailedResults.filter((r: any) => !r.isCorrect);

  const questions =
    allTestResults.find((test) => test.testId === result.testId)?.testDetails
      ?.questions || [];

  console.log("detailedResults", detailedResults);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between pb-4 border-b border-slate-200">
        <div className="flex flex-col">
          <button
            onClick={onBack}
            className="w-fit cursor-pointer flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors bg-blue-50 px-4 py-2 rounded-xl mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Attempts
          </button>

          <h1 className="text-2xl font-extrabold text-slate-800">
            Attempt Details for{" "}
            <span className="text-blue-600">
              {result?.userDetails?.displayName || "Unknown User"}
            </span>
          </h1>
        </div>

        <div
          className={`text-center p-3 rounded-xl font-bold text-xl ${
            result?.resultStatus === "Pass"
              ? "bg-emerald-500 text-white"
              : "bg-rose-500 text-white"
          }`}
        >
          {result?.resultStatus ?? "No Status"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((q: any, index: number) => {
          const userQ = detailedResults.find((d: any) => d.questionId === q.id);
          const userAttempt = Number(userQ?.attempt);
          const isCorrect = userAttempt === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-lg shadow-sm border ${
                isCorrect
                  ? "border-green-300 bg-green-50"
                  : "border-red-300 bg-red-50"
              }`}
            >
              {/* Question */}
              <h2 className="font-bold text-lg">
                {index + 1}. {q.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 mt-4">
                {q.options.map((opt: any, idx: number) => {
                  const isCorrectOpt = idx === q.correctAnswer;
                  const isUser = idx === userAttempt;

                  // User selected correct answer → GREEN strong
                  if (isUser && isCorrectOpt) {
                    return (
                      <p
                        key={idx}
                        className="border p-3 rounded-lg bg-emerald-300 text-emerald-900 border-emerald-500 font-bold"
                      >
                        {opt}
                      </p>
                    );
                  }

                  // User selected wrong answer → RED
                  if (isUser && !isCorrectOpt) {
                    return (
                      <p
                        key={idx}
                        className="border p-3 rounded-lg bg-rose-300 text-rose-900 border-rose-500 font-bold"
                      >
                        {opt}
                      </p>
                    );
                  }

                  // Correct answer (when user selected something else) → GREEN light
                  if (isCorrectOpt && userAttempt !== q.correctAnswer) {
                    return (
                      <p
                        key={idx}
                        className="border p-3 rounded-lg bg-emerald-200 text-emerald-800 border-emerald-400 font-semibold"
                      >
                        {opt}
                      </p>
                    );
                  }

                  // Default option
                  return (
                    <p
                      key={idx}
                      className="border p-3 rounded-lg bg-white text-slate-700 border-slate-200"
                    >
                      {opt}
                    </p>
                  );
                })}
              </div>

              {/* Correct / Wrong message */}
              {isCorrect ? (
                <p className="text-green-600 font-semibold mt-3">✔ Correct</p>
              ) : (
                <p className="text-red-600 font-semibold mt-3">✘ Wrong</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TestDetailsView: React.FC<{
  summary: TestEntry;
  onBack: () => void;
  onSelectAttempt: (result: UserTestResult) => void;
}> = ({ summary, onBack, onSelectAttempt }) => {
  console.log("ssssssss", summary);
  const uniqueParticipatedUsers = new Set(
    summary.testResults?.map((r) => r.userId)
  ).size;
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const reversedResults = [...summary.testResults].reverse();

  const paginatedResults = reversedResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors bg-blue-50 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to All Tests
        </button>
        <h1 className="text-2xl font-extrabold text-slate-800">
          Results for{" "}
          <span className="text-blue-600">{summary?.testDetails?.title}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title="Unique Participants"
          value={uniqueParticipatedUsers}
          colorClass="bg-indigo-500 shadow-indigo-300"
        />
        <StatCard
          icon={CheckCircle2}
          title="Total Passed Attempts"
          value={summary.testDetails?.passedCount}
          colorClass="bg-emerald-500 shadow-emerald-300"
        />
        <StatCard
          icon={XCircle}
          title="Total Failed Attempts"
          value={summary?.testDetails?.failedCount}
          colorClass="bg-rose-500 shadow-rose-300"
        />
        <StatCard
          icon={Clock}
          title="Average Time Taken"
          value={summary.testDetails?.avgTimeTaken}
          colorClass="bg-amber-500 shadow-amber-300"
        />
      </div>

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-500" /> User Attempt Details
            ({summary?.testResults?.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                  S.NO
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider min-w-[200px]">
                  User & Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Correct / Wrong
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider min-w-[120px]">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
             <tbody className="bg-white divide-y divide-slate-100">
              {paginatedResults.map((result, index) => (
                <tr
                  key={result.id}
                  className={`hover:bg-slate-50 transition duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  {/* SNO */}
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                    {(currentPage - 1) * pageSize + (index + 1)}
                  </td>

                  {/* USER INFO */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {result?.userDetails?.displayName || "Unknown User"}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />{" "}
                      {result?.userDetails?.email || "N/A"}
                    </p>
                  </td>


                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-emerald-600">
                      {result?.score}
                    </span>{" "}
                    /{" "}
                    <span className="text-sm font-bold text-rose-600">
                      {result?.totalQuestions - result?.score}
                    </span>
                    <p className="text-xs text-slate-400">
                      ({result?.totalQuestions} total)
                    </p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                    {result?.percentage}%
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                    {result?.timeTaken}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onSelectAttempt(result)}
                      className="text-indigo-600 cursor-pointer hover:text-indigo-900 bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" /> View Score
                    </button>
                  </td>
                </tr>
              ))}

              {summary?.testResults?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-slate-500 italic"
                  >
                    No completed results found for this test.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
           <div className="p-4 flex justify-end">
            <Pagination
              current={currentPage}
              total={summary.testResults.length}
              pageSize={pageSize}
              showSizeChanger={false}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultsManagementPage: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<TestEntry | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<UserTestResult | null>(
    null
  );
  const [allTestResults, setAllTestResults] = useState<TestEntry[]>([]);
  const [loading, setLoading] = useState(true); // TypeScript infers boolean

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const results = await getTestsWithResults();
        setAllTestResults(results);
      } catch (error) {
        console.error("Failed to fetch test results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleBackToTestList = useCallback(() => {
    setSelectedTest(null);
    setSelectedAttempt(null);
  }, []);

  const handleBackToTestDetails = useCallback(() => {
    setSelectedAttempt(null);
  }, []);

  const handleSelectTest = useCallback((data: TestEntry) => {
    setSelectedTest(data);
    setSelectedAttempt(null);
  }, []);

  const handleSelectAttempt = useCallback((result: UserTestResult) => {
    setSelectedAttempt(result);
  }, []);

  const renderMainContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-slate-600">Loading test data...</div>
        </div>
      );
    }

    if (selectedAttempt) {
      return (
        <UserAttemptDetailView
          result={selectedAttempt}
          onBack={handleBackToTestDetails}
        />
      );
    } else if (selectedTest) {
      return (
        <TestDetailsView
          summary={selectedTest}
          onBack={handleBackToTestList}
          onSelectAttempt={handleSelectAttempt}
        />
      );
    } else {
      return (
        <TestSummaryList
          allTestResults={allTestResults}
          onSelectTest={handleSelectTest}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-['Inter']">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 flex items-center">
          <Star className="w-8 h-8 mr-3 text-blue-600" />
          Test Performance Dashboard
        </h1>
        <p className="text-slate-600 mt-1">
          Analyze aggregated and individual results across all tests.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">{renderMainContent()}</main>
    </div>
  );
};

export default ResultsManagementPage;
