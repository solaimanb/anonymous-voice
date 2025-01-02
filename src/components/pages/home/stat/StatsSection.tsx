import { Users, CheckCircle, HeartHandshake } from "lucide-react";
import { StatsSectionProps } from "./types";

export function StatsSection({ stats }: StatsSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "users":
        return <Users className="w-8 h-8" />;
      case "check":
        return <CheckCircle className="w-8 h-8" />;
      case "heart":
        return <HeartHandshake className="w-8 h-8" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#86C6C6]/20 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm space-y-2"
            >
              <div className="text-[#86C6C6]">{getIcon(stat.icon)}</div>
              <div className="text-4xl font-bold text-gray-800">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}