'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'billing', label: 'Billing' },
  { id: 'security', label: 'Security' },
  { id: 'api', label: 'API Keys' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your workspace configuration.
        </p>
      </div>

      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Workspace Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workspace Name</label>
              <input
                type="text"
                defaultValue="SignalFlow Demo"
                className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
              <select className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
                <option>UTC</option>
                <option>America/New_York</option>
                <option>America/Chicago</option>
                <option>America/Los_Angeles</option>
                <option>Europe/London</option>
                <option>Asia/Tokyo</option>
              </select>
            </div>
          </div>
          <Button variant="primary" size="sm">Save Changes</Button>
        </Card>
      )}

      {activeTab === 'billing' && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Billing &amp; Subscription</h3>
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
            <div>
              <div className="font-medium text-green-800 dark:text-green-300">Free Plan — Active</div>
              <div className="text-sm text-green-600 dark:text-green-400">You&apos;re on the free tier. All features included in demo mode.</div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Security Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security.</div>
              </div>
              <Button variant="secondary" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Session Timeout</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Auto-logout after inactivity.</div>
              </div>
              <select className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
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
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">API Keys</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage API keys for external integrations and webhook endpoints.
          </p>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-mono text-gray-700 dark:text-gray-300">sf_live_••••••••••••k4xm</div>
                <div className="text-xs text-gray-400 mt-1">Created Sep 20, 2026</div>
              </div>
              <Button variant="ghost" size="sm">Revoke</Button>
            </div>
          </div>
          <Button variant="secondary" size="sm">Generate New Key</Button>
        </Card>
      )}
    </div>
  );
}
