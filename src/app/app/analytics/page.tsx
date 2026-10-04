import React from "react";
import { getSession } from "@/lib/auth/session";
import { getLeadsSafe } from "@/lib/mockData";
import { AnalyticsClientView } from "@/components/analytics/AnalyticsClientView";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await getSession();
  const leads = await getLeadsSafe(session?.workspaceId);
  return <AnalyticsClientView leads={leads as any} />;
}

