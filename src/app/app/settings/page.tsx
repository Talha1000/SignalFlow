'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import {
  Settings,
  Shield,
  Key,
  CreditCard,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Copy,
  Trash2,
  Plus,
  Lock,
} from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: Sliders },
  { id: 'billing', label: 'Billing & Usage', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'api', label: 'API Keys', icon: Key },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  // General Settings State
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDomain, setWorkspaceDomain] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [generalSuccess, setGeneralSuccess] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Billing / Usage State
  const [planData, setPlanData] = useState<{
    plan: string;
    usage: {
      leads: { current: number; limit: number };
      emails: { current: number; limit: number };
      aiCredits: { current: number; limit: number };
      teamMembers: { current: number; limit: number };
      automations: { current: number; limit: number };
    };
  } | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  // Security State
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);

  // API Keys State
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [createKeyModalOpen, setCreateKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyGenerated, setNewKeyGenerated] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);

  // Initial Load
  useEffect(() => {
    fetchWorkspace();
    fetchUsage();
    fetchKeys();
  }, []);

  const fetchWorkspace = async () => {
    try {
      const res = await fetch('/api/v1/workspace');
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (data) {
          setWorkspaceName(data.name || '');
          setWorkspaceDomain(data.domain || '');
          if (data.settings?.timezone) setTimezone(data.settings.timezone);
          if (data.settings?.sessionTimeoutMinutes) {
            setSessionTimeout(String(data.settings.sessionTimeoutMinutes));
          }
          if (data.settings?.twoFactorRequired) {
            setTwoFactorEnabled(Boolean(data.settings.twoFactorRequired));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load workspace settings:', err);
    }
  };

  const fetchUsage = async () => {
    setLoadingUsage(true);
    try {
      const res = await fetch('/api/v1/workspace/usage');
      if (res.ok) {
        const json = await res.json();
        setPlanData(json.data);
      }
    } catch (err) {
      console.error('Failed to load usage:', err);
    } finally {
      setLoadingUsage(false);
    }
  };

  const fetchKeys = async () => {
    setLoadingKeys(true);
    try {
      const res = await fetch('/api/v1/keys');
      if (res.ok) {
        const json = await res.json();
        setApiKeys(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load keys:', err);
    } finally {
      setLoadingKeys(false);
    }
  };

  const handleSaveGeneral = async () => {
    setIsSavingGeneral(true);
    setGeneralSuccess(null);
    setGeneralError(null);
    try {
      const res = await fetch('/api/v1/workspace', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workspaceName.trim(),
          domain: workspaceDomain.trim() || null,
          timezone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Failed to update settings');
      }
      setGeneralSuccess('Workspace profile successfully updated.');
    } catch (err: any) {
      setGeneralError(err.message || 'Error updating workspace profile.');
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const handleSaveSecurity = async (newTimeout?: string, new2fa?: boolean) => {
    setIsSavingSecurity(true);
    setSecuritySuccess(null);
    const timeoutToSave = newTimeout !== undefined ? newTimeout : sessionTimeout;
    const twoFactorToSave = new2fa !== undefined ? new2fa : twoFactorEnabled;

    try {
      const res = await fetch('/api/v1/workspace', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            sessionTimeoutMinutes: Number(timeoutToSave),
            twoFactorRequired: twoFactorToSave,
          },
        }),
      });
      if (res.ok) {
        setSecuritySuccess('Security policies saved.');
      }
    } catch (err) {
      console.error('Failed to update security settings:', err);
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      setKeyError('Please provide a descriptive name for the API key.');
      return;
    }
    setIsGeneratingKey(true);
    setKeyError(null);
    try {
      const res = await fetch('/api/v1/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName.trim(),
          permissions: ['read', 'write'],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Failed to generate key');
      }
      setNewKeyGenerated(data.data.rawKey);
      fetchKeys();
    } catch (err: any) {
      setKeyError(err.message || 'Failed to generate API key.');
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? Systems using it will immediately lose access.')) {
      return;
    }
    try {
      const res = await fetch(`/api/v1/keys/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setApiKeys(apiKeys.filter((k) => k.id !== id));
      }
    } catch (err) {
      console.error('Failed to revoke key:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
          <Settings className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
          Workspace Settings
        </h1>
        <p className="text-xs text-slate-300 light:text-[#4a5053] mt-0.5">
          Manage your organization profile, multi-tenant security policies, and API keys.
        </p>
      </div>

      <div className="flex gap-1 border-b border-white/10 light:border-black/10 overflow-x-auto text-xs font-semibold no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#38b6ff] text-[#38b6ff] light:border-[#0284c7] light:text-[#0284c7] font-bold'
                  : 'border-transparent text-slate-400 light:text-[#787e82] hover:text-white light:hover:text-[#121212]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <h3 className="font-bold text-white light:text-[#121212] text-base">General Information</h3>

          {generalSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 light:text-emerald-700 text-xs flex items-center gap-2 max-w-md">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {generalSuccess}
            </div>
          )}

          {generalError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 max-w-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {generalError}
            </div>
          )}

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-[#4a5053] mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="e.g. SignalFlow Growth Team"
                className="w-full px-3.5 py-2 border border-white/10 light:border-black/10 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-white light:text-[#121212] text-xs focus:outline-none focus:border-[#38b6ff]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-[#4a5053] mb-1.5">
                Primary Company Domain
              </label>
              <input
                type="text"
                value={workspaceDomain}
                onChange={(e) => setWorkspaceDomain(e.target.value)}
                placeholder="e.g. signalflow.io"
                className="w-full px-3.5 py-2 border border-white/10 light:border-black/10 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-white light:text-[#121212] text-xs focus:outline-none focus:border-[#38b6ff]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-[#4a5053] mb-1.5">
                Default Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2 border border-white/10 light:border-black/10 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-white light:text-[#121212] text-xs focus:outline-none focus:border-[#38b6ff]"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="America/Chicago">Central Time (US & Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                <option value="Europe/London">London / GMT</option>
                <option value="Europe/Berlin">Central European Time (Berlin, Paris)</option>
                <option value="Asia/Tokyo">Tokyo / JST</option>
              </select>
            </div>
          </div>
          <div className="pt-2">
            <Button variant="pill" size="sm" onClick={handleSaveGeneral} disabled={isSavingGeneral}>
              {isSavingGeneral ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white light:text-[#121212] text-base">Billing & Plan Quotas</h3>
              <p className="text-xs text-slate-400 light:text-[#787e82] mt-0.5">
                Real-time usage meters backed by atomic transactional quota verification.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#38b6ff]/15 border border-[#38b6ff]/30 text-[#38b6ff] light:text-[#0284c7] font-mono text-xs font-bold uppercase self-start">
              Tier: {planData?.plan || 'STARTER'}
            </div>
          </div>

          {loadingUsage ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading plan telemetry...</div>
          ) : planData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Leads */}
              <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white light:text-[#121212]">Prioritized Leads</span>
                  <span className="font-mono text-slate-300 light:text-[#4a5053]">
                    {planData.usage.leads.current.toLocaleString()} / {planData.usage.leads.limit.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 light:bg-black/10 overflow-hidden">
                  <div
                    className="h-full bg-[#38b6ff] rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (planData.usage.leads.current / planData.usage.leads.limit) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Emails */}
              <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white light:text-[#121212]">Monthly Outbound Emails</span>
                  <span className="font-mono text-slate-300 light:text-[#4a5053]">
                    {planData.usage.emails.current.toLocaleString()} / {planData.usage.emails.limit.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 light:bg-black/10 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (planData.usage.emails.current / planData.usage.emails.limit) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* AI Credits */}
              <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white light:text-[#121212]">AI Copilot Credits</span>
                  <span className="font-mono text-slate-300 light:text-[#4a5053]">
                    {planData.usage.aiCredits.current.toLocaleString()} / {planData.usage.aiCredits.limit.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 light:bg-black/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (planData.usage.aiCredits.current / planData.usage.aiCredits.limit) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Team Members */}
              <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white light:text-[#121212]">Team Seats</span>
                  <span className="font-mono text-slate-300 light:text-[#4a5053]">
                    {planData.usage.teamMembers.current} / {planData.usage.teamMembers.limit}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 light:bg-black/10 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (planData.usage.teamMembers.current / planData.usage.teamMembers.limit) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <h3 className="font-bold text-white light:text-[#121212] text-base">Security Policies</h3>

          {securitySuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 light:text-emerald-700 text-xs flex items-center gap-2 max-w-xl">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {securitySuccess}
            </div>
          )}

          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
              <div>
                <div className="text-xs font-bold text-white light:text-[#121212]">Two-Factor Authentication</div>
                <div className="text-[11px] text-slate-400 light:text-[#787e82]">
                  Enforce hardware or app authenticator TOTP for all team members.
                </div>
              </div>
              <Button
                variant={twoFactorEnabled ? 'pill' : 'outline'}
                size="sm"
                onClick={() => {
                  const updated = !twoFactorEnabled;
                  setTwoFactorEnabled(updated);
                  handleSaveSecurity(undefined, updated);
                }}
              >
                {twoFactorEnabled ? 'Enabled' : 'Enable'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
              <div>
                <div className="text-xs font-bold text-white light:text-[#121212]">Session Inactivity Timeout</div>
                <div className="text-[11px] text-slate-400 light:text-[#787e82]">
                  Automatically invalidate tokens after idle period.
                </div>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => {
                  setSessionTimeout(e.target.value);
                  handleSaveSecurity(e.target.value, undefined);
                }}
                className="px-3 py-1.5 text-xs border border-white/10 light:border-black/10 rounded-xl bg-[#1e2224] light:bg-[#ffffff] text-white light:text-[#121212] focus:outline-none"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="240">4 hours</option>
                <option value="1440">24 hours</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white light:text-[#121212] text-base">Workspace API Keys</h3>
              <p className="text-xs text-slate-300 light:text-[#4a5053] mt-0.5">
                Cryptographically hashed SHA-256 API keys for programmatic telemetry ingestion and webhooks.
              </p>
            </div>
            <Button
              variant="pill"
              size="sm"
              onClick={() => {
                setKeyError(null);
                setNewKeyGenerated(null);
                setNewKeyName('');
                setCreateKeyModalOpen(true);
              }}
              className="gap-1.5 shadow-md self-start"
            >
              <Plus className="h-3.5 w-3.5" /> Generate New Key
            </Button>
          </div>

          {loadingKeys ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading API keys...</div>
          ) : apiKeys.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 light:border-black/10 bg-[#252a2b]/40 text-xs text-slate-400">
              No API keys generated yet. Click "Generate New Key" to create credentials for external SDKs or ingestion scripts.
            </div>
          ) : (
            <div className="space-y-3 max-w-2xl">
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  className="p-4 bg-[#252a2b] light:bg-[#f0f2f3] rounded-2xl border border-white/10 light:border-black/10 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-semibold text-white light:text-[#121212] text-xs">{k.name}</div>
                    <div className="text-xs font-mono font-bold text-[#38b6ff] light:text-[#0284c7] mt-0.5">
                      {k.maskedKey}
                    </div>
                    <div className="text-[10px] text-slate-400 light:text-[#787e82] mt-1 font-mono">
                      Created: {new Date(k.createdAt).toLocaleDateString()}
                      {k.lastUsedAt && ` • Last used: ${new Date(k.lastUsedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeKey(k.id)}
                    className="text-rose-500 hover:text-rose-400 text-xs gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Revoke
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Create Key Modal */}
      <Modal
        isOpen={createKeyModalOpen}
        onClose={() => setCreateKeyModalOpen(false)}
        title={newKeyGenerated ? "API Key Generated" : "Generate API Key"}
        maxWidth="md"
      >
        {newKeyGenerated ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs leading-relaxed">
              ⚠️ <strong>Save this secret key immediately.</strong> For security, this plaintext key cannot be retrieved or displayed again after closing this window.
            </div>

            <div className="p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-[#38b6ff] light:text-[#0284c7] truncate select-all">
                {newKeyGenerated}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(newKeyGenerated);
                  setCopiedKey(true);
                  setTimeout(() => setCopiedKey(false), 2000);
                }}
                className="shrink-0 text-xs"
              >
                {copiedKey ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="pill" size="sm" onClick={() => setCreateKeyModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {keyError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {keyError}
              </div>
            )}

            <Input
              label="Key Description"
              placeholder="e.g. Website Telemetry Script, CI Pipeline"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />

            <div className="text-[11px] text-slate-400">
              Keys are created with standard read/write permissions for signal ingestion and lead management.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setCreateKeyModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="pill" size="sm" onClick={handleGenerateKey} disabled={isGeneratingKey}>
                {isGeneratingKey ? "Generating..." : "Generate Key"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
