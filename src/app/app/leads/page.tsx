import React from "react";
import { getSession } from "@/lib/auth/session";
import { getLeadsSafe } from "@/lib/mockData";
import { LeadsListClient } from "@/components/leads/LeadsListClient";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const session = await getSession();
  const rawLeads = await getLeadsSafe(session?.workspaceId);

  // Clean serialization to ensure no RSC date/prototype mismatches
  const safeLeads = JSON.parse(JSON.stringify(rawLeads || []));

  return <LeadsListClient initialLeads={safeLeads} />;
}
