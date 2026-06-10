import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface ScoreRadarProps {
  scores: {
    marketFit: number;
    financialViability: number;
    competition: number;
    scalability: number;
    regulatoryEase: number;
    indiaFit: number;
  };
}

export default function ScoreRadar({ scores }: ScoreRadarProps) {
  const data = [
    { subject: "Market Fit", value: scores.marketFit },
    { subject: "Financial Viability", value: scores.financialViability },
    { subject: "Competition", value: scores.competition },
    { subject: "Scalability", value: scores.scalability },
    { subject: "Regulatory Ease", value: scores.regulatoryEase },
    { subject: "India Market Fit", value: scores.indiaFit },
  ];

  return (
    <div className="w-full h-[300px] md:h-[350px] bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex flex-col items-center justify-center backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-neutral-300 mb-2">Metrics Evaluation</h3>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 10, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#71717a" }} />
          <Radar
            name="Vyapar Score"
            dataKey="value"
            stroke="#f97316"
            fill="#ea580c"
            fillOpacity={0.3}
            isAnimationActive={true}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
