import React from "react";
import { getLeadsSafe } from "@/lib/mockData";
import { PipelineKanbanClient } from "@/components/pipeline/PipelineKanbanClient";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const leads = await getLeadsSafe();
  return <PipelineKanbanClient initialLeads={leads as any} />;
}
