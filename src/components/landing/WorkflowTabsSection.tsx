"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Cpu,
  Send,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";

export function WorkflowTabsSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "ingest",
      number: "01",
      title: "Connect & Ingest Signals",
      subtitle: "Enterprise integrations with zero cookie dependencies",
      description:
        "Connect Segment, Stripe, your website, GitHub, or API webhooks in under 60 seconds. SignalFlow listens to anonymous visitor activity, developer docs usage, and company enrichment in real-time.",
      icon: Share2,
      preview: {
        badge: "INGESTION PIPELINE",
        title: "Real-Time Telemetry Stream",
        items: [
          { name: "Segment Webhook", desc: "User triggered 'pricing_modal_opened'", status: "Processed (4ms)" },
          { name: "Clearbit Reveal", desc: "Domain resolved to Acme Corp (Series B)", status: "Enriched (12ms)" },
          { name: "GitHub Activity", desc: "3 PRs committed in open-source SDK", status: "Linked (22ms)" },
        ],
        codeSnippet: `// Drop-in TypeScript SDK
import { SignalFlow } from "@signalflow/sdk";

SignalFlow.track("viewed_enterprise_pricing", {
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
        badge: "DETERMINISTIC ATTRIBUTION",
        title: "Explainable Mathematical Score",
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
        codeSnippet: `// AI Copilot Tailored Outreach
"Sarah, noticed your team was reviewing our multi-tenant
SSO architecture earlier today. Would you like a private 
sandbox cluster and our SOC2 Type II audit packet?"`,
      },
    },
  ];

  const current = steps[activeStep];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-950/80 light:bg-slate-50/80 border-t border-slate-800/80 light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 light:border-blue-200 light:bg-blue-50 light:text-blue-700 text-xs font-semibold tracking-wide mb-4">
            <Layers className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" />
            <span>ENTERPRISE WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white light:text-slate-900 tracking-tight">
            From Raw Telemetry to{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 light:from-blue-600 light:via-indigo-600 light:to-blue-800 bg-clip-text text-transparent">
              Closed Revenue in 3 Steps
            </span>
          </h2>
          <p className="mt-4 text-slate-300 light:text-slate-600 text-base sm:text-lg">
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
                    ? "bg-slate-900 light:bg-white border-blue-500/60 light:border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.01]"
                    : "bg-slate-900/40 light:bg-slate-100/70 border-slate-800 light:border-slate-200 hover:bg-slate-900/70 light:hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-blue-400 light:text-blue-600">{st.number}</span>
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-blue-500/20 text-blue-300 light:bg-blue-100 light:text-blue-700"
                        : "bg-slate-800 light:bg-slate-200 text-slate-400 light:text-slate-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white light:text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-400 light:text-slate-600 mt-1">{st.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Detailed Animated Preview Canvas */}
        <div className="rounded-3xl border border-slate-800 light:border-slate-200 bg-slate-900/90 light:bg-white p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-colors">
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
                <span className="text-xs font-mono font-semibold text-blue-400 light:text-blue-600 uppercase tracking-widest">
                  Step {current.number}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900">{current.title}</h3>
                <p className="text-sm text-slate-300 light:text-slate-600 leading-relaxed">{current.description}</p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 light:text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> Automated background orchestration
                  </span>
                </div>
              </div>

              {/* Right Column: Code & Visual Telemetry */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-slate-800 light:border-slate-200 bg-slate-950 light:bg-slate-50 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-800/80 light:border-slate-200 pb-3">
                    <span className="text-xs font-mono text-blue-400 light:text-blue-700 font-semibold">
                      {current.preview.badge}
                    </span>
                    <span className="text-xs text-slate-400 light:text-slate-500">{current.preview.title}</span>
                  </div>

                  {/* Feed Items */}
                  <div className="space-y-2">
                    {current.preview.items.map((it, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-900/70 light:bg-white border border-slate-800/90 light:border-slate-200 flex items-center justify-between text-xs shadow-xs"
                      >
                        <div>
                          <div className="font-semibold text-white light:text-slate-900">{it.name}</div>
                          <div className="text-[11px] text-slate-400 light:text-slate-500">{it.desc}</div>
                        </div>
                        <span className="font-mono text-emerald-400 light:text-emerald-600 text-[11px] font-semibold">
                          {it.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Code snippet block */}
                  <div className="rounded-xl bg-slate-900/90 light:bg-slate-900 p-3.5 border border-slate-800 light:border-slate-800 font-mono text-[11px] text-blue-300 overflow-x-auto whitespace-pre">
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
