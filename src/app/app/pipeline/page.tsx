import React from "react";
import { getSession } from "@/lib/auth/session";
import { getLeadsSafe } from "@/lib/mockData";
import { PipelineKanbanClient } from "@/components/pipeline/PipelineKanbanClient";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const session = await getSession();
  const leads = await getLeadsSafe(session?.workspaceId);
  return <PipelineKanbanClient initialLeads={leads as any} />;
}

