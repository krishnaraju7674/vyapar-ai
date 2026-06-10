"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  FileUp,
  MonitorIcon,
  CircleUserRound,
  ArrowUpIcon,
  Paperclip,
  Code2,
  Palette,
  Layers,
  Rocket,
} from "lucide-react";

interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: AutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`; // reset first
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

interface RuixenMoonChatProps {
  onAnalyze?: (idea: string) => void;
  isLoading?: boolean;
}

export default function RuixenMoonChat({ onAnalyze, isLoading }: RuixenMoonChatProps) {
  const [message, setMessage] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 48,
    maxHeight: 150,
  });

  const handleSend = () => {
    if (message.trim() && onAnalyze && !isLoading) {
      onAnalyze(message.trim());
      setMessage("");
      adjustHeight(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (label: string) => {
    if (onAnalyze && !isLoading) {
      onAnalyze(label);
    }
  };

  return (
    <div
      className="relative w-full h-[65vh] md:h-[70vh] bg-cover bg-center flex flex-col items-center justify-between rounded-2xl overflow-hidden shadow-2xl border border-neutral-800"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')", // Beautiful premium abstract background
        backgroundAttachment: "scroll",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      {/* Centered AI Title */}
      <div className="flex-1 w-full flex flex-col items-center justify-center z-10 px-4">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-500 drop-shadow-md">
            Vyapar AI
          </h1>
          <p className="mt-3 text-neutral-300 max-w-md mx-auto text-sm md:text-base">
            Build something amazing in the Indian market. Just start typing your business idea below.
          </p>
        </div>
      </div>

      {/* Input Box Section */}
      <div className="w-full max-w-3xl px-4 pb-8 z-10">
        <div className="relative bg-black/70 backdrop-blur-md rounded-xl border border-neutral-700/60 shadow-xl">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your startup or business idea here (e.g. Kirana organic grocery delivery in Pune)..."
            className={cn(
              "w-full px-4 py-3.5 resize-none border-none",
              "bg-transparent text-white text-sm",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-neutral-400 min-h-[48px]"
            )}
            style={{ overflow: "hidden" }}
            disabled={isLoading}
          />

          {/* Footer Buttons */}
          <div className="flex items-center justify-between p-3 border-t border-neutral-800/50">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-white hover:bg-neutral-800"
              disabled={isLoading}
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all",
                  message.trim() && !isLoading
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90 font-medium shadow-lg"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowUpIcon className="w-4 h-4" />
                )}
                <span className="text-xs">{isLoading ? "Analyzing..." : "Analyze"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center flex-wrap gap-2 md:gap-3 mt-6">
          <QuickAction
            icon={<Code2 className="w-3.5 h-3.5" />}
            label="Chai Stall Chain"
            onClick={() => handleQuickAction("A high-end regional chai stall franchise targeting Tier 2 tech hubs")}
            disabled={isLoading}
          />
          <QuickAction
            icon={<Rocket className="w-3.5 h-3.5" />}
            label="Kirana B2B SaaS"
            onClick={() => handleQuickAction("A WhatsApp-integrated ledger and inventory tool for kirana shops")}
            disabled={isLoading}
          />
          <QuickAction
            icon={<Layers className="w-3.5 h-3.5" />}
            label="Handicraft Export"
            onClick={() => handleQuickAction("Direct-to-consumer platform selling Rajasthani handicrafts to international buyers")}
            disabled={isLoading}
          />
          <QuickAction
            icon={<Palette className="w-3.5 h-3.5" />}
            label="AgriTech Cold Chain"
            onClick={() => handleQuickAction("Solar-powered cold storage rentals for smallholder farmers in Maharashtra")}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

function QuickAction({ icon, label, onClick, disabled }: QuickActionProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-full border-neutral-700/60 bg-black/40 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all text-xs h-8 px-3"
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}
