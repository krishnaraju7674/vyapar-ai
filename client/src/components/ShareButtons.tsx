import React, { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";

export default function ShareButtons({ sessionId }: { sessionId: string }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/dashboard/${sessionId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Check out my business analysis on Vyapar AI: ${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={shareWhatsApp}
          className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-all"
          title={t("share.whatsapp")}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>
        <button
          onClick={copyLink}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all ${
            copied
              ? "bg-green-600 text-white"
              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          }`}
          title={t("share.copy")}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? t("dashboard.copied") : t("share.copy")}</span>
        </button>
      </div>
    </div>
  );
}