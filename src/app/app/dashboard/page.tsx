import React from "react";
import { getSession } from "@/lib/auth/session";
import { getLeadsSafe } from "@/lib/mockData";
import { DashboardClientView } from "@/components/dashboard/DashboardClientView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  const leads = await getLeadsSafe(session?.workspaceId);

  const now = Date.now();
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

  const hotCount = leads.filter((l: any) => (l.score ?? 0) >= 85).length;
  // Surging: either +15 points delta or high activity velocity
  const surgingCount = leads.filter((l: any) => {
    const delta = l.leadScore?.delta7d ?? 0;
    return delta >= 15 || ((l.score ?? 0) >= 70 && (l.score ?? 0) < 85);
  }).length;
  // Going cold: 14+ days since lastActivityAt
  const coolingCount = leads.filter((l: any) => {
    if (!l.lastActivityAt) return true;
    const diff = now - new Date(l.lastActivityAt).getTime();
    return diff >= fourteenDaysMs;
  }).length;
  const followUpsDue = leads.filter((l: any) => Boolean(l.nextAction)).length;
  const totalPipeline = leads.reduce((sum: number, l: any) => sum + (l.dealValue ?? 0), 0);

  const userName = session?.name || session?.email?.split("@")[0] || "there";

  return (
    <DashboardClientView
      leads={leads as any}
      userName={userName}
      metrics={{
        hotCount,
        surgingCount,
        followUpsDue,
        coolingCount,
        pipelineValue: totalPipeline,
      }}
    />
  );
}

