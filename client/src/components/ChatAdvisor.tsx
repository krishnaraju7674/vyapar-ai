import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  sender: "user" | "ai";
  message: string;
  timestamp?: string | Date;
}

interface ChatAdvisorProps {
  sessionId: string;
  initialHistory: Message[];
  apiUrl: string;
}

export default function ChatAdvisor({ sessionId, initialHistory, apiUrl }: ChatAdvisorProps) {
  const [history, setHistory] = useState<Message[]>(initialHistory);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(initialHistory);
  }, [initialHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    setMessage("");
    setLoading(true);

    // Optimistically add user message
    setHistory((prev) => [...prev, { sender: "user", message: userMsg }]);

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: userMsg }),
      });

      if (!response.ok) {
        throw new Error("Failed to get chat response");
      }

      const data = await response.json();
      if (data.success) {
        setHistory(data.chatHistory);
      }
    } catch (err) {
      console.error(err);
      setHistory((prev) => [
        ...prev,
        { sender: "ai", message: "Sorry, I had trouble connecting. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-neutral-950/60 border-b border-neutral-800">
        <MessageSquare className="w-4 h-4 text-orange-500" />
        <h3 className="font-semibold text-sm text-neutral-200">Vyapar Chat Advisor</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-orange-500 text-white rounded-br-none"
                  : "bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700/40"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-none px-4 py-2.5 bg-neutral-800 border border-neutral-700/40 text-neutral-400 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-neutral-800 bg-neutral-950/60 flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask follow-up questions..."
          className="flex-1 bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
          disabled={loading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || loading}
          className="bg-orange-500 hover:bg-orange-600 text-white transition-colors h-9 w-9 rounded-lg"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
