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
        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 p-5 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Interactive Guided Tour</h4>
              <p className="text-xs text-slate-300">
                You're viewing the <strong>Priority Queue</strong>. Leads are ranked by immediate
                buying velocity, not chronological creation date.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTour(false)}
              className="text-xs border-slate-700"
            >
              Dismiss Tour
            </Button>
            <Link href="/app/leads">
              <Button variant="gradient" size="sm" className="text-xs">
                View All Leads →
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Good morning, Alex
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● Live Engine Sync
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Here's what needs your attention today across your revenue pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/app/onboarding">
            <Button variant="outline" size="sm" className="text-xs">
              + Import Leads
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Hot Leads */}
        <div
          onClick={() => setFilter(filter === "HOT" ? "ALL" : "HOT")}
          className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
            filter === "HOT"
              ? "bg-red-950/30 border-red-500/50 ring-1 ring-red-500/40"
              : "bg-slate-900/80 border-slate-800 hover:border-red-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Hot Leads</span>
            <div className="p-1 rounded bg-red-500/10 text-red-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-white">
            {metrics.hotCount}
          </div>
          <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-medium">
            🔥 Score 85+ • Immediate action
          </p>
        </div>

        {/* Surging Intent */}
        <div
          onClick={() => setFilter(filter === "SURGING" ? "ALL" : "SURGING")}
          className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
            filter === "SURGING"
              ? "bg-amber-950/30 border-amber-500/50 ring-1 ring-amber-500/40"
              : "bg-slate-900/80 border-slate-800 hover:border-amber-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Surging Intent</span>
            <div className="p-1 rounded bg-amber-500/10 text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-white">
            {metrics.surgingCount}
          </div>
          <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1 font-medium">
            ⚡ +15 pts in 7 days
          </p>
        </div>

        {/* Follow-ups Due */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Follow-ups Due</span>
            <div className="p-1 rounded bg-cyan-500/10 text-cyan-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-white">
            {metrics.followUpsDue}
          </div>
          <p className="text-[10px] text-cyan-400 mt-1 font-medium">📩 Cadence steps due today</p>
        </div>

        {/* Leads Going Cold */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Going Cold</span>
            <div className="p-1 rounded bg-slate-800 text-slate-400">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-white">
            {metrics.coolingCount}
          </div>
          <p className="text-[10px] text-rose-400 mt-1 font-medium">⚠ 14+ days inactivity</p>
        </div>

        {/* Influenced Pipeline */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pipeline Influenced</span>
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-white">
            ${(metrics.pipelineValue / 1000).toFixed(0)}K
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> Across qualified stages
          </p>
        </div>
      </div>

      {/* AI Sales Morning Briefing Card */}
      <div className="rounded-2xl border border-cyan-800/40 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-900 p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              AI Sales Morning Briefing
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Generated 8:00 AM Today</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-400" />
              The Priority Queue
            </h2>
            <p className="text-xs text-slate-400">
              Ranked dynamically by intent score, stakeholder velocity, and recent engagement.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded-md transition-colors font-medium ${
                filter === "ALL" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              All ({leads.length})
            </button>
            <button
              onClick={() => setFilter("HOT")}
              className={`px-3 py-1 rounded-md transition-colors font-medium flex items-center gap-1 ${
                filter === "HOT"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🔥 Hot Only ({metrics.hotCount})
            </button>
            <button
              onClick={() => setFilter("SURGING")}
              className={`px-3 py-1 rounded-md transition-colors font-medium flex items-center gap-1 ${
                filter === "SURGING"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ⚡ Surging ({metrics.surgingCount})
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
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-slate-700 transition-all duration-150 space-y-4 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Lead Identity & Title */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0 w-16">
                      <span className="text-xl font-extrabold font-mono text-white tracking-tight">
                        {lead.score}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">/ 100</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/app/leads/${lead.id}`}
                          className="text-base font-bold text-white hover:text-cyan-400 transition-colors"
                        >
                          {companyName}
                        </Link>
                        <IntentBadge level={lead.intentLevel} />
                        <StageBadge stage={lead.stage} />
                      </div>

                      <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white">{contactName}</span>
                        <span className="text-slate-500">•</span>
                        <span>{lead.contact?.title || "Decision Maker"}</span>
                        {lead.dealValue > 0 && (
                          <>
                            <span className="text-slate-500">•</span>
                            <span className="font-mono text-emerald-400 font-semibold">
                              ${lead.dealValue.toLocaleString()} deal value
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="gradient"
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
                      className="gap-1.5"
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
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  {/* Recent Signals */}
                  <div className="md:col-span-6 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                      Recent Activity Signals
                    </span>
                    <div className="space-y-1 text-slate-300">
                      {lead.activities && lead.activities.length > 0 ? (
                        lead.activities.map((a, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                            <span>{a.title}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Eye className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Viewed pricing & integration architecture docs</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Recommended Next Action */}
                  <div className="md:col-span-6 rounded-lg bg-cyan-950/20 border border-cyan-800/30 p-2.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px]">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                      AI Recommended Action
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
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
