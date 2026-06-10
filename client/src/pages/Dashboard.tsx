import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FileText,
  TrendingUp,
  Award,
  Zap,
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  BarChart3,
  Calculator,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import ScoreRadar from "../components/ScoreRadar";
import VerdictBadge from "../components/VerdictBadge";
import RoadmapTimeline from "../components/RoadmapTimeline";
import CompetitorCard from "../components/CompetitorCard";
import ChatAdvisor from "../components/ChatAdvisor";
import ShareButtons from "../components/ShareButtons";
import BudgetCalculator from "../components/BudgetCalculator";

interface SessionData {
  _id: string;
  idea: string;
  category: string;
  chatHistory: any[];
  result: {
    verdict: string;
    summary: string;
    scores: {
      marketFit: number;
      financialViability: number;
      competition: number;
      scalability: number;
      regulatoryEase: number;
      indiaFit: number;
    };
    scoresExplanation: {
      marketFit: string;
      financialViability: string;
      competition: string;
      scalability: string;
      regulatoryEase: string;
      indiaFit: string;
    };
    competitors: Array<{ name: string; marketShare: string; description: string }>;
    roadmap: Array<{ phase: string; color: string; tasks: string[] }>;
    quickWins: string[];
    vyaparTip: string;
  };
}

export default function Dashboard({ apiUrl }: { apiUrl: string }) {
  const { id } = useParams<{ id: string }>();
  const { lang, toggle, t } = useLang();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"report" | "advisor" | "budget" | "plan">("report");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/analyze/session/${id}`);
        if (!response.ok) {
          throw new Error("Failed to load business session.");
        }
        const data = await response.json();
        setSession(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, apiUrl]);

  const handleExportPDF = () => {
    if (!session) return;

    const doc = new jsPDF();
    const r = session.result;

    // Report Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(234, 88, 12); // Orange theme color
    doc.text("Vyapar AI", 15, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Tailored Startup & Business Planning Hub for India", 15, 25);
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 28, 195, 28);

    // Business details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("BUSINESS IDEA REPORT", 15, 36);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Idea: "${session.idea}"`, 15, 42);
    doc.text(`Vertical: ${session.category}`, 15, 48);
    doc.text(`Verdict: ${r.verdict}`, 15, 54);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 60);

    // Summary
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary:", 15, 68);
    doc.setFont("helvetica", "normal");
    const splitSummary = doc.splitTextToSize(r.summary, 180);
    doc.text(splitSummary, 15, 74);

    // Scores table
    const scoreRows = [
      ["Market Fit", `${r.scores.marketFit}/100`, r.scoresExplanation.marketFit],
      ["Financial Viability", `${r.scores.financialViability}/100`, r.scoresExplanation.financialViability],
      ["Competition", `${r.scores.competition}/100`, r.scoresExplanation.competition],
      ["Scalability", `${r.scores.scalability}/100`, r.scoresExplanation.scalability],
      ["Regulatory Ease", `${r.scores.regulatoryEase}/100`, r.scoresExplanation.regulatoryEase],
      ["India Market Fit", `${r.scores.indiaFit}/100`, r.scoresExplanation.indiaFit],
    ];

    autoTable(doc, {
      startY: 85,
      head: [["Metric Dimension", "Score", "Evaluation & Context"]],
      body: scoreRows,
      theme: "striped",
      headStyles: { fillColor: [234, 88, 12] },
    });

    // Vyapar Tip
    let currentY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(234, 88, 12);
    doc.text("Exclusive Vyapar Tip (Indian Market Insight):", 15, currentY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const splitTip = doc.splitTextToSize(r.vyaparTip, 180);
    doc.text(splitTip, 15, currentY + 6);

    // Competitors
    currentY = currentY + 12 + splitTip.length * 5;
    doc.setFont("helvetica", "bold");
    doc.text("Indian Market Competitors & Alternatives:", 15, currentY);
    const compRows = r.competitors.map(c => [c.name, c.marketShare, c.description]);
    autoTable(doc, {
      startY: currentY + 4,
      head: [["Name", "Market Position", "Description"]],
      body: compRows,
      theme: "grid",
      headStyles: { fillColor: [50, 50, 50] },
    });

    // Add page for Roadmap
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(234, 88, 12);
    doc.text("90-Day Step-by-Step Execution Roadmap", 15, 20);
    doc.setDrawColor(234, 88, 12);
    doc.line(15, 24, 195, 24);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    let roadmapY = 32;
    r.roadmap.forEach((step, idx) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${step.phase}:`, 15, roadmapY);
      doc.setFont("helvetica", "normal");
      roadmapY += 6;
      step.tasks.forEach(t => {
        const splitTask = doc.splitTextToSize(`- ${t}`, 170);
        doc.text(splitTask, 20, roadmapY);
        roadmapY += 5 * splitTask.length + 1;
      });
      roadmapY += 4;
    });

    // Quick wins
    roadmapY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Quick Wins (Actionable in Minutes):", 15, roadmapY);
    doc.setFont("helvetica", "normal");
    roadmapY += 6;
    r.quickWins.forEach(qw => {
      const splitQw = doc.splitTextToSize(`- ${qw}`, 170);
      doc.text(splitQw, 20, roadmapY);
      roadmapY += 5 * splitQw.length + 1;
    });

    doc.save(`vyapar-ai-${session._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm text-neutral-400 animate-pulse">Consulting live Indian databases & competitors...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 space-y-4">
        <p className="text-red-500 text-sm">{error || "Failed to load session."}</p>
        <Link to="/" className="text-sm text-orange-500 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  const { result } = session;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-900 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t("nav.generator")}</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="flex items-center gap-1 text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            {lang === "en" ? "HI" : "EN"}
          </button>
          <ShareButtons sessionId={session?._id || id || ""} />
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 text-xs bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 transition-all shadow-md"
          >
            <FileText className="w-4 h-4" />
            {t("dashboard.export")}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Banner Section */}
        <section className="p-6 bg-neutral-900/40 border border-neutral-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-sm">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xs bg-neutral-800 border border-neutral-700 px-3 py-1 rounded-full text-neutral-300 font-medium">
                {session.category}
              </span>
              <VerdictBadge verdict={result.verdict} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              "{session.idea}"
            </h1>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {result.summary}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-neutral-950 p-4 border border-neutral-800 rounded-xl md:w-48 justify-center shrink-0 shadow-inner">
            <div className="text-center">
              <div className="text-3xl font-black text-orange-500">{result.scores.indiaFit}/100</div>
              <div className="text-[10px] text-neutral-500 uppercase font-semibold tracking-wider mt-1">India Fit Score</div>
            </div>
          </div>
        </section>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-neutral-800 gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("report")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "report"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 inline mr-1" />
            {t("dashboard.report")}
          </button>
          <button
            onClick={() => setActiveTab("advisor")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "advisor"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <svg className="w-3.5 h-3.5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            {t("dashboard.advisor")}
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "budget"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Calculator className="w-3.5 h-3.5 inline mr-1" />
            {t("dashboard.budget")}
          </button>
          <button
            onClick={() => setActiveTab("plan")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "plan"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            {t("dashboard.plan")}
          </button>
        </div>

        {activeTab === "report" ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Score Grid Info Row */}
            <section className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <MiniScoreCard label="Market Fit" score={result.scores.marketFit} />
              <MiniScoreCard label="Financial Viability" score={result.scores.financialViability} />
              <MiniScoreCard label="Competition" score={result.scores.competition} />
              <MiniScoreCard label="Scalability" score={result.scores.scalability} />
              <MiniScoreCard label="Regulatory Ease" score={result.scores.regulatoryEase} />
              <MiniScoreCard label="India Fit" score={result.scores.indiaFit} isHighlight />
            </section>

            {/* Dynamic Visualization Layer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (Charts, Competitors) */}
              <div className="lg:col-span-7 space-y-8">
                <div className="bg-neutral-950 rounded-xl p-1 border border-neutral-900 shadow-xl">
                  <ScoreRadar scores={result.scores} />
                </div>

                {/* Competitor Listing */}
                <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-6">
                  <CompetitorCard competitors={result.competitors} />
                </div>
              </div>

              {/* Right Column (Roadmap, Tip) */}
              <div className="lg:col-span-5 space-y-8">
                {/* Custom Vyapar Tip */}
                <div className="p-5 bg-gradient-to-tr from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 rounded-2xl space-y-3 relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl" />
                  <h3 className="font-extrabold text-sm text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Exclusive Vyapar Tip
                  </h3>
                  <p className="text-sm text-neutral-200 leading-relaxed font-medium">
                    "{result.vyaparTip}"
                  </p>
                </div>

                {/* 90-Day Timeline */}
                <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-6">
                  <RoadmapTimeline roadmap={result.roadmap} />
                </div>

                {/* Quick Wins */}
                <div className="p-5 bg-neutral-900/30 border border-neutral-800 rounded-2xl space-y-3">
                  <h3 className="font-bold text-sm text-neutral-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Quick Wins (Action in Minutes)
                  </h3>
                  <ul className="space-y-2.5">
                    {result.quickWins.map((qw, qidx) => (
                      <li key={qidx} className="text-xs text-neutral-400 flex items-start gap-2">
                        <span className="text-amber-500 font-bold">✓</span>
                        <span>{qw}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "budget" ? (
          <div className="max-w-3xl mx-auto animate-fadeIn py-4">
            <BudgetCalculator />
          </div>
        ) : activeTab === "plan" ? (
          <div className="space-y-6 animate-fadeIn py-4">
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                {t("plan.title")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleExportPDF}
                  className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-orange-500/50 transition-all text-left space-y-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-orange-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{t("plan.executive")}</h4>
                  <p className="text-[10px] text-neutral-400">Full report with scores, roadmap, and competitors</p>
                </button>
                <button
                  onClick={() => setActiveTab("budget")}
                  className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-orange-500/50 transition-all text-left space-y-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-orange-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{t("plan.financials")}</h4>
                  <p className="text-[10px] text-neutral-400">Budget projection and breakeven analysis</p>
                </button>
                <button
                  onClick={() => setActiveTab("report")}
                  className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-orange-500/50 transition-all text-left space-y-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-orange-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{t("plan.roadmap")}</h4>
                  <p className="text-[10px] text-neutral-400">90-day execution plan with milestones</p>
                </button>
              </div>
              <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-3">
                <h4 className="text-sm font-bold text-orange-400">{t("plan.executive")}</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{result.summary}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-neutral-500">Verdict:</span> <span className="text-white font-bold">{result.verdict}</span></div>
                  <div><span className="text-neutral-500">India Fit:</span> <span className="text-orange-400 font-bold">{result.scores.indiaFit}/100</span></div>
                  <div><span className="text-neutral-500">Market Fit:</span> <span className="text-white">{result.scores.marketFit}/100</span></div>
                  <div><span className="text-neutral-500">Financial:</span> <span className="text-white">{result.scores.financialViability}/100</span></div>
                </div>
              </div>
              <button
                onClick={handleExportPDF}
                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {t("plan.download")}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn py-4">
            <div className="text-center space-y-2 mb-2">
              <h2 className="text-xl font-bold text-white">Dedicated AI Advisor Portal</h2>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Ask follow-up questions about your business plan, government Mudra loans, local licensing, or marketing channels in India.
              </p>
            </div>
            
            <ChatAdvisor
              sessionId={session._id}
              initialHistory={session.chatHistory}
              apiUrl={apiUrl}
            />

            <div className="p-4 bg-neutral-900/20 border border-neutral-800 rounded-xl space-y-2.5">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Suggested Questions:</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="bg-neutral-950 border border-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg">
                  "How do I apply for a Mudra Loan for my business?"
                </div>
                <div className="bg-neutral-950 border border-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg">
                  "What licenses and GST registrations are required?"
                </div>
                <div className="bg-neutral-950 border border-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg">
                  "Where and how do I find my first 10 customers?"
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="text-center text-neutral-600 py-6 border-t border-neutral-900 text-xs">
        © {new Date().getFullYear()} Vyapar AI • Tailored Business Planning for India
      </footer>
    </div>
  );
}

interface MiniScoreCardProps {
  label: string;
  score: number;
  isHighlight?: boolean;
}

function MiniScoreCard({ label, score, isHighlight }: MiniScoreCardProps) {
  return (
    <div
      className={`p-3.5 border rounded-xl flex flex-col justify-between h-20 shadow-sm transition-all hover:scale-102 ${
        isHighlight
          ? "bg-gradient-to-br from-orange-500/20 to-transparent border-orange-500/30"
          : "bg-neutral-900/40 border-neutral-800/70"
      }`}
    >
      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline justify-between mt-1">
        <span className={`text-xl font-extrabold ${isHighlight ? "text-orange-400" : "text-white"}`}>
          {score}
        </span>
        <span className="text-[10px] text-neutral-500">/100</span>
      </div>
    </div>
  );
}
