import React from "react";
import { getSession } from "@/lib/auth/session";
import { getLeadsSafe } from "@/lib/mockData";
import { LeadsListClient } from "@/components/leads/LeadsListClient";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const session = await getSession();
  const leads = await getLeadsSafe(session?.workspaceId);
  return <LeadsListClient initialLeads={leads as any} />;
}

