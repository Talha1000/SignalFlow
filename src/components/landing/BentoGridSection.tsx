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
} from "lucide-react";

export function BentoGridSection() {
  return (
    <section className="py-28 relative overflow-hidden bg-[#121212] light:bg-[#f7f7f7] transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white text-slate-300 light:text-[#121212] text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
            <span>ENTERPRISE ARCHITECTURE</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white light:text-[#121212] tracking-tight leading-tight">
            Comprehensive Infrastructure for{" "}
            <span className="text-[#38b6ff] light:text-[#0284c7]">
              Autonomous Revenue
            </span>
          </h2>
          <p className="mt-4 text-slate-300 light:text-[#4a5053] text-base sm:text-lg">
            Engineered from first principles for high-growth SaaS and enterprise revenue operations that outgrow legacy CRM spreadsheets.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Omnichannel Signal Ingestion (Span 2) */}
          <div className="md:col-span-2 rounded-3xl border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white p-8 sm:p-10 relative overflow-hidden group hover:border-[#38b6ff]/40 light:hover:border-black/30 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-[#38b6ff] light:text-[#0284c7]">
                <Database className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#38b6ff] light:text-[#0284c7] bg-white/5 light:bg-[#f0f2f3] px-3 py-1 rounded-full border border-white/10 light:border-black/10">
                &lt; 50ms Stream Ingestion
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white light:text-[#121212]">First-Party Telemetry & Ingestion Engine</h3>
            <p className="mt-3 text-sm text-slate-400 light:text-[#4a5053] max-w-lg leading-relaxed">
              Capture digital intent across every buyer touchpoint: pricing loops, documentation reads, API sandbox spikes, and hiring announcements without third-party cookies.
            </p>

            {/* Visual Telemetry Stream Nodes */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[
                { name: "Pricing Webhooks", speed: "12ms", state: "Active" },
                { name: "Docs Telemetry", speed: "18ms", state: "Streaming" },
                { name: "Git Repo Stars", speed: "45ms", state: "Synced" },
                { name: "Executive Hires", speed: "92ms", state: "Ingested" },
              ].map((pipe, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/5 light:border-black/5 text-left relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                    <span className="text-[10px] font-mono text-slate-400 light:text-[#787e82]">{pipe.speed}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 light:text-[#121212] mt-2.5">{pipe.name}</div>
                  <div className="text-[10px] font-mono text-[#38b6ff] light:text-[#0284c7] mt-0.5">{pipe.state}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Self-Tuning Intent Radar */}
          <div className="rounded-3xl border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white p-8 sm:p-10 relative overflow-hidden group hover:border-[#38b6ff]/40 light:hover:border-black/30 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-[#f2be01]">
                  <Target className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#f2be01] bg-white/5 light:bg-[#f0f2f3] px-3 py-1 rounded-full border border-white/10 light:border-black/10">
                  Adaptive ICP
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white light:text-[#121212]">Self-Tuning Intent Radar</h3>
              <p className="mt-3 text-sm text-slate-400 light:text-[#4a5053] leading-relaxed">
                Autonomous radar that continuously correlates buyer telemetry to alert reps the moment target accounts enter their decision window.
              </p>
            </div>

            {/* Radar graphic animation */}
            <div className="mt-8 flex items-center justify-center p-4">
              <div className="relative h-28 w-28 rounded-full border border-white/15 light:border-black/15 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-[#38b6ff]/30 animate-spin" style={{ animationDuration: "16s" }} />
                <div className="h-16 w-16 rounded-full border border-[#38b6ff]/40 flex items-center justify-center">
                  <span className="h-3 w-3 rounded-full bg-[#38b6ff] animate-ping" />
                </div>
                <span className="absolute top-3 right-5 h-2 w-2 rounded-full bg-[#f2be01]" />
                <span className="absolute bottom-4 left-6 h-1.5 w-1.5 rounded-full bg-[#10b981]" />
              </div>
            </div>
          </div>

          {/* Card 3: Deterministic Explainable AI Scoring */}
          <div className="rounded-3xl border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white p-8 sm:p-10 relative overflow-hidden group hover:border-[#38b6ff]/40 light:hover:border-black/30 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-[#38b6ff] light:text-[#0284c7]">
                <Activity className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#10b981] bg-white/5 light:bg-[#f0f2f3] px-3 py-1 rounded-full border border-white/10 light:border-black/10">
                Deterministic
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white light:text-[#121212]">Explainable Scoring Logs</h3>
            <p className="mt-3 text-sm text-slate-400 light:text-[#4a5053] leading-relaxed">
              Every score (0–100) displays exact mathematical factors so sales reps understand precisely why an account is prioritized.
            </p>

            <div className="mt-6 space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/5 light:border-black/5 flex justify-between">
                <span className="text-slate-300 light:text-[#121212]">C-Level Decision Maker</span>
                <span className="text-[#10b981] font-bold">+25 pts</span>
              </div>
              <div className="p-3 rounded-xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/5 light:border-black/5 flex justify-between">
                <span className="text-slate-300 light:text-[#121212]">Enterprise Pricing 3x</span>
                <span className="text-[#10b981] font-bold">+18 pts</span>
              </div>
              <div className="p-3 rounded-xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/5 light:border-black/5 flex justify-between">
                <span className="text-slate-300 light:text-[#121212]">Recency Decay (14d)</span>
                <span className="text-rose-400 font-bold">-8 pts</span>
              </div>
            </div>
          </div>

          {/* Card 4: Autonomous Drip Cadences with Auto-Stop */}
          <div className="rounded-3xl border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white p-8 sm:p-10 relative overflow-hidden group hover:border-[#38b6ff]/40 light:hover:border-black/30 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-[#f2be01]">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#f2be01] bg-white/5 light:bg-[#f0f2f3] px-3 py-1 rounded-full border border-white/10 light:border-black/10">
                Auto-Stop Active
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white light:text-[#121212]">Protected Autonomous Cadences</h3>
            <p className="mt-3 text-sm text-slate-400 light:text-[#4a5053] leading-relaxed">
              Multi-touch outreach cadences that instantly halt across all reps the millisecond a prospect replies or books a meeting.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/5 light:border-black/5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#10b981] font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Reply Detected from Prospect
              </div>
              <div className="text-[11px] text-slate-400 light:text-[#787e82] font-mono">
                Status: Cadence #104 halted for 3 reps
              </div>
            </div>
          </div>

          {/* Card 5: Enterprise Sovereign Security */}
          <div className="rounded-3xl border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white p-8 sm:p-10 relative overflow-hidden group hover:border-[#38b6ff]/40 light:hover:border-black/30 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-[#10b981]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#10b981] bg-white/5 light:bg-[#f0f2f3] px-3 py-1 rounded-full border border-white/10 light:border-black/10">
                SOC2 Type II
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white light:text-[#121212]">Sovereign Data Security</h3>
            <p className="mt-3 text-sm text-slate-400 light:text-[#4a5053] leading-relaxed">
              Multi-tenant customer isolation, SAML 2.0 / Okta SSO, audit logs, and zero data retention agreements for AI operations.
            </p>

            <div className="mt-6 space-y-2.5 text-xs text-slate-300 light:text-[#121212] font-mono">
              <div className="flex items-center gap-2.5">
                <Lock className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" /> AES-256 at Rest & TLS 1.3 in Flight
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" /> EU & US Sovereign Data Residency
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
