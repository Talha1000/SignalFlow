import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  BarChart3,
  Bot,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Cpu,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LiveSignalSimulator } from "@/components/landing/LiveSignalSimulator";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden pt-8 pb-20">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-cyan-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-96 left-1/4 h-[400px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />

      {/* Hero Section */}
      <motion.section
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-12 pb-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}>
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-medium text-cyan-400 mb-8 backdrop-blur-sm shadow-sm">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Next-Generation B2B Revenue Prioritization</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">2026 Release</span>
        </div>

        {/* Hero Headlines */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Stop chasing leads. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Start prioritizing buyers.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          SignalFlow turns scattered B2B signals into clear sales priorities—so your team knows
          who to contact, why now, and what to say.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup">
            <Button variant="gradient" size="lg" className="shadow-xl shadow-cyan-500/20 text-base px-6">
              Start Free Today <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
          <Link href="#simulator">
            <Button variant="outline" size="lg" className="text-base px-6">
              Explore Live Simulator
            </Button>
          </Link>
        </div>

        {/* Sub-hero trust metrics */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Zero Fake Probabilities
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-cyan-400" />
            Strict Tenant Isolation
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-400" />
            Sub-second Score Recalculation
          </span>
        </div>

        {/* Hero Interactive Simulator */}
        <div id="simulator" className="mt-14 scroll-mt-20">
          <LiveSignalSimulator />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            The Product Principle
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Your CRM tells you what happened. <br />
            <span className="text-slate-400">SignalFlow tells you what matters next.</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed pt-2">
            Most sales teams drown in low-value form fills while high-intent decision-makers explore
            pricing in silence. SignalFlow unites behavioral telemetry, company fit, and explainable
            AI to surface high-velocity opportunities before they go cold.
          </p>
        </div>

        {/* 3 Core Impact Metrics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-2">
            <div className="text-3xl font-mono font-extrabold text-cyan-400">3.4x</div>
            <h3 className="text-base font-semibold text-white">Faster Time-to-Contact</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-intent accounts are instantly escalated to the Priority Queue with ready-to-send
              contextual outreach.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-2">
            <div className="text-3xl font-mono font-extrabold text-emerald-400">100%</div>
            <h3 className="text-base font-semibold text-white">Explainable Scoring Factors</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every score displays the exact positive (+18) and negative (-4) drivers. No black-box
              hallucinations.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-2">
            <div className="text-3xl font-mono font-extrabold text-indigo-400">68%</div>
            <h3 className="text-base font-semibold text-white">Higher Meeting Rate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cadences triggered by real buyer actions achieve dramatically higher reply rates than
              blind cold outreach.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Core Architecture
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Built for Serious Commercial Teams
          </h2>
          <p className="text-xs text-slate-400">
            Designed as an enterprise-grade revenue engine with real deterministic foundations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
        className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-cyan-500/40 transition-colors"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Priority Sales Queue</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No more browsing endless spreadsheets. Your morning command center surfaces hot
              leads, surging accounts, due follow-ups, and leads going cold.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">AI That Explains Itself</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never fabricate purchase probabilities. If historical volume is low, scores are
              transparently marked as AI-assisted qualification metrics grounded in real evidence.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Cadences with Auto-Stop</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-step drip sequences that trigger on score thresholds. As soon as a prospect
              replies, future cadence emails are automatically paused.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Visual Workflow Builder</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Orchestrate complex routing rules with drag-and-connect nodes: Triggers, Conditions,
              Delays, AI Action rewrites, and Webhook dispatching.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Contextual Sales Copilot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask natural-language questions grounded strictly in your live workspace data: "Who
              should I contact today?", "Why did Acme Corp surge?", or "Draft an outreach email."
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Tenant RBAC & Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built on PostgreSQL with hard tenant isolation on every table. Role-based access
              controls (Owner, Admin, Manager, Rep, Viewer) enforced server-side.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Market Comparison
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Traditional CRM vs SignalFlow
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="grid grid-cols-3 p-4 bg-slate-800/60 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <div>Feature</div>
            <div className="text-slate-400">Traditional CRM</div>
            <div className="text-cyan-400">SignalFlow</div>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            <div className="grid grid-cols-3 p-4 items-center">
              <div className="font-medium text-slate-200">Lead Prioritization</div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-400" /> Chronological / Manual
              </div>
              <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" /> Real-time Intent Priority Queue
              </div>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <div className="font-medium text-slate-200">Scoring Engine</div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-400" /> Black-box or static rules
              </div>
              <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" /> Fully Explainable (+/- factors)
              </div>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <div className="font-medium text-slate-200">Next Action Guidance</div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-400" /> Rep guess-work
              </div>
              <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" /> AI-generated action & urgency
              </div>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <div className="font-medium text-slate-200">Multi-Touch Cadences</div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-400" /> Clunky 3rd-party add-ons
              </div>
              <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" /> Native sequences with auto-stop
              </div>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <div className="font-medium text-slate-200">Workspace Tenant Isolation</div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-400" /> Shared database pooling
              </div>
              <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" /> Strict row-level workspace_id
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950 p-10 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to know who wants to buy?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join hundreds of modern B2B revenue teams prioritizing high-intent accounts today.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button variant="gradient" size="lg" className="px-8 shadow-xl shadow-cyan-500/25">
                Get Started Free <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Sign In with Demo Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
