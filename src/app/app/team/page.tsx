'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Users, UserPlus, AlertCircle, CheckCircle2, Shield, Trash2 } from 'lucide-react';

interface MemberItem {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'SALES_REP' | 'VIEWER';
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export default function TeamPage() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Invite Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MANAGER' | 'SALES_REP' | 'VIEWER'>('SALES_REP');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Manage Role Modal State
  const [manageMember, setManageMember] = useState<MemberItem | null>(null);
  const [newRole, setNewRole] = useState<string>('SALES_REP');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/team');
      if (res.ok) {
        const json = await res.json();
        setMembers(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteName.trim() || !inviteEmail.trim()) {
      setInviteError('Please fill out both name and email.');
      return;
    }
    setIsInviting(true);
    setInviteError(null);
    try {
      const res = await fetch('/api/v1/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inviteName.trim(),
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Failed to invite team member');
      }
      setInviteModalOpen(false);
      setInviteName('');
      setInviteEmail('');
      fetchTeam();
    } catch (err: any) {
      setInviteError(err.message || 'Error sending team invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!manageMember) return;
    setIsUpdatingRole(true);
    setRoleError(null);
    try {
      const res = await fetch(`/api/v1/team/${manageMember.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Failed to update member role');
      }
      setManageMember(null);
      fetchTeam();
    } catch (err: any) {
      setRoleError(err.message || 'Error updating member role');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!manageMember) return;
    if (!confirm(`Are you sure you want to remove ${manageMember.user.name} from the workspace?`)) return;
    setIsUpdatingRole(true);
    setRoleError(null);
    try {
      const res = await fetch(`/api/v1/team/${manageMember.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Failed to remove member');
      }
      setManageMember(null);
      fetchTeam();
    } catch (err: any) {
      setRoleError(err.message || 'Error removing member');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'brand';
      case 'ADMIN':
        return 'cyan';
      case 'MANAGER':
        return 'warning';
      case 'SALES_REP':
        return 'default';
      default:
        return 'outline';
    }
  };

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
        <Button
          variant="pill"
          size="sm"
          className="gap-1.5 shadow-sm self-start sm:self-auto"
          onClick={() => {
            setInviteError(null);
            setInviteModalOpen(true);
          }}
        >
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    Loading team members...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No team members found.
                  </td>
                </tr>
              ) : (
                members.map((member) => {
                  const initials = member.user.name
                    ? member.user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'U';

                  return (
                    <tr key={member.id} className="hover:bg-white/5 light:hover:bg-black/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#38b6ff]/15 border border-[#38b6ff]/30 flex items-center justify-center text-xs font-bold text-[#38b6ff] light:text-[#0284c7]">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-white light:text-[#121212] text-xs">
                              {member.user.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 light:text-[#787e82]">
                              {member.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getRoleBadgeVariant(member.role) as any}>{member.role}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 light:text-emerald-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setManageMember(member);
                            setNewRole(member.role);
                            setRoleError(null);
                          }}
                        >
                          Manage Role
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Member Modal */}
      <Modal isOpen={inviteModalOpen} onClose={() => setInviteModalOpen(false)} title="Invite Team Member">
        <div className="space-y-4">
          {inviteError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {inviteError}
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="e.g. Jordan Lee"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />

          <Input
            label="Email Address"
            placeholder="jordan@company.com"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-[#4a5053] mb-1.5">
              Workspace Role
            </label>
            <select
              value={inviteRole}
              onChange={(e: any) => setInviteRole(e.target.value)}
              className="w-full px-3.5 py-2 border border-white/10 light:border-black/10 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-white light:text-[#121212] text-xs focus:outline-none focus:border-[#38b6ff]"
            >
              <option value="ADMIN">Admin (Full administrative access)</option>
              <option value="MANAGER">Manager (Team & lead management)</option>
              <option value="SALES_REP">Sales Rep (Assigned lead execution)</option>
              <option value="VIEWER">Viewer (Read-only access)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="pill" size="sm" onClick={handleInvite} disabled={isInviting}>
              {isInviting ? 'Sending Invite...' : 'Send Invitation'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Manage Role Modal */}
      <Modal
        isOpen={Boolean(manageMember)}
        onClose={() => setManageMember(null)}
        title={`Manage ${manageMember?.user.name}`}
      >
        <div className="space-y-4">
          {roleError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {roleError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-[#4a5053] mb-1.5">
              Role Assignment
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full px-3.5 py-2 border border-white/10 light:border-black/10 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-white light:text-[#121212] text-xs focus:outline-none focus:border-[#38b6ff]"
            >
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="SALES_REP">Sales Rep</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>

          <div className="pt-3 border-t border-white/10 light:border-black/10 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveMember}
              className="text-rose-500 hover:text-rose-400 text-xs gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove from Team
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setManageMember(null)}>
                Cancel
              </Button>
              <Button variant="pill" size="sm" onClick={handleUpdateRole} disabled={isUpdatingRole}>
                {isUpdatingRole ? 'Updating...' : 'Update Role'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
