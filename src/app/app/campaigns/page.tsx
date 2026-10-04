import React from "react";
import { Megaphone, TrendingUp, Target, DollarSign, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getLeadsSafe } from "@/lib/mockData";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const session = await getSession();
  const leads = await getLeadsSafe(session?.workspaceId);

  // Aggregate real workspace leads by acquisition source
  const sourceGroups: Record<string, typeof leads> = {};
  leads.forEach((l: any) => {
    const src = l.source || "WEBSITE";
    if (!sourceGroups[src]) sourceGroups[src] = [];
    sourceGroups[src].push(l);
  });

  const campaigns = Object.entries(sourceGroups).map(([sourceKey, srcLeads], idx) => {
    const totalPipeline = srcLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
    const avgScore = srcLeads.length > 0 ? Math.round(srcLeads.reduce((sum, l) => sum + l.score, 0) / srcLeads.length) : 0;
    const qualifiedCount = srcLeads.filter((l) => l.score >= 70).length;

    const formattedName = sourceKey
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      id: `camp-${idx + 1}`,
      name: `${formattedName} Inbound Channel`,
      type: sourceKey.includes("OUTBOUND") ? "Outbound Cadence" : "Inbound Telemetry",
      leads: srcLeads.length,
      qualified: qualifiedCount,
      avgScore,
      pipeline: totalPipeline,
      status: "ACTIVE",
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
            Campaigns & Source Attribution
          </h1>
          <p className="text-xs text-slate-400 light:text-[#787e82] mt-0.5">
            Identify which marketing campaigns and channels produce the highest-scoring leads.
          </p>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-12 text-center space-y-3">
          <Megaphone className="h-8 w-8 mx-auto text-slate-500 opacity-60" />
          <h3 className="text-base font-bold text-white light:text-[#121212]">No campaign attribution recorded</h3>
          <p className="text-xs text-slate-400 light:text-[#787e82] max-w-md mx-auto">
            Source metrics are generated when signals arrive with UTM parameters or when leads are registered with acquisition channels.
          </p>
        </div>
      ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 space-y-4 hover:border-[#38b6ff]/30 light:hover:border-[#0284c7]/30 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white light:text-[#121212]">{c.name}</h3>
                <span className="text-[11px] text-[#38b6ff] light:text-[#0284c7] font-medium">{c.type}</span>
              </div>
              <span
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                  c.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-400 light:text-emerald-700 border-emerald-500/30"
                    : "bg-[#252a2b] light:bg-[#f0f2f3] text-slate-400 light:text-[#787e82] border-white/10 light:border-black/10"
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400 light:text-[#787e82] uppercase font-mono">Leads</div>
                <div className="text-base font-bold font-mono text-white light:text-[#121212] mt-0.5">{c.leads}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 light:text-[#787e82] uppercase font-mono">Qualified</div>
                <div className="text-base font-bold font-mono text-[#38b6ff] light:text-[#0284c7] mt-0.5">
                  {c.qualified}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 light:text-[#787e82] uppercase font-mono">Avg Score</div>
                <div className="text-base font-bold font-mono text-amber-400 light:text-amber-700 mt-0.5">
                  {c.avgScore}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 light:text-[#787e82] uppercase font-mono">Pipeline</div>
                <div className="text-base font-bold font-mono text-emerald-400 light:text-emerald-700 mt-0.5">
                  ${(c.pipeline / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
