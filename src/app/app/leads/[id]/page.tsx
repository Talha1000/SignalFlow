import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { getLeadByIdSafe, getSequencesSafe, MOCK_OWNERS } from "@/lib/mockData";
import { LeadDetailClient } from "@/components/leads/LeadDetailClient";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const lead = await getLeadByIdSafe(id, session?.workspaceId);

  if (!lead) {
    notFound();
  }

  const sequences = await getSequencesSafe(session?.workspaceId);

  let teamMembers = MOCK_OWNERS.map((o) => ({
    id: o.id,
    name: o.name,
    email: o.email,
  }));

  if (session?.workspaceId) {
    try {
      const members = await prisma.workspaceMember.findMany({
        where: { workspaceId: session.workspaceId },
        include: { user: true },
      });
      if (members.length > 0) {
        teamMembers = members.map((m) => ({
          id: m.user.id,
          name: m.user.name,
          email: m.user.email,
        }));
      }
    } catch {
      // fallback
    }
  }

  return (
    <LeadDetailClient
      lead={lead as any}
      availableSequences={sequences as any}
      teamMembers={teamMembers}
    />
  );
}

