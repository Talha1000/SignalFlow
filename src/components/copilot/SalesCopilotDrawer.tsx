"use client";

import React, { useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
}

export function SalesCopilotDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "copilot",
      text: "Hello Alex! I'm your SignalFlow Sales Copilot. I'm actively analyzing signals across your 65 leads and 16 companies. What would you like to know?",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "Which leads should I contact today?",
    "Why did our pipeline score surge this week?",
    "Show me accounts with high buying intent",
    "Which leads became cold?",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSend }),
      });

      const data = await res.json();
      const copilotMsg: ChatMessage = {
        id: `c-${Date.now()}`,
        sender: "copilot",
        text: data.answer || "I reviewed your workspace data. Let me know if you need more details.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, copilotMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "copilot",
          text: "I was unable to retrieve live telemetry right now. Please try again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#181b1c] light:bg-[#ffffff] text-white light:text-[#121212] border-l border-white/10 light:border-black/10 shadow-2xl flex flex-col animate-slideInRight">
      {/* Header */}
      <div className="p-4 border-b border-white/10 light:border-black/10 flex items-center justify-between bg-[#1e2224] light:bg-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-[#38b6ff]/10 light:bg-[#0284c7]/10 text-[#38b6ff] light:text-[#0284c7] border border-[#38b6ff]/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white light:text-[#121212] flex items-center gap-1.5">
              Sales Copilot
              <span className="text-[10px] font-mono text-[#38b6ff] light:text-[#0284c7] bg-[#38b6ff]/10 light:bg-[#0284c7]/10 px-1.5 py-0.2 rounded border border-[#38b6ff]/20">
                AI Intelligence
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 light:text-[#787e82]">Grounded strictly in workspace records</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 light:text-[#787e82] hover:text-white light:hover:text-[#121212] hover:bg-[#252a2b] light:hover:bg-[#f0f2f3] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Suggested prompts carousel */}
      <div className="p-3 border-b border-white/10 light:border-black/10 bg-[#1e2224]/50 light:bg-[#fafafa] overflow-x-auto flex gap-2 no-scrollbar">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-[#252a2b] light:bg-[#f0f2f3] hover:bg-[#38b6ff]/10 hover:text-[#38b6ff] light:hover:text-[#0284c7] hover:border-[#38b6ff]/30 border border-white/10 light:border-black/10 text-slate-300 light:text-[#4a5053] transition-all font-medium cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-[#38b6ff] text-[#121212] light:bg-[#0284c7] light:text-white font-medium rounded-tr-none shadow-sm"
                  : "bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 text-white light:text-[#121212] rounded-tl-none shadow-sm"
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
            </div>
            <span className="text-[10px] text-slate-400 light:text-[#787e82] mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 text-xs text-slate-400 light:text-[#787e82] w-fit">
            <Sparkles className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7] animate-spin" />
            Analyzing telemetry & calculating priorities...
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-white/10 light:border-black/10 bg-[#1e2224] light:bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Copilot about leads, scoring, or accounts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 light:border-black/15 bg-[#252a2b] light:bg-[#f0f2f3] px-3.5 py-2 text-xs text-white light:text-[#121212] placeholder-slate-400 light:placeholder-[#8a9296] focus:border-[#38b6ff] light:focus:border-[#0284c7] focus:outline-none"
          />
          <Button
            type="submit"
            variant="pill"
            size="sm"
            disabled={!input.trim() || loading}
            className="p-2 shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
