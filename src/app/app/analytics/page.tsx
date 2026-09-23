import React from "react";
import { prisma } from "@/lib/prisma";
import { AnalyticsClientView } from "@/components/analytics/AnalyticsClientView";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const leads = await prisma.lead.findMany({
    select: {
      score: true,
      stage: true,
      dealValue: true,
      source: true,
      createdAt: true,
      owner: { select: { name: true } },
    },
  });

  return <AnalyticsClientView leads={leads as any} />;
}
