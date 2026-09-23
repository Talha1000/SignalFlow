"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trello,
  Plus,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Target,
  ChevronRight,
  Flame,
} from "lucide-react";
import { IntentBadge, ScoreBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface PipelineLead {
  id: string;
  stage: string;
  dealValue: number;
  score: number;
  intentLevel: string;
  company?: { name: string } | null;
  contact?: { firstName: string; lastName: string; title?: string | null } | null;
  owner?: { name: string } | null;
}

const STAGES = [
  { key: "NEW", label: "New Lead", color: "border-slate-700" },
  { key: "CONTACTED", label: "Contacted", color: "border-sky-500/40" },
  { key: "ENGAGED", label: "Engaged", color: "border-indigo-500/40" },
  { key: "QUALIFIED", label: "Qualified", color: "border-purple-500/40" },
  { key: "MEETING", label: "Meeting Booked", color: "border-fuchsia-500/40" },
  { key: "PROPOSAL", label: "Proposal", color: "border-amber-500/40" },
  { key: "NEGOTIATION", label: "Negotiation", color: "border-orange-500/40" },
  { key: "WON", label: "Closed Won", color: "border-emerald-500/40" },
  { key: "LOST", label: "Closed Lost", color: "border-red-500/40" },
];

export function PipelineKanbanClient({ initialLeads }: { initialLeads: PipelineLead[] }) {
  const [leads, setLeads] = useState(initialLeads);

  const moveStage = async (leadId: string, currentStage: string, direction: 1 | -1) => {
    const currentIndex = STAGES.findIndex((s) => s.key === currentStage);
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= STAGES.length) return;

    const nextStage = STAGES[newIndex].key;

    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: nextStage } : l))
    );

    try {
      await fetch(`/api/v1/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: nextStage }),
      });
    } catch (err) {
      console.error("Failed to update stage:", err);
    }
  };

  const totalValue = leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Trello className="h-6 w-6 text-cyan-400" />
            Visual Sales Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Total active pipeline value:{" "}
            <span className="text-emerald-400 font-mono font-bold">
              ${totalValue.toLocaleString()}
            </span>{" "}
            across {leads.length} accounts.
          </p>
        </div>
      </div>

      {/* Horizontal scrolling Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar min-h-[650px]">
        {STAGES.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.key);
          const colValue = colLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

          return (
            <div
              key={col.key}
              className="w-80 shrink-0 flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-3 space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {col.label}
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {colLeads.length}
                    </span>
                  </h3>
                  <div className="text-[11px] font-mono text-emerald-400 font-semibold mt-0.5">
                    ${colValue.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Column Cards */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {colLeads.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-600 border border-dashed border-slate-800/80 rounded-xl">
                    No deals in {col.label}
                  </div>
                ) : (
                  colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2.5 hover:border-cyan-500/40 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/app/leads/${lead.id}`}
                            className="font-bold text-xs text-white hover:text-cyan-400 transition-colors"
                          >
                            {lead.company?.name || "Direct Lead"}
                          </Link>
                          <div className="text-[11px] text-slate-400">
                            {lead.contact?.firstName} {lead.contact?.lastName}
                          </div>
                        </div>
                        <ScoreBadge score={lead.score} />
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                        <span className="font-mono text-emerald-400 font-semibold">
                          ${lead.dealValue.toLocaleString()}
                        </span>
                        <IntentBadge level={lead.intentLevel} />
                      </div>

                      {/* Stage advancement quick arrows */}
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <button
                          onClick={() => moveStage(lead.id, lead.stage, -1)}
                          disabled={col.key === "NEW"}
                          className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20"
                          title="Move stage back"
                        >
                          <ArrowLeft className="h-3 w-3" />
                        </button>
                        <Link
                          href={`/app/leads/${lead.id}`}
                          className="text-slate-400 hover:text-cyan-400 text-[10px]"
                        >
                          Details →
                        </Link>
                        <button
                          onClick={() => moveStage(lead.id, lead.stage, 1)}
                          disabled={col.key === "LOST"}
                          className="p-1 rounded text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-20"
                          title="Advance stage"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
