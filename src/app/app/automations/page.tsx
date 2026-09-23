import React from "react";
import { prisma } from "@/lib/prisma";
import { Layers } from "lucide-react";
import { AutomationBuilderClient } from "@/components/automations/AutomationBuilderClient";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const automations = await prisma.automation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      executions: {
        take: 5,
        orderBy: { triggeredAt: "desc" },
      },
    },
  });

  return <AutomationBuilderClient initialAutomations={automations as any} />;
}
