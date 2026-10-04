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
  ShieldCheck,
} from "lucide-react";
import { IntentBadge } from "@/components/ui/Badge";

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
      { icon: Eye, text: "Enterprise Pricing page visited 3x", pts: 18, time: "Just now" },
      { icon: Users, text: "3 teammates active across documentation", pts: 15, time: "4m ago" },
      { icon: FileCode, text: "API Webhook architecture reviewed", pts: 12, time: "18m ago" },
      { icon: MailCheck, text: "Opened outbound sequence step #2", pts: 8, time: "1h ago" },
    ],
    aiAction: "Immediate executive priority. Offer a 20-minute architecture review and custom pricing sandbox.",
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
      { icon: Zap, text: "Requested Enterprise Architecture Demo", pts: 25, time: "Just now" },
      { icon: FileCode, text: "SOC2 Compliance packet downloaded", pts: 14, time: "12m ago" },
      { icon: Eye, text: "Multi-region latency specs evaluated", pts: 10, time: "35m ago" },
    ],
    aiAction: "Direct AE touchpoint. CTO evaluating Q4 infrastructure migration with enterprise compliance requirements.",
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
      { icon: FileCode, text: "Evaluated SSO & RBAC security specs", pts: 15, time: "Just now" },
      { icon: Eye, text: "Reviewed tenant isolation architecture", pts: 14, time: "8m ago" },
      { icon: MailCheck, text: "Replied requesting multi-tenant SLA terms", pts: 18, time: "22m ago" },
    ],
    aiAction: "Transmit SOC2 Type II compliance audit packet and schedule 15-minute security briefing.",
    intent: "HOT",
  },
];

export function LiveSignalSimulator() {
  const [selectedLead, setSelectedLead] = useState<SimLead>(sampleLeads[0]);
  const [revealedCount, setRevealedCount] = useState(1);

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
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-slate-800 light:border-slate-200 bg-[#0c1220]/95 light:bg-white shadow-2xl shadow-blue-950/20 light:shadow-slate-200 backdrop-blur-xl overflow-hidden text-left transition-colors">
      {/* Simulator Executive Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 light:border-slate-200 px-4 py-3 bg-slate-900/60 light:bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-700 light:bg-slate-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-700 light:bg-slate-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-700 light:bg-slate-300" />
          </div>
          <span className="text-xs font-mono text-slate-400 light:text-slate-500 pl-2">
            telemetry://live-signal-engine.enterprise
          </span>
        </div>

        {/* Lead Account Switcher */}
        <div className="flex items-center gap-1.5">
          {sampleLeads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors font-medium ${
                selectedLead.id === lead.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-800/60 light:hover:bg-slate-200/60"
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
              <h3 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
                {selectedLead.company}
                <span className="text-xs font-normal text-slate-400 light:text-slate-500">
                  ({selectedLead.domain})
                </span>
              </h3>
              <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5">
                {selectedLead.contact} — <span className="text-slate-300 light:text-slate-700 font-medium">{selectedLead.title}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <IntentBadge level={selectedLead.intent} />
            </div>
          </div>

          {/* Signals Stream */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 light:text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-blue-400 light:text-blue-600 animate-pulse" />
                Live Ingested Signals
              </span>
              <span>{revealedCount} of {selectedLead.signals.length} verified</span>
            </div>

            <div className="space-y-2 min-h-[160px]">
              {selectedLead.signals.slice(0, revealedCount).map((sig, idx) => {
                const Icon = sig.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/70 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-xs text-slate-200 light:text-slate-800 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded bg-blue-500/10 text-blue-400 light:text-blue-600">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium">{sig.text}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-emerald-400 light:text-emerald-600 font-semibold">+{sig.pts}</span>
                      <span className="text-slate-500 text-[10px]">{sig.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Score Evolution & Recommended Play */}
        <div className="md:col-span-5 flex flex-col justify-between rounded-xl bg-slate-900/50 light:bg-slate-50 border border-slate-800/80 light:border-slate-200 p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">
                Deterministic Score
              </span>
              <span className="text-[10px] font-mono font-semibold text-blue-400 light:text-blue-700 bg-blue-500/10 light:bg-blue-100 px-2 py-0.5 rounded">
                +{addedPoints} pts Surge
              </span>
            </div>

            {/* Score Big Display */}
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-white light:text-slate-900">
                {currentScore}
              </span>
              <span className="text-sm font-mono text-slate-500">/ 100</span>
              <span className="ml-auto text-xs font-semibold text-emerald-400 light:text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> High Velocity
              </span>
            </div>

            {/* Score Meter Bar */}
            <div className="mt-2.5 h-2 w-full rounded-full bg-slate-800 light:bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 transition-all duration-700 rounded-full"
                style={{ width: `${currentScore}%` }}
              />
            </div>
          </div>

          {/* AI Recommended Next Action */}
          <div className="rounded-lg bg-blue-950/30 light:bg-blue-50 border border-blue-800/40 light:border-blue-200 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 light:text-blue-700">
              <Sparkles className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" />
              Recommended Playbook Touch
            </div>
            <p className="text-xs text-slate-300 light:text-slate-700 leading-relaxed font-normal">
              "{selectedLead.aiAction}"
            </p>
          </div>

          {/* Automated Sequence Trigger */}
          <div className="pt-2 border-t border-slate-800/80 light:border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-400 light:text-slate-500 flex items-center gap-1.5 font-medium">
              <Zap className="h-3.5 w-3.5 text-amber-400 light:text-amber-600" />
              Cadence Triggered:
            </span>
            <span className="font-semibold text-slate-200 light:text-slate-800">Priority Executive Outbound</span>
          </div>
        </div>
      </div>
    </div>
  );
}
