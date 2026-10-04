"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  BarChart3,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LiveSignalSimulator } from "@/components/landing/LiveSignalSimulator";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
      {/* Refined ambient corporate aura */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
        <div className="h-[520px] w-[800px] rounded-full bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-transparent blur-[140px]" />
        <div className="absolute top-1/4 -right-20 h-[380px] w-[380px] rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute bottom-10 -left-20 h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      {/* Structural subtle grid backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] light:bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Executive Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 light:border-blue-200 light:bg-blue-50 light:text-blue-700 backdrop-blur-md text-xs font-medium mb-8 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-semibold tracking-wide">ENTERPRISE REVENUE INFRASTRUCTURE</span>
          <span className="text-slate-500 light:text-slate-300">•</span>
          <span className="text-slate-300 light:text-slate-600">SOC2 Type II Certified</span>
        </motion.div>

        {/* World-Class Executive Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white light:text-slate-900 max-w-5xl mx-auto leading-[1.12]"
        >
          Turn Silent Buyer Signals Into{" "}
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 light:from-blue-600 light:via-indigo-600 light:to-blue-800 bg-clip-text text-transparent">
            Predictable Enterprise Pipeline
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-300 light:text-slate-600 max-w-3xl mx-auto leading-relaxed"
        >
          SignalFlow captures dark funnel intent—pricing loops, API documentation reads, and expansion surges—synthesizing them into explainable AI lead scores and autonomous sales plays before your competition detects interest.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/app/dashboard">
            <Button
              variant="primary"
              size="lg"
              className="h-12 px-8 text-base shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all font-semibold gap-2 group"
            >
              Launch Live Platform Demo
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <a href="#simulator">
            <Button
              variant="secondary"
              size="lg"
              className="h-12 px-7 text-base bg-slate-900/90 light:bg-white border border-slate-700/80 light:border-slate-300 hover:border-blue-500/50 light:hover:border-blue-500 text-slate-200 light:text-slate-800 transition-all gap-2"
            >
              <Activity className="h-4 w-4 text-blue-400 light:text-blue-600" />
              Test Signal Radar
            </Button>
          </a>
        </motion.div>

        {/* Executive Key Metrics Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80 light:border-slate-200"
        >
          <div className="p-4 text-left border-l-2 border-blue-500 bg-slate-900/40 light:bg-white light:border-blue-500 light:shadow-sm rounded-r-lg">
            <div className="text-2xl font-bold font-mono text-white light:text-slate-900">$480M+</div>
            <div className="text-xs text-slate-400 light:text-slate-500 mt-0.5">Pipeline Influenced</div>
          </div>
          <div className="p-4 text-left border-l-2 border-indigo-500 bg-slate-900/40 light:bg-white light:border-indigo-500 light:shadow-sm rounded-r-lg">
            <div className="text-2xl font-bold font-mono text-white light:text-slate-900">&lt; 90s</div>
            <div className="text-xs text-slate-400 light:text-slate-500 mt-0.5">Signal-to-Action Latency</div>
          </div>
          <div className="p-4 text-left border-l-2 border-emerald-500 bg-slate-900/40 light:bg-white light:border-emerald-500 light:shadow-sm rounded-r-lg">
            <div className="text-2xl font-bold font-mono text-white light:text-slate-900">3.8x</div>
            <div className="text-xs text-slate-400 light:text-slate-500 mt-0.5">Qualified Meeting Lift</div>
          </div>
          <div className="p-4 text-left border-l-2 border-amber-500 bg-slate-900/40 light:bg-white light:border-amber-500 light:shadow-sm rounded-r-lg">
            <div className="text-2xl font-bold font-mono text-white light:text-slate-900">99.99%</div>
            <div className="text-xs text-slate-400 light:text-slate-500 mt-0.5">Enterprise Uptime SLA</div>
          </div>
        </motion.div>

        {/* Live Signal Telemetry Center */}
        <motion.div
          id="simulator"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 relative"
        >
          {/* Subtle perimeter border sheen */}
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-blue-600/30 blur-sm opacity-60" />
          <div className="relative">
            <LiveSignalSimulator />
          </div>
        </motion.div>

        {/* Enterprise Logos Bar */}
        <div className="mt-20 pt-10 border-t border-slate-800/60 light:border-slate-200">
          <p className="text-xs uppercase tracking-wider text-slate-400 light:text-slate-500 font-semibold mb-6">
            Trusted by revenue teams scaling high-velocity enterprise pipeline
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75 hover:opacity-100 transition-opacity text-slate-400 light:text-slate-600 font-semibold tracking-wider text-sm">
            <span className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> STRIPE
            </span>
            <span className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <span className="h-2 w-2 rounded-full bg-indigo-500" /> DATADOG
            </span>
            <span className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <span className="h-2 w-2 rounded-full bg-sky-500" /> SNOWFLAKE
            </span>
            <span className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> SUPABASE
            </span>
            <span className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <span className="h-2 w-2 rounded-full bg-violet-500" /> LINEAR
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
