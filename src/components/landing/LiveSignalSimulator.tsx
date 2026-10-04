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
  TrendingUp,
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
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white shadow-2xl overflow-hidden text-left transition-colors">
      {/* Precision Console Chrome Topbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 light:border-black/10 px-6 py-4 bg-[#252a2b] light:bg-[#f0f2f3]">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/20 light:bg-black/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/20 light:bg-black/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/20 light:bg-black/20" />
          </div>
          <span className="text-xs font-mono text-slate-400 light:text-[#787e82] pl-2 uppercase tracking-wider">
            stream://live-telemetry.enterprise
          </span>
        </div>

        {/* Lead Account Switcher */}
        <div className="flex items-center gap-2">
          {sampleLeads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`text-xs px-3 py-1 rounded-full transition-all font-mono uppercase tracking-wider font-semibold ${
                selectedLead.id === lead.id
                  ? "bg-[#38b6ff] text-[#121212] light:bg-[#121212] light:text-white shadow-sm"
                  : "text-slate-400 light:text-[#4a5053] hover:text-white light:hover:text-[#121212] hover:bg-white/5 light:hover:bg-black/5"
              }`}
            >
              {lead.company.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Body */}
      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Account Profile & Realtime Signals */}
        <div className="md:col-span-7 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-white light:text-[#121212] flex items-center gap-2">
                {selectedLead.company}
                <span className="text-xs font-mono font-normal text-slate-400 light:text-[#787e82]">
                  ({selectedLead.domain})
                </span>
              </h3>
              <p className="text-xs text-slate-400 light:text-[#4a5053] mt-0.5">
                {selectedLead.contact} — <span className="text-slate-200 light:text-[#121212] font-semibold">{selectedLead.title}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <IntentBadge level={selectedLead.intent} />
            </div>
          </div>

          {/* Signals Stream */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 light:text-[#787e82] font-mono uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7] animate-pulse" />
                Live Ingested Signals
              </span>
              <span>{revealedCount} of {selectedLead.signals.length} verified</span>
            </div>

            <div className="space-y-2.5 min-h-[160px]">
              {selectedLead.signals.slice(0, revealedCount).map((sig, idx) => {
                const Icon = sig.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/5 light:border-black/5 text-xs text-slate-200 light:text-[#121212] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-[#1e2224] light:bg-white text-[#38b6ff] light:text-[#0284c7]">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium">{sig.text}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#38b6ff] light:text-[#0284c7] font-bold">+{sig.pts}</span>
                      <span className="text-slate-500 light:text-[#787e82] text-[10px]">{sig.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Score Evolution & Recommended Play */}
        <div className="md:col-span-5 flex flex-col justify-between rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 light:text-[#787e82] font-semibold">
                Deterministic Score
              </span>
              <span className="text-[10px] font-mono font-bold text-[#38b6ff] light:text-[#0284c7] bg-white/5 light:bg-white px-2 py-0.5 rounded-full border border-white/10 light:border-black/10">
                +{addedPoints} pts Surge
              </span>
            </div>

            {/* Score Big Display */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono tracking-tight text-white light:text-[#121212]">
                {currentScore}
              </span>
              <span className="text-sm font-mono text-slate-500 light:text-[#787e82]">/ 100</span>
              <span className="ml-auto text-xs font-semibold text-[#10b981] flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> High Velocity
              </span>
            </div>

            {/* Score Meter Bar */}
            <div className="mt-3 h-2 w-full rounded-full bg-[#1e2224] light:bg-slate-300 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#38b6ff] to-[#34feff] light:from-[#0284c7] light:to-[#38b6ff] transition-all duration-700 rounded-full"
                style={{ width: `${currentScore}%` }}
              />
            </div>
          </div>

          {/* AI Recommended Next Action */}
          <div className="rounded-xl bg-[#1e2224] light:bg-white border border-white/10 light:border-black/10 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#38b6ff] light:text-[#0284c7]">
              <Sparkles className="h-3.5 w-3.5" />
              Recommended Playbook Touch
            </div>
            <p className="text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">
              "{selectedLead.aiAction}"
            </p>
          </div>

          {/* Automated Sequence Trigger */}
          <div className="pt-2 border-t border-white/10 light:border-black/10 flex items-center justify-between text-xs">
            <span className="text-slate-400 light:text-[#787e82] flex items-center gap-1.5 font-medium">
              <Zap className="h-3.5 w-3.5 text-[#f2be01]" />
              Cadence Triggered:
            </span>
            <span className="font-semibold text-white light:text-[#121212]">Executive Outreach</span>
          </div>
        </div>
      </div>
    </div>
  );
}
