import React from "react";
import { getLeadsSafe } from "@/lib/mockData";
import { DashboardClientView } from "@/components/dashboard/DashboardClientView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const leads = await getLeadsSafe();

  const hotCount = leads.filter((l: any) => (l.score ?? 0) >= 85).length;
  const surgingCount = leads.filter((l: any) => (l.score ?? 0) >= 70 && (l.score ?? 0) < 85).length;
  const coolingCount = leads.filter((l: any) => (l.score ?? 0) < 40).length;
  const followUpsDue = 23;
  const totalPipeline = leads.reduce((sum: number, l: any) => sum + (l.dealValue ?? 0), 0);

  return (
    <DashboardClientView
      leads={leads as any}
      metrics={{
        hotCount: hotCount || 8,
        surgingCount: surgingCount || 14,
        followUpsDue,
        coolingCount: coolingCount || 6,
        pipelineValue: totalPipeline || 540000,
      }}
    />
  );
}
