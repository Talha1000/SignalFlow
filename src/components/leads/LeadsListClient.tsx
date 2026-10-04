"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Plus,
  Mail,
  ExternalLink,
  Target,
  ArrowUpDown,
  Building,
} from "lucide-react";
import { IntentBadge, ScoreBadge, StageBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { EmailComposerModal } from "@/components/email/EmailComposerModal";

interface LeadRow {
  id: string;
  score: number;
  intentLevel: string;
  stage: string;
  dealValue: number;
  source: string;
  lastActivityAt: string | Date;
  company?: { name: string; domain?: string | null; industry?: string | null } | null;
  contact?: { firstName: string; lastName: string; email: string; title?: string | null } | null;
  owner?: { name: string } | null;
}

export function LeadsListClient({ initialLeads }: { initialLeads: LeadRow[] }) {
  const [search, setSearch] = useState("");
  const [intentFilter, setIntentFilter] = useState("ALL");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [sortField, setSortField] = useState<"score" | "value" | "date">("score");

  const [composerLead, setComposerLead] = useState<{
    id: string;
    name: string;
    email: string;
    company: string;
    title?: string;
    score?: number;
  } | null>(null);

  const filtered = initialLeads
    .filter((l) => {
      const matchSearch =
        search === "" ||
        (l.company?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.contact?.firstName || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.contact?.lastName || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.contact?.email || "").toLowerCase().includes(search.toLowerCase());

      const matchIntent = intentFilter === "ALL" || l.intentLevel === intentFilter;
      const matchStage = stageFilter === "ALL" || l.stage === stageFilter;

      return matchSearch && matchIntent && matchStage;
    })
    .sort((a, b) => {
      if (sortField === "score") return b.score - a.score;
      if (sortField === "value") return b.dealValue - a.dealValue;
      return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
    });

  const handleExportCSV = () => {
    const headers = "Name,Company,Email,Title,Score,Intent,Stage,Deal Value\n";
    const rows = filtered
      .map(
        (l) =>
          `"${l.contact?.firstName || ""} ${l.contact?.lastName || ""}","${l.company?.name || ""}","${l.contact?.email || ""}","${l.contact?.title || ""}",${l.score},${l.intentLevel},${l.stage},${l.dealValue}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `signalflow-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
            <Target className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
            Lead Prioritization & CRM
          </h1>
          <p className="text-xs text-slate-400 light:text-[#787e82] mt-0.5">
            All workspace leads continuously scored by behavioral intent and customer fit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
          <Link href="/app/onboarding">
            <Button variant="pill" size="sm" className="text-xs gap-1.5 shadow-md">
              <Plus className="h-3.5 w-3.5" /> Import Leads
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-3.5 flex flex-wrap items-center gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 light:text-[#787e82]" />
          <input
            type="text"
            placeholder="Search by name, company, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 light:border-black/15 bg-[#252a2b] light:bg-[#f0f2f3] pl-9 pr-3 py-2 text-xs text-white light:text-[#121212] placeholder-slate-400 light:placeholder-[#8a9296] focus:border-[#38b6ff] light:focus:border-[#0284c7] focus:outline-none"
          />
        </div>

        <select
          value={intentFilter}
          onChange={(e) => setIntentFilter(e.target.value)}
          className="rounded-xl border border-white/10 light:border-black/15 bg-[#252a2b] light:bg-[#f0f2f3] px-3 py-2 text-xs text-white light:text-[#121212] focus:outline-none focus:border-[#38b6ff] light:focus:border-[#0284c7]"
        >
          <option value="ALL">All Intent Levels</option>
          <option value="HOT">🔥 Hot Intent (85+)</option>
          <option value="HIGH">⚡ High Intent (70-84)</option>
          <option value="WARM">🌤 Warm (50-69)</option>
          <option value="LOW">❄ Low (30-49)</option>
          <option value="COLD">🧊 Cold (&lt;30)</option>
        </select>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="rounded-xl border border-white/10 light:border-black/15 bg-[#252a2b] light:bg-[#f0f2f3] px-3 py-2 text-xs text-white light:text-[#121212] focus:outline-none focus:border-[#38b6ff] light:focus:border-[#0284c7]"
        >
          <option value="ALL">All Stages</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="ENGAGED">Engaged</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="MEETING">Meeting Booked</option>
          <option value="PROPOSAL">Proposal</option>
          <option value="WON">Closed Won</option>
          <option value="LOST">Closed Lost</option>
        </select>

        <select
          value={sortField}
          onChange={(e: any) => setSortField(e.target.value)}
          className="rounded-xl border border-white/10 light:border-black/15 bg-[#252a2b] light:bg-[#f0f2f3] px-3 py-2 text-xs text-white light:text-[#121212] focus:outline-none focus:border-[#38b6ff] light:focus:border-[#0284c7]"
        >
          <option value="score">Sort by Score (Highest)</option>
          <option value="value">Sort by Deal Value</option>
          <option value="date">Sort by Recent Activity</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 light:text-[#4a5053]">
            <thead className="bg-[#181b1c] light:bg-white border-b border-white/10 light:border-black/10 text-[11px] uppercase font-mono text-slate-400 light:text-[#787e82]">
              <tr>
                <th className="p-3.5">Score</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">Intent Level</th>
                <th className="p-3.5">Stage</th>
                <th className="p-3.5">Deal Value</th>
                <th className="p-3.5">Assigned Owner</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 light:divide-black/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 light:text-[#787e82]">
                    No leads match the selected search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => {
                  const contactName = lead.contact
                    ? `${lead.contact.firstName} ${lead.contact.lastName}`
                    : "Unknown";
                  const companyName = lead.company?.name || "Direct Lead";

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#252a2b]/60 light:hover:bg-[#f0f2f3] transition-colors group"
                    >
                      <td className="p-3.5">
                        <ScoreBadge score={lead.score} />
                      </td>
                      <td className="p-3.5">
                        <Link
                          href={`/app/leads/${lead.id}`}
                          className="font-semibold text-white light:text-[#121212] group-hover:text-[#38b6ff] light:group-hover:text-[#0284c7] transition-colors"
                        >
                          {contactName}
                        </Link>
                        <div className="text-[11px] text-slate-400 light:text-[#787e82]">
                          {lead.contact?.title || "Decision Maker"}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-white light:text-[#121212]">{companyName}</div>
                        <div className="text-[10px] text-slate-400 light:text-[#787e82]">
                          {lead.company?.industry || "B2B Tech"}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <IntentBadge level={lead.intentLevel} />
                      </td>
                      <td className="p-3.5">
                        <StageBadge stage={lead.stage} />
                      </td>
                      <td className="p-3.5 font-mono text-white light:text-[#121212]">
                        {lead.dealValue > 0 ? (
                          <span className="text-emerald-400 light:text-emerald-700 font-semibold">
                            ${lead.dealValue.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-400 light:text-[#787e82]">—</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-400 light:text-[#787e82]">
                        {lead.owner?.name || "Unassigned"}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() =>
                            setComposerLead({
                              id: lead.id,
                              name: contactName,
                              email: lead.contact?.email || "lead@company.com",
                              company: companyName,
                              title: lead.contact?.title || undefined,
                              score: lead.score,
                            })
                          }
                          className="p-1.5 rounded-lg bg-[#252a2b] light:bg-[#f0f2f3] hover:bg-[#38b6ff]/20 light:hover:bg-[#0284c7]/20 text-slate-400 light:text-[#787e82] hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors"
                          title="Compose email"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </button>
                        <Link
                          href={`/app/leads/${lead.id}`}
                          className="p-1.5 inline-block rounded-lg bg-[#252a2b] light:bg-[#f0f2f3] hover:bg-white/10 light:hover:bg-black/5 text-slate-400 light:text-[#787e82] hover:text-white light:hover:text-[#121212] transition-colors"
                          title="View lead profile"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmailComposerModal
        isOpen={Boolean(composerLead)}
        onClose={() => setComposerLead(null)}
        lead={composerLead}
      />
    </div>
  );
}
