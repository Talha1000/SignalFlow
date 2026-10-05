"use client";

import React, { useState, useEffect } from "react";
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
  RefreshCw,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { IntentBadge, ScoreBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ThreadHistoryItem {
  activityId?: string;
  sender: "prospect" | "rep";
  text: string;
  time: string;
  createdAt?: string;
}

interface Thread {
  id: string;
  leadId: string;
  contactId?: string | null;
  companyId?: string | null;
  sender: string;
  email: string;
  title: string;
  company: string;
  score: number;
  subject: string;
  snippet: string;
  sentiment: "MEETING_REQUESTED" | "TECHNICAL_INQUIRY" | "OBJECTION" | "INTERESTED";
  time: string;
  unread: boolean;
  history: ThreadHistoryItem[];
}

export default function InboxPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simulateSentiment, setSimulateSentiment] = useState<"MEETING_REQUESTED" | "TECHNICAL_INQUIRY" | "OBJECTION" | "INTERESTED">("MEETING_REQUESTED");
  const [simulateBody, setSimulateBody] = useState("Hi, we reviewed your architecture docs and would like to schedule a 20-minute call this Thursday at 2 PM PST.");
  const [actionNotice, setActionNotice] = useState<{ type: "success" | "warning" | "error"; message: string } | null>(null);

  const fetchThreads = async (preserveSelectedId?: string) => {
    setIsLoadingThreads(true);
    try {
      const res = await fetch("/api/v1/inbox/threads");
      if (!res.ok) {
        throw new Error(`Failed to load threads: HTTP ${res.status}`);
      }
      const data = await res.json();
      const threadList: Thread[] = data.data?.threads || [];
      setThreads(threadList);

      if (threadList.length > 0) {
        if (preserveSelectedId) {
          const matched = threadList.find((t) => t.id === preserveSelectedId);
          setSelectedThread(matched || threadList[0]);
        } else if (!selectedThread) {
          setSelectedThread(threadList[0]);
        } else {
          const matched = threadList.find((t) => t.id === selectedThread.id);
          setSelectedThread(matched || threadList[0]);
        }
      } else {
        setSelectedThread(null);
      }
    } catch (err: any) {
      console.error("Error fetching inbox threads:", err);
      setActionNotice({
        type: "error",
        message: err.message || "Failed to load database conversation threads.",
      });
    } finally {
      setIsLoadingThreads(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const handleGenerateAiReply = async () => {
    if (!selectedThread) return;
    setIsDrafting(true);
    setActionNotice(null);
    try {
      const res = await fetch("/api/v1/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: selectedThread.sender,
          company: selectedThread.company,
          subject: selectedThread.subject,
          sentiment: selectedThread.sentiment,
          leadScore: selectedThread.score,
          history: selectedThread.history.map((h) => ({
            sender: h.sender,
            text: h.text,
          })),
        }),
      });

      const resJson = await res.json();
      const payload = resJson.data || resJson;

      if (payload.reply) {
        setReplyText(payload.reply);
        if (payload.source === "ai") {
          setActionNotice({
            type: "success",
            message: "Contextual AI response drafted based on prospect dialogue.",
          });
        }
      } else if (resJson.error) {
        setActionNotice({ type: "error", message: resJson.error });
      }
    } catch (err: any) {
      setActionNotice({
        type: "error",
        message: err.message || "Failed to contact AI service. Please verify network connectivity.",
      });
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedThread || !replyText.trim()) return;
    setIsSending(true);
    setActionNotice(null);

    try {
      const res = await fetch("/api/v1/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedThread.leadId,
          to: selectedThread.email,
          subject: selectedThread.subject.startsWith("Re:") ? selectedThread.subject : `Re: ${selectedThread.subject}`,
          body: replyText,
          allowLocalRecord: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionNotice({
          type: "error",
          message: data.error || "Failed to deliver or record reply.",
        });
        return;
      }

      if (data.data?.status === "SENT") {
        setActionNotice({
          type: "success",
          message: "Email reply delivered via Resend and logged to lead timeline.",
        });
      } else if (data.data?.status === "RECORDED_LOCALLY") {
        setActionNotice({
          type: "warning",
          message: "Saved to database timeline (Local Sandbox Mode — configure RESEND_API_KEY for live external email dispatch).",
        });
      } else {
        setActionNotice({
          type: "success",
          message: "Reply saved to lead timeline in PostgreSQL.",
        });
      }

      setReplyText("");
      // Refetch threads to update conversation history directly from PostgreSQL
      await fetchThreads(selectedThread.id);
    } catch (err: any) {
      setActionNotice({
        type: "error",
        message: err.message || "Network error while sending reply.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSimulateInboundReply = async () => {
    if (!selectedThread) return;
    setIsSimulating(true);
    setActionNotice(null);

    try {
      const res = await fetch("/api/v1/inbox/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedThread.leadId,
          subject: `Re: ${selectedThread.subject.replace(/^Re:\s*/i, "")}`,
          body: simulateBody,
          sentiment: simulateSentiment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionNotice({
          type: "error",
          message: data.error || "Failed to simulate inbound reply.",
        });
        return;
      }

      setShowSimulateModal(false);
      setActionNotice({
        type: "success",
        message: `Inbound reply ingested! Lead score updated to ${data.data.newScore} (+${data.data.scoreDelta}) and active sequences auto-paused.`,
      });

      await fetchThreads(selectedThread.id);
    } catch (err: any) {
      setActionNotice({
        type: "error",
        message: err.message || "Network error while simulating inbound reply.",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
            <Inbox className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
            Conversations & Reply Inbox
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 light:text-emerald-700 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live PostgreSQL Inbox
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchThreads(selectedThread?.id)}
              disabled={isLoadingThreads}
              className="text-xs h-7 gap-1 border-white/10 light:border-black/10"
            >
              <RefreshCw className={`h-3 w-3 ${isLoadingThreads ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
        <p className="text-xs text-slate-400 light:text-[#787e82] mt-0.5">
          Prospect replies automatically halt outgoing sequences and classify buyer intent. Outbound replies persist directly to your lead timeline.
        </p>
      </div>

      {actionNotice && (
        <div
          className={`p-3 rounded-2xl text-xs flex items-center justify-between border ${
            actionNotice.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 light:text-emerald-700"
              : actionNotice.type === "warning"
              ? "bg-amber-500/10 border-amber-500/20 text-amber-300 light:text-amber-800"
              : "bg-rose-500/10 border-rose-500/20 text-rose-300 light:text-rose-700"
          }`}
        >
          <span>{actionNotice.message}</span>
          <button
            onClick={() => setActionNotice(null)}
            className="text-[10px] font-bold opacity-75 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Inbox Container */}
      <div className="flex-1 rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0 shadow-sm">
        {/* Left Column: Thread List */}
        <div className="md:col-span-5 border-r border-white/10 light:border-black/10 flex flex-col min-h-0 bg-[#181b1c] light:bg-[#fafafa]">
          <div className="p-3.5 border-b border-white/10 light:border-black/10 bg-[#1e2224] light:bg-white flex items-center justify-between text-xs text-slate-400 light:text-[#787e82]">
            <span className="font-semibold text-white light:text-[#121212] flex items-center gap-1.5">
              Active Threads ({threads.length})
            </span>
            <span className="text-[10px] font-mono text-[#38b6ff] light:text-[#0284c7]">Auto-Stop Active</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/10 light:divide-black/10">
            {isLoadingThreads && threads.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <RefreshCw className="h-5 w-5 animate-spin mx-auto text-[#38b6ff]" />
                <p className="text-xs text-slate-400">Loading conversation threads from database...</p>
              </div>
            ) : threads.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <MessageSquare className="h-8 w-8 mx-auto text-slate-500 opacity-50" />
                <p className="text-xs text-slate-400">No active conversation threads found in this workspace.</p>
                <p className="text-[11px] text-slate-500">Seed sample accounts or enroll leads in a sequence to populate inbound messages.</p>
              </div>
            ) : (
              threads.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedThread(t)}
                  className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                    selectedThread?.id === t.id
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
                    {t.sentiment === "INTERESTED" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 light:text-blue-700 border border-blue-500/20">
                        ✨ Interested
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Active Thread View */}
        <div className="md:col-span-7 flex flex-col min-h-0 bg-[#1e2224] light:bg-[#ffffff]">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-white/10 light:border-black/10 flex items-center justify-between bg-[#1e2224] light:bg-white">
                <div>
                  <h3 className="text-sm font-bold text-white light:text-[#121212]">{selectedThread.subject}</h3>
                  <p className="text-xs text-slate-400 light:text-[#787e82] mt-0.5">
                    {selectedThread.sender} ({selectedThread.title} at {selectedThread.company}) • <span className="text-slate-300 light:text-slate-600">{selectedThread.email}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSimulateModal(true)}
                    className="text-[11px] h-7 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 gap-1"
                    title="Simulate an inbound email reply to verify auto-pause and score updates"
                  >
                    <Bot className="h-3 w-3" />
                    Simulate Inbound
                  </Button>
                  <ScoreBadge score={selectedThread.score} />
                </div>
              </div>

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedThread.history.map((h, i) => (
                  <div
                    key={h.activityId || i}
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
                    <span className="text-[10px] text-slate-400 light:text-[#787e82] mt-1 px-1">
                      {h.sender === "rep" ? "You (Outbound)" : selectedThread.sender} • {h.time}
                    </span>
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

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 light:text-slate-500">
                    Replies are saved to the prospect's lead timeline in PostgreSQL.
                  </span>
                  <Button
                    variant="pill"
                    size="sm"
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || isSending}
                    loading={isSending}
                    className="gap-1.5 text-xs shadow-md"
                  >
                    Send Reply <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <Inbox className="h-10 w-10 text-slate-500 opacity-40 mb-3" />
              <p className="text-sm font-semibold text-white light:text-[#121212]">No Thread Selected</p>
              <p className="text-xs text-slate-500 mt-1">Select a prospect thread on the left to review dialogue and send replies.</p>
            </div>
          )}
        </div>
      </div>

      {/* Simulate Inbound Reply Modal */}
      {showSimulateModal && selectedThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e2224] light:bg-white border border-white/15 light:border-black/15 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 light:border-black/10 pb-3">
              <h3 className="text-sm font-bold text-white light:text-[#121212] flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-400" />
                Simulate Inbound Prospect Reply
              </h3>
              <button
                onClick={() => setShowSimulateModal(false)}
                className="text-xs text-slate-400 hover:text-white light:hover:text-black font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 light:text-[#787e82]">
              Simulate an inbound email from <span className="font-semibold text-white light:text-black">{selectedThread.sender}</span> ({selectedThread.company}) to test sequence halting, intent re-classification, and lead score adjustments in real-time.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300 light:text-slate-700 block mb-1">
                  Intent Classification:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSimulateSentiment("MEETING_REQUESTED");
                      setSimulateBody("We reviewed the architecture documentation. Are you available for a 20-minute meeting this Thursday at 2 PM PST?");
                    }}
                    className={`p-2 rounded-xl border text-left transition-colors ${
                      simulateSentiment === "MEETING_REQUESTED"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 light:border-black/10 text-slate-300 light:text-slate-700"
                    }`}
                  >
                    ⚡ Meeting Requested (+15 pts)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimulateSentiment("TECHNICAL_INQUIRY");
                      setSimulateBody("Does your webhook pipeline support HMAC SHA-256 signatures with customer-managed keys?");
                    }}
                    className={`p-2 rounded-xl border text-left transition-colors ${
                      simulateSentiment === "TECHNICAL_INQUIRY"
                        ? "border-sky-500 bg-sky-500/10 text-sky-400"
                        : "border-white/10 light:border-black/10 text-slate-300 light:text-slate-700"
                    }`}
                  >
                    🔍 Technical Spec (+10 pts)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimulateSentiment("INTERESTED");
                      setSimulateBody("This looks relevant to our current pipeline modernization goals. Please send over pricing for 15 seats.");
                    }}
                    className={`p-2 rounded-xl border text-left transition-colors ${
                      simulateSentiment === "INTERESTED"
                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                        : "border-white/10 light:border-black/10 text-slate-300 light:text-slate-700"
                    }`}
                  >
                    ✨ Interested (+8 pts)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimulateSentiment("OBJECTION");
                      setSimulateBody("We are locked into our existing vendor contract until November. What does your migration process look like?");
                    }}
                    className={`p-2 rounded-xl border text-left transition-colors ${
                      simulateSentiment === "OBJECTION"
                        ? "border-amber-500 bg-amber-500/10 text-amber-400"
                        : "border-white/10 light:border-black/10 text-slate-300 light:text-slate-700"
                    }`}
                  >
                    ⏱ Contract Objection (-4 pts)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 light:text-slate-700 block mb-1">
                  Message Body:
                </label>
                <textarea
                  rows={3}
                  value={simulateBody}
                  onChange={(e) => setSimulateBody(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 light:border-black/15 bg-[#252a2b] light:bg-[#f0f2f3] p-3 text-xs text-white light:text-[#121212] focus:border-[#38b6ff] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10 light:border-black/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSimulateModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="pill"
                size="sm"
                onClick={handleSimulateInboundReply}
                loading={isSimulating}
                className="text-xs bg-purple-600 hover:bg-purple-500 text-white"
              >
                Simulate Inbound Reply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
