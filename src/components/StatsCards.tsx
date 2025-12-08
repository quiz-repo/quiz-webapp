import React from "react";
import { FileText, FileQuestion, Users, TrendingUp } from "lucide-react";

interface StatItem {
  title: string;
  value: number;
  icon: any;
  color: string;
  change: string;
  trend: "up" | "down";
}

interface Props {
  stats: StatItem[];
}

const StatsCards: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === "blue"
                  ? "bg-blue-50 text-blue-600"
                  : stat.color === "green"
                  ? "bg-emerald-50 text-emerald-600"
                  : stat.color === "yellow"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-purple-50 text-purple-600"
              }`}
            >
              <stat.icon className="w-6 h-6" />
            </div>

            <div
              className={`flex items-center text-sm font-medium ${
                stat.trend === "up" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  stat.trend === "down" ? "rotate-180" : ""
                }`}
              />
              {stat.change}
            </div>
          </div>

          <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
          <p className="text-slate-500 font-medium">{stat.title}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
