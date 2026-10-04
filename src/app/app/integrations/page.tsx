'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Share2, CheckCircle2, AlertCircle, Plus, Trash2, ExternalLink } from 'lucide-react';

interface WebhookItem {
  id: string;
  name: string;
  url: string;
  active: boolean;
  createdAt: string;
}

export default function IntegrationsPage() {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [loadingWebhooks, setLoadingWebhooks] = useState(false);

  // Modal states
  const [slackModalOpen, setSlackModalOpen] = useState(false);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('');
  const [slackSaving, setSlackSaving] = useState(false);
  const [slackError, setSlackError] = useState<string | null>(null);
  const [slackSuccess, setSlackSuccess] = useState<string | null>(null);

  const [webhookModalOpen, setWebhookModalOpen] = useState(false);
  const [customWhName, setCustomWhName] = useState('');
  const [customWhUrl, setCustomWhUrl] = useState('');
  const [whSaving, setWhSaving] = useState(false);
  const [whError, setWhError] = useState<string | null>(null);

  const [oauthModalOpen, setOauthModalOpen] = useState(false);
  const [selectedOauthService, setSelectedOauthService] = useState<{
    name: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setLoadingWebhooks(true);
    try {
      const res = await fetch('/api/v1/webhooks');
      if (res.ok) {
        const json = await res.json();
        setWebhooks(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load webhooks:', err);
    } finally {
      setLoadingWebhooks(false);
    }
  };

  const handleSaveSlackWebhook = async () => {
    if (!slackWebhookUrl.trim()) {
      setSlackError('Please enter your Slack incoming webhook URL.');
      return;
    }
    setSlackSaving(true);
    setSlackError(null);
    setSlackSuccess(null);
    try {
      const res = await fetch('/api/v1/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Slack Alerts Channel',
          url: slackWebhookUrl.trim(),
          eventTypes: ['lead.created', 'lead.score_changed'],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Failed to configure Slack webhook');
      }
      setSlackSuccess('Slack notifications configured successfully!');
      fetchWebhooks();
      setTimeout(() => {
        setSlackModalOpen(false);
        setSlackWebhookUrl('');
      }, 1500);
    } catch (err: any) {
      setSlackError(err.message || 'Error configuring Slack webhook');
    } finally {
      setSlackSaving(false);
    }
  };

  const handleSaveCustomWebhook = async () => {
    if (!customWhName.trim() || !customWhUrl.trim()) {
      setWhError('Both name and HTTPS URL are required.');
      return;
    }
    setWhSaving(true);
    setWhError(null);
    try {
      const res = await fetch('/api/v1/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customWhName.trim(),
          url: customWhUrl.trim(),
          eventTypes: ['lead.created', 'lead.score_changed'],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Failed to create webhook');
      }
      setWebhookModalOpen(false);
      setCustomWhName('');
      setCustomWhUrl('');
      fetchWebhooks();
    } catch (err: any) {
      setWhError(err.message || 'Failed to create webhook');
    } finally {
      setWhSaving(false);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/webhooks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWebhooks(webhooks.filter((w) => w.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete webhook:', err);
    }
  };

  const hasSlack = webhooks.some((w) => w.name.toLowerCase().includes('slack') || w.url.includes('slack.com'));

  const integrations = [
    {
      name: 'Custom Webhooks',
      category: 'Developer & API',
      status: webhooks.length > 0 ? 'configured' : 'available',
      badgeText: webhooks.length > 0 ? `${webhooks.length} Active` : 'Available',
      icon: '⚡',
      description: 'Receive real-time signed HTTPS JSON payloads when leads are scored or created.',
      actionText: 'Manage Webhooks',
      onAction: () => setWebhookModalOpen(true),
    },
    {
      name: 'Slack',
      category: 'Communication',
      status: hasSlack ? 'configured' : 'available',
      badgeText: hasSlack ? 'Configured' : 'Available',
      icon: '💬',
      description: 'Get instant notifications in your sales channel when hot leads surge in intent.',
      actionText: hasSlack ? 'Update Channel' : 'Connect Slack',
      onAction: () => {
        setSlackError(null);
        setSlackSuccess(null);
        setSlackModalOpen(true);
      },
    },
    {
      name: 'Salesforce',
      category: 'CRM',
      status: 'available',
      badgeText: 'Available',
      icon: '☁️',
      description: 'Sync high-intent accounts, contacts, and opportunities bidirectionally.',
      actionText: 'Connect CRM',
      onAction: () => {
        setSelectedOauthService({
          name: 'Salesforce',
          description:
            'To connect Salesforce, enter your Connected App Client ID and Secret in your enterprise deployment environment, or contact support for sandbox OAuth pairing.',
        });
        setOauthModalOpen(true);
      },
    },
    {
      name: 'HubSpot',
      category: 'CRM',
      status: 'available',
      badgeText: 'Available',
      icon: '🟠',
      description: 'Import contacts and synchronize behavioral intent scores with HubSpot properties.',
      actionText: 'Connect HubSpot',
      onAction: () => {
        setSelectedOauthService({
          name: 'HubSpot',
          description:
            'HubSpot integration uses OAuth 2.0 or private app tokens. Configure your HUBSPOT_ACCESS_TOKEN in the environment settings to enable live contact synchronization.',
        });
        setOauthModalOpen(true);
      },
    },
    {
      name: 'Gmail & Google Workspace',
      category: 'Email',
      status: 'available',
      badgeText: 'Available',
      icon: '📧',
      description: 'Track email opens, replies, and synchronize thread history directly to lead timelines.',
      actionText: 'Configure Mailbox',
      onAction: () => {
        setSelectedOauthService({
          name: 'Google Workspace',
          description:
            'Direct mailbox tracking requires Google Workspace OAuth consent. Outbound cadence delivery can also be configured via Resend SMTP credentials in your workspace environment.',
        });
        setOauthModalOpen(true);
      },
    },
    {
      name: 'Microsoft Outlook 365',
      category: 'Email',
      status: 'available',
      badgeText: 'Available',
      icon: '📨',
      description: 'Connect Microsoft 365 enterprise mailboxes for automatic conversation logging.',
      actionText: 'Configure Outlook',
      onAction: () => {
        setSelectedOauthService({
          name: 'Microsoft 365',
          description:
            'Requires Azure Active Directory App Registration with Mail.ReadWrite permissions. Contact your IT administrator to grant tenant consent.',
        });
        setOauthModalOpen(true);
      },
    },
    {
      name: 'Zapier',
      category: 'Automation',
      status: 'available',
      badgeText: 'Available',
      icon: '🔌',
      description: 'Connect 5000+ business applications using SignalFlow REST API Keys and Webhooks.',
      actionText: 'View Zapier Guide',
      onAction: () => {
        setSelectedOauthService({
          name: 'Zapier & Make.com',
          description:
            'Use your Workspace API Key (generated in Settings > API Keys) and configure custom Webhook triggers to connect SignalFlow with Zapier, Make, or n8n.',
        });
        setOauthModalOpen(true);
      },
    },
    {
      name: 'Stripe',
      category: 'Billing',
      status: 'coming_soon',
      badgeText: 'Coming Soon',
      icon: '💳',
      description: 'Track revenue, ARR expansion, and subscription status per customer deal.',
      actionText: 'Notify Me',
      onAction: () => {},
    },
    {
      name: 'Calendly',
      category: 'Scheduling',
      status: 'coming_soon',
      badgeText: 'Coming Soon',
      icon: '📅',
      description: 'Auto-detect when high-intent leads schedule executive walkthroughs.',
      actionText: 'Notify Me',
      onAction: () => {},
    },
  ];

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
                {integration.status === 'configured' ? (
                  <Badge variant="cyan" className="text-[10px]">
                    {integration.badgeText}
                  </Badge>
                ) : integration.status === 'coming_soon' ? (
                  <Badge variant="outline" className="text-[10px]">
                    Coming Soon
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-[10px]">
                    Available
                  </Badge>
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
                onClick={integration.onAction}
              >
                {integration.actionText}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Slack Integration Modal */}
      <Modal isOpen={slackModalOpen} onClose={() => setSlackModalOpen(false)} title="Configure Slack Integration">
        <div className="space-y-4">
          <p className="text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">
            Enter an Incoming Webhook URL from your Slack Workspace to receive real-time alerts when leads reach HOT intent (score &ge; 85).
          </p>

          {slackSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {slackSuccess}
            </div>
          )}

          {slackError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {slackError}
            </div>
          )}

          <Input
            label="Slack Webhook URL"
            placeholder="https://hooks.slack.com/services/T00/B00/XXXXX"
            value={slackWebhookUrl}
            onChange={(e) => setSlackWebhookUrl(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setSlackModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="pill" size="sm" onClick={handleSaveSlackWebhook} disabled={slackSaving}>
              {slackSaving ? 'Validating & Saving...' : 'Save Slack Webhook'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Custom Webhooks Management Modal */}
      <Modal
        isOpen={webhookModalOpen}
        onClose={() => setWebhookModalOpen(false)}
        title="Custom HTTPS Webhooks"
        maxWidth="xl"
      >
        <div className="space-y-5">
          <p className="text-xs text-slate-300 light:text-[#4a5053]">
            Configure outbound webhooks to stream live lead and score change events into your internal data pipelines.
          </p>

          {/* New Webhook Form */}
          <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-3">
            <h4 className="text-xs font-bold text-white light:text-[#121212] uppercase font-mono">
              Register New Webhook
            </h4>
            {whError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {whError}
              </div>
            )}
            <Input
              label="Endpoint Label"
              placeholder="e.g. Analytics Ingestion Lambda"
              value={customWhName}
              onChange={(e) => setCustomWhName(e.target.value)}
            />
            <Input
              label="HTTPS Target URL"
              placeholder="https://api.yourdomain.com/v1/webhook"
              value={customWhUrl}
              onChange={(e) => setCustomWhUrl(e.target.value)}
            />
            <Button variant="pill" size="sm" onClick={handleSaveCustomWebhook} disabled={whSaving} className="w-full">
              {whSaving ? 'Verifying SSRF & Registering...' : 'Add Webhook'}
            </Button>
          </div>

          {/* Active Webhooks List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white light:text-[#121212] uppercase font-mono">
              Active Endpoints ({webhooks.length})
            </h4>
            {webhooks.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-white/10 rounded-xl">
                No custom webhooks registered.
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {webhooks.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white light:text-[#121212]">{w.name}</div>
                      <div className="text-[11px] font-mono text-slate-400 truncate max-w-sm">{w.url}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWebhook(w.id)}
                      className="text-rose-500 hover:text-rose-400 p-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* OAuth / Integration Guide Modal */}
      <Modal
        isOpen={oauthModalOpen}
        onClose={() => setOauthModalOpen(false)}
        title={selectedOauthService ? `Connect ${selectedOauthService.name}` : 'Integration Setup'}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">
            {selectedOauthService?.description}
          </p>
          <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 text-xs space-y-1.5 text-slate-300 light:text-[#4a5053]">
            <div className="font-bold text-white light:text-[#121212]">Next steps:</div>
            <div>1. Generate an API Key in <strong className="text-white">Settings &gt; API Keys</strong>.</div>
            <div>2. Point your integration or middleware to <code className="text-[#38b6ff] font-mono">/api/v1/signals</code>.</div>
            <div>3. Use registered Webhooks for downstream bidirectional synchronization.</div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="pill" size="sm" onClick={() => setOauthModalOpen(false)}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
