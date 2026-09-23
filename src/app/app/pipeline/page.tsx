import React from "react";
import { prisma } from "@/lib/prisma";
import { PipelineKanbanClient } from "@/components/pipeline/PipelineKanbanClient";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const leads = await prisma.lead.findMany({
    include: {
      company: true,
      contact: true,
      owner: true,
    },
    orderBy: { score: "desc" },
  });

  return <PipelineKanbanClient initialLeads={leads as any} />;
}
