'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Share2 } from 'lucide-react';

const integrations = [
  { name: 'Salesforce', category: 'CRM', status: 'available', icon: '☁️', description: 'Sync leads, contacts, and deals bidirectionally.' },
  { name: 'HubSpot', category: 'CRM', status: 'available', icon: '🟠', description: 'Import contacts and sync deal stages.' },
  { name: 'Slack', category: 'Communication', status: 'available', icon: '💬', description: 'Get real-time notifications for hot leads and deal updates.' },
  { name: 'Gmail', category: 'Email', status: 'available', icon: '📧', description: 'Track email opens, replies, and auto-log conversations.' },
  { name: 'Outlook', category: 'Email', status: 'available', icon: '📨', description: 'Connect Microsoft 365 mailboxes for email tracking.' },
  { name: 'Zapier', category: 'Automation', status: 'available', icon: '⚡', description: 'Connect 5000+ apps with no-code workflows.' },
  { name: 'Stripe', category: 'Billing', status: 'coming_soon', icon: '💳', description: 'Track revenue and subscription status per deal.' },
  { name: 'Calendly', category: 'Scheduling', status: 'coming_soon', icon: '📅', description: 'Auto-detect when leads book meetings.' },
  { name: 'LinkedIn', category: 'Social', status: 'coming_soon', icon: '🔗', description: 'Enrich contacts with LinkedIn profile data.' },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
          <Share2 className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
          Integrations Hub
        </h1>
        <p className="text-xs text-slate-300 light:text-[#4a5053] mt-0.5">
          Connect SignalFlow with your CRM, notification channels, and automation stack.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-center text-xl shrink-0">
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white light:text-[#121212] text-sm">{integration.name}</h3>
                    <span className="text-[11px] text-slate-400 light:text-[#787e82]">{integration.category}</span>
                  </div>
                </div>
                {integration.status === 'coming_soon' ? (
                  <Badge variant="outline" className="text-[10px]">Coming Soon</Badge>
                ) : (
                  <Badge variant="cyan" className="text-[10px]">Connected</Badge>
                )}
              </div>
              <p className="text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">{integration.description}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 light:border-black/10">
              <Button
                variant={integration.status === 'coming_soon' ? 'outline' : 'pill'}
                size="sm"
                className="w-full justify-center"
                disabled={integration.status === 'coming_soon'}
              >
                {integration.status === 'coming_soon' ? 'Notify Me' : 'Configure Sync'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
