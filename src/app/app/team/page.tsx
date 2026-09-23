'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const members = [
  { name: 'Alex Morgan', email: 'alex.morgan@signalflow.io', role: 'Owner', avatar: 'AM', status: 'active' },
  { name: 'Sarah Connor', email: 'sarah.connor@signalflow.io', role: 'Admin', avatar: 'SC', status: 'active' },
  { name: 'Liam Vance', email: 'liam.vance@signalflow.io', role: 'Manager', avatar: 'LV', status: 'active' },
  { name: 'Maya Patel', email: 'maya.patel@signalflow.io', role: 'Member', avatar: 'MP', status: 'active' },
];

const roleColors: Record<string, string> = {
  Owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Manager: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Member: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your workspace members and their roles.
          </p>
        </div>
        <Button variant="primary" size="sm">
          Invite Member
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Member</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Role</th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {members.map((member) => (
                <tr key={member.email} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-medium text-indigo-700 dark:text-indigo-300">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{member.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleColors[member.role]}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
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
