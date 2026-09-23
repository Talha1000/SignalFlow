"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Users,
  Eye,
  FileCode,
  MailCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { IntentBadge, ScoreBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface SimLead {
  id: string;
  company: string;
  domain: string;
  contact: string;
  title: string;
  initialScore: number;
  signals: Array<{ icon: any; text: string; pts: number; time: string }>;
  aiAction: string;
  intent: "HOT" | "HIGH" | "WARM";
}

const sampleLeads: SimLead[] = [
  {
    id: "acme",
    company: "Acme Technologies",
    domain: "acmetech.io",
    contact: "Sarah Chen",
    title: "VP of Engineering",
    initialScore: 68,
    signals: [
      { icon: Eye, text: "Enterprise Pricing visited 3x", pts: 18, time: "Just now" },
      { icon: Users, text: "3 teammates active across docs", pts: 15, time: "4m ago" },
      { icon: FileCode, text: "API Webhook docs viewed", pts: 12, time: "18m ago" },
      { icon: MailCheck, text: "Opened outbound sequence #2", pts: 8, time: "1h ago" },
    ],
    aiAction: "Contact within 2 hours. Offer a 20-minute architecture review and custom pricing sandbox.",
    intent: "HOT",
  },
  {
    id: "apex",
    company: "ApexCloud Platforms",
    domain: "apexcloud.dev",
    contact: "Marcus Vance",
    title: "Chief Technology Officer",
    initialScore: 62,
    signals: [
      { icon: Zap, text: "Requested Enterprise Demo", pts: 25, time: "Just now" },
      { icon: FileCode, text: "SOC2 Compliance packet downloaded", pts: 14, time: "12m ago" },
      { icon: Eye, text: "Pricing comparison page visited", pts: 10, time: "35m ago" },
    ],
    aiAction: "Immediate executive touchpoint. CTO requested demonstration for upcoming Q4 infrastructure overhaul.",
    intent: "HOT",
  },
  {
    id: "securityzero",
    company: "SecurityZero Corp",
    domain: "securityzero.com",
    contact: "Victor Stone",
    title: "Chief Information Officer",
    initialScore: 71,
    signals: [
      { icon: FileCode, text: "Evaluated SSO & RBAC specs", pts: 15, time: "Just now" },
      { icon: Eye, text: "Reviewed tenant isolation architecture", pts: 14, time: "8m ago" },
      { icon: MailCheck, text: "Replied: 'Looking for multi-tenant SLA'", pts: 18, time: "22m ago" },
    ],
    aiAction: "Forward SOC2 Type II audit report and schedule 15-min compliance briefing.",
    intent: "HOT",
  },
];

export function LiveSignalSimulator() {
  const [selectedLead, setSelectedLead] = useState<SimLead>(sampleLeads[0]);
  const [revealedCount, setRevealedCount] = useState(1);
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    setRevealedCount(1);
    const timer = setInterval(() => {
      setRevealedCount((prev) => (prev < selectedLead.signals.length ? prev + 1 : prev));
    }, 1400);

    return () => clearInterval(timer);
  }, [selectedLead]);

  const addedPoints = selectedLead.signals
    .slice(0, revealedCount)
    .reduce((sum, s) => sum + s.pts, 0);
  const currentScore = Math.min(98, selectedLead.initialScore + addedPoints);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-950/90 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl overflow-hidden text-left">
      {/* Simulator Topbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400 pl-2">
            engine://realtime-signal-pipeline.live
          </span>
        </div>

        {/* Lead Switcher */}
        <div className="flex items-center gap-1.5">
          {sampleLeads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors font-medium ${
                selectedLead.id === lead.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {lead.company.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Account Profile & Realtime Signals */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {selectedLead.company}
                <span className="text-xs font-normal text-slate-400">({selectedLead.domain})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedLead.contact} — <span className="text-slate-300">{selectedLead.title}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <IntentBadge level={selectedLead.intent} />
            </div>
          </div>

          {/* Signals Stream */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                Live Ingested Signals
              </span>
              <span>{revealedCount} of {selectedLead.signals.length} processed</span>
            </div>

            <div className="space-y-2 min-h-[160px]">
              {selectedLead.signals.slice(0, revealedCount).map((sig, idx) => {
                const Icon = sig.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200 animate-fadeIn transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded bg-cyan-500/10 text-cyan-400">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium">{sig.text}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-emerald-400 font-semibold">+{sig.pts}</span>
                      <span className="text-slate-500 text-[10px]">{sig.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Score Evolution & Recommended Play */}
        <div className="md:col-span-5 flex flex-col justify-between rounded-xl bg-slate-900/60 border border-slate-800/90 p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Explainable Score
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                +{addedPoints} pts Surge
              </span>
            </div>

            {/* Score Big Display */}
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
                {currentScore}
              </span>
              <span className="text-sm font-mono text-slate-500">/ 100</span>
              <span className="ml-auto text-xs font-medium text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> High Velocity
              </span>
            </div>

            {/* Score Meter Bar */}
            <div className="mt-2.5 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-700 rounded-full"
                style={{ width: `${currentScore}%` }}
              />
            </div>
          </div>

          {/* AI Recommended Next Action */}
          <div className="rounded-lg bg-cyan-950/30 border border-cyan-800/40 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              AI Recommended Next Action
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "{selectedLead.aiAction}"
            </p>
          </div>

          {/* Automated Sequence Trigger */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Sequence Triggered:
            </span>
            <span className="font-semibold text-slate-200">Rapid Enterprise Response</span>
          </div>
        </div>
      </div>
    </div>
  );
}
