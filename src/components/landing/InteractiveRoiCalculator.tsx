"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, DollarSign, Clock, TrendingUp, Zap, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function InteractiveRoiCalculator() {
  const [reps, setReps] = useState(12);
  const [avgDeal, setAvgDeal] = useState(45000);
  const [monthlyLeads, setMonthlyLeads] = useState(250);

  // Revenue Lift model calculations
  // With SignalFlow: +24% conversion on hot leads, 8.5 hours saved per rep/week
  const estimatedAnnualLift = Math.round(reps * avgDeal * 0.28 * 12 * 0.35);
  const hoursSavedPerYear = Math.round(reps * 8.5 * 48);
  const cycleDaysSaved = Math.min(28, Math.round(14 + (avgDeal / 10000) * 1.5));
  const winRateIncrease = "+34.8%";

  return (
    <section className="py-20 relative overflow-hidden bg-slate-950/60 border-y border-slate-800/80">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 via-transparent to-indigo-950/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-4">
            <Calculator className="h-3.5 w-3.5 text-cyan-400" />
            <span>INTERACTIVE ROI MODELER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Quantify Your Team's{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Revenue Expansion
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            See the exact pipeline impact when your reps stop chasing cold prospects and prioritize buyers with surging intent signals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Controls Column */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Zap className="h-5 w-5 text-cyan-400" /> Configure Your Sales Org
            </h3>

            {/* Slider 1: Reps */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-medium">Sales Representatives / AEs</span>
                <span className="font-mono font-bold text-cyan-400 text-base">{reps} Reps</span>
              </div>
              <input
                type="range"
                min="2"
                max="80"
                step="1"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>2 Reps</span>
                <span>40 Reps</span>
                <span>80 Reps</span>
              </div>
            </div>

            {/* Slider 2: Average Deal Value */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-medium">Average Deal Size (ACV)</span>
                <span className="font-mono font-bold text-indigo-400 text-base">
                  ${avgDeal.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="150000"
                step="5000"
                value={avgDeal}
                onChange={(e) => setAvgDeal(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>$10,000</span>
                <span>$75,000</span>
                <span>$150,000</span>
              </div>
            </div>

            {/* Slider 3: Monthly Inbound Volume */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-medium">Monthly Inbound / Lead Volume</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  {monthlyLeads.toLocaleString()} Leads
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="50"
                value={monthlyLeads}
                onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>50</span>
                <span>750</span>
                <span>1,500</span>
              </div>
            </div>
          </div>

          {/* Results Display Column */}
          <div className="lg:col-span-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/95 via-cyan-950/20 to-slate-950 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            {/* Ambient accent glow */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative">
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
                Projected Annual Impact
              </span>

              {/* Big ARR Lift */}
              <div>
                <div className="text-slate-400 text-xs uppercase font-mono">Projected Annual Pipeline Lift</div>
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white mt-1">
                  +${estimatedAnnualLift.toLocaleString()}
                </div>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3.5 w-3.5" /> Derived from {winRateIncrease} win-rate lift on prioritized hot leads
                </p>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" /> Rep Time Saved
                  </div>
                  <div className="text-xl font-bold font-mono text-white mt-1">
                    {hoursSavedPerYear.toLocaleString()} hrs
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">8.5 hrs / rep / week</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Zap className="h-3.5 w-3.5 text-indigo-400" /> Sales Cycle Drop
                  </div>
                  <div className="text-xl font-bold font-mono text-white mt-1">
                    -{cycleDaysSaved} Days
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Faster time to close</div>
                </div>
              </div>

              {/* CTA button */}
              <div className="pt-2">
                <Link href="/app/dashboard" className="block w-full">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full justify-center gap-2 font-bold shadow-lg shadow-cyan-500/20"
                  >
                    Deploy Signal Engine Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
