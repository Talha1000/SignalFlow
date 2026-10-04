'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Sparkles, TrendingUp, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export default function AIInsightsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
          AI Revenue Insights
        </h1>
        <p className="text-xs text-slate-300 light:text-[#4a5053] mt-0.5">
          AI-powered telemetry analysis, buying signals, and pipeline recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400 light:text-purple-600" />
            </div>
            <h3 className="font-bold text-white light:text-[#121212]">Hot Leads Surging</h3>
          </div>
          <p className="text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">
            3 leads show high purchase velocity signals this week. Focus outreach on TechCorp and Acme Inc.
          </p>
          <div className="mt-4 text-[11px] text-purple-400 light:text-purple-600 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Based on behavioral engagement patterns
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#38b6ff]/15 border border-[#38b6ff]/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#38b6ff] light:text-[#0284c7]" />
            </div>
            <h3 className="font-bold text-white light:text-[#121212]">Pipeline Velocity</h3>
          </div>
          <p className="text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">
            Average deal cycle is 18 days. Deals with architecture demos close 2.3x faster.
          </p>
          <div className="mt-4 text-[11px] text-[#38b6ff] light:text-[#0284c7] font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Based on closed deals last 90 days
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 light:text-amber-600" />
            </div>
            <h3 className="font-bold text-white light:text-[#121212]">At-Risk Deals</h3>
          </div>
          <p className="text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">
            2 deals haven&apos;t received a touchpoint in 7+ days. Consider enrolling in a re-engagement cadence.
          </p>
          <div className="mt-4 text-[11px] text-amber-500 light:text-amber-600 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Based on activity staleness decay
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-white light:text-[#121212] mb-4">Weekly Intelligence Summary</h3>
        <div className="space-y-3.5 text-xs text-slate-300 light:text-[#4a5053]">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
            <span className="text-emerald-500 font-bold">●</span>
            <span>Lead qualification velocity improved by 12% compared to last week.</span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
            <span className="text-[#38b6ff] light:text-[#0284c7] font-bold">●</span>
            <span>Email reply rates are highest on Tuesday mornings — schedule sequences accordingly.</span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
            <span className="text-amber-500 font-bold">●</span>
            <span>Consider offering an &quot;Architecture Sandbox&quot; CTA — top-converting accounts interact with developer docs first.</span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
            <span className="text-purple-400 font-bold">●</span>
            <span>3 contacts from Acme Inc visited your pricing page in the last 48 hours. Consensus score elevated.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
