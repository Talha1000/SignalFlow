import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getContactsSafe } from "@/lib/mockData";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const session = await getSession();
  const contacts = await getContactsSafe(session?.workspaceId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
            <Users className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
            Contacts Directory
          </h1>
          <p className="text-xs text-slate-300 light:text-[#4a5053] mt-0.5">
            All decision-makers and stakeholders mapped across accounts.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 light:text-[#4a5053]">
            <thead className="bg-[#252a2b] light:bg-[#f0f2f3] border-b border-white/10 light:border-black/10 text-[11px] uppercase font-mono text-slate-400 light:text-[#787e82]">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Title</th>
                <th className="p-4">Company</th>
                <th className="p-4">Email</th>
                <th className="p-4">Department</th>
                <th className="p-4 text-right">Associated Leads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 light:divide-black/10">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No contacts found in this workspace. Contacts are mapped automatically when leads or signals arrive.
                  </td>
                </tr>
              ) : (
                contacts.map((c: any) => (
                  <tr key={c.id} className="hover:bg-white/5 light:hover:bg-black/5 transition-colors">
                    <td className="p-4 font-bold text-white light:text-[#121212]">
                      {c.firstName ? `${c.firstName} ${c.lastName || ""}` : (c.name || "Contact")}
                    </td>
                    <td className="p-4 text-slate-300 light:text-[#4a5053]">{c.title || "Decision Maker"}</td>
                    <td className="p-4">
                      <Link
                        href={c.company ? `/app/companies/${c.company.id || c.companyId}` : "#"}
                        className="font-semibold text-[#38b6ff] light:text-[#0284c7] hover:underline"
                      >
                        {c.company?.name || "Direct"}
                      </Link>
                    </td>
                    <td className="p-4 font-mono text-slate-400 light:text-[#787e82]">{c.email}</td>
                    <td className="p-4 text-slate-400 light:text-[#787e82]">{c.department || "Operations"}</td>
                    <td className="p-4 text-right">
                      {c.leads && c.leads.length > 0 ? (
                        <Link
                          href={`/app/leads/${c.leads[0].id}`}
                          className="text-[#38b6ff] light:text-[#0284c7] font-semibold hover:underline text-xs"
                        >
                          View Lead (Score: {c.leads[0].score}) →
                        </Link>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
