"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Flame,
  Zap,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Target,
  Eye,
  MailCheck,
  CheckCircle2,
  Users,
  Mail,
  X,
  FileText,
  Filter,
} from "lucide-react";
import { IntentBadge, ScoreBadge, StageBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmailComposerModal } from "@/components/email/EmailComposerModal";

interface LeadItem {
  id: string;
  score: number;
  intentLevel: string;
  dealValue: number;
  stage: string;
  nextAction?: string | null;
  lastActivityAt: string | Date;
  company?: {
    id: string;
    name: string;
    domain?: string | null;
    industry?: string | null;
  } | null;
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    title?: string | null;
  } | null;
  leadScore?: {
    delta7d: number;
    explanation?: string | null;
    positiveFactors: any;
  } | null;
  activities: Array<{
    id: string;
    title: string;
    type: string;
    createdAt: string | Date;
  }>;
}

interface DashboardProps {
  leads: LeadItem[];
  metrics: {
    hotCount: number;
    surgingCount: number;
    followUpsDue: number;
    coolingCount: number;
    pipelineValue: number;
  };
}

export function DashboardClientView({ leads, metrics }: DashboardProps) {
  const searchParams = useSearchParams();
  const showTourParam = searchParams.get("tour") === "start";
  const [showTour, setShowTour] = useState(showTourParam);
  const [filter, setFilter] = useState<"ALL" | "HOT" | "SURGING">("ALL");
  const [activeComposerLead, setActiveComposerLead] = useState<{
    id: string;
    name: string;
    email: string;
    company: string;
    title?: string;
    score?: number;
  } | null>(null);

  const filteredLeads = leads.filter((l) => {
    if (filter === "HOT") return l.score >= 85;
    if (filter === "SURGING") return l.score >= 70 && l.score < 85;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Interactive Tour Banner */}
      {showTour && (
        <div className="rounded-3xl border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white p-6 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-colors">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-[#38b6ff] light:text-[#0284c7] border border-white/10 light:border-black/10">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white light:text-[#121212]">Interactive Guided Tour</h4>
              <p className="text-xs text-slate-300 light:text-[#4a5053] mt-0.5">
                You're viewing the <strong>Priority Queue</strong>. Accounts are ranked by immediate
                buying velocity, not chronological creation date.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTour(false)}
              className="text-xs"
            >
              Dismiss
            </Button>
            <Link href="/app/leads">
              <Button variant="primary" size="sm" className="text-xs font-semibold">
                View All Leads →
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white light:text-[#121212] flex items-center gap-3">
            Good morning, Alex
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/10 light:bg-black/5 text-[#10b981] border border-white/10 light:border-black/10">
              ● Live Engine Sync
            </span>
          </h1>
          <p className="text-xs text-slate-400 light:text-[#787e82] mt-1 font-mono">
            Real-time accounts demanding executive action across your revenue pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/app/onboarding">
            <Button variant="outline" size="sm" className="text-xs">
              + Import Accounts
            </Button>
          </Link>
          <Link href="/app/pipeline">
            <Button variant="secondary" size="sm" className="text-xs">
              View Kanban Pipeline →
            </Button>
          </Link>
        </div>
      </div>

      {/* Priority Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Hot Leads */}
        <div
          onClick={() => setFilter(filter === "HOT" ? "ALL" : "HOT")}
          className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
            filter === "HOT"
              ? "bg-red-950/30 light:bg-red-50 border-red-500/50 ring-1 ring-red-500/40"
              : "bg-[#1e2224] light:bg-white border-white/10 light:border-black/10 hover:border-red-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 light:text-[#787e82]">Hot Leads</span>
            <div className="p-1.5 rounded-full bg-red-500/10 text-red-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-white light:text-[#121212]">
            {metrics.hotCount}
          </div>
          <p className="text-[10px] text-red-400 mt-1 font-mono font-medium">
            Score 85+ • Action required
          </p>
        </div>

        {/* Surging Intent */}
        <div
          onClick={() => setFilter(filter === "SURGING" ? "ALL" : "SURGING")}
          className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
            filter === "SURGING"
              ? "bg-amber-950/30 light:bg-amber-50 border-amber-500/50 ring-1 ring-amber-500/40"
              : "bg-[#1e2224] light:bg-white border-white/10 light:border-black/10 hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 light:text-[#787e82]">Surging Intent</span>
            <div className="p-1.5 rounded-full bg-amber-500/10 text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-white light:text-[#121212]">
            {metrics.surgingCount}
          </div>
          <p className="text-[10px] text-amber-400 mt-1 font-mono font-medium">
            +15 pts in 7 days
          </p>
        </div>

        {/* Follow-ups Due */}
        <div className="rounded-2xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 light:text-[#787e82]">Follow-ups</span>
            <div className="p-1.5 rounded-full bg-[#38b6ff]/10 text-[#38b6ff] light:text-[#0284c7]">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-white light:text-[#121212]">
            {metrics.followUpsDue}
          </div>
          <p className="text-[10px] text-[#38b6ff] light:text-[#0284c7] mt-1 font-mono font-medium">Cadence steps due</p>
        </div>

        {/* Leads Going Cold */}
        <div className="rounded-2xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 light:text-[#787e82]">Going Cold</span>
            <div className="p-1.5 rounded-full bg-white/5 light:bg-black/5 text-slate-400">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-white light:text-[#121212]">
            {metrics.coolingCount}
          </div>
          <p className="text-[10px] text-rose-400 mt-1 font-mono font-medium">14+ days inactivity</p>
        </div>

        {/* Influenced Pipeline */}
        <div className="rounded-2xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-white p-5 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 light:text-[#787e82]">Influenced</span>
            <div className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-white light:text-[#121212]">
            ${(metrics.pipelineValue / 1000).toFixed(0)}K
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 font-mono font-medium flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> Across qualified
          </p>
        </div>
      </div>

      {/* AI Sales Executive Briefing Card */}
      <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-white p-6 shadow-sm space-y-2.5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" />
            <h3 className="text-xs font-mono font-bold text-white light:text-[#121212] uppercase tracking-wider">
              AI Sales Executive Briefing
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 light:text-[#787e82]">Generated 8:00 AM Today</span>
        </div>
        <p className="text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">
          "3 accounts (<strong>Acme Technologies</strong>, <strong>ApexCloud Platforms</strong>, and{" "}
          <strong>SecurityZero Corp</strong>) show immediate buying velocity with multiple
          stakeholders active on pricing and API documentation. Sarah Chen and Marcus Vance should
          receive tailored architecture briefings before 12:00 PM."
        </p>
      </div>

      {/* Main Section: Priority Queue */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white light:text-[#121212] flex items-center gap-2">
              <Target className="h-5 w-5 text-[#38b6ff] light:text-[#0284c7]" />
              The Priority Queue
            </h2>
            <p className="text-xs text-slate-400 light:text-[#787e82] font-mono">
              Ranked dynamically by intent score, stakeholder velocity, and recent engagement.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-[#1e2224] light:bg-white p-1 rounded-full border border-white/10 light:border-black/10 text-xs font-mono">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-full transition-colors font-medium ${
                filter === "ALL"
                  ? "bg-[#252a2b] light:bg-[#f0f2f3] text-white light:text-[#121212] shadow-sm font-bold"
                  : "text-slate-400 light:text-[#787e82] hover:text-white"
              }`}
            >
              All ({leads.length})
            </button>
            <button
              onClick={() => setFilter("HOT")}
              className={`px-3.5 py-1.5 rounded-full transition-colors font-medium flex items-center gap-1 ${
                filter === "HOT"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30 shadow-sm font-bold"
                  : "text-slate-400 light:text-[#787e82] hover:text-white"
              }`}
            >
              Hot ({metrics.hotCount})
            </button>
            <button
              onClick={() => setFilter("SURGING")}
              className={`px-3.5 py-1.5 rounded-full transition-colors font-medium flex items-center gap-1 ${
                filter === "SURGING"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm font-bold"
                  : "text-slate-400 light:text-[#787e82] hover:text-white"
              }`}
            >
              Surging ({metrics.surgingCount})
            </button>
          </div>
        </div>

        {/* Priority Lead Cards List */}
        <div className="space-y-3">
          {filteredLeads.map((lead) => {
            const contactName = lead.contact
              ? `${lead.contact.firstName} ${lead.contact.lastName}`
              : "Lead Contact";
            const companyName = lead.company?.name || "Target Account";

            return (
              <div
                key={lead.id}
                className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-white p-6 hover:border-[#38b6ff]/40 light:hover:border-black/20 transition-all duration-150 space-y-5 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Lead Identity & Title */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 shrink-0 w-16">
                      <span className="text-2xl font-black font-mono text-white light:text-[#121212] tracking-tight">
                        {lead.score}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 light:text-[#787e82]">/ 100</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                          href={`/app/leads/${lead.id}`}
                          className="text-base font-bold text-white light:text-[#121212] hover:text-[#38b6ff] transition-colors"
                        >
                          {companyName}
                        </Link>
                        <IntentBadge level={lead.intentLevel} />
                        <StageBadge stage={lead.stage} />
                      </div>

                      <div className="text-xs text-slate-300 light:text-[#4a5053] flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white light:text-[#121212]">{contactName}</span>
                        <span className="text-slate-500">•</span>
                        <span>{lead.contact?.title || "Decision Maker"}</span>
                        {lead.dealValue > 0 && (
                          <>
                            <span className="text-slate-500">•</span>
                            <span className="font-mono text-[#38b6ff] light:text-[#0284c7] font-semibold">
                              ${lead.dealValue.toLocaleString()} deal value
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        setActiveComposerLead({
                          id: lead.id,
                          name: contactName,
                          email: lead.contact?.email || "sarah@company.com",
                          company: companyName,
                          title: lead.contact?.title || undefined,
                          score: lead.score,
                        })
                      }
                      className="gap-1.5 font-semibold shadow-xs"
                    >
                      <Mail className="h-3.5 w-3.5" /> Contact Lead
                    </Button>

                    <Link href={`/app/leads/${lead.id}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Details →
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Sub-block: Activity Signals & AI Recommended Action */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 border-t border-white/10 light:border-black/5 text-xs">
                  {/* Recent Signals */}
                  <div className="md:col-span-6 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 light:text-[#787e82] font-semibold">
                      Recent Activity Signals
                    </span>
                    <div className="space-y-1 text-slate-300 light:text-[#4a5053]">
                      {lead.activities && lead.activities.length > 0 ? (
                        lead.activities.map((a, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#38b6ff] light:bg-[#0284c7] shrink-0" />
                            <span>{a.title}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Eye className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
                          <span>Viewed pricing & integration architecture docs</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Recommended Next Action */}
                  <div className="md:col-span-6 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/5 light:border-black/5 p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#38b6ff] light:text-[#0284c7] font-semibold text-[11px] font-mono">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Recommended Action
                    </div>
                    <p className="text-xs text-slate-200 light:text-[#121212] leading-relaxed">
                      "{lead.nextAction || "Send tailored architecture case study and offer 20-minute review call."}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Email Composer Modal */}
      <EmailComposerModal
        isOpen={Boolean(activeComposerLead)}
        onClose={() => setActiveComposerLead(null)}
        lead={activeComposerLead}
      />
    </div>
  );
}
