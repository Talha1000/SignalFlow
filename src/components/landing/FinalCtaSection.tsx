"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCtaSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950">
      {/* Background portal glows */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[450px] w-[650px] rounded-full bg-gradient-to-r from-cyan-500/25 via-indigo-600/20 to-cyan-500/25 blur-[120px] animate-pulse-glow" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-8 sm:p-14 backdrop-blur-2xl shadow-[0_0_80px_rgba(6,182,212,0.15)] relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-6">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>ACCELERATE YOUR PIPELINE TODAY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Stop Chasing Cold Leads.{" "}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Start Closing Inbound Signals.
            </span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of forward-thinking revenue leaders who trust SignalFlow's autonomous intelligence engine to pinpoint and close enterprise opportunities.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/app/dashboard">
              <Button
                variant="gradient"
                size="lg"
                className="h-13 px-8 text-base font-bold shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] gap-2 group"
              >
                Launch Live App Sandbox <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/signup">
              <Button
                variant="secondary"
                size="lg"
                className="h-13 px-7 text-base bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-200"
              >
                Create Free Account
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> 14-day unrestricted trial
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Enterprise SOC2 Type II Certified
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
