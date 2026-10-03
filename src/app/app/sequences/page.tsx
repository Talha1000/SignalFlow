import React from "react";
import Link from "next/link";
import { getSequencesSafe } from "@/lib/mockData";
import { Zap, Plus, Users, Mail, CheckCircle2, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function SequencesPage() {
  const sequences = await getSequencesSafe();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-cyan-400" />
            Cadences & Outbound Sequences
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated multi-step drip cadences triggered by buying signals with instant auto-stop on reply.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sequences.map((seq: any) => (
          <div
            key={seq.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{seq.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{seq.description}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {seq.status}
                </span>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Open Rate</div>
                  <div className="text-sm font-bold font-mono text-cyan-400 mt-0.5">
                    {((seq.openRate || 0.65) * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Click Rate</div>
                  <div className="text-sm font-bold font-mono text-indigo-400 mt-0.5">
                    {((seq.clickRate || 0.35) * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Reply Rate</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                    {((seq.replyRate || 0.22) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Steps overview */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase font-mono">
                  Cadence Steps ({(seq.steps || []).length})
                </span>
                <div className="space-y-1 text-slate-300">
                  {(seq.steps || []).map((st: any) => (
                    <div
                      key={st.id}
                      className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-cyan-400" />
                        <span className="font-semibold text-white">Day {st.delayDays}:</span>
                        <span className="truncate max-w-[260px] text-slate-300">{st.subject}</span>
                      </div>
                      <span className="font-mono text-slate-500 text-[10px]">
                        Step {st.stepOrder}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                <strong className="text-white font-mono">{seq.enrolledCount || 240}</strong> prospects enrolled
              </span>
              <span className="text-emerald-400 text-[11px] flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Auto-pause on reply active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
