"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, Clock, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function InteractiveRoiCalculator() {
  const [reps, setReps] = useState(12);
  const [avgDeal, setAvgDeal] = useState(45000);
  const [monthlyLeads, setMonthlyLeads] = useState(250);

  // Revenue Lift model calculations
  const estimatedAnnualLift = Math.round(reps * avgDeal * 0.28 * 12 * 0.35);
  const hoursSavedPerYear = Math.round(reps * 8.5 * 48);
  const cycleDaysSaved = Math.min(28, Math.round(14 + (avgDeal / 10000) * 1.5));
  const winRateIncrease = "+34.8%";

  return (
    <section className="py-24 relative overflow-hidden bg-[#121212] light:bg-[#f7f7f7] border-y border-white/10 light:border-black/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white text-slate-300 light:text-[#121212] text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <Calculator className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
            <span>EXECUTIVE ROI MODEL</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white light:text-[#121212] tracking-tight leading-tight">
            Quantify Your Team's{" "}
            <span className="text-[#38b6ff] light:text-[#0284c7]">
              Revenue Expansion
            </span>
          </h2>
          <p className="mt-4 text-slate-300 light:text-[#4a5053] text-base sm:text-lg">
            Model the exact pipeline return when your reps stop chasing cold prospects and prioritize enterprise accounts exhibiting active intent signals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Controls Column */}
          <div className="lg:col-span-6 rounded-3xl border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white p-8 space-y-7 shadow-xl transition-colors">
            <h3 className="text-lg font-bold text-white light:text-[#121212] flex items-center gap-2 pb-3 border-b border-white/10 light:border-black/10">
              <Zap className="h-5 w-5 text-[#38b6ff] light:text-[#0284c7]" /> Configure Sales Organization
            </h3>

            {/* Slider 1: Reps */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 light:text-[#4a5053] font-medium">Account Executives (AEs)</span>
                <span className="font-mono font-bold text-[#38b6ff] light:text-[#0284c7] text-base">{reps} Reps</span>
              </div>
              <input
                type="range"
                min="2"
                max="80"
                step="1"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-full h-2 bg-[#252a2b] light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#38b6ff]"
              />
              <div className="flex justify-between text-[11px] text-slate-500 light:text-[#787e82] font-mono">
                <span>2 Reps</span>
                <span>40 Reps</span>
                <span>80 Reps</span>
              </div>
            </div>

            {/* Slider 2: Average Deal Value */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 light:text-[#4a5053] font-medium">Average Contract Value (ACV)</span>
                <span className="font-mono font-bold text-[#f2be01] text-base">
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
                className="w-full h-2 bg-[#252a2b] light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#f2be01]"
              />
              <div className="flex justify-between text-[11px] text-slate-500 light:text-[#787e82] font-mono">
                <span>$10,000</span>
                <span>$75,000</span>
                <span>$150,000</span>
              </div>
            </div>

            {/* Slider 3: Monthly Inbound Volume */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 light:text-[#4a5053] font-medium">Monthly Inbound Lead Volume</span>
                <span className="font-mono font-bold text-[#10b981] text-base">
                  {monthlyLeads.toLocaleString()} Accounts
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="50"
                value={monthlyLeads}
                onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                className="w-full h-2 bg-[#252a2b] light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
              />
              <div className="flex justify-between text-[11px] text-slate-500 light:text-[#787e82] font-mono">
                <span>50</span>
                <span>750</span>
                <span>1,500</span>
              </div>
            </div>
          </div>

          {/* Results Display Column */}
          <div className="lg:col-span-6 rounded-3xl border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white p-8 relative overflow-hidden shadow-xl transition-colors">
            <div className="space-y-7 relative">
              <span className="text-xs font-mono uppercase tracking-widest text-[#38b6ff] light:text-[#0284c7] font-semibold">
                Projected Annual Impact
              </span>

              {/* Big Pipeline Lift */}
              <div>
                <div className="text-slate-400 light:text-[#787e82] text-xs uppercase font-mono">
                  Estimated Net-New Pipeline Lift
                </div>
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white light:text-[#121212] mt-2">
                  +${estimatedAnnualLift.toLocaleString()}
                </div>
                <p className="text-xs text-[#10b981] mt-2 flex items-center gap-1 font-medium font-mono">
                  <TrendingUp className="h-3.5 w-3.5" /> Driven by {winRateIncrease} win-rate lift on prioritized intent signals
                </p>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 light:border-black/10">
                <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/5 light:border-black/5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 light:text-[#787e82] font-mono uppercase">
                    <Clock className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" /> Capacity Saved
                  </div>
                  <div className="text-2xl font-black font-mono text-white light:text-[#121212] mt-1.5">
                    {hoursSavedPerYear.toLocaleString()} hrs
                  </div>
                  <div className="text-[11px] text-slate-500 light:text-[#787e82] mt-0.5">8.5 hrs / rep / week</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/5 light:border-black/5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-700 font-mono uppercase">
                    <Zap className="h-3.5 w-3.5 text-[#f2be01]" /> Sales Cycle Drop
                  </div>
                  <div className="text-2xl font-black font-mono text-white light:text-[#121212] mt-1.5">
                    -{cycleDaysSaved} Days
                  </div>
                  <div className="text-[11px] text-slate-500 light:text-[#787e82] mt-0.5">Accelerated time to close</div>
                </div>
              </div>

              {/* CTA button */}
              <div className="pt-2">
                <Link href="/app/dashboard" className="block w-full">
                  <Button
                    variant="pill"
                    size="lg"
                    className="w-full justify-center gap-2 font-bold shadow-md shadow-[#38b6ff]/20"
                  >
                    Deploy Revenue Platform <ArrowRight className="h-4 w-4" />
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
