import React from "react";
import { notFound } from "next/navigation";
import { getLeadByIdSafe, getSequencesSafe, MOCK_OWNERS } from "@/lib/mockData";
import { LeadDetailClient } from "@/components/leads/LeadDetailClient";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLeadByIdSafe(id);

  if (!lead) {
    notFound();
  }

  const sequences = await getSequencesSafe();
  const teamMembers = MOCK_OWNERS.map((o) => ({
    id: o.id,
    name: o.name,
    email: o.email,
  }));

  return (
    <LeadDetailClient
      lead={lead as any}
      availableSequences={sequences as any}
      teamMembers={teamMembers}
    />
  );
}
