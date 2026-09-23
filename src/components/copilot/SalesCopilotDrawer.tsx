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
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 animate-slideInRight">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Sales Copilot
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                AI Intelligence
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Grounded strictly in workspace records</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Suggested prompts carousel */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/30 overflow-x-auto flex gap-2 no-scrollbar">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/30 border border-slate-700/80 text-slate-300 transition-all font-medium"
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
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-cyan-500 text-slate-950 font-medium rounded-tr-none"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm"
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 w-fit">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
            Analyzing telemetry & calculating priorities...
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/80">
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
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <Button
            type="submit"
            variant="gradient"
            size="sm"
            disabled={!input.trim() || loading}
            className="p-2"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
