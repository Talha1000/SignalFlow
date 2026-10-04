import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Activity, Users, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#38b6ff] light:text-[#0284c7] shadow-xs">
          <Sparkles className="h-3.5 w-3.5" /> Our Mission
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white light:text-[#121212]">
          We believe sales teams should prioritize buyers, not chase ghosts.
        </h1>
        <p className="text-sm sm:text-base text-slate-300 light:text-[#4a5053] leading-relaxed">
          Founded in 2026, SignalFlow was engineered to solve the most painful paradox in B2B:
          companies generate hundreds of digital signals every day, yet sales reps waste 60% of
          their time on prospects with zero intention to buy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 space-y-3 shadow-sm hover:border-[#38b6ff]/30 light:hover:border-[#0284c7]/30 transition-all">
          <Activity className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
          <h3 className="text-base font-bold text-white light:text-[#121212]">Explainability First</h3>
          <p className="text-xs text-slate-400 light:text-[#787e82] leading-relaxed">
            We reject black-box AI. Every recommendation and score adjustment is supported by
            verifiable behavioral evidence that builds rep trust.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 space-y-3 shadow-sm hover:border-[#38b6ff]/30 light:hover:border-[#0284c7]/30 transition-all">
          <Users className="h-6 w-6 text-indigo-400 light:text-indigo-600" />
          <h3 className="text-base font-bold text-white light:text-[#121212]">Human-in-the-Loop</h3>
          <p className="text-xs text-slate-400 light:text-[#787e82] leading-relaxed">
            AI should eliminate administrative friction and highlight the optimal angle—empowering
            sales professionals to conduct high-value human conversations.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 space-y-3 shadow-sm hover:border-[#38b6ff]/30 light:hover:border-[#0284c7]/30 transition-all">
          <Shield className="h-6 w-6 text-emerald-400 light:text-emerald-600" />
          <h3 className="text-base font-bold text-white light:text-[#121212]">Enterprise Integrity</h3>
          <p className="text-xs text-slate-400 light:text-[#787e82] leading-relaxed">
            From deterministic multi-tenancy to verifiable audit trails, we engineer for startups
            that eventually scale into global enterprises.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-8 text-center space-y-4 shadow-sm">
        <h3 className="text-xl font-bold text-white light:text-[#121212]">Join the SignalFlow Journey</h3>
        <p className="text-xs text-slate-400 light:text-[#787e82] max-w-lg mx-auto">
          Start identifying buying signals in your pipeline today. Set up in under 5 minutes.
        </p>
        <Link href="/signup">
          <Button variant="pill" size="md" className="shadow-md">
            Start Free Now <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
