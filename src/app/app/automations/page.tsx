import React from "react";
import { getSession } from "@/lib/auth/session";
import { getAutomationsSafe } from "@/lib/mockData";
import { AutomationBuilderClient } from "@/components/automations/AutomationBuilderClient";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const session = await getSession();
  const automations = await getAutomationsSafe(session?.workspaceId);
  return <AutomationBuilderClient initialAutomations={automations as any} />;
}

