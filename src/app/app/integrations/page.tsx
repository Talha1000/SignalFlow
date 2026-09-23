'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Connect SignalFlow with your favorite tools and services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.name} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{integration.name}</h3>
                    <span className="text-xs text-gray-400">{integration.category}</span>
                  </div>
                </div>
                {integration.status === 'coming_soon' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    Coming Soon
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{integration.description}</p>
            </div>
            <div className="mt-4">
              <Button
                variant={integration.status === 'coming_soon' ? 'ghost' : 'secondary'}
                size="sm"
                className="w-full"
                disabled={integration.status === 'coming_soon'}
              >
                {integration.status === 'coming_soon' ? 'Notify Me' : 'Connect'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
