"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCtaSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-[#121212] light:bg-[#f7f7f7] border-t border-white/10 light:border-black/10 transition-colors">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative text-center">
        <div className="rounded-[28px] border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white p-10 sm:p-16 shadow-2xl relative overflow-hidden transition-colors">
          {/* Subtle Corner Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#38b6ff]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 light:bg-black/5 border border-white/10 light:border-black/10 text-slate-300 light:text-[#121212] text-xs font-mono uppercase tracking-widest mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
            <span>ACCELERATE YOUR REVENUE FUTURE</span>
          </div>

          <h2 className="text-4xl sm:text-7xl font-black text-white light:text-[#121212] tracking-tight leading-tight">
            Empower Revenue Velocity
          </h2>

          <p className="mt-6 text-base sm:text-xl text-slate-300 light:text-[#4a5053] max-w-2xl mx-auto leading-relaxed">
            Stop waiting for buyers to fill out contact forms. Connect your tech stack in 5 minutes and convert dark-funnel buying signals into closed-won ARR today.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link href="/app/dashboard">
              <Button
                variant="pill"
                size="lg"
                className="h-14 px-10 text-base font-bold luminous-button gap-2 bg-[#262626] hover:bg-black text-white light:bg-[#121212] light:text-white border border-white/20 light:border-black/20 group"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="secondary"
                size="lg"
                className="h-14 px-8 text-base font-semibold border border-white/10 light:border-black/10"
              >
                Book Architecture Review
              </Button>
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 light:border-black/10 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 light:text-[#787e82] font-mono">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" /> Zero credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#f2be01]" /> 14-day unrestricted pilot
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#10b981]" /> SOC2 Type II &amp; ISO 27001 Certified
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
