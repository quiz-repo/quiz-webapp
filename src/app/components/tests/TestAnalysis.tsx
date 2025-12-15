// TestAnalysis.tsx
"use client";
import React, { useEffect, useState } from "react";
import { getUserTestResults, getTotalUsers, auth } from "@/lib/Firebase";

interface TestAnalysisProps {
  testId: string;
  onClose: () => void;
}

const TestAnalysis: React.FC<TestAnalysisProps> = ({ testId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<number>(0);
  const [avgScore, setAvgScore] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        // Fetch all test results for this test
        const allResults = await getUserTestResults(); // Returns results for current user only
        const testResults = allResults.filter(r => r.testId === testId);

        setAttempts(testResults.length);

        if (testResults.length > 0) {
          const totalScore = testResults.reduce(
            (acc, r) => acc + (r.score || 0),
            0
          );
          setAvgScore(totalScore / testResults.length);
        }

        // Fetch total users (handle admin/non-admin)
        let total = 0;
        try {
          total = await getTotalUsers(); // Will return 0 if non-admin
        } catch (err) {
     
        }
        setTotalUsers(total);
      } catch (err) {

        setAttempts(0);
        setAvgScore(0);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [testId]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Test Analysis</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Users Attempted:</span> {attempts}
            </p>
            <p>
              <span className="font-semibold">Total Users:</span> {totalUsers}
            </p>
            <p>
              <span className="font-semibold">Average Score:</span>{" "}
              {avgScore.toFixed(2)}
            </p>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestAnalysis;
