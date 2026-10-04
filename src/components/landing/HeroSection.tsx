"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, TrendingUp, Sparkles, Zap, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LiveSignalSimulator } from "@/components/landing/LiveSignalSimulator";

const ROTATING_SECTORS = [
  "Predictable Pipeline",
  "Enterprise Revenue",
  "High-Value Conversions",
  "Autonomous Execution",
];

const SECTOR_PILLS = [
  { name: "Intent Telemetry", color: "#34FEFF", desc: "1st-Party De-Anonymization" },
  { name: "Behavioral AI", color: "#38B6FF", desc: "Predictive Lead Scoring" },
  { name: "Autonomous Outbound", color: "#FF914D", desc: "Instant AI Cadences" },
  { name: "CRM Sync Engine", color: "#F2BE01", desc: "Sub-90s Pipeline Routing" },
  { name: "Enterprise SLA", color: "#007B7C", desc: "SOC-2 Type II Verified" },
];

export function HeroSection() {
  const [sectorIndex, setSectorIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSectorIndex((prev) => (prev + 1) % ROTATING_SECTORS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-14 pb-20 md:pt-24 md:pb-32 bg-[#121212] light:bg-[#f7f7f7] transition-colors">
      {/* Dynamic Ambient Sector Gradient Mesh */}
      <div className="hero-ambient-mesh" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 text-center z-10">
        {/* Eyebrow Subhead Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white text-slate-300 light:text-[#121212] text-xs font-mono uppercase tracking-widest mb-8 shadow-xs"
        >
          <span className="h-2 w-2 rounded-full bg-[#34feff] light:bg-[#007b7c] animate-ping" />
          <span>AUTONOMOUS REVENUE ENGINE</span>
          <span className="text-white/30 light:text-black/30">•</span>
          <span className="text-[#38b6ff] light:text-[#0284c7] font-semibold">2027 ENTERPRISE STANDARD</span>
        </motion.div>

        {/* Display Headline with Animated Rotating Sector Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white light:text-[#121212] max-w-5xl mx-auto leading-[1.06]"
        >
          Turn Buyer Signals Into{" "}
          <span className="block mt-1 sm:mt-2 min-h-[1.2em]">
            <AnimatePresence mode="wait">
              <motion.em
                key={sectorIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="sector-animating-text not-italic font-black inline-block"
              >
                {ROTATING_SECTORS[sectorIndex]}
              </motion.em>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-lg sm:text-2xl text-slate-300 light:text-[#4a5053] max-w-3xl mx-auto leading-relaxed font-normal"
        >
          SignalFlow captures dark funnel intent across documentation, pricing toggles, and developer activity—synthesizing raw telemetry into explainable AI lead scores before competitors detect interest.
        </motion.p>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/app/dashboard">
            <Button
              variant="pill"
              size="lg"
              className="h-14 px-8 text-base luminous-button font-bold gap-2 bg-[#262626] hover:bg-black text-white light:bg-[#121212] light:text-white border border-white/20 light:border-black/20 group"
            >
              Start Your Journey
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <a href="#sectors">
            <Button
              variant="secondary"
              size="lg"
              className="h-14 px-8 text-base font-semibold gap-2 border border-white/10 light:border-black/10"
            >
              <Activity className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" />
              Explore Platform Capabilities
            </Button>
          </a>
        </motion.div>

        {/* Hero Sector Quick Selector Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto"
        >
          {SECTOR_PILLS.map((pill) => (
            <div
              key={pill.name}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e2224]/80 light:bg-white/80 border border-white/10 light:border-black/10 hover:border-white/30 light:hover:border-black/30 transition-all text-xs font-mono font-medium text-slate-300 light:text-[#2d3133] shadow-xs cursor-default"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pill.color }} />
              <span>{pill.name}</span>
            </div>
          ))}
        </motion.div>

        {/* Architectural Milestone Metric Blocks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto text-left"
        >
          <div className="p-6 rounded-[20px] bg-[#1e2224] light:bg-white border border-white/10 light:border-black/10 shadow-xs relative overflow-hidden group hover:border-[#34feff]/40 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#34feff]/5 rounded-bl-full pointer-events-none" />
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#34feff] light:text-[#007b7c]">
              $480M+
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 light:text-[#6c7377] mt-1.5 font-mono font-semibold">
              Pipeline Influenced
            </div>
            <p className="text-xs text-slate-400 light:text-[#787e82] mt-2 font-normal leading-relaxed">
              Verified enterprise revenue accelerated through first-party intent.
            </p>
          </div>

          <div className="p-6 rounded-[20px] bg-[#1e2224] light:bg-white border border-white/10 light:border-black/10 shadow-xs relative overflow-hidden group hover:border-[#38b6ff]/40 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#38b6ff]/5 rounded-bl-full pointer-events-none" />
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#38b6ff] light:text-[#0284c7]">
              &lt; 90s
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 light:text-[#6c7377] mt-1.5 font-mono font-semibold">
              Signal-to-Cadence
            </div>
            <p className="text-xs text-slate-400 light:text-[#787e82] mt-2 font-normal leading-relaxed">
              Autonomous outbound sequences triggered the instant intent spikes.
            </p>
          </div>

          <div className="p-6 rounded-[20px] bg-[#1e2224] light:bg-white border border-white/10 light:border-black/10 shadow-xs relative overflow-hidden group hover:border-[#ff914d]/40 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff914d]/5 rounded-bl-full pointer-events-none" />
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#ff914d] light:text-[#e06c27]">
              3.8x
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 light:text-[#6c7377] mt-1.5 font-mono font-semibold">
              Conversion Lift
            </div>
            <p className="text-xs text-slate-400 light:text-[#787e82] mt-2 font-normal leading-relaxed">
              Higher reply & demo booking rates vs traditional cold prospecting.
            </p>
          </div>

          <div className="p-6 rounded-[20px] bg-[#1e2224] light:bg-white border border-white/10 light:border-black/10 shadow-xs relative overflow-hidden group hover:border-[#f2be01]/40 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#f2be01]/5 rounded-bl-full pointer-events-none" />
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#f2be01] light:text-[#b88600]">
              99.99%
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 light:text-[#6c7377] mt-1.5 font-mono font-semibold">
              Telemetry SLA
            </div>
            <p className="text-xs text-slate-400 light:text-[#787e82] mt-2 font-normal leading-relaxed">
              Sub-50ms global streaming ingestion without 3rd-party cookie dependency.
            </p>
          </div>
        </motion.div>

        {/* Live Signal Simulator Console */}
        <div id="simulator" className="mt-20 text-left">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#38b6ff] light:text-[#0284c7] uppercase tracking-widest font-semibold mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#38b6ff] light:bg-[#0284c7] animate-pulse" />
                Live Mission Control
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white light:text-[#121212]">
                Interactive Signal Radar & Decisioning Console
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 light:text-[#787e82] font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-Time Feed Connected
            </div>
          </div>
          <LiveSignalSimulator />
        </div>
      </div>
    </section>
  );
}
