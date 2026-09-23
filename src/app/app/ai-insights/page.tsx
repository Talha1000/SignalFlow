'use client';

import { Card } from '@/components/ui/Card';

export default function AIInsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          AI-powered analysis and recommendations for your pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Hot Leads</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            3 leads show buying signals this week. Focus outreach on TechCorp and Acme Inc.
          </p>
          <div className="mt-4 text-xs text-purple-600 dark:text-purple-400 font-medium">
            Based on engagement patterns
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Pipeline Velocity</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Average deal cycle is 18 days. Deals with demos close 2.3x faster.
          </p>
          <div className="mt-4 text-xs text-blue-600 dark:text-blue-400 font-medium">
            Based on closed deals last 90 days
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">At-Risk Deals</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            2 deals haven&apos;t been touched in 7+ days. Consider a follow-up sequence.
          </p>
          <div className="mt-4 text-xs text-amber-600 dark:text-amber-400 font-medium">
            Based on activity staleness
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Weekly Summary</h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">●</span>
            <span>Lead conversion rate improved by 12% compared to last week.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>Email open rates are highest on Tuesday mornings — schedule sends accordingly.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">●</span>
            <span>Consider adding a &quot;Book a Demo&quot; CTA — top-performing competitors all use one.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">●</span>
            <span>3 contacts from Acme Inc visited your pricing page in the last 48 hours.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
