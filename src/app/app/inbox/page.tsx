"use client";

import React, { useState } from "react";
import {
  Inbox,
  Sparkles,
  Send,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Bot,
  Flame,
} from "lucide-react";
import { IntentBadge, ScoreBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Thread {
  id: string;
  sender: string;
  title: string;
  company: string;
  score: number;
  subject: string;
  snippet: string;
  sentiment: "MEETING_REQUESTED" | "TECHNICAL_INQUIRY" | "OBJECTION" | "INTERESTED";
  time: string;
  unread: boolean;
  history: Array<{ sender: "prospect" | "rep"; text: string; time: string }>;
}

const mockThreads: Thread[] = [
  {
    id: "th-1",
    sender: "Sarah Chen",
    title: "VP of Engineering",
    company: "Acme Technologies",
    score: 91,
    subject: "Re: Prioritizing revenue signals at Acme Technologies",
    snippet: "Hi Liam, thanks for reaching out. We are actually evaluating customer signal latency right now. Do you have time this Thursday at 2 PM PST?",
    sentiment: "MEETING_REQUESTED",
    time: "14m ago",
    unread: true,
    history: [
      {
        sender: "rep",
        text: "Hi Sarah, noticed your team exploring real-time customer signals. Would you be open to a 15-minute briefing on our tenant isolation architecture?",
        time: "Yesterday 10:18 AM",
      },
      {
        sender: "prospect",
        text: "Hi Liam, thanks for reaching out. We are actually evaluating customer signal latency right now. Do you have time this Thursday at 2 PM PST?",
        time: "Today 10:42 AM",
      },
    ],
  },
  {
    id: "th-2",
    sender: "Victor Stone",
    title: "CIO",
    company: "SecurityZero Corp",
    score: 92,
    subject: "Re: Questions on the SecurityZero evaluation?",
    snippet: "Maya, can you send over your SOC2 Type II report and verify if your webhooks support HMAC SHA256 signatures?",
    sentiment: "TECHNICAL_INQUIRY",
    time: "1h ago",
    unread: true,
    history: [
      {
        sender: "rep",
        text: "Hi Victor, saw you tested our webhook endpoints today. Happy to answer questions or set up a dedicated sandbox.",
        time: "Today 8:30 AM",
      },
      {
        sender: "prospect",
        text: "Maya, can you send over your SOC2 Type II report and verify if your webhooks support HMAC SHA256 signatures?",
        time: "Today 9:15 AM",
      },
    ],
  },
  {
    id: "th-3",
    sender: "Tobias Meyer",
    title: "COO",
    company: "PeakFlow Systems",
    score: 86,
    subject: "Re: Quick follow-up + technical benchmark",
    snippet: "We like the product but we are currently locked into a contract through November. What does migration look like?",
    sentiment: "OBJECTION",
    time: "3h ago",
    unread: false,
    history: [
      {
        sender: "rep",
        text: "Hi Tobias, here is our recent benchmark comparing signal latency vs conversion rate.",
        time: "2 days ago",
      },
      {
        sender: "prospect",
        text: "We like the product but we are currently locked into a contract through November. What does migration look like?",
        time: "Today 7:45 AM",
      },
    ],
  },
];

export default function InboxPage() {
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [selectedThread, setSelectedThread] = useState<Thread>(mockThreads[0]);
  const [replyText, setReplyText] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  const handleGenerateAiReply = () => {
    setIsDrafting(true);
    setTimeout(() => {
      if (selectedThread.sentiment === "MEETING_REQUESTED") {
        setReplyText(
          `Hi ${selectedThread.sender.split(" ")[0]},\n\nThursday at 2 PM PST works perfectly for me. I've sent a calendar invite with the Zoom link.\n\nLooking forward to walking through the architecture.\n\nBest,\nLiam Vance`
        );
      } else if (selectedThread.sentiment === "TECHNICAL_INQUIRY") {
        setReplyText(
          `Hi ${selectedThread.sender.split(" ")[0]},\n\nAttached is our latest SOC2 Type II compliance audit packet. And yes, all SignalFlow webhooks are cryptographically signed using HMAC SHA-256 with workspace secret rotation.\n\nHappy to walk your security team through the details.\n\nBest,\nMaya Patel`
        );
      } else {
        setReplyText(
          `Hi ${selectedThread.sender.split(" ")[0]},\n\nUnderstood on the November timeline. We offer free parallel staging so you can test SignalFlow in sandbox mode with zero migration risk until your current renewal.\n\nBest,\nLiam`
        );
      }
      setIsDrafting(false);
    }, 600);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    const newEntry = {
      sender: "rep" as const,
      text: replyText,
      time: "Just now",
    };
    setSelectedThread((prev) => ({
      ...prev,
      history: [...prev.history, newEntry],
    }));
    setReplyText("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
          <Inbox className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
          Conversations & Reply Inbox
        </h1>
        <p className="text-xs text-slate-400 light:text-[#787e82] mt-0.5">
          Prospect replies automatically halt outgoing sequences and classify buyer intent.
        </p>
      </div>

      <div className="flex-1 rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0 shadow-sm">
        {/* Left Column: Thread List */}
        <div className="md:col-span-5 border-r border-white/10 light:border-black/10 flex flex-col min-h-0 bg-[#181b1c] light:bg-[#fafafa]">
          <div className="p-3.5 border-b border-white/10 light:border-black/10 bg-[#1e2224] light:bg-white flex items-center justify-between text-xs text-slate-400 light:text-[#787e82]">
            <span className="font-semibold text-white light:text-[#121212]">Active Discussions ({threads.length})</span>
            <span className="text-[10px] font-mono text-[#38b6ff] light:text-[#0284c7]">Auto-Stop Active</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/10 light:divide-black/10">
            {threads.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedThread(t)}
                className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                  selectedThread.id === t.id
                    ? "bg-[#252a2b] light:bg-[#f0f2f3] border-l-2 border-[#38b6ff] light:border-[#0284c7]"
                    : "hover:bg-[#252a2b]/50 light:hover:bg-[#f0f2f3]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white light:text-[#121212] flex items-center gap-2">
                    {t.sender}
                    <ScoreBadge score={t.score} />
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 light:text-[#787e82]">{t.time}</span>
                </div>
                <div className="text-[11px] text-[#38b6ff] light:text-[#0284c7] font-medium">{t.company}</div>
                <div className="text-xs font-semibold text-white light:text-[#121212] truncate">{t.subject}</div>
                <p className="text-[11px] text-slate-400 light:text-[#787e82] line-clamp-2 leading-relaxed">{t.snippet}</p>

                <div className="pt-1 flex items-center gap-2">
                  {t.sentiment === "MEETING_REQUESTED" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 light:text-emerald-700 border border-emerald-500/20">
                      ⚡ Meeting Requested
                    </span>
                  )}
                  {t.sentiment === "TECHNICAL_INQUIRY" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#38b6ff]/10 text-[#38b6ff] light:text-[#0284c7] border border-[#38b6ff]/20">
                      🔍 Technical Spec
                    </span>
                  )}
                  {t.sentiment === "OBJECTION" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 light:text-amber-700 border border-amber-500/20">
                      ⏱ Contract Timing
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Thread View */}
        <div className="md:col-span-7 flex flex-col min-h-0 bg-[#1e2224] light:bg-[#ffffff]">
          {/* Thread Header */}
          <div className="p-4 border-b border-white/10 light:border-black/10 flex items-center justify-between bg-[#1e2224] light:bg-white">
            <div>
              <h3 className="text-sm font-bold text-white light:text-[#121212]">{selectedThread.subject}</h3>
              <p className="text-xs text-slate-400 light:text-[#787e82] mt-0.5">
                {selectedThread.sender} ({selectedThread.title} at {selectedThread.company})
              </p>
            </div>
            <ScoreBadge score={selectedThread.score} />
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedThread.history.map((h, i) => (
              <div
                key={i}
                className={`flex flex-col ${h.sender === "rep" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    h.sender === "rep"
                      ? "bg-[#38b6ff] text-[#121212] light:bg-[#0284c7] light:text-white font-medium rounded-tr-none shadow-sm"
                      : "bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 text-white light:text-[#121212] rounded-tl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{h.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 light:text-[#787e82] mt-1 px-1">{h.time}</span>
              </div>
            ))}
          </div>

          {/* AI Drafting toolbar & reply box */}
          <div className="p-4 border-t border-white/10 light:border-black/10 bg-[#181b1c] light:bg-white space-y-3">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateAiReply}
                loading={isDrafting}
                className="text-xs border-[#38b6ff]/30 text-[#38b6ff] light:text-[#0284c7] hover:bg-[#38b6ff]/10 gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
                Draft Contextual AI Reply
              </Button>
              <span className="text-[10px] text-slate-400 light:text-[#787e82]">
                Cadence auto-paused for {selectedThread.sender}
              </span>
            </div>

            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a response or click 'Draft Contextual AI Reply'..."
              className="w-full rounded-2xl border border-white/10 light:border-black/15 bg-[#252a2b] light:bg-[#f0f2f3] p-3 text-xs text-white light:text-[#121212] placeholder-slate-400 light:placeholder-[#8a9296] focus:border-[#38b6ff] light:focus:border-[#0284c7] focus:outline-none"
            />

            <div className="flex justify-end">
              <Button
                variant="pill"
                size="sm"
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="gap-1.5 text-xs shadow-md"
              >
                Send Reply <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
