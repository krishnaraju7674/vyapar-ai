import React from "react";
import { Users, BarChart3 } from "lucide-react";

interface Competitor {
  name: string;
  marketShare: string;
  description: string;
}

interface CompetitorCardProps {
  competitors: Competitor[];
}

export default function CompetitorCard({ competitors }: CompetitorCardProps) {
  if (!competitors || competitors.length === 0) {
    return (
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 text-center">
        <p className="text-sm text-neutral-400">No direct competitors flagged by AI. High blue ocean potential!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Users className="w-5 h-5 text-orange-500" />
        Market Landscape & Competitors
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competitors.map((comp, idx) => (
          <div
            key={idx}
            className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-white text-base">{comp.name}</h4>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
                  <BarChart3 className="w-2.5 h-2.5" />
                  {comp.marketShare}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                {comp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
