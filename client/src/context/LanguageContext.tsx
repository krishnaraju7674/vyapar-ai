import React, { createContext, useContext, useState, useCallback } from "react";

type Lang = "en" | "hi";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    "app.name": "Vyapar AI",
    "app.tagline": "Build something amazing in the Indian market.",
    "app.subtitle": "Tailored Business Planning for India",
    "nav.history": "My History",
    "nav.login": "Access Advisor Hub",
    "nav.logout": "Log Out",
    "nav.generator": "Idea Generator",
    "home.select_vertical": "Select Business Vertical",
    "home.analyze": "Analyze",
    "home.analyzing": "Analyzing...",
    "home.placeholder": "Type your startup or business idea here...",
    "home.recent": "Recent Analyses",
    "dashboard.report": "Business Plan & Metrics",
    "dashboard.advisor": "Interactive AI Advisor",
    "dashboard.export": "Export PDF Report",
    "dashboard.share": "Share Report",
    "dashboard.copied": "Link copied!",
    "dashboard.compare": "Compare",
    "dashboard.budget": "Budget Calculator",
    "dashboard.plan": "Business Plan",
    "history.title": "Your Saved Analysis History",
    "history.search": "Search ideas...",
    "history.filter": "Filter by category",
    "history.empty": "You haven't run any business analyses yet.",
    "history.analyze_first": "Analyze Your First Idea",
    "auth.login_title": "Vyapar Advisor Hub",
    "auth.login_desc": "Log in or register to save your analyses.",
    "auth.email": "Email Address",
    "auth.password": "Password",
    "auth.login": "Access Hub",
    "auth.register": "Create Account",
    "auth.toggle_login": "Already have an account? Log In",
    "auth.toggle_register": "Don't have an account? Register",
    "auth.forgot": "Forgot Password?",
    "auth.reset_sent": "Reset link generated! Check server console.",
    "budget.title": "Financial Projection Calculator",
    "budget.rent": "Monthly Rent (₹)",
    "budget.salary": "Staff Salaries (₹)",
    "budget.materials": "Raw Materials (₹)",
    "budget.utilities": "Utilities & Misc (₹)",
    "budget.marketing": "Marketing (₹)",
    "budget.revenue": "Expected Monthly Revenue (₹)",
    "budget.calculate": "Calculate Projections",
    "budget.total_cost": "Total Monthly Cost",
    "budget.profit": "Net Monthly Profit",
    "budget.margin": "Profit Margin",
    "budget.breakeven": "Est. Breakeven (months)",
    "compare.title": "Compare Business Ideas",
    "compare.select": "Select sessions to compare",
    "compare.empty": "Select 2+ sessions from your history",
    "verdict.STRONG": "STRONG",
    "verdict.VIABLE": "VIABLE",
    "verdict.RISKY": "RISKY",
    "verdict.WEAK": "WEAK",
    "plan.title": "Business Plan Generator",
    "plan.executive": "Executive Summary",
    "plan.financials": "Financial Projections",
    "plan.roadmap": "Execution Roadmap",
    "plan.market": "Market Analysis",
    "plan.download": "Download Business Plan",
    "share.whatsapp": "Share on WhatsApp",
    "share.copy": "Copy Link",
  },
  hi: {
    "app.name": "व्यापार AI",
    "app.tagline": "भारतीय बाजार में कुछ शानदार बनाएं।",
    "app.subtitle": "भारत के लिए अनुकूलित व्यवसाय योजना",
    "nav.history": "मेरा इतिहास",
    "nav.login": "एडवाइज़र हब तक पहुंचें",
    "nav.logout": "लॉग आउट",
    "nav.generator": "आइडिया जनरेटर",
    "home.select_vertical": "व्यवसाय वर्टिकल चुनें",
    "home.analyze": "विश्लेषण करें",
    "home.analyzing": "विश्लेषण हो रहा है...",
    "home.placeholder": "अपना स्टार्टअप या व्यवसाय आइडिया यहां टाइप करें...",
    "home.recent": "हाल के विश्लेषण",
    "dashboard.report": "व्यवसाय योजना और मेट्रिक्स",
    "dashboard.advisor": "इंटरैक्टिव AI सलाहकार",
    "dashboard.export": "PDF रिपोर्ट डाउनलोड करें",
    "dashboard.share": "रिपोर्ट साझा करें",
    "dashboard.copied": "लिंक कॉपी हो गया!",
    "dashboard.compare": "तुलना करें",
    "dashboard.budget": "बजट कैलकुलेटर",
    "dashboard.plan": "व्यवसाय योजना",
    "history.title": "आपके सहेजे गए विश्लेषण",
    "history.search": "आइडिया खोजें...",
    "history.filter": "श्रेणी के अनुसार फ़िल्टर",
    "history.empty": "आपने अभी तक कोई व्यवसाय विश्लेषण नहीं किया है।",
    "history.analyze_first": "अपना पहला आइडिया विश्लेषण करें",
    "auth.login_title": "व्यापार AI सलाहकार हब",
    "auth.login_desc": "अपने विश्लेषण सहेजने के लिए लॉग इन या रजिस्टर करें।",
    "auth.email": "ईमेल पता",
    "auth.password": "पासवर्ड",
    "auth.login": "हब तक पहुंचें",
    "auth.register": "खाता बनाएं",
    "auth.toggle_login": "पहले से खाता है? लॉग इन करें",
    "auth.toggle_register": "खाता नहीं है? रजिस्टर करें",
    "auth.forgot": "पासवर्ड भूल गए?",
    "auth.reset_sent": "रीसेट लिंक जनरेट हो गया! सर्वर कंसोल देखें।",
    "budget.title": "वित्तीय अनुमान कैलकुलेटर",
    "budget.rent": "मासिक किराया (₹)",
    "budget.salary": "कर्मचारी वेतन (₹)",
    "budget.materials": "कच्चा माल (₹)",
    "budget.utilities": "उपयोगिताएं और विविध (₹)",
    "budget.marketing": "मार्केटिंग (₹)",
    "budget.revenue": "अपेक्षित मासिक राजस्व (₹)",
    "budget.calculate": "अनुमान गणना करें",
    "budget.total_cost": "कुल मासिक लागत",
    "budget.profit": "शुद्ध मासिक लाभ",
    "budget.margin": "लाभ मार्जिन",
    "budget.breakeven": "अनुमानित ब्रेकईवन (महीने)",
    "compare.title": "व्यवसाय आइडियास की तुलना",
    "compare.select": "तुलना के लिए सेशन चुनें",
    "compare.empty": "अपने इतिहास से 2+ सेशन चुनें",
    "verdict.STRONG": "मजबूत",
    "verdict.VIABLE": "व्यवहार्य",
    "verdict.RISKY": "जोखिम भरा",
    "verdict.WEAK": "कमजोर",
    "plan.title": "व्यवसाय योजना जनरेटर",
    "plan.executive": "कार्यकारी सारांश",
    "plan.financials": "वित्तीय अनुमान",
    "plan.roadmap": "कार्यान्वयन रोडमैप",
    "plan.market": "बाजार विश्लेषण",
    "plan.download": "व्यवसाय योजना डाउनलोड करें",
    "share.whatsapp": "WhatsApp पर साझा करें",
    "share.copy": "लिंक कॉपी करें",
  },
};

const LanguageContext = createContext<{
  lang: Lang;
  toggle: () => void;
  t: (key: string) => string;
}>({ lang: "en", toggle: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "en");

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "hi" : "en";
      localStorage.setItem("lang", next);
      return next;
    });
  }, []);

  const t = useCallback((key: string) => translations[lang][key] || key, [lang]);

  return <LanguageContext.Provider value={{ lang, toggle, t }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}