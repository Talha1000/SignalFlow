import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LeadDetailClient } from "@/components/leads/LeadDetailClient";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      company: {
        include: {
          contacts: true,
        },
      },
      contact: true,
      owner: true,
      leadScore: true,
      scoreEvents: {
        orderBy: { createdAt: "desc" },
      },
      activities: {
        orderBy: { createdAt: "desc" },
      },
      enrollments: {
        include: {
          sequence: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!lead) {
    notFound();
  }

  // Fetch available sequences for enrollment modal
  const sequences = await prisma.sequence.findMany({
    where: { workspaceId: lead.workspaceId },
  });

  // Fetch team members for assignment
  const teamMembers = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });

  return (
    <LeadDetailClient
      lead={lead as any}
      availableSequences={sequences as any}
      teamMembers={teamMembers}
    />
  );
}
