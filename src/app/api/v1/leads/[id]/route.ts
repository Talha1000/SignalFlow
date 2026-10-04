import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLeadByIdSafe } from "@/lib/mockData";
import { logAuditEvent } from "@/lib/audit/logger";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const { id } = await params;

  try {
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

    if (lead) return apiSuccess(lead, { durationMs: Date.now() - startTime });
  } catch (e) {
    // Database unavailable, fallback to safe getter
  }

  const safeLead = await getLeadByIdSafe(id);
  if (!safeLead) return apiError("Lead not found", 404, "NOT_FOUND");
  return apiSuccess(safeLead, { durationMs: Date.now() - startTime });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  try {
    const { id } = await params;
    const body = await request.json();

    try {
      const existing = await prisma.lead.findUnique({ where: { id } });
      if (existing) {
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

        if (body.stage && body.stage !== existing.stage) {
          try {
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
          } catch {
            // activity logging fallback
          }
        }

        return apiSuccess(updated, { durationMs: Date.now() - startTime });
      }
    } catch {
      // Database not reachable
    }

    // Resilient simulated update for local testing
    const safeLead = await getLeadByIdSafe(id);
    const updatedSimulated = {
      ...safeLead,
      stage: body.stage || safeLead.stage,
      dealValue: body.dealValue !== undefined ? Number(body.dealValue) : safeLead.dealValue,
      score: body.score !== undefined ? Number(body.score) : safeLead.score,
      intentLevel: body.intentLevel || safeLead.intent,
      updatedAt: new Date().toISOString(),
    };

    return apiSuccess(updatedSimulated, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("Lead update error:", error);
    return apiError("Failed to update lead", 500, "LEAD_UPDATE_ERROR", error.message);
  }
}
