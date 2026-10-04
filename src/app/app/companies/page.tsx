import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getCompaniesSafe } from "@/lib/mockData";
import { Building, Users, ArrowRight } from "lucide-react";
import { ScoreBadge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const session = await getSession();
  const companies = await getCompaniesSafe(session?.workspaceId);


  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
            <Building className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
            Accounts & Target Companies
          </h1>
          <p className="text-xs text-slate-400 light:text-[#787e82] mt-0.5">
            Account-Based Marketing (ABM) intelligence aggregating signals across all company stakeholders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((comp: any) => {
          const totalPipeline = (comp.leads || []).reduce((sum: number, l: any) => sum + (l.dealValue || 0), 0);

          return (
            <div
              key={comp.id}
              className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-5 space-y-4 hover:border-[#38b6ff]/30 light:hover:border-[#0284c7]/30 transition-all flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/app/companies/${comp.id}`}
                      className="text-base font-bold text-white light:text-[#121212] hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors"
                    >
                      {comp.name}
                    </Link>
                    <div className="text-xs text-slate-400 light:text-[#787e82] font-mono mt-0.5">{comp.domain}</div>
                  </div>
                  <ScoreBadge score={comp.intentScore || 85} />
                </div>

                <div className="text-xs text-slate-300 light:text-[#4a5053] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400 light:text-[#787e82]">Industry:</span>
                    <span className="font-medium text-white light:text-[#121212]">{comp.industry || "B2B Tech"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 light:text-[#787e82]">Scale:</span>
                    <span className="font-medium text-white light:text-[#121212]">{comp.size || comp.employeeCount || "100-250"} employees</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 light:text-[#787e82]">Pipeline Value:</span>
                    <span className="font-mono text-emerald-400 light:text-emerald-700 font-semibold">
                      ${totalPipeline.toLocaleString()}
                    </span>
                  </div>
                </div>

                {comp.aiSummary && (
                  <p className="text-[11px] text-slate-300 light:text-[#4a5053] leading-relaxed bg-[#252a2b] light:bg-[#f0f2f3] p-3 rounded-2xl border border-white/10 light:border-black/10">
                    "{comp.aiSummary}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 light:border-black/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 light:text-[#787e82] flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
                  {(comp.contacts || []).length} active contacts
                </span>
                <Link
                  href={`/app/companies/${comp.id}`}
                  className="text-[#38b6ff] light:text-[#0284c7] hover:underline font-medium flex items-center gap-1"
                >
                  View Account <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
