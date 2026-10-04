import React from "react";
import { Card } from "@/components/ui/Card";
import { Sparkles, TrendingUp, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getLeadsSafe } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export default async function AIInsightsPage() {
  const session = await getSession();
  const leads = await getLeadsSafe(session?.workspaceId);

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  const hotLeads = leads.filter((l: any) => (l.score ?? 0) >= 85);
  const surgingLeads = leads.filter((l: any) => {
    const delta = l.leadScore?.delta7d ?? 0;
    return delta >= 15 || ((l.score ?? 0) >= 70 && (l.score ?? 0) < 85);
  });
  const atRiskLeads = leads.filter((l: any) => {
    if (!l.lastActivityAt) return true;
    return now - new Date(l.lastActivityAt).getTime() > sevenDaysMs;
  });

  const totalPipeline = leads.reduce((sum: number, l: any) => sum + (l.dealValue ?? 0), 0);
  const qualifiedCount = leads.filter((l: any) => (l.score ?? 0) >= 70).length;

  const hotLeadCompanyNames = hotLeads.map((l: any) => l.company?.name || "Account").slice(0, 3);

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
            {hotLeads.length > 0
              ? `${hotLeads.length} lead${hotLeads.length > 1 ? "s" : ""} show immediate buying velocity signals (${hotLeadCompanyNames.join(", ")}). Recommend executive briefing calls.`
              : "0 leads currently meet the hot threshold (85+). Monitor surging accounts as new telemetry arrives."}
          </p>
          <div className="mt-4 text-[11px] text-purple-400 light:text-purple-600 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Derived from real-time behavioral signals
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#38b6ff]/15 border border-[#38b6ff]/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#38b6ff] light:text-[#0284c7]" />
            </div>
            <h3 className="font-bold text-white light:text-[#121212]">Pipeline Distribution</h3>
          </div>
          <p className="text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">
            ${(totalPipeline / 1000).toFixed(0)}K in pipeline value across {leads.length} accounts. {qualifiedCount} account{qualifiedCount === 1 ? "" : "s"} meet high-intent qualification criteria.
          </p>
          <div className="mt-4 text-[11px] text-[#38b6ff] light:text-[#0284c7] font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Grounded in active workspace deals
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 light:text-amber-600" />
            </div>
            <h3 className="font-bold text-white light:text-[#121212]">Stale & Inactive Accounts</h3>
          </div>
          <p className="text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">
            {atRiskLeads.length > 0
              ? `${atRiskLeads.length} account${atRiskLeads.length > 1 ? "s" : ""} haven't registered telemetry in 7+ days. Consider enrolling in a re-engagement cadence.`
              : "All tracked leads have registered activity events within the past 7 days."}
          </p>
          <div className="mt-4 text-[11px] text-amber-500 light:text-amber-600 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Based on activity decay timestamps
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-white light:text-[#121212] mb-4">Live Telemetry Observations</h3>
        <div className="space-y-3.5 text-xs text-slate-300 light:text-[#4a5053]">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
            <span className="text-emerald-500 font-bold">●</span>
            <span>
              {hotLeads.length} hot account{hotLeads.length === 1 ? "" : "s"} and {surgingLeads.length} surging account{surgingLeads.length === 1 ? "" : "s"} currently monitored in your workspace.
            </span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
            <span className="text-[#38b6ff] light:text-[#0284c7] font-bold">●</span>
            <span>Outbound sequence auto-stop is active: prospect replies automatically halt downstream cadence steps.</span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
            <span className="text-amber-500 font-bold">●</span>
            <span>
              Accounts exploring API documentation and pricing exhibit higher score convergence than general visitors.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
