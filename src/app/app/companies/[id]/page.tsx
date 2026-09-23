import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Building,
  Users,
  Target,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Mail,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react";
import { ScoreBadge, IntentBadge, StageBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      contacts: true,
      leads: {
        include: {
          contact: true,
          owner: true,
        },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!company) notFound();

  const totalPipeline = company.leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <Link
          href="/app/companies"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Accounts
        </Link>
      </div>

      {/* Account Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Building className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{company.name}</h1>
                <ScoreBadge score={company.intentScore} />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{company.domain}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase text-slate-500 font-mono">
                Aggregate Pipeline
              </div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                ${totalPipeline.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* AI Account Summary */}
        <div className="rounded-xl border border-cyan-800/40 bg-gradient-to-r from-cyan-950/20 to-slate-950 p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            AI Account Intelligence Summary
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
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
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                Active Account Contacts ({company.contacts.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-800 text-xs">
              {company.contacts.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">
                      {c.firstName} {c.lastName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {c.title} • <span className="font-mono">{c.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{c.department}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Leads / Deals */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-cyan-400" />
              Active Opportunities & Leads
            </h3>

            <div className="space-y-2 text-xs">
              {company.leads.map((l) => (
                <div
                  key={l.id}
                  className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/app/leads/${l.id}`}
                        className="font-bold text-white hover:text-cyan-400"
                      >
                        {l.contact?.firstName} {l.contact?.lastName}
                      </Link>
                      <IntentBadge level={l.intentLevel} />
                      <StageBadge stage={l.stage} />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Owner: {l.owner?.name || "Unassigned"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-emerald-400 font-semibold">
                      ${l.dealValue.toLocaleString()}
                    </div>
                    <Link
                      href={`/app/leads/${l.id}`}
                      className="text-[11px] text-cyan-400 hover:underline"
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
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Firmographic Specs
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Industry:</span>
                <span>{company.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Employees:</span>
                <span>{company.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span>{company.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Revenue:</span>
                <span className="font-mono text-emerald-400">{company.annualRevenue}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Detected Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(company.techStack || []).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 font-mono text-xs"
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
