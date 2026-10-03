import React from "react";
import { getAutomationsSafe } from "@/lib/mockData";
import { AutomationBuilderClient } from "@/components/automations/AutomationBuilderClient";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const automations = await getAutomationsSafe();
  return <AutomationBuilderClient initialAutomations={automations as any} />;
}
