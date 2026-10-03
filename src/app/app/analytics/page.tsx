import React from "react";
import { getLeadsSafe } from "@/lib/mockData";
import { AnalyticsClientView } from "@/components/analytics/AnalyticsClientView";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const leads = await getLeadsSafe();
  return <AnalyticsClientView leads={leads as any} />;
}
