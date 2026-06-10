import React from "react";
import { cn } from "@/lib/utils";

interface RoadmapStep {
  phase: string;
  color: string;
  tasks: string[];
}

interface RoadmapTimelineProps {
  roadmap: RoadmapStep[];
}

export default function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  const colorMap = {
    green: {
      border: "border-emerald-500/30",
      bullet: "bg-emerald-500",
      bg: "bg-emerald-500/5",
      text: "text-emerald-400",
    },
    amber: {
      border: "border-amber-500/30",
      bullet: "bg-amber-500",
      bg: "bg-amber-500/5",
      text: "text-amber-400",
    },
    purple: {
      border: "border-purple-500/30",
      bullet: "bg-purple-500",
      bg: "bg-purple-500/5",
      text: "text-purple-400",
    },
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white mb-4">90-Day Execution Roadmap</h3>
      <div className="relative border-l border-neutral-800 ml-3.5 space-y-8">
        {roadmap.map((step, idx) => {
          const colorName = step.color?.toLowerCase() || "green";
          const theme = colorMap[colorName as keyof typeof colorMap] || colorMap.green;
          
          return (
            <div key={idx} className="relative pl-8 group">
              {/* Timeline Bullet */}
              <div
                className={cn(
                  "absolute -left-[9px] top-1.5 w-4.5 h-4.5 rounded-full border border-black flex items-center justify-center transition-transform group-hover:scale-110",
                  theme.bullet
                )}
              >
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>

              {/* Box */}
              <div className={cn("p-4 rounded-xl border backdrop-blur-sm", theme.border, theme.bg)}>
                <span className={cn("text-xs font-semibold uppercase tracking-wider", theme.text)}>
                  {step.phase}
                </span>
                <ul className="mt-3 space-y-2.5">
                  {step.tasks.map((task, taskIdx) => (
                    <li key={taskIdx} className="text-sm text-neutral-300 flex items-start gap-2">
                      <span className="text-amber-500 mt-1 select-none">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
