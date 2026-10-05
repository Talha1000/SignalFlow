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
import { EmailComposerModal } from "@/components/email/EmailComposerModal";

interface LeadRow {
  id: string;
  score?: number;
  intentLevel?: string;
  intent?: string;
  stage?: string;
  dealValue?: number;
  source?: string;
  lastActivityAt?: string | Date;
  company?: { name?: string; domain?: string | null; industry?: string | null } | null;
  contact?: { firstName?: string; lastName?: string; email?: string; title?: string | null; name?: string } | null;
  owner?: { name?: string } | null;
}

export function LeadsListClient({ initialLeads = [] }: { initialLeads?: LeadRow[] }) {
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

  const safeLeads = Array.isArray(initialLeads) ? initialLeads : [];

  const filtered = safeLeads
    .filter((l) => {
      if (!l) return false;
      const companyName = l.company?.name || "";
      const contactFirst = l.contact?.firstName || "";
      const contactLast = l.contact?.lastName || "";
      const contactEmail = l.contact?.email || "";
      const query = (search || "").toLowerCase().trim();

      const matchSearch =
        query === "" ||
        companyName.toLowerCase().includes(query) ||
        contactFirst.toLowerCase().includes(query) ||
        contactLast.toLowerCase().includes(query) ||
        contactEmail.toLowerCase().includes(query);

      const level = l.intentLevel || l.intent || "COLD";
      const matchIntent = intentFilter === "ALL" || level === intentFilter;
      const stage = l.stage || "NEW";
      const matchStage = stageFilter === "ALL" || stage === stageFilter;

      return matchSearch && matchIntent && matchStage;
    })
    .sort((a, b) => {
      if (!a && !b) return 0;
      if (!a) return 1;
      if (!b) return -1;
      if (sortField === "score") return (b.score ?? 0) - (a.score ?? 0);
      if (sortField === "value") return (b.dealValue ?? 0) - (a.dealValue ?? 0);
      const timeB = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0;
      const timeA = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0;
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    });

  const handleExportCSV = () => {
    const headers = "Name,Company,Email,Title,Score,Intent,Stage,Deal Value\n";
    const rows = filtered
      .map((l) => {
        const contactFirst = l.contact?.firstName || "";
        const contactLast = l.contact?.lastName || "";
        const name = `${contactFirst} ${contactLast}`.trim() || l.contact?.name || "Unknown";
        const company = l.company?.name || "";
        const email = l.contact?.email || "";
        const title = l.contact?.title || "";
        const score = l.score ?? 0;
        const intent = l.intentLevel || l.intent || "COLD";
        const stage = l.stage || "NEW";
        const dealValue = l.dealValue ?? 0;
        return `"${name}","${company}","${email}","${title}",${score},${intent},${stage},${dealValue}`;
      })
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
                  if (!lead) return null;
                  const contactFirst = lead.contact?.firstName || "";
                  const contactLast = lead.contact?.lastName || "";
                  const contactName =
                    `${contactFirst} ${contactLast}`.trim() ||
                    lead.contact?.name ||
                    lead.contact?.email ||
                    "Unknown Prospect";
                  const companyName = lead.company?.name || "Direct Lead";
                  const intentLevel = lead.intentLevel || lead.intent || "COLD";
                  const stage = lead.stage || "NEW";
                  const dealValue = Number(lead.dealValue) || 0;
                  const score = Number(lead.score) || 0;

                  return (
                    <tr
                      key={lead.id || Math.random().toString()}
                      className="hover:bg-[#252a2b]/60 light:hover:bg-[#f0f2f3] transition-colors group"
                    >
                      <td className="p-3.5">
                        <ScoreBadge score={score} />
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
                        <IntentBadge level={intentLevel} />
                      </td>
                      <td className="p-3.5">
                        <StageBadge stage={stage} />
                      </td>
                      <td className="p-3.5 font-mono text-white light:text-[#121212]">
                        {dealValue > 0 ? (
                          <span className="text-emerald-400 light:text-emerald-700 font-semibold">
                            ${dealValue.toLocaleString()}
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
                              score: score,
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
