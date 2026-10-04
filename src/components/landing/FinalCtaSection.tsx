"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCtaSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950 light:bg-slate-50 transition-colors">
      {/* Background ambient corporate aura */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[450px] w-[650px] rounded-full bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-blue-600/20 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="rounded-3xl border border-blue-500/30 light:border-blue-200 bg-gradient-to-b from-slate-900/95 via-slate-900/70 to-slate-950 light:from-white light:via-blue-50/20 light:to-slate-50 p-8 sm:p-14 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-colors">
          {/* Top highlight hairline */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 light:border-blue-200 light:bg-blue-50 light:text-blue-700 text-xs font-semibold tracking-wide mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" />
            <span>ACCELERATE YOUR PIPELINE TODAY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white light:text-slate-900 tracking-tight leading-tight">
            Stop Chasing Cold Leads.{" "}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 light:from-blue-600 light:via-indigo-600 light:to-blue-800 bg-clip-text text-transparent">
              Start Closing Inbound Signals.
            </span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-slate-300 light:text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Join thousands of forward-thinking revenue leaders who trust SignalFlow's autonomous intelligence engine to pinpoint and close enterprise opportunities.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/app/dashboard">
              <Button
                variant="primary"
                size="lg"
                className="h-13 px-8 text-base font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 gap-2 group"
              >
                Launch Live App Sandbox <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/signup">
              <Button
                variant="secondary"
                size="lg"
                className="h-13 px-7 text-base bg-slate-900/90 light:bg-white border border-slate-700/80 light:border-slate-300 hover:bg-slate-800 light:hover:bg-slate-100 text-slate-200 light:text-slate-800"
              >
                Create Free Account
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 light:border-slate-200 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 light:text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 light:text-indigo-600" /> 14-day unrestricted trial
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 light:text-emerald-600" /> Enterprise SOC2 Type II Certified
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
