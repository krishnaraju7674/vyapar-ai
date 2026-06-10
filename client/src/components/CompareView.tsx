import React from "react";
import { useLang } from "@/context/LanguageContext";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

interface CompareItem {
  _id: string;
  idea: string;
  category: string;
  result: {
    verdict: string;
    scores: {
      marketFit: number;
      financialViability: number;
      competition: number;
      scalability: number;
      regulatoryEase: number;
      indiaFit: number;
    };
  };
}

export default function CompareView({ sessions }: { sessions: CompareItem[] }) {
  const { t } = useLang();
  if (sessions.length < 2) {
    return (
      <div className="py-12 text-center text-neutral-500 text-sm">
        {t("compare.empty")}
      </div>
    );
  }

  const metrics = [
    "marketFit", "financialViability", "competition",
    "scalability", "regulatoryEase", "indiaFit"
  ];
  const labels = [
    "Market Fit", "Financial", "Competition",
    "Scalability", "Regulatory", "India Fit"
  ];
  const colors = ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ec4899"];

  const chartData = metrics.map((m, i) => {
    const point: any = { subject: labels[i] };
    sessions.forEach((s, j) => {
      point[s.idea.substring(0, 12)] = s.result.scores[m as keyof typeof s.result.scores];
    });
    return point;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sessions.map((s, i) => (
          <div key={s._id} className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-3 space-y-1">
            <div className="text-xs text-neutral-500">{s.category}</div>
            <div className="text-sm font-bold text-white truncate">"{s.idea}"</div>
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded-full font-medium ${
                s.result.verdict === "STRONG" ? "bg-green-900/40 text-green-400" :
                s.result.verdict === "VIABLE" ? "bg-blue-900/40 text-blue-400" :
                "bg-red-900/40 text-red-400"
              }`}>{s.result.verdict}</span>
              <span className="text-orange-400 font-bold">{s.result.scores.indiaFit}/100</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-neutral-900/20 border border-neutral-800 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="#3f3f46" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#71717a" }} />
            {sessions.map((s, i) => (
              <Radar key={s._id} name={s.idea.substring(0, 20)} dataKey={s.idea.substring(0, 12)} stroke={colors[i % 5]} fill={colors[i % 5]} fillOpacity={0.15} />
            ))}
            <Legend wrapperStyle={{ fontSize: "10px", color: "#a1a1aa" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}