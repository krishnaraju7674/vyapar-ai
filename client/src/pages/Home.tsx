import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import RuixenMoonChat from "@/components/ui/ruixen-moon-chat";
import { useLang } from "@/context/LanguageContext";
import { BookOpen, FolderHeart, Landmark, Clock, Globe, Search } from "lucide-react";

export default function Home({ apiUrl }: { apiUrl: string }) {
  const navigate = useNavigate();
  const { lang, toggle, t } = useLang();
  const [category, setCategory] = useState("Retail & Kirana");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSessions, setRecentSessions] = useState<Array<{ id: string; idea: string; category: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("recentSessions");
    if (raw) {
      try { setRecentSessions(JSON.parse(raw)); } catch {}
    }
  }, []);

  const saveGuestSession = (sessionId: string, idea: string) => {
    const raw = localStorage.getItem("recentSessions");
    let list: Array<{ id: string; idea: string; category: string }> = [];
    if (raw) try { list = JSON.parse(raw); } catch {}
    list = list.filter(s => s.id !== sessionId);
    list.unshift({ id: sessionId, idea, category });
    if (list.length > 10) list = list.slice(0, 10);
    localStorage.setItem("recentSessions", JSON.stringify(list));
    setRecentSessions(list);
  };

  const categories = [
    "Retail & Kirana",
    "AgriTech & Farming",
    "FinTech & MicroLoans",
    "E-Commerce & D2C",
    "Food & Beverage Franchises",
    "Logistics & Warehousing",
    "EdTech & Training",
    "HealthTech & Ayurveda",
    "Local MSME & Artisans"
  ];

  const handleAnalyze = async (idea: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        headers,
        body: JSON.stringify({ idea, category }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the business idea. Please try again.");
      }

      const data = await response.json();
      if (data.success && data.sessionId) {
        saveGuestSession(data.sessionId, idea);
        navigate(`/dashboard/${data.sessionId}`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const token = localStorage.getItem("token");

  const filteredSuggestions = searchTerm.length > 0
    ? recentSessions.filter(s => s.idea.toLowerCase().includes(searchTerm.toLowerCase()))
    : recentSessions;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-900 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-black text-lg shadow-lg">
            V
          </div>
          <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            {t("app.name")}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="flex items-center gap-1 text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-lg text-neutral-400 hover:text-white transition-colors">
            <Globe className="w-3 h-3" />
            {lang === "en" ? "HI" : "EN"}
          </button>
          <Link to="/demo" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Demo UI
          </Link>
          {token ? (
            <>
              <Link to="/history" className="text-sm text-neutral-400 hover:text-white transition-colors">
                {t("nav.history")}
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs border border-neutral-800 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 transition-all"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <Link
              to="/history"
              className="text-xs bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold text-black transition-all"
            >
              {t("nav.login")}
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Search / Autocomplete Bar */}
        <div className="relative max-w-xl mx-auto w-full">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
              onFocus={(e) => { setShowSuggestions(true); e.target.select(); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
              placeholder={t("home.placeholder")}
              className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(""); setShowSuggestions(false); }}
                className="absolute right-3 top-2.5 text-neutral-500 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          {showSuggestions && searchTerm.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl z-20">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map(s => (
                  <div
                    key={s.id}
                    onMouseDown={() => navigate(`/dashboard/${s.id}`)}
                    className="px-4 py-2.5 hover:bg-neutral-900 cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-sm text-neutral-200 truncate">"{s.idea}"</span>
                    <span className="text-[10px] text-neutral-500 shrink-0 ml-2">{s.category}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-neutral-500 text-center">
                  {recentSessions.length === 0
                    ? "No recent analyses yet. Type a business idea above and analyze it!"
                    : `No results for "${searchTerm}"`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category Picker Selector */}
        <div className="flex flex-col items-center space-y-3">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
            <FolderHeart className="w-3.5 h-3.5 text-orange-500" />
            {t("home.select_vertical")}
          </label>
          <div className="flex items-center justify-center flex-wrap gap-2 max-w-3xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                  category === cat
                    ? "bg-white text-black border-white font-medium shadow-md"
                    : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-950/40 border border-red-900/40 text-red-400 rounded-xl text-sm max-w-xl mx-auto text-center">
            {error}
          </div>
        )}

        {/* Integrated Chat Component */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <RuixenMoonChat onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>

        {/* Recent Guest Sessions */}
        {recentSessions.length > 0 && (
          <div className="max-w-3xl mx-auto w-full space-y-3">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {t("home.recent")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSessions.slice(0, 5).map(s => (
                <button
                  key={s.id}
                  onClick={() => navigate(`/dashboard/${s.id}`)}
                  className="text-xs bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg transition-all truncate max-w-[200px]"
                >
                  "{s.idea}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feature Highlights section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 bg-neutral-900/30 border border-neutral-900 rounded-xl space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="font-semibold text-white text-base">Indian Context Engine</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Analyzes micro-market behaviors in Tier 1, 2, and 3 regions, factoring in regional regulations and demographics.
            </p>
          </div>
          
          <div className="p-5 bg-neutral-900/30 border border-neutral-900 rounded-xl space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="font-semibold text-white text-base">Mudra & MSME Schemes</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Identifies government schemes, subsidies, and credit-linkages relevant to your specific sector.
            </p>
          </div>

          <div className="p-5 bg-neutral-900/30 border border-neutral-900 rounded-xl space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white text-base">Search Grounding</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Leverages live Google Search feeds to benchmark your business idea against actual active competitors in India.
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="text-center text-neutral-600 py-6 border-t border-neutral-900 text-xs">
        © {new Date().getFullYear()} Vyapar AI • Tailored Business Planning for India
      </footer>
    </div>
  );
}
