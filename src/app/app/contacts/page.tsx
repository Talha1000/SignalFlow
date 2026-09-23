import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Users, Mail, Phone, Building, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      company: true,
      leads: true,
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-cyan-400" />
            Contacts Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            All decision-makers and stakeholders mapped across accounts.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 border-b border-slate-800 text-[11px] uppercase font-mono text-slate-400">
            <tr>
              <th className="p-3.5">Name</th>
              <th className="p-3.5">Title</th>
              <th className="p-3.5">Company</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Department</th>
              <th className="p-3.5 text-right">Associated Leads</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {contacts.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5 font-bold text-white">
                  {c.firstName} {c.lastName}
                </td>
                <td className="p-3.5 text-slate-300">{c.title || "Decision Maker"}</td>
                <td className="p-3.5">
                  <Link
                    href={c.company ? `/app/companies/${c.company.id}` : "#"}
                    className="font-medium text-cyan-400 hover:underline"
                  >
                    {c.company?.name || "Direct"}
                  </Link>
                </td>
                <td className="p-3.5 font-mono text-slate-400">{c.email}</td>
                <td className="p-3.5 text-slate-400">{c.department || "Operations"}</td>
                <td className="p-3.5 text-right">
                  {c.leads.length > 0 ? (
                    <Link
                      href={`/app/leads/${c.leads[0].id}`}
                      className="text-cyan-400 hover:underline text-xs"
                    >
                      View Lead (Score: {c.leads[0].score}) →
                    </Link>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
