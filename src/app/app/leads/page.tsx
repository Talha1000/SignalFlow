import React from "react";
import { getLeadsSafe } from "@/lib/mockData";
import { LeadsListClient } from "@/components/leads/LeadsListClient";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getLeadsSafe();
  return <LeadsListClient initialLeads={leads as any} />;
}
