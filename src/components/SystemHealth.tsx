"use client";
import React from "react";
import { Target } from "lucide-react";

interface Props {
  activeTests: number;
  draftTests: number;
  totalUsers: number;
  totalSubmissions: number;
}

const SystemHealth: React.FC<Props> = ({
  activeTests,
  draftTests,
  totalUsers,
  totalSubmissions,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
        <Target className="mr-2 text-green-600" /> System Health
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Active Tests</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <span className="font-medium">{activeTests}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600">Draft Tests</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
            <span className="font-medium">{draftTests}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600">Total Users</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <span className="font-medium">{totalUsers}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600">Total Submissions</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
            <span className="font-medium">{totalSubmissions}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
