"use client";
import React from "react";
import { BarChart3, FileText, Users, TrendingUp, LogOutIcon } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  loading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  loading,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "tests", label: "Tests", icon: FileText },
    { id: "users", label: "Users", icon: Users },
    { id: "results", label: "Result", icon: TrendingUp },
  ];

  return (
    <div className="bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between h-screen fixed">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Quizz Pro</h1>
            <p className="text-sm text-slate-500">Admin Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  activeTab === item.id ? "text-blue-600" : "text-slate-400"
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8">
        <button
          onClick={onLogout}
          className="w-full bg-red-50 text-red-700 border border-red-200 px-4 py-3.5 rounded-xl font-medium hover:bg-red-100 transition-all disabled:opacity-50 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin mr-2 w-5 h-5 text-red-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            <LogOutIcon className="mr-2 w-5 h-5" />
          )}
          {loading ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
