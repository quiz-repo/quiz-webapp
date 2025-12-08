"use client";
import React from "react";
import { Award, FileText } from "lucide-react";

interface Test {
  id: string;
  title: string;
  subject?: string;
  created?: string;
  questions?: any;
  status?: string;
}

interface Props {
  tests: Test[];
  testAnalytics: { [key: string]: any };
}

const RecentTests: React.FC<Props> = ({ tests, testAnalytics }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center">
          <Award className="mr-3 text-blue-600" /> Recent Tests
        </h2>
      </div>
      <div className="p-6 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {tests.slice(0, 5).map((test) => (
            <div
              key={test.id}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{test.title}</h3>
                  <p className="text-slate-500 text-sm">
                    {test.subject} • {test.created} •{" "}
                    {Array.isArray(test.questions)
                      ? test.questions.length
                      : typeof test.questions === "number"
                      ? test.questions
                      : 0}{" "}
                    questions
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    test.status?.toLowerCase() === "active"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {test.status
                    ? test.status.charAt(0).toUpperCase() +
                      test.status.slice(1).toLowerCase()
                    : "Unknown"}
                </span>

                {testAnalytics[test.id] && (
                  <div className="text-xs text-slate-600">
                    {testAnalytics[test.id].totalAttempts} attempts •{" "}
                    {Number(testAnalytics[test.id].averageScore || 0).toFixed(1)}{" "}
                    avg %
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentTests;
