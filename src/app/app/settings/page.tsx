'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Settings, Shield, Key, CreditCard, Sliders, CheckCircle2 } from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: Sliders },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'api', label: 'API Keys', icon: Key },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

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

      {activeTab === 'general' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <h3 className="font-bold text-white light:text-[#121212] text-base">General Information</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-[#4a5053] mb-1.5">Workspace Name</label>
              <input
                type="text"
                defaultValue="SignalFlow Demo"
                className="w-full px-3.5 py-2 border border-white/10 light:border-black/10 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-white light:text-[#121212] text-xs focus:outline-none focus:border-[#38b6ff]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-[#4a5053] mb-1.5">Timezone</label>
              <select className="w-full px-3.5 py-2 border border-white/10 light:border-black/10 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] text-white light:text-[#121212] text-xs focus:outline-none focus:border-[#38b6ff]">
                <option>UTC</option>
                <option>America/New_York</option>
                <option>America/Chicago</option>
                <option>America/Los_Angeles</option>
                <option>Europe/London</option>
                <option>Asia/Tokyo</option>
              </select>
            </div>
          </div>
          <div className="pt-2">
            <Button variant="pill" size="sm">Save Changes</Button>
          </div>
        </Card>
      )}

      {activeTab === 'billing' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <h3 className="font-bold text-white light:text-[#121212] text-base">Billing &amp; Subscription</h3>
          <div className="flex items-center gap-3.5 p-4 bg-[#38b6ff]/10 border border-[#38b6ff]/20 rounded-2xl">
            <CheckCircle2 className="h-5 w-5 text-[#38b6ff] light:text-[#0284c7] shrink-0" />
            <div>
              <div className="font-bold text-white light:text-[#121212] text-sm">Growth Tier — Active Plan</div>
              <div className="text-xs text-slate-300 light:text-[#4a5053] mt-0.5">Your workspace includes 10,000 prioritized leads, sales copilot, and visual automation builder.</div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <h3 className="font-bold text-white light:text-[#121212] text-base">Security Policies</h3>
          <div className="space-y-3.5 max-w-xl">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
              <div>
                <div className="text-xs font-bold text-white light:text-[#121212]">Two-Factor Authentication</div>
                <div className="text-[11px] text-slate-400 light:text-[#787e82]">Enforce hardware or app authenticator TOTP for all team members.</div>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
              <div>
                <div className="text-xs font-bold text-white light:text-[#121212]">Session Inactivity Timeout</div>
                <div className="text-[11px] text-slate-400 light:text-[#787e82]">Automatically rotate credentials after idle period.</div>
              </div>
              <select className="px-3 py-1.5 text-xs border border-white/10 light:border-black/10 rounded-xl bg-[#1e2224] light:bg-[#ffffff] text-white light:text-[#121212] focus:outline-none">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
                <option>24 hours</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'api' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <h3 className="font-bold text-white light:text-[#121212] text-base">Workspace API Keys</h3>
          <p className="text-xs text-slate-300 light:text-[#4a5053]">
            Manage cryptographically hashed SHA-256 API keys for programmatic telemetry ingestion and webhooks.
          </p>
          <div className="p-4 bg-[#252a2b] light:bg-[#f0f2f3] rounded-2xl border border-white/10 light:border-black/10 max-w-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-[#38b6ff] light:text-[#0284c7]">sf_live_••••••••••••k4xm</div>
                <div className="text-[10px] text-slate-400 light:text-[#787e82] mt-1 font-mono">Permissions: [read, write] • Created Sep 20, 2026</div>
              </div>
              <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-400">Revoke</Button>
            </div>
          </div>
          <div>
            <Button variant="pill" size="sm">Generate New Key</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
