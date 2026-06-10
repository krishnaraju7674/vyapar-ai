import React from "react";
import { cn } from "@/lib/utils";

interface VerdictBadgeProps {
  verdict: "STRONG" | "VIABLE" | "RISKY" | "WEAK" | string;
}

export default function VerdictBadge({ verdict }: VerdictBadgeProps) {
  const normVerdict = verdict.toUpperCase();
  
  const styles = {
    STRONG: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    VIABLE: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    RISKY: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    WEAK: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  const currentStyle = styles[normVerdict as keyof typeof styles] || "bg-neutral-500/10 text-neutral-400 border-neutral-500/30";

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border",
        currentStyle
      )}
    >
      ● {normVerdict}
    </span>
  );
}
