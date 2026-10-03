"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Terminal,
  ChevronRight,
  Play,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LiveSignalSimulator } from "@/components/landing/LiveSignalSimulator";

export function HeroSection() {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
        <div className="h-[480px] w-[750px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-600/15 to-transparent blur-[130px] animate-pulse-glow" />
        <div className="absolute top-1/4 -right-24 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute bottom-10 -left-24 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[90px]" />
      </div>

      {/* Futuristic cyber-grid backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 backdrop-blur-md text-xs font-mono mb-8 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
        >
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold tracking-wide">SIGNAL ENGINE V3.4 LIVE</span>
          <span className="text-cyan-600">|</span>
          <span className="text-slate-300">Autonomous Revenue Intelligence</span>
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
        </motion.div>

        {/* Main 2027 Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]"
        >
          Turn Silent Intent Signals Into{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.3)]">
            Closed Enterprise Pipeline
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          SignalFlow captures dark buyer telemetry—pricing loops, API docs explorations, and hiring surges—synthesizing them into explainable AI lead scores and autonomous sales plays before your competition even knows they're shopping.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/app/dashboard">
            <Button
              variant="gradient"
              size="lg"
              className="h-12 px-8 text-base shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:shadow-[0_0_45px_rgba(6,182,212,0.55)] transition-all font-bold gap-2 group"
            >
              Launch Live App Demo
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <a href="#simulator">
            <Button
              variant="secondary"
              size="lg"
              className="h-12 px-7 text-base bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-200 transition-all gap-2"
            >
              <Cpu className="h-4 w-4 text-cyan-400" />
              Test Signal Radar
            </Button>
          </a>
        </motion.div>

        {/* Live Key Metrics Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80"
        >
          <div className="p-3 text-left border-l-2 border-cyan-500/60 bg-slate-900/30 rounded-r-lg">
            <div className="text-2xl font-bold font-mono text-white">$480M+</div>
            <div className="text-xs text-slate-400 mt-0.5">Pipeline Influenced</div>
          </div>
          <div className="p-3 text-left border-l-2 border-indigo-500/60 bg-slate-900/30 rounded-r-lg">
            <div className="text-2xl font-bold font-mono text-white">&lt; 90s</div>
            <div className="text-xs text-slate-400 mt-0.5">Signal-to-Outreach</div>
          </div>
          <div className="p-3 text-left border-l-2 border-emerald-500/60 bg-slate-900/30 rounded-r-lg">
            <div className="text-2xl font-bold font-mono text-white">3.8x</div>
            <div className="text-xs text-slate-400 mt-0.5">Meeting Booked Lift</div>
          </div>
          <div className="p-3 text-left border-l-2 border-amber-500/60 bg-slate-900/30 rounded-r-lg">
            <div className="text-2xl font-bold font-mono text-white">0%</div>
            <div className="text-xs text-slate-400 mt-0.5">Spam & Blacklist Risk</div>
          </div>
        </motion.div>

        {/* Interactive Holographic Signal Center */}
        <motion.div
          id="simulator"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 relative"
        >
          {/* Subtle perimeter border glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-indigo-500/20 to-cyan-500/30 blur-lg opacity-75" />
          <div className="relative">
            <LiveSignalSimulator />
          </div>
        </motion.div>

        {/* Enterprise Logos Proof Bar */}
        <div className="mt-20 pt-10 border-t border-slate-800/60">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-6">
            Trusted by revenue teams scaling high-velocity enterprise pipeline
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-60 hover:opacity-90 transition-opacity text-slate-400 font-semibold tracking-wider text-sm">
            <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
              <span className="h-2 w-2 rounded-full bg-cyan-400" /> STRIPE
            </span>
            <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
              <span className="h-2 w-2 rounded-full bg-indigo-400" /> DATADOG
            </span>
            <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
              <span className="h-2 w-2 rounded-full bg-sky-400" /> SNOWFLAKE
            </span>
            <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
              <span className="h-2 w-2 rounded-full bg-white" /> VERCEL
            </span>
            <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> SUPABASE
            </span>
            <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
              <span className="h-2 w-2 rounded-full bg-violet-400" /> LINEAR
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
