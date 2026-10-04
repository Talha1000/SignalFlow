import React from "react";
import { Megaphone, TrendingUp, Target, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CampaignsPage() {
  const campaigns = [
    {
      id: "camp-1",
      name: "Q3 Enterprise Infra Whitepaper",
      type: "Content Download",
      leads: 28,
      qualified: 12,
      avgScore: 78,
      pipeline: 145000,
      status: "ACTIVE",
    },
    {
      id: "camp-2",
      name: "Google High-Intent Search Ads",
      type: "Paid Search",
      leads: 34,
      qualified: 18,
      avgScore: 82,
      pipeline: 188000,
      status: "ACTIVE",
    },
    {
      id: "camp-3",
      name: "API & Webhook Documentation Inbound",
      type: "Developer Organic",
      leads: 22,
      qualified: 15,
      avgScore: 89,
      pipeline: 210000,
      status: "ACTIVE",
    },
    {
      id: "camp-4",
      name: "CTO / Executive Cold Cadence",
      type: "Outbound Email",
      leads: 19,
      qualified: 7,
      avgScore: 68,
      pipeline: 95000,
      status: "PAUSED",
    },
  ];

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
    </div>
  );
}
