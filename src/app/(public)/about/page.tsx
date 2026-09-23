import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Activity, Users, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-medium text-cyan-400">
          <Sparkles className="h-3 w-3" /> Our Mission
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          We believe sales teams should prioritize buyers, not chase ghosts.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Founded in 2026, SignalFlow was engineered to solve the most painful paradox in B2B:
          companies generate hundreds of digital signals every day, yet sales reps waste 60% of
          their time on prospects with zero intention to buy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <Activity className="h-6 w-6 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Explainability First</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We reject black-box AI. Every recommendation and score adjustment is supported by
            verifiable behavioral evidence that builds rep trust.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <Users className="h-6 w-6 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Human-in-the-Loop</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI should eliminate administrative friction and highlight the optimal angle—empowering
            sales professionals to conduct high-value human conversations.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <Shield className="h-6 w-6 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Enterprise Integrity</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            From deterministic multi-tenancy to verifiable audit trails, we engineer for startups
            that eventually scale into global enterprises.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Join the SignalFlow Journey</h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Start identifying buying signals in your pipeline today. Set up in under 5 minutes.
        </p>
        <Link href="/signup">
          <Button variant="gradient" size="md">
            Start Free Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
