"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Target,
  Zap,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  GitPullRequest,
  Database,
  Globe,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Mail,
} from "lucide-react";

export function BentoGridSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono mb-4">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>2027 REVENUE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Six Engines. One Autonomous{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Revenue Command Center
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Engineered from first principles for high-growth SaaS and enterprise sales orgs that outgrow legacy CRM spreadsheets.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Omnichannel Signal Ingestion (Span 2) */}
          <div className="md:col-span-2 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-950 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Database className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                &lt; 50ms Webhook Stream
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">Omnichannel Signal Ingestion Engine</h3>
            <p className="mt-2 text-sm text-slate-400 max-w-lg leading-relaxed">
              Listen to the dark funnel across every buyer touchpoint: pricing loops, documentation reads, API sandbox spikes, and hiring announcements.
            </p>

            {/* Visual Telemetry Stream Nodes */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Pricing Webhooks", speed: "12ms", state: "Active" },
                { name: "Docs Telemetry", speed: "18ms", state: "Streaming" },
                { name: "Git Repo Stars", speed: "45ms", state: "Synced" },
                { name: "Executive Hires", speed: "92ms", state: "Ingested" },
              ].map((pipe, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-left relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-slate-500">{pipe.speed}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-2">{pipe.name}</div>
                  <div className="text-[10px] font-mono text-cyan-400 mt-0.5">{pipe.state}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Self-Tuning Intent Radar */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Target className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Adaptive ICP
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Self-Tuning Intent Radar</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Autonomous radar that maps buyer velocity and alerts reps the moment accounts enter their decision window.
              </p>
            </div>

            {/* Radar graphic animation */}
            <div className="mt-6 flex items-center justify-center p-4">
              <div className="relative h-28 w-28 rounded-full border border-indigo-500/30 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-indigo-500/20 animate-spin" style={{ animationDuration: "12s" }} />
                <div className="h-16 w-16 rounded-full border border-cyan-500/40 flex items-center justify-center">
                  <span className="h-3 w-3 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <span className="absolute top-3 right-5 h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                <span className="absolute bottom-4 left-6 h-1.5 w-1.5 rounded-full bg-amber-400" />
              </div>
            </div>
          </div>

          {/* Card 3: Deterministic Explainable AI Scoring */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                No Black Box
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Explainable Scoring Logs</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Every score (0–100) displays exact mathematical factors so sales reps understand why an account is prioritized.
            </p>

            <div className="mt-4 space-y-2 font-mono text-xs">
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/80 flex justify-between">
                <span className="text-slate-300">C-Level Decision Maker</span>
                <span className="text-emerald-400 font-bold">+25 pts</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/80 flex justify-between">
                <span className="text-slate-300">Enterprise Pricing 3x</span>
                <span className="text-emerald-400 font-bold">+18 pts</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800/80 flex justify-between">
                <span className="text-slate-300">Recency Decay (14d)</span>
                <span className="text-rose-400 font-bold">-8 pts</span>
              </div>
            </div>
          </div>

          {/* Card 4: Autonomous Drip Cadences with Auto-Stop */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                Auto-Stop Active
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Safe Autonomous Cadences</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Multi-touch outreach cadences that instantly halt across all reps the millisecond a prospect replies or books a demo.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="h-4 w-4" /> Reply Detected from Prospect
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Status: Sequence #102 halted for 3 reps
              </div>
            </div>
          </div>

          {/* Card 5: Enterprise Sovereign Security */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                SOC2 Type II
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Sovereign Data Isolation</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Full multi-tenant tenant isolation, SAML 2.0 SSO, audit logs, and zero data retention guarantees on AI models.
            </p>

            <div className="mt-4 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-cyan-400" /> AES-256 at Rest & TLS 1.3
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-cyan-400" /> EU & US Data Residency
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
