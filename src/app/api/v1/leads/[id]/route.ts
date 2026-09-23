import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit/logger";
import { ActivityType } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      company: true,
      contact: true,
      owner: true,
      leadScore: true,
      activities: true,
      scoreEvents: true,
    },
  });

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        stage: body.stage || undefined,
        ownerId: body.ownerId !== undefined ? body.ownerId : undefined,
        dealValue: body.dealValue !== undefined ? Number(body.dealValue) : undefined,
        nextAction: body.nextAction || undefined,
        score: body.score !== undefined ? Number(body.score) : undefined,
        intentLevel: body.intentLevel || undefined,
      },
    });

    // If stage changed, log an activity event
    if (body.stage && body.stage !== existing.stage) {
      await prisma.activity.create({
        data: {
          workspaceId: existing.workspaceId,
          leadId: existing.id,
          companyId: existing.companyId,
          contactId: existing.contactId,
          type: ActivityType.STAGE_CHANGE,
          title: `Stage updated to ${body.stage}`,
          description: `Lead stage transitioned from ${existing.stage} to ${body.stage}`,
        },
      });

      await logAuditEvent({
        workspaceId: existing.workspaceId,
        action: "LEAD_STAGE_CHANGED",
        entityType: "Lead",
        entityId: existing.id,
        details: { from: existing.stage, to: body.stage },
      });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Lead update error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
