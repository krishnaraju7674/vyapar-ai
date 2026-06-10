import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Lock, UserPlus, Key, Search, Filter, GitCompare, X } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import VerdictBadge from "../components/VerdictBadge";
import CompareView from "../components/CompareView";

interface HistoryItem {
  _id: string;
  idea: string;
  category: string;
  result: {
    verdict: string;
    scores: {
      indiaFit: number;
    };
  };
  createdAt: string;
}

export default function History({ apiUrl }: { apiUrl: string }) {
  const navigate = useNavigate();
  const { t } = useLang();
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/analyze/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          handleLogout();
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to load history.");
      }

      const data = await response.json();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setHistory([]);
  };

  const allCategories = useMemo(() => {
    const cats = new Set(history.map(h => h.category));
    return ["All", ...Array.from(cats)];
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter(h => {
      const matchesSearch = h.idea.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || h.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [history, searchQuery, categoryFilter]);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between p-4">
        <header className="max-w-6xl w-full mx-auto py-4">
          <Link to="/" className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Generator
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-md bg-neutral-900/40 border border-neutral-800 rounded-2xl p-8 space-y-6 backdrop-blur-md">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Vyapar Advisor Hub</h2>
              <p className="text-xs text-neutral-400">
                Log in or register to save your Indian business analyses, review 90-day roadmaps, and chat with AI.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900/40 text-red-400 text-xs rounded-lg text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">{t("auth.email")}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">@</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@domain.com"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-neutral-700 text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">{t("auth.password")}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                    <Key className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-neutral-700 text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                {!isRegister && (
                  <div className="text-right mt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!email) { setError("Enter your email first"); return; }
                        setLoading(true);
                        try {
                          const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email }),
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error);
                          setError(null);
                          alert(t("auth.reset_sent"));
                        } catch (err: any) {
                          setError(err.message);
                        } finally { setLoading(false); }
                      }}
                      className="text-[10px] text-orange-400 hover:text-orange-300"
                    >
                      {t("auth.forgot")}
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 transition-colors text-black font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 shadow-md"
              >
                {isRegister ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {loading ? "Please wait..." : isRegister ? t("auth.register") : t("auth.login")}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-orange-400 hover:underline hover:text-orange-300"
              >
                {isRegister ? t("auth.toggle_login") : t("auth.toggle_register")}
              </button>
            </div>
          </div>
        </main>

        <footer className="text-center text-neutral-700 text-[10px] py-4">
          © {new Date().getFullYear()} Vyapar AI • Secured Advisor Hub
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-900 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Idea Generator</span>
        </Link>
        <button
          onClick={handleLogout}
          className="text-xs border border-neutral-800 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 transition-all"
        >
          Log Out
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <h1 className="text-2xl font-extrabold text-white">{t("history.title")}</h1>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => { setCompareMode(!compareMode); setCompareIds([]); }}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                compareMode ? "bg-orange-500 text-black font-semibold" : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              {t("dashboard.compare")}
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        {history.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("history.search")}
                className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-neutral-700"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-white text-sm rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-neutral-700 appearance-none"
              >
                {allCategories.map(c => (
                  <option key={c} value={c}>{c === "All" ? t("history.filter") : c}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-950/40 border border-red-900/40 text-red-400 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="py-20 text-center bg-neutral-900/20 border border-neutral-900 rounded-2xl space-y-4">
            <p className="text-sm text-neutral-400">{t("history.empty")}</p>
            <Link
              to="/"
              className="inline-flex bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-semibold text-black transition-colors"
            >
              {t("history.analyze_first")}
            </Link>
          </div>
        ) : compareMode ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-400">{t("compare.select")} ({compareIds.length} selected)</p>
              {compareIds.length >= 2 && (
                <div className="space-x-2">
                  <button
                    onClick={() => setCompareIds([])}
                    className="text-xs text-neutral-500 hover:text-white px-2 py-1"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredHistory.map(item => {
                const selected = compareIds.includes(item._id);
                return (
                  <div
                    key={item._id}
                    onClick={() => toggleCompare(item._id)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selected
                        ? "bg-orange-500/10 border-orange-500/50 ring-1 ring-orange-500/30"
                        : "bg-neutral-900/40 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-400">{item.category}</span>
                      {selected && <X className="w-3.5 h-3.5 text-orange-400" />}
                    </div>
                    <h3 className="font-bold text-sm text-white">"{item.idea}"</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <VerdictBadge verdict={item.result?.verdict || "VIABLE"} />
                      <span className="text-xs text-orange-400 font-bold">{item.result?.scores?.indiaFit || 0}/100</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {compareIds.length >= 2 && (
              <CompareView sessions={filteredHistory.filter(h => compareIds.includes(h._id)) as any} />
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(
              (() => {
                const today = new Date().toLocaleDateString();
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterday = yesterdayDate.toLocaleDateString();

                const groups: { [key: string]: HistoryItem[] } = {
                  "Today": [],
                  "Yesterday": [],
                  "Earlier": []
                };

                filteredHistory.forEach(item => {
                  const itemDate = new Date(item.createdAt).toLocaleDateString();
                  if (itemDate === today) {
                    groups["Today"].push(item);
                  } else if (itemDate === yesterday) {
                    groups["Yesterday"].push(item);
                  } else {
                    groups["Earlier"].push(item);
                  }
                });

                return groups;
              })()
            ).map(([groupName, groupItems]) => {
              if (groupItems.length === 0) return null;
              return (
                <div key={groupName} className="space-y-3">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">
                    {groupName}
                  </h3>
                  <div className="space-y-4">
                    {groupItems.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => navigate(`/dashboard/${item._id}`)}
                        className="p-5 bg-neutral-900/40 border border-neutral-800 rounded-2xl hover:border-neutral-700 hover:bg-neutral-900/60 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-400 font-medium">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-bold text-white text-base">"{item.idea}"</h3>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4 border-t border-neutral-800/50 md:border-none pt-3 md:pt-0">
                          <div className="text-right">
                            <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">India Fit</div>
                            <div className="text-base font-bold text-orange-400">{item.result?.scores?.indiaFit || 0}/100</div>
                          </div>
                          <VerdictBadge verdict={item.result?.verdict || "VIABLE"} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
