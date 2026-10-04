'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Users, UserPlus } from 'lucide-react';

const members = [
  { name: 'Alex Morgan', email: 'alex.morgan@signalflow.io', role: 'Owner', avatar: 'AM', status: 'active', badgeVariant: 'brand' as const },
  { name: 'Sarah Connor', email: 'sarah.connor@signalflow.io', role: 'Admin', avatar: 'SC', status: 'active', badgeVariant: 'cyan' as const },
  { name: 'Liam Vance', email: 'liam.vance@signalflow.io', role: 'Manager', avatar: 'LV', status: 'active', badgeVariant: 'warning' as const },
  { name: 'Maya Patel', email: 'maya.patel@signalflow.io', role: 'Sales Rep', avatar: 'MP', status: 'active', badgeVariant: 'default' as const },
];

export default function TeamPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
            <Users className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
            Team &amp; Access Control
          </h1>
          <p className="text-xs text-slate-300 light:text-[#4a5053] mt-0.5">
            Manage your workspace members and role-based permissions (RBAC).
          </p>
        </div>
        <Button variant="pill" size="sm" className="gap-1.5 shadow-sm">
          <UserPlus className="h-3.5 w-3.5" /> Invite Member
        </Button>
      </div>

      <Card className="overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 light:text-[#4a5053]">
            <thead className="bg-[#252a2b] light:bg-[#f0f2f3] border-b border-white/10 light:border-black/10 text-[11px] uppercase font-mono text-slate-400 light:text-[#787e82]">
              <tr>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 light:divide-black/10">
              {members.map((member) => (
                <tr key={member.email} className="hover:bg-white/5 light:hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#38b6ff]/15 border border-[#38b6ff]/30 flex items-center justify-center text-xs font-bold text-[#38b6ff] light:text-[#0284c7]">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-white light:text-[#121212] text-xs">{member.name}</div>
                        <div className="text-[11px] font-mono text-slate-400 light:text-[#787e82]">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={member.badgeVariant}>
                      {member.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 light:text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm">Manage Role</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
