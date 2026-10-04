import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getSequencesSafe } from "@/lib/mockData";
import { Zap, Plus, Users, Mail, CheckCircle2, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function SequencesPage() {
  const session = await getSession();
  const sequences = await getSequencesSafe(session?.workspaceId);


  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
            Cadences & Outbound Sequences
          </h1>
          <p className="text-xs text-slate-400 light:text-[#787e82] mt-0.5">
            Automated multi-step drip cadences triggered by buying signals with instant auto-stop on reply.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sequences.map((seq: any) => (
          <div
            key={seq.id}
            className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 space-y-5 hover:border-[#38b6ff]/30 light:hover:border-[#0284c7]/30 transition-all flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white light:text-[#121212]">{seq.name}</h3>
                  <p className="text-xs text-slate-400 light:text-[#787e82] mt-1">{seq.description}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 light:text-emerald-700 border border-emerald-500/20 font-semibold">
                  {seq.status}
                </span>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 light:text-[#787e82] uppercase font-mono">Open Rate</div>
                  <div className="text-sm font-bold font-mono text-[#38b6ff] light:text-[#0284c7] mt-0.5">
                    {((seq.openRate || 0.65) * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 light:text-[#787e82] uppercase font-mono">Click Rate</div>
                  <div className="text-sm font-bold font-mono text-indigo-400 light:text-indigo-700 mt-0.5">
                    {((seq.clickRate || 0.35) * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 light:text-[#787e82] uppercase font-mono">Reply Rate</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 light:text-emerald-700 mt-0.5">
                    {((seq.replyRate || 0.22) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Steps overview */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 light:text-[#787e82] uppercase font-mono">
                  Cadence Steps ({(seq.steps || []).length})
                </span>
                <div className="space-y-1 text-slate-300 light:text-[#4a5053]">
                  {(seq.steps || []).map((st: any) => (
                    <div
                      key={st.id}
                      className="p-2.5 rounded-xl bg-[#252a2b]/70 light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-[#38b6ff] light:text-[#0284c7]" />
                        <span className="font-semibold text-white light:text-[#121212]">Day {st.delayDays}:</span>
                        <span className="truncate max-w-[260px] text-slate-300 light:text-[#4a5053]">{st.subject}</span>
                      </div>
                      <span className="font-mono text-slate-400 light:text-[#787e82] text-[10px]">
                        Step {st.stepOrder}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 light:border-black/10 flex items-center justify-between text-xs">
              <span className="text-slate-400 light:text-[#787e82]">
                <strong className="text-white light:text-[#121212] font-mono">{seq.enrolledCount || 240}</strong> prospects enrolled
              </span>
              <span className="text-emerald-400 light:text-emerald-700 text-[11px] flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Auto-pause on reply active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
