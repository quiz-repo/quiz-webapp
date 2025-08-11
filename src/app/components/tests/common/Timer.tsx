import { Timer } from "lucide-react";

interface TimerProps {
  timeRemaining: number;
}

export const TestTimer = ({ timeRemaining }: TimerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center text-white">
      <Timer className="w-5 h-5 mr-2" />
      <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
    </div>
  );
};
