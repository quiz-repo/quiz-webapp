import { useEffect, useState } from "react";
import { BookOpen, CheckCircle, Clock, Users, ArrowRight } from "lucide-react";
import { Test, TestResult } from "./type";
import { getTotalUsers } from "@/lib/Firebase";
import { StatsCard } from "./common/StatsCard";
import { TestCard } from "./TestCard";

interface DashboardViewProps {
  tests: Test[];
  testResults: TestResult[];
  onSelectTest: (test: Test) => void;
  onShowResults: (test: Test, result: TestResult) => void;
  onLogout: () => void;
}
export const DashboardView = ({
  tests,
  testResults,
  onSelectTest,
  onShowResults,
}: DashboardViewProps) => {
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const count = await getTotalUsers();
      setTotalUsers(isNaN(count) ? 0 : count);
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatsCard
          title="Active Tests"
          value={tests?.length || 0}
          icon={<BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />}
        />
        <StatsCard
          title="Total Questions"
          // value={tests.reduce((sum, test) => sum + (test?.questions?.length || 0), 0)}
          value={tests[0]?.questions?.length || 0}
          icon={
            <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
          }
        />
        <StatsCard
          title="Avg Duration"
          value={`${30} m`}
          // tests.length > 0
          //   ? `${Math.round(
          //       tests.reduce((sum, test) => sum + (test?.duration || 0), 0) / tests.length
          //     )}m`
          //   : "0m"
          // }
          icon={<Clock className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500" />}
        />
        <StatsCard
          title="Participants"
          value={totalUsers || 0}
          icon={<Users className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />}
        />
      </div>

      {/* Available Tests */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
          Available Tests
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 w-full">
          {tests.map((test) => (
            <div key={test.id} className="w-full">
              <TestCard test={test} onClick={() => onSelectTest(test)} />
            </div>
          ))}
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 mt-6 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
            Your Test Results
          </h2>
          <div className="flex flex-col gap-4 w-full">
            {testResults.map((result, index) => {
              const test = tests.find((t) => t.id === result.testId);
              console.log(result.testId, "jhniuh");
              if (!test) return null;

              return (
                <div
                  key={`result-${index}`}
                  className="bg-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer w-full"
                  onClick={() => onShowResults(test, result)}
                >
                  <div className="flex-1 w-full">
                    <h3 className="text-base sm:text-lg font-semibold text-white break-words">
                      {test.title}
                    </h3>
                    <p className="text-blue-200 text-sm">
                      Completed on {result.dateCompleted}
                    </p>
                    <p className="text-green-300 text-sm mt-1">
                      Score: {result.score}/{test.questions.length} (
                      {Math.round((result.score / test.questions.length) * 100)}
                      %)
                    </p>
                  </div>
                  <button className="w-full sm:w-auto flex justify-center items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
