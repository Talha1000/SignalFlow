"use client";

import React from "react";
import { ShieldCheck, Zap, Lock, Cpu, CheckCircle2, TrendingUp } from "lucide-react";

export function SocialProofSection() {
  const capabilities = [
    {
      title: "Explainable Mathematical Scoring",
      description:
        "Every score change is mathematically attributed to verifiable behavioral events—pricing visits, docs exploration, or form submissions—backed by decay rates and recorded ScoreEvents.",
      metric: "100% Explainable",
      subMetric: "Transparent factor attribution",
      icon: Cpu,
      tag: "CORE ENGINE",
    },
    {
      title: "Transactional Cadence Safety",
      description:
        "Automated sequence enrollment with strict auto-stop controls. Prospect replies and inbound meetings instantly halt outbound drips across all reps, preventing embarrassing email collisions.",
      metric: "Zero Collisions",
      subMetric: "Real-time auto-stop protection",
      icon: Zap,
      tag: "WORKFLOW INTEGRITY",
    },
    {
      title: "Hardened Multi-Tenant Isolation",
      description:
        "Every tenant database record is strictly bound to its workspace. Secured with row-level serialization, HMAC SHA-256 webhook signatures, and fail-closed SSRF egress protection.",
      metric: "Multi-Tenant",
      subMetric: "Cryptographic HMAC & SSRF Defense",
      icon: Lock,
      tag: "ENTERPRISE SECURITY",
    },
  ];

  return (
    <section className="py-28 relative overflow-hidden bg-[#121212] light:bg-[#f7f7f7] transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white text-slate-300 light:text-[#121212] text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
            <span>PLATFORM ARCHITECTURAL TENETS</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white light:text-[#121212] tracking-tight leading-tight">
            Engineered for High-Velocity{" "}
            <span className="text-[#38b6ff] light:text-[#0284c7]">
              Revenue Teams
            </span>
          </h2>
          <p className="mt-4 text-slate-300 light:text-[#4a5053] text-base sm:text-lg">
            Built on verifiable telemetry, strict tenant isolation, and explainable AI—eliminating blind guesswork from outbound sales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {capabilities.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white p-8 sm:p-10 flex flex-col justify-between hover:border-[#38b6ff]/40 light:hover:border-black/30 transition-all shadow-sm"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-[#38b6ff]/10 text-[#38b6ff] light:text-[#0284c7] border border-[#38b6ff]/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-mono text-[#38b6ff] light:text-[#0284c7] bg-[#38b6ff]/10 px-2.5 py-0.5 rounded-full border border-[#38b6ff]/20 font-bold">
                      {c.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white light:text-[#121212] mb-2">{c.title}</h3>
                    <p className="text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 light:border-black/10">
                  <div className="text-xl font-black font-mono text-white light:text-[#121212]">
                    {c.metric}
                  </div>
                  <div className="text-[11px] text-slate-400 light:text-[#787e82] mt-0.5">
                    {c.subMetric}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
