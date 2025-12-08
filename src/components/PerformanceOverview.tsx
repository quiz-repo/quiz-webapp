"use client";
import React from "react";
import { Activity } from "lucide-react";

interface Test {
  id: string;
  title: string;
  subject?: string;
}

interface Props {
  tests: Test[];
  testAnalytics: { [key: string]: any };
}

const PerformanceOverview: React.FC<Props> = ({ tests, testAnalytics }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
        <Activity className="mr-2 text-blue-600" /> Test Performance Overview
      </h3>
      <div className="space-y-4">
        {tests.slice(0, 3).map((test) => {
          const analytics = testAnalytics[test.id];
          return (
            <div key={test.id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-slate-900 truncate">
                  {test.title}
                </p>
                <p className="text-sm text-slate-500">{test.subject}</p>
              </div>
              {analytics && (
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {Math.round(analytics.averageScore)}% avg
                  </p>
                  <p className="text-xs text-slate-500">
                    {analytics.totalAttempts} attempts
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceOverview;
