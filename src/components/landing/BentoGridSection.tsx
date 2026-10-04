"use client";

import React from "react";
import {
  Activity,
  Target,
  Zap,
  ShieldCheck,
  TrendingUp,
  Database,
  Globe,
  Lock,
  CheckCircle2,
  GitPullRequest,
  Sparkles,
} from "lucide-react";

export function BentoGridSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950/80 light:bg-slate-50/80 transition-colors">
      {/* Background subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 light:border-blue-200 light:bg-blue-50 light:text-blue-700 text-xs font-semibold tracking-wide mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" />
            <span>ENTERPRISE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white light:text-slate-900 tracking-tight">
            Comprehensive Infrastructure for{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 light:from-blue-600 light:via-indigo-600 light:to-blue-800 bg-clip-text text-transparent">
              Autonomous Revenue
            </span>
          </h2>
          <p className="mt-4 text-slate-300 light:text-slate-600 text-base sm:text-lg">
            Engineered from first principles for high-growth SaaS and enterprise revenue operations that outgrow legacy CRM spreadsheets.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Omnichannel Signal Ingestion (Span 2) */}
          <div className="md:col-span-2 rounded-3xl border border-slate-800 light:border-slate-200 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-950 light:from-white light:via-slate-50 light:to-slate-100 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/40 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 light:text-blue-600 border border-blue-500/20 light:border-blue-200">
                <Database className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-blue-400 light:text-blue-700 bg-blue-500/10 light:bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-500/20 light:border-blue-200">
                &lt; 50ms Webhook Stream
              </span>
            </div>

            <h3 className="text-xl font-bold text-white light:text-slate-900">First-Party Telemetry & Ingestion Engine</h3>
            <p className="mt-2 text-sm text-slate-400 light:text-slate-600 max-w-lg leading-relaxed">
              Capture digital intent across every buyer touchpoint: pricing loops, documentation reads, API sandbox spikes, and hiring announcements without third-party cookies.
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
                  className="p-3 rounded-xl bg-slate-950/80 light:bg-white border border-slate-800 light:border-slate-200 text-left relative overflow-hidden shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-mono text-slate-500">{pipe.speed}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 light:text-slate-800 mt-2">{pipe.name}</div>
                  <div className="text-[10px] font-mono text-blue-400 light:text-blue-600 mt-0.5">{pipe.state}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Self-Tuning Intent Radar */}
          <div className="rounded-3xl border border-slate-800 light:border-slate-200 bg-gradient-to-br from-slate-900/90 to-slate-950 light:from-white light:to-slate-100 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 light:text-indigo-600 border border-indigo-500/20 light:border-indigo-200">
                  <Target className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-indigo-400 light:text-indigo-700 bg-indigo-500/10 light:bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-500/20 light:border-indigo-200">
                  Adaptive ICP
                </span>
              </div>
              <h3 className="text-xl font-bold text-white light:text-slate-900">Self-Tuning Intent Radar</h3>
              <p className="mt-2 text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                Autonomous radar that continuously correlates buyer telemetry to alert reps the moment target accounts enter their decision window.
              </p>
            </div>

            {/* Radar graphic animation */}
            <div className="mt-6 flex items-center justify-center p-4">
              <div className="relative h-28 w-28 rounded-full border border-indigo-500/30 light:border-indigo-200 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-indigo-500/20 animate-spin" style={{ animationDuration: "16s" }} />
                <div className="h-16 w-16 rounded-full border border-blue-500/40 light:border-blue-300 flex items-center justify-center">
                  <span className="h-3 w-3 rounded-full bg-blue-500" />
                </div>
                <span className="absolute top-3 right-5 h-2 w-2 rounded-full bg-emerald-400" />
                <span className="absolute bottom-4 left-6 h-1.5 w-1.5 rounded-full bg-indigo-400" />
              </div>
            </div>
          </div>

          {/* Card 3: Deterministic Explainable AI Scoring */}
          <div className="rounded-3xl border border-slate-800 light:border-slate-200 bg-gradient-to-br from-slate-900/90 to-slate-950 light:from-white light:to-slate-100 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/40 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 light:text-blue-600 border border-blue-500/20 light:border-blue-200">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-emerald-400 light:text-emerald-700 bg-emerald-500/10 light:bg-emerald-100 px-2 py-0.5 rounded">
                Deterministic
              </span>
            </div>
            <h3 className="text-xl font-bold text-white light:text-slate-900">Explainable Scoring Logs</h3>
            <p className="mt-2 text-sm text-slate-400 light:text-slate-600 leading-relaxed">
              Every score (0–100) displays exact mathematical factors so sales reps understand precisely why an account is prioritized.
            </p>

            <div className="mt-4 space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/80 light:bg-white border border-slate-800/80 light:border-slate-200 flex justify-between shadow-xs">
                <span className="text-slate-300 light:text-slate-700">C-Level Decision Maker</span>
                <span className="text-emerald-400 light:text-emerald-600 font-bold">+25 pts</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 light:bg-white border border-slate-800/80 light:border-slate-200 flex justify-between shadow-xs">
                <span className="text-slate-300 light:text-slate-700">Enterprise Pricing 3x</span>
                <span className="text-emerald-400 light:text-emerald-600 font-bold">+18 pts</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 light:bg-white border border-slate-800/80 light:border-slate-200 flex justify-between shadow-xs">
                <span className="text-slate-300 light:text-slate-700">Recency Decay (14d)</span>
                <span className="text-rose-400 light:text-rose-600 font-bold">-8 pts</span>
              </div>
            </div>
          </div>

          {/* Card 4: Autonomous Drip Cadences with Auto-Stop */}
          <div className="rounded-3xl border border-slate-800 light:border-slate-200 bg-gradient-to-br from-slate-900/90 to-slate-950 light:from-white light:to-slate-100 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 light:text-amber-600 border border-amber-500/20 light:border-amber-200">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-amber-400 light:text-amber-700 bg-amber-500/10 light:bg-amber-100 px-2 py-0.5 rounded">
                Auto-Stop Active
              </span>
            </div>
            <h3 className="text-xl font-bold text-white light:text-slate-900">Protected Autonomous Cadences</h3>
            <p className="mt-2 text-sm text-slate-400 light:text-slate-600 leading-relaxed">
              Multi-touch outreach cadences that instantly halt across all reps the millisecond a prospect replies or books a meeting.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/90 light:bg-white border border-slate-800/90 light:border-slate-200 space-y-2 text-xs shadow-xs">
              <div className="flex items-center gap-2 text-emerald-400 light:text-emerald-600 font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Reply Detected from Prospect
              </div>
              <div className="text-[11px] text-slate-400 light:text-slate-500 font-mono">
                Status: Cadence #104 halted for 3 reps
              </div>
            </div>
          </div>

          {/* Card 5: Enterprise Sovereign Security */}
          <div className="rounded-3xl border border-slate-800 light:border-slate-200 bg-gradient-to-br from-slate-900/90 to-slate-950 light:from-white light:to-slate-100 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 light:text-emerald-600 border border-emerald-500/20 light:border-emerald-200">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-emerald-400 light:text-emerald-700 bg-emerald-500/10 light:bg-emerald-100 px-2 py-0.5 rounded">
                SOC2 Type II
              </span>
            </div>
            <h3 className="text-xl font-bold text-white light:text-slate-900">Sovereign Data Security</h3>
            <p className="mt-2 text-sm text-slate-400 light:text-slate-600 leading-relaxed">
              Multi-tenant customer isolation, SAML 2.0 / Okta SSO, audit logs, and zero data retention agreements for AI operations.
            </p>

            <div className="mt-4 space-y-2 text-xs text-slate-300 light:text-slate-700">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" /> AES-256 at Rest & TLS 1.3 in Flight
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" /> EU & US Sovereign Data Residency
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
