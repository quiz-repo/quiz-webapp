import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export const StatsCard = ({ title, value, icon }: StatsCardProps) => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-blue-200 text-sm">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);