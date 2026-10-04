import React from "react";
import { getSession } from "@/lib/auth/session";
import { getLeadsSafe } from "@/lib/mockData";
import { DashboardClientView } from "@/components/dashboard/DashboardClientView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  const leads = await getLeadsSafe(session?.workspaceId);

  const hotCount = leads.filter((l: any) => (l.score ?? 0) >= 85).length;
  const surgingCount = leads.filter((l: any) => (l.score ?? 0) >= 70 && (l.score ?? 0) < 85).length;
  const coolingCount = leads.filter((l: any) => (l.score ?? 0) < 40).length;
  const followUpsDue = leads.filter((l: any) => l.nextAction).length;
  const totalPipeline = leads.reduce((sum: number, l: any) => sum + (l.dealValue ?? 0), 0);

  return (
    <DashboardClientView
      leads={leads as any}
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

