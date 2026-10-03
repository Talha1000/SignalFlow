"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Cpu,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code,
  Terminal,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export function WorkflowTabsSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "ingest",
      number: "01",
      title: "Connect & Ingest Signals",
      subtitle: "One-click integrations with your existing tech stack",
      description:
        "Connect Segment, Stripe, your website, GitHub, or API webhooks in under 60 seconds. SignalFlow listens to anonymous visitor activity, developer docs usage, and company enrichment in real-time.",
      icon: Share2,
      preview: {
        badge: "INPUT PIPELINE",
        title: "Realtime Ingestion Hub",
        items: [
          { name: "Segment Webhook", desc: "User triggered 'pricing_modal_opened'", status: "Processed (4ms)" },
          { name: "Clearbit Reveal", desc: "Domain resolved to Acme Corp (Series B)", status: "Enriched (12ms)" },
          { name: "GitHub Activity", desc: "3 PRs committed in open-source SDK", status: "Linked (22ms)" },
        ],
        codeSnippet: `// 60-second SDK drop-in
import { SignalFlow } from "@signalflow/sdk";
SignalFlow.track("viewed_enterprise_docs", {
  userId: "usr_942",
  companyDomain: "acmetech.io"
});`,
      },
    },
    {
      id: "score",
      number: "02",
      title: "Synthesize & Explain Score",
      subtitle: "Deterministic AI attribution with zero hallucination",
      description:
        "Our mathematical scoring engine evaluates seniority, intent velocity, ICP fit, and recency decay. Leads surge from Cold to Hot with a human-readable explanation of why they are ready to buy.",
      icon: Cpu,
      preview: {
        badge: "AI INTELLIGENCE",
        title: "Deterministic Scoring Analysis",
        items: [
          { name: "Fit Score: 48/50", desc: "Enterprise SaaS, 450+ headcount, $65M ARR", status: "Optimal ICP" },
          { name: "Intent Velocity: 46/50", desc: "3 team members active on pricing in 24h", status: "Surging +22" },
          { name: "Decision Urgency: HIGH", desc: "Contract expiration flagged in 45 days", status: "Priority 1" },
        ],
        codeSnippet: `// Explainable Score Breakdown
{
  "totalScore": 94,
  "factors": [
    { "factor": "Executive VP Authority", "pts": +20 },
    { "factor": "Enterprise Pricing 3x", "pts": +18 },
    { "factor": "SDK Sandbox Setup", "pts": +15 }
  ]
}`,
      },
    },
    {
      id: "execute",
      number: "03",
      title: "Autonomous Action & Close",
      subtitle: "Turn signals into meetings before leads go cold",
      description:
        "Trigger immediate high-touch executive cadences, dispatch Slack alerts to dedicated account owners, or let the AI Copilot draft a personalized multi-channel follow-up tailored to the prospect's exact research history.",
      icon: Send,
      preview: {
        badge: "AUTONOMOUS EXECUTION",
        title: "Action Dispatcher",
        items: [
          { name: "Slack Urgent Alert", desc: "Sent to #sales-hot-leads with instant claim button", status: "Delivered" },
          { name: "Cadence Sequence #4", desc: "Personalized architecture review email queued", status: "Sent" },
          { name: "Safety Protocol", desc: "Auto-halts sequence instantly upon prospect reply", status: "Listening" },
        ],
        codeSnippet: `// AI Copilot Drafted Play
"Sarah, noticed your team was reviewing our multi-tenant
SSO architecture earlier today. Would you like a private 
sandbox cluster and our SOC2 Type II packet?"`,
      },
    },
  ];

  const current = steps[activeStep];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-950/80 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-4">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>HOW IT OPERATES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            From Raw Telemetry to{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Closed Revenue in 3 Steps
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            See how the entire loop happens seamlessly without manual CRM entry or spreadsheet gymnastics.
          </p>
        </div>

        {/* 3 Step Interactive Tab Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={st.id}
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  isActive
                    ? "bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10 scale-[1.02]"
                    : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-cyan-400">{st.number}</span>
                  <div
                    className={`p-2 rounded-lg ${
                      isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white">{st.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{st.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Detailed Animated Preview Canvas */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Explanation */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
                  Step {current.number}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{current.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{current.description}</p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> Fully automated background pipeline
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Code & Visual Telemetry */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-xs font-mono text-cyan-400 font-semibold">
                      {current.preview.badge}
                    </span>
                    <span className="text-xs text-slate-400">{current.preview.title}</span>
                  </div>

                  {/* Feed Items */}
                  <div className="space-y-2">
                    {current.preview.items.map((it, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{it.name}</div>
                          <div className="text-[11px] text-slate-400">{it.desc}</div>
                        </div>
                        <span className="font-mono text-emerald-400 text-[11px] font-medium">
                          {it.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Code snippet block */}
                  <div className="rounded-xl bg-slate-900/90 p-3.5 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto whitespace-pre">
                    {current.preview.codeSnippet}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
