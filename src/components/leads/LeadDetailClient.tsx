"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  UserPlus,
  Zap,
  Sparkles,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react";
import { IntentBadge, StageBadge, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmailComposerModal } from "@/components/email/EmailComposerModal";

interface LeadDetailProps {
  lead: any;
  availableSequences: any[];
  teamMembers: any[];
}

export function LeadDetailClient({
  lead: initialLead,
  availableSequences,
  teamMembers,
}: LeadDetailProps) {
  const [lead, setLead] = useState(initialLead);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "ai"
    | "score"
    | "timeline"
    | "emails"
    | "notes"
    | "company"
    | "contacts"
    | "history"
  >("overview");

  // Modals
  const [composerOpen, setComposerOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [seqModalOpen, setSeqModalOpen] = useState(false);

  // Form states
  const [newNote, setNewNote] = useState("");
  const [callOutcome, setCallOutcome] = useState("Connected - Positive");
  const [selectedOwner, setSelectedOwner] = useState(lead.ownerId || "");
  const [selectedSeq, setSelectedSeq] = useState(availableSequences[0]?.id || "");

  const stages = [
    "NEW",
    "CONTACTED",
    "ENGAGED",
    "QUALIFIED",
    "MEETING",
    "PROPOSAL",
    "NEGOTIATION",
    "WON",
    "LOST",
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState<string | null>(null);

  const handleStageChange = async (newStage: string) => {
    setActionError(null);
    try {
      const res = await fetch(`/api/v1/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error?.message || "Failed to update pipeline stage");
      }
      setLead({ ...lead, stage: newStage });
    } catch (err: any) {
      setActionError(err.message || "Failed to update stage");
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const res = await fetch("/api/v1/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          type: "NOTE",
          title: "Rep Note Added",
          description: newNote.trim(),
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error?.message || "Failed to save note");
      }
      const json = await res.json();
      const savedActivity = json.data || {
        id: `act-${Date.now()}`,
        type: "NOTE",
        title: "Rep Note Added",
        description: newNote.trim(),
        createdAt: new Date().toISOString(),
      };
      setLead({
        ...lead,
        activities: [savedActivity, ...(lead.activities || [])],
      });
      setNewNote("");
      setNoteModalOpen(false);
    } catch (err: any) {
      setActionError(err.message || "Could not persist note to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogCall = async () => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      const res = await fetch("/api/v1/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          type: "CALL",
          title: `Call: ${callOutcome}`,
          description: `Outbound sales call logged. Status: ${callOutcome}`,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error?.message || "Failed to log call");
      }
      const json = await res.json();
      const savedActivity = json.data || {
        id: `act-${Date.now()}`,
        type: "CALL",
        title: `Call: ${callOutcome}`,
        description: `Outbound sales call logged. Status: ${callOutcome}`,
        createdAt: new Date().toISOString(),
      };
      setLead({
        ...lead,
        activities: [savedActivity, ...(lead.activities || [])],
      });
      setCallModalOpen(false);
    } catch (err: any) {
      setActionError(err.message || "Could not persist call log to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignOwner = async () => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/v1/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId: selectedOwner || null }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error?.message || "Failed to reassign owner");
      }
      const member = teamMembers.find((m) => m.id === selectedOwner);
      setLead({
        ...lead,
        ownerId: selectedOwner,
        owner: member ? { name: member.name, email: member.email } : null,
      });
      setAssignModalOpen(false);
    } catch (err: any) {
      setActionError(err.message || "Failed to assign lead owner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnrollSequence = async () => {
    if (!selectedSeq) return;
    setIsEnrolling(true);
    setEnrollmentError(null);
    setEnrollmentSuccess(null);
    try {
      const res = await fetch("/api/v1/sequences/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequenceId: selectedSeq,
          leadId: lead.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || "Failed to enroll lead in cadence");
      }
      const seqName = data?.data?.sequenceName || "Cadence";
      const newActivity = {
        id: `act-${Date.now()}`,
        type: "CADENCE_ENROLLED",
        title: `Enrolled in Cadence: ${seqName}`,
        description: "Outbound cadence initiated. Auto-pause configured upon prospect response.",
        createdAt: new Date().toISOString(),
      };
      setLead({
        ...lead,
        activities: [newActivity, ...(lead.activities || [])],
        enrollments: [
          ...(lead.enrollments || []),
          data.data.enrollment || { sequence: { name: seqName }, status: "ACTIVE" },
        ],
      });
      setEnrollmentSuccess(`Successfully enrolled in ${seqName}!`);
      setTimeout(() => {
        setSeqModalOpen(false);
        setEnrollmentSuccess(null);
      }, 1000);
    } catch (err: any) {
      setEnrollmentError(err.message || "Failed to enroll lead in cadence.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const contactName = lead.contact
    ? `${lead.contact.firstName} ${lead.contact.lastName}`
    : "Anonymous Prospect";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/app/leads"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 light:text-[#787e82] hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Priority Leads
        </Link>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-slate-400 hover:text-white ml-2">×</button>
        </div>
      )}

      {/* Main Header Card */}
      <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Identity */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 shrink-0 w-20">
              <span className="text-3xl font-extrabold font-mono text-white light:text-[#121212] tracking-tight">
                {lead.score}
              </span>
              <span className="text-[10px] font-mono text-slate-400 light:text-[#787e82]">/ 100</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-white light:text-[#121212]">{contactName}</h1>
                <IntentBadge level={lead.intentLevel} />
                <StageBadge stage={lead.stage} />
                {lead.dealValue > 0 && (
                  <span className="text-xs font-mono font-semibold text-emerald-500 light:text-emerald-600 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    ${lead.dealValue.toLocaleString()} deal value
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-300 light:text-[#4a5053] flex flex-wrap items-center gap-2">
                <span className="font-semibold text-white light:text-[#121212]">
                  {lead.contact?.title || "Decision Maker"}
                </span>
                <span className="text-slate-400 light:text-[#787e82]">at</span>
                <Link
                  href={lead.company ? `/app/companies/${lead.company.id}` : "#"}
                  className="font-bold text-[#38b6ff] light:text-[#0284c7] hover:underline"
                >
                  {lead.company?.name || "Direct Lead"}
                </Link>
                {lead.contact?.email && (
                  <>
                    <span className="text-slate-400 light:text-[#787e82]">•</span>
                    <span className="font-mono text-slate-400 light:text-[#787e82]">{lead.contact.email}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="pill"
              size="sm"
              onClick={() => setComposerOpen(true)}
              className="gap-1.5 shadow-sm"
            >
              <Mail className="h-3.5 w-3.5" /> Send Email
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCallModalOpen(true)}
              className="gap-1.5"
            >
              <Phone className="h-3.5 w-3.5" /> Log Call
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setNoteModalOpen(true)}
              className="gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" /> Add Note
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignModalOpen(true)}
              className="gap-1.5 text-xs"
            >
              <UserPlus className="h-3.5 w-3.5" /> Assign
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSeqModalOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Zap className="h-3.5 w-3.5" /> Cadence
            </Button>
          </div>
        </div>

        {/* Stage Pipeline Stepper */}
        <div className="pt-4 border-t border-white/10 light:border-black/10">
          <div className="text-[10px] font-mono uppercase text-slate-400 light:text-[#787e82] mb-2.5 font-bold">
            Sales Pipeline Stage (Click to advance)
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center">
            {stages.map((st, i) => {
              const currentIdx = stages.indexOf(lead.stage);
              const isPast = i < currentIdx;
              const isCurrent = st === lead.stage;

              return (
                <button
                  key={st}
                  onClick={() => handleStageChange(st)}
                  className={`py-1.5 px-1 rounded-xl text-[11px] font-semibold transition-all ${
                    isCurrent
                      ? "bg-[#38b6ff] light:bg-[#0284c7] text-slate-950 light:text-white font-bold shadow-md"
                      : isPast
                      ? "bg-[#252a2b] light:bg-[#e2e8f0] text-white light:text-[#121212] hover:bg-[#38b6ff]/20"
                      : "bg-[#1e2224] light:bg-[#ffffff] text-slate-400 light:text-[#787e82] border border-white/10 light:border-black/10 hover:text-white light:hover:text-[#121212]"
                  }`}
                >
                  {st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs Header Navigation */}
      <div className="flex border-b border-white/10 light:border-black/10 overflow-x-auto text-xs font-semibold no-scrollbar">
        {[
          { key: "overview", label: "Overview" },
          { key: "ai", label: "AI Insights & Evidence" },
          { key: "score", label: "Score Breakdown" },
          { key: "timeline", label: "Activity Timeline" },
          { key: "emails", label: "Emails & Cadence" },
          { key: "notes", label: "Notes" },
          { key: "company", label: "Company Profile" },
          { key: "contacts", label: "Related Contacts" },
          { key: "history", label: "Score History Log" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === t.key
                ? "border-[#38b6ff] text-[#38b6ff] light:border-[#0284c7] light:text-[#0284c7] font-bold"
                : "border-transparent text-slate-400 light:text-[#787e82] hover:text-white light:hover:text-[#121212]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-6">
            {/* AI Action Box */}
            <div className="rounded-3xl border border-[#38b6ff]/30 bg-[#38b6ff]/10 p-6 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#38b6ff] light:text-[#0284c7] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Recommended Next Play
                </span>
                <span className="text-[10px] font-mono font-semibold text-[#38b6ff] light:text-[#0284c7] bg-[#38b6ff]/15 px-2.5 py-0.5 rounded-full border border-[#38b6ff]/30">
                  Evidence Coverage: {lead.leadScore?.evidenceStrength ? `${(lead.leadScore.evidenceStrength * 100).toFixed(0)}%` : "85%"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white light:text-[#121212] leading-relaxed font-medium">
                "{lead.nextAction || "Contact within 2 hours. Offer a 20-minute architecture review and custom pricing sandbox."}"
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Button variant="pill" size="sm" onClick={() => setComposerOpen(true)}>
                  Execute Next Play <Send className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white light:text-[#121212]">Lead Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-slate-400 light:text-[#787e82] text-[11px]">Assigned Owner</div>
                  <div className="font-semibold text-white light:text-[#121212] mt-0.5">
                    {lead.owner?.name || "Unassigned"}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 light:text-[#787e82] text-[11px]">Primary Source</div>
                  <div className="font-semibold text-white light:text-[#121212] mt-0.5 font-mono">{lead.source}</div>
                </div>
                <div>
                  <div className="text-slate-400 light:text-[#787e82] text-[11px]">Current Stage</div>
                  <div className="font-semibold text-white light:text-[#121212] mt-0.5">{lead.stage}</div>
                </div>
                <div>
                  <div className="text-slate-400 light:text-[#787e82] text-[11px]">Target ACV Potential</div>
                  <div className="font-semibold text-emerald-500 light:text-emerald-600 font-mono mt-0.5">
                    ${lead.dealValue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 light:text-[#787e82] text-[11px]">Last Activity</div>
                  <div className="font-semibold text-slate-300 light:text-[#4a5053] mt-0.5">
                    {new Date(lead.lastActivityAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 light:text-[#787e82] text-[11px]">Created Date</div>
                  <div className="font-semibold text-slate-300 light:text-[#4a5053] mt-0.5">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Mini Stats & Company Fit */}
          <div className="md:col-span-4 space-y-6">
            <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-white light:text-[#121212] uppercase tracking-wider">
                Account Summary
              </h4>
              <div className="text-xs space-y-2.5 text-slate-300 light:text-[#4a5053]">
                <div className="flex justify-between">
                  <span className="text-slate-400 light:text-[#787e82]">Company:</span>
                  <span className="font-semibold text-white light:text-[#121212]">{lead.company?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 light:text-[#787e82]">Industry:</span>
                  <span>{lead.company?.industry || "B2B Tech"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 light:text-[#787e82]">Employee Scale:</span>
                  <span>{lead.company?.size || "250-500"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 light:text-[#787e82]">Annual Revenue:</span>
                  <span className="font-mono text-emerald-500 light:text-emerald-600 font-semibold">
                    {lead.company?.annualRevenue || "$35M"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-white light:text-[#121212] uppercase tracking-wider">
                Assigned Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="cyan">Enterprise</Badge>
                <Badge variant="warning">High Velocity</Badge>
                <Badge variant="default">Q4 Evaluation</Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI INSIGHTS & EVIDENCE */}
      {activeTab === "ai" && (
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 light:border-black/10">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#38b6ff] light:text-[#0284c7]" />
              <h3 className="text-base font-bold text-white light:text-[#121212]">AI Explainability & Evidence Report</h3>
            </div>
            <span className="text-xs text-slate-400 light:text-[#787e82]">
              Confidence Score: <strong className="text-emerald-500 font-bold">94%</strong>
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 light:text-[#787e82] font-bold">
              Why is this lead important?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 light:text-[#4a5053] leading-relaxed bg-[#252a2b] light:bg-[#f0f2f3] p-4 rounded-2xl border border-white/10 light:border-black/10">
              {lead.leadScore?.explanation ||
                `${contactName} appears to be actively evaluating solutions rather than casually researching them. The strongest signals are repeated enterprise pricing visits, integration documentation activity, and engagement from multiple stakeholders at ${lead.company?.name}.`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-1">
              <span className="text-xs font-semibold text-white light:text-[#121212]">Evidence Detected</span>
              <p className="text-xs text-[#38b6ff] light:text-[#0284c7] font-mono font-medium">
                3 pricing visits + 2 doc views + 1 demo request
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-1">
              <span className="text-xs font-semibold text-white light:text-[#121212]">Consensus Signals</span>
              <p className="text-xs text-indigo-400 light:text-indigo-600 font-mono font-medium">
                3 active colleagues active in last 7 days
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-1">
              <span className="text-xs font-semibold text-white light:text-[#121212]">Urgency Timeline</span>
              <p className="text-xs text-emerald-500 light:text-emerald-600 font-mono font-medium">
                Optimal touchpoint within 2 hours
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCORE BREAKDOWN */}
      {activeTab === "score" && (
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 light:border-black/10">
            <div>
              <h3 className="text-base font-bold text-white light:text-[#121212]">Mathematical Scoring Breakdown</h3>
              <p className="text-xs text-slate-400 light:text-[#787e82]">
                Transparent factor attribution totaling current score: {lead.score} / 100
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#38b6ff] light:text-[#0284c7] bg-[#38b6ff]/15 px-3 py-1 rounded-full border border-[#38b6ff]/30">
              +{lead.leadScore?.delta7d || 21} pts in last 7 days
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Positive Factors */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-emerald-500 light:text-emerald-600 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="h-4 w-4" /> Positive Drivers
              </h4>
              <div className="space-y-2">
                {[
                  { name: "Pricing page activity", pts: 18, desc: "Browsed Growth and Enterprise tiers 3x" },
                  { name: "Demo page visited", pts: 12, desc: "Requested architecture review call" },
                  { name: "Multi-stakeholder engagement", pts: 15, desc: "3 colleagues active on product docs" },
                  { name: "Email engagement", pts: 9, desc: "Opened 3x and clicked documentation link" },
                  { name: "Senior decision-maker match", pts: 7, desc: "VP / Executive authority match" },
                ].map((pos, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white light:text-[#121212]">{pos.name}</div>
                      <div className="text-[11px] text-slate-400 light:text-[#787e82]">{pos.desc}</div>
                    </div>
                    <span className="font-mono text-emerald-500 light:text-emerald-600 font-bold text-sm">+{pos.pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Negative Factors */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-rose-500 light:text-rose-600 flex items-center gap-1.5 font-mono">
                <Clock className="h-4 w-4" /> Negative / Decay Factors
              </h4>
              <div className="space-y-2">
                {[
                  { name: "Weekend inactivity", pts: -2, desc: "Minor decay over non-business days" },
                ].map((neg, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white light:text-[#121212]">{neg.name}</div>
                      <div className="text-[11px] text-slate-400 light:text-[#787e82]">{neg.desc}</div>
                    </div>
                    <span className="font-mono text-rose-500 light:text-rose-600 font-bold text-sm">{neg.pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVITY TIMELINE */}
      {activeTab === "timeline" && (
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-white light:text-[#121212]">Full Behavioral Activity Stream</h3>
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-white/10 light:before:bg-black/10">
            {lead.activities && lead.activities.length > 0 ? (
              lead.activities.map((act: any, idx: number) => (
                <div key={idx} className="relative flex items-start gap-4 pl-8 text-xs">
                  <div className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-full bg-[#38b6ff] border-2 border-[#1e2224] light:border-white ring-2 ring-[#38b6ff]/20" />
                  <div className="flex-1 p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white light:text-[#121212]">{act.title}</span>
                      <span className="text-[10px] font-mono text-slate-400 light:text-[#787e82]">
                        {new Date(act.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {act.description && (
                      <p className="text-slate-300 light:text-[#4a5053] text-[11px] leading-relaxed">
                        {act.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 light:text-[#787e82]">No recorded activities yet.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: EMAILS */}
      {activeTab === "emails" && (
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 light:border-black/10">
            <h3 className="text-base font-bold text-white light:text-[#121212]">Sent & Cadence Emails</h3>
            <Button variant="pill" size="sm" onClick={() => setComposerOpen(true)}>
              + Compose New Email
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white light:text-[#121212]">
                  Prioritizing revenue signals at {lead.company?.name || "your company"}
                </span>
                <span className="text-[10px] text-emerald-500 font-mono font-semibold">Opened 3x • Clicked</span>
              </div>
              <p className="text-slate-300 light:text-[#4a5053] text-[11px] leading-relaxed">
                "Hi {lead.contact?.firstName || "there"}, noticed your team looking into customer
                signal capture. Most engineering leaders lose 40% of high-intent buyers..."
              </p>
              <div className="text-[10px] text-slate-400 light:text-[#787e82]">Sent by Liam Vance • 2 days ago</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: NOTES */}
      {activeTab === "notes" && (
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 light:border-black/10">
            <h3 className="text-base font-bold text-white light:text-[#121212]">Rep Notes & Collaboration</h3>
            <Button variant="outline" size="sm" onClick={() => setNoteModalOpen(true)}>
              + Add Note
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            {lead.activities
              .filter((a: any) => a.type === "NOTE")
              .map((note: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-1">
                  <div className="flex justify-between items-center text-slate-400 light:text-[#787e82] text-[10px]">
                    <span className="font-semibold text-white light:text-[#121212]">Sales Note</span>
                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300 light:text-[#4a5053] text-xs leading-relaxed">{note.description}</p>
                </div>
              ))}
            {lead.activities.filter((a: any) => a.type === "NOTE").length === 0 && (
              <p className="text-xs text-slate-400 light:text-[#787e82] py-4 text-center">No notes added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: COMPANY PROFILE */}
      {activeTab === "company" && (
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 light:border-black/10">
            <div>
              <h3 className="text-base font-bold text-white light:text-[#121212]">{lead.company?.name}</h3>
              <p className="text-xs text-slate-400 light:text-[#787e82]">{lead.company?.domain}</p>
            </div>
            <Link href={lead.company ? `/app/companies/${lead.company.id}` : "#"}>
              <Button variant="outline" size="sm" className="text-xs">
                Open Full Account View →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
              <div className="text-slate-400 light:text-[#787e82] text-[11px]">Industry</div>
              <div className="font-bold text-white light:text-[#121212] mt-0.5">{lead.company?.industry}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
              <div className="text-slate-400 light:text-[#787e82] text-[11px]">Headquarters</div>
              <div className="font-bold text-white light:text-[#121212] mt-0.5">{lead.company?.location}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
              <div className="text-slate-400 light:text-[#787e82] text-[11px]">Annual Revenue</div>
              <div className="font-bold text-emerald-500 light:text-emerald-600 font-mono mt-0.5">
                {lead.company?.annualRevenue}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
              <div className="text-slate-400 light:text-[#787e82] text-[11px]">Company Intent Score</div>
              <div className="font-bold text-[#38b6ff] light:text-[#0284c7] font-mono mt-0.5">
                {lead.company?.intentScore} / 100
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-white light:text-[#121212]">Detected Tech Stack:</span>
            <div className="flex flex-wrap gap-2">
              {(lead.company?.techStack || ["Next.js", "Kubernetes", "PostgreSQL", "Go"]).map(
                (t: string) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-[#252a2b] light:bg-[#f0f2f3] text-xs font-mono font-medium text-[#38b6ff] light:text-[#0284c7] border border-white/10 light:border-black/10"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: RELATED CONTACTS */}
      {activeTab === "contacts" && (
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white light:text-[#121212]">
            Stakeholders at {lead.company?.name || "Company"}
          </h3>
          <div className="divide-y divide-white/10 light:divide-black/10 text-xs">
            {(lead.company?.contacts || [lead.contact]).map((c: any) => (
              <div key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white light:text-[#121212]">
                    {c.firstName} {c.lastName}
                  </div>
                  <div className="text-[11px] text-slate-400 light:text-[#787e82]">
                    {c.title} • <span className="font-mono">{c.email}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setComposerOpen(true)}
                  className="text-xs"
                >
                  Contact
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: SCORE HISTORY LOG */}
      {activeTab === "history" && (
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white light:text-[#121212]">Score Event Log</h3>
          <div className="space-y-2 text-xs">
            {lead.scoreEvents && lead.scoreEvents.length > 0 ? (
              lead.scoreEvents.map((ev: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white light:text-[#121212]">{ev.factorName}</div>
                    <div className="text-[11px] text-slate-400 light:text-[#787e82]">{ev.reason}</div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-emerald-500 light:text-emerald-600 font-bold">+{ev.delta} pts</span>
                    <div className="text-[10px] text-slate-400 light:text-[#787e82]">New Score: {ev.newScore}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white light:text-[#121212]">Intent Signals Calculation</div>
                  <div className="text-[11px] text-slate-400 light:text-[#787e82]">
                    Pricing page views and multi-stakeholder surge
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-emerald-500 light:text-emerald-600 font-bold">+21 pts</span>
                  <div className="text-[10px] text-slate-400 light:text-[#787e82]">New Score: {lead.score}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <EmailComposerModal
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        lead={{
          id: lead.id,
          name: contactName,
          email: lead.contact?.email || "sarah@company.com",
          company: lead.company?.name || "Company",
          title: lead.contact?.title || undefined,
          score: lead.score,
        }}
      />

      {/* Note Modal */}
      <Modal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title="Add Rep Note"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <textarea
            rows={4}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Type your notes about stakeholder feedback, objections, or timeline..."
            className="w-full rounded-2xl border border-white/10 light:border-black/10 bg-[#252a2b] light:bg-[#f0f2f3] p-3.5 text-white light:text-[#121212] placeholder-slate-400 light:placeholder-[#787e82] focus:border-[#38b6ff] focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="pill" size="sm" onClick={handleSaveNote}>
              Save Note
            </Button>
          </div>
        </div>
      </Modal>

      {/* Call Log Modal */}
      <Modal
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        title="Log Phone Touchpoint"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-white light:text-[#121212] font-semibold">Call Outcome</label>
            <select
              value={callOutcome}
              onChange={(e) => setCallOutcome(e.target.value)}
              className="w-full rounded-2xl border border-white/10 light:border-black/10 bg-[#252a2b] light:bg-[#f0f2f3] p-3 text-white light:text-[#121212]"
            >
              <option value="Connected - Positive">Connected — Positive Interest</option>
              <option value="Meeting Scheduled">Meeting Scheduled</option>
              <option value="Left Voicemail">Left Voicemail</option>
              <option value="Gatekeeper / No Answer">Gatekeeper / No Answer</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCallModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="pill" size="sm" onClick={handleLogCall}>
              Log Call
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assign Owner Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Lead Owner"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-white light:text-[#121212] font-semibold">Select Sales Rep</label>
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="w-full rounded-2xl border border-white/10 light:border-black/10 bg-[#252a2b] light:bg-[#f0f2f3] p-3 text-white light:text-[#121212]"
            >
              <option value="">Unassigned</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="pill" size="sm" onClick={handleAssignOwner}>
              Save Assignment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cadence Enrollment Modal */}
      <Modal
        isOpen={seqModalOpen}
        onClose={() => setSeqModalOpen(false)}
        title="Enroll in Automated Cadence"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-white light:text-[#121212] font-semibold">Select Cadence</label>
            <select
              value={selectedSeq}
              onChange={(e) => setSelectedSeq(e.target.value)}
              className="w-full rounded-2xl border border-white/10 light:border-black/10 bg-[#252a2b] light:bg-[#f0f2f3] p-3 text-white light:text-[#121212]"
            >
              {availableSequences.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.status})
                </option>
              ))}
            </select>
          </div>
          {enrollmentError && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {enrollmentError}
            </div>
          )}
          {enrollmentSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              {enrollmentSuccess}
            </div>
          )}
          <p className="text-[11px] text-slate-400 light:text-[#787e82]">
            Enrolling will schedule Day 0 outreach and automatically pause on prospect reply.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSeqModalOpen(false)} disabled={isEnrolling}>
              Cancel
            </Button>
            <Button
              variant="pill"
              size="sm"
              onClick={handleEnrollSequence}
              disabled={isEnrolling || !selectedSeq}
            >
              {isEnrolling ? "Enrolling..." : "Confirm Enrollment"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
