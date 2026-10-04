"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, DollarSign, Clock, TrendingUp, Zap, ArrowRight, ShieldCheck } from "lucide-react";
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
    <section className="py-20 relative overflow-hidden bg-slate-950/70 light:bg-slate-100/60 border-y border-slate-800/80 light:border-slate-200 transition-colors">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 via-transparent to-indigo-950/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 light:border-blue-200 light:bg-blue-50 light:text-blue-700 text-xs font-semibold tracking-wide mb-4">
            <Calculator className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" />
            <span>EXECUTIVE ROI MODEL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white light:text-slate-900 tracking-tight">
            Quantify Your Organization's{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 light:from-blue-600 light:via-indigo-600 light:to-blue-800 bg-clip-text text-transparent">
              Revenue Expansion
            </span>
          </h2>
          <p className="mt-4 text-slate-300 light:text-slate-600 text-base sm:text-lg">
            Model the exact pipeline return when your reps stop chasing cold prospects and prioritize enterprise accounts exhibiting active intent signals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Controls Column */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-800 light:border-slate-200 bg-slate-900/85 light:bg-white p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl transition-colors">
            <h3 className="text-lg font-bold text-white light:text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-800 light:border-slate-200">
              <Zap className="h-5 w-5 text-blue-400 light:text-blue-600" /> Configure Sales Organization
            </h3>

            {/* Slider 1: Reps */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 light:text-slate-700 font-medium">Account Executives (AEs)</span>
                <span className="font-mono font-bold text-blue-400 light:text-blue-600 text-base">{reps} Reps</span>
              </div>
              <input
                type="range"
                min="2"
                max="80"
                step="1"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 light:text-slate-400 font-mono">
                <span>2 Reps</span>
                <span>40 Reps</span>
                <span>80 Reps</span>
              </div>
            </div>

            {/* Slider 2: Average Deal Value */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 light:text-slate-700 font-medium">Average Contract Value (ACV)</span>
                <span className="font-mono font-bold text-indigo-400 light:text-indigo-600 text-base">
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
                className="w-full h-2 bg-slate-800 light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 light:text-slate-400 font-mono">
                <span>$10,000</span>
                <span>$75,000</span>
                <span>$150,000</span>
              </div>
            </div>

            {/* Slider 3: Monthly Inbound Volume */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 light:text-slate-700 font-medium">Monthly Inbound Lead Volume</span>
                <span className="font-mono font-bold text-emerald-400 light:text-emerald-600 text-base">
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
                className="w-full h-2 bg-slate-800 light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 light:text-slate-400 font-mono">
                <span>50</span>
                <span>750</span>
                <span>1,500</span>
              </div>
            </div>
          </div>

          {/* Results Display Column */}
          <div className="lg:col-span-6 rounded-2xl border border-blue-500/30 light:border-blue-300 bg-gradient-to-br from-slate-900/95 via-slate-900 to-slate-950 light:from-white light:via-blue-50/20 light:to-slate-50 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl transition-colors">
            {/* Subtle ambient corporate aura */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative">
              <span className="text-xs font-semibold text-blue-400 light:text-blue-700 uppercase tracking-wider">
                Projected Annual Impact
              </span>

              {/* Big Pipeline Lift */}
              <div>
                <div className="text-slate-400 light:text-slate-500 text-xs uppercase font-medium">Estimated Net-New Pipeline Lift</div>
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900 mt-1">
                  +${estimatedAnnualLift.toLocaleString()}
                </div>
                <p className="text-xs text-emerald-400 light:text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3.5 w-3.5" /> Driven by {winRateIncrease} win-rate lift on prioritized intent signals
                </p>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 light:border-slate-200">
                <div className="p-3.5 rounded-xl bg-slate-950/70 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-500 font-medium">
                    <Clock className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" /> Rep Capacity Saved
                  </div>
                  <div className="text-xl font-bold font-mono text-white light:text-slate-900 mt-1">
                    {hoursSavedPerYear.toLocaleString()} hrs
                  </div>
                  <div className="text-[11px] text-slate-500 light:text-slate-400 mt-0.5">8.5 hrs / rep / week</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-500 font-medium">
                    <Zap className="h-3.5 w-3.5 text-indigo-400 light:text-indigo-600" /> Sales Cycle Drop
                  </div>
                  <div className="text-xl font-bold font-mono text-white light:text-slate-900 mt-1">
                    -{cycleDaysSaved} Days
                  </div>
                  <div className="text-[11px] text-slate-500 light:text-slate-400 mt-0.5">Accelerated time to close</div>
                </div>
              </div>

              {/* CTA button */}
              <div className="pt-2">
                <Link href="/app/dashboard" className="block w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center gap-2 font-semibold shadow-lg shadow-blue-600/20"
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
