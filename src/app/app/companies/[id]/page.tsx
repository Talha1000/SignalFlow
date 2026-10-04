import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCompanyByIdSafe } from "@/lib/mockData";
import {
  Building,
  Users,
  Target,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { ScoreBadge, IntentBadge, StageBadge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const company = await getCompanyByIdSafe(id, session?.workspaceId);

  if (!company) notFound();

  const totalPipeline = (company.leads || []).reduce((sum: number, l: any) => sum + (l.dealValue || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <Link
          href="/app/companies"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 light:text-[#787e82] hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Accounts
        </Link>
      </div>

      {/* Account Header */}
      <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-[#38b6ff] light:text-[#0284c7] border border-white/10 light:border-black/10 shrink-0">
              <Building className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white light:text-[#121212]">{company.name}</h1>
                <ScoreBadge score={company.intentScore} />
              </div>
              <p className="text-xs text-slate-400 light:text-[#787e82] font-mono mt-0.5">{company.domain}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase text-slate-400 light:text-[#787e82] font-mono font-semibold">
                Aggregate Pipeline
              </div>
              <div className="text-lg font-bold font-mono text-emerald-500 light:text-emerald-600">
                ${totalPipeline.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* AI Account Summary */}
        <div className="rounded-2xl border border-[#38b6ff]/30 bg-[#38b6ff]/10 p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#38b6ff] light:text-[#0284c7]">
            <Sparkles className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
            AI Account Intelligence Summary
          </div>
          <p className="text-xs text-white light:text-[#121212] leading-relaxed">
            {company.aiSummary ||
              `${company.name} shows high evaluation velocity. Multiple technical decision-makers engaged with product documentation and enterprise pricing.`}
          </p>
        </div>
      </div>

      {/* Account Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Contacts & Opportunities */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Contacts Table */}
          <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white light:text-[#121212] flex items-center gap-2">
                <Users className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" />
                Active Account Contacts ({company.contacts.length})
              </h3>
            </div>

            <div className="divide-y divide-white/10 light:divide-black/10 text-xs">
              {(company.contacts || []).map((c: any) => (
                <div key={c.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white light:text-[#121212]">
                      {c.firstName ? `${c.firstName} ${c.lastName || ""}` : (c.name || "Contact")}
                    </div>
                    <div className="text-[11px] text-slate-400 light:text-[#787e82]">
                      {c.title} • <span className="font-mono">{c.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 light:text-[#787e82]">{c.department || "Operations"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Leads / Deals */}
          <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white light:text-[#121212] flex items-center gap-2">
              <Target className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" />
              Active Opportunities & Leads
            </h3>

            <div className="space-y-2 text-xs">
              {company.leads.map((l) => (
                <div
                  key={l.id}
                  className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/app/leads/${l.id}`}
                        className="font-bold text-white light:text-[#121212] hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors"
                      >
                        {l.contact?.firstName} {l.contact?.lastName}
                      </Link>
                      <IntentBadge level={l.intentLevel} />
                      <StageBadge stage={l.stage} />
                    </div>
                    <div className="text-[11px] text-slate-400 light:text-[#787e82]">
                      Owner: {l.owner?.name || "Unassigned"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-emerald-500 light:text-emerald-600 font-bold">
                      ${l.dealValue.toLocaleString()}
                    </div>
                    <Link
                      href={`/app/leads/${l.id}`}
                      className="text-[11px] text-[#38b6ff] light:text-[#0284c7] font-semibold hover:underline"
                    >
                      Open Lead →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Firmographics & Tech Stack */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-white light:text-[#121212] uppercase tracking-wider text-[11px]">
              Firmographic Specs
            </h4>
            <div className="space-y-2 text-slate-300 light:text-[#4a5053]">
              <div className="flex justify-between">
                <span className="text-slate-400 light:text-[#787e82]">Industry:</span>
                <span>{company.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 light:text-[#787e82]">Employees:</span>
                <span>{company.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 light:text-[#787e82]">Location:</span>
                <span>{(company as any).location || `${(company as any).city || ""}, ${(company as any).country || ""}` || "United States"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 light:text-[#787e82]">Revenue:</span>
                <span className="font-mono text-emerald-500 light:text-emerald-600 font-semibold">{(company as any).annualRevenue || "$50M+"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-3">
            <h4 className="font-bold text-white light:text-[#121212] uppercase tracking-wider text-[11px]">
              Detected Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {((company as any).techStack || []).map((t: string) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-full bg-[#252a2b] light:bg-[#f0f2f3] text-[#38b6ff] light:text-[#0284c7] border border-white/10 light:border-black/10 font-mono text-xs font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
