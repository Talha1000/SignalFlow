import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { logAuditEvent } from "@/lib/audit/logger";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType, LeadStage } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (!PERMISSIONS.VIEW_LEADS(caller.role)) {
      return apiError("Insufficient permissions to view leads", 403, "FORBIDDEN");
    }

    const { id } = await params;

    // Strict multi-tenant query: MUST match both id AND caller's workspaceId
    const lead = await prisma.lead.findFirst({
      where: {
        id,
        workspaceId: caller.workspaceId,
        deletedAt: null,
      },
      include: {
        company: true,
        contact: true,
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        leadScore: true,
        activities: {
          orderBy: { createdAt: "desc" },
        },
        scoreEvents: {
          orderBy: { createdAt: "desc" },
        },
        enrollments: {
          include: { sequence: true },
        },
        tags: {
          include: { tag: true },
        },
      },
    });

    if (!lead) {
      return apiError("Lead not found", 404, "NOT_FOUND");
    }

    return apiSuccess(lead, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("GET /api/v1/leads/[id] error:", error);
    return apiError("Failed to fetch lead", 500, "LEAD_FETCH_ERROR", error.message);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (!PERMISSIONS.EDIT_LEAD(caller.role)) {
      return apiError("Insufficient permissions to update leads", 403, "FORBIDDEN");
    }

    const { id } = await params;
    const body = await request.json();

    // Verify existence strictly within caller's workspace
    const existing = await prisma.lead.findFirst({
      where: {
        id,
        workspaceId: caller.workspaceId,
        deletedAt: null,
      },
    });

    if (!existing) {
      return apiError("Lead not found", 404, "NOT_FOUND");
    }

    const updateData: any = {};
    if (body.stage) updateData.stage = body.stage as LeadStage;
    if (body.ownerId !== undefined) updateData.ownerId = body.ownerId || null;
    if (body.dealValue !== undefined) updateData.dealValue = Number(body.dealValue);
    if (body.nextAction !== undefined) updateData.nextAction = body.nextAction;
    if (body.nextActionDue !== undefined) updateData.nextActionDue = body.nextActionDue ? new Date(body.nextActionDue) : null;
    if (body.score !== undefined) updateData.score = Number(body.score);
    if (body.intentLevel) updateData.intentLevel = body.intentLevel;
    updateData.lastActivityAt = new Date();

    const updated = await prisma.lead.update({
      where: { id: existing.id },
      data: updateData,
      include: {
        company: true,
        contact: true,
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        leadScore: true,
      },
    });

    // If stage changed, record activity & audit log
    if (body.stage && body.stage !== existing.stage) {
      await prisma.activity.create({
        data: {
          workspaceId: caller.workspaceId,
          leadId: existing.id,
          companyId: existing.companyId,
          contactId: existing.contactId,
          type: ActivityType.STAGE_CHANGE,
          title: `Stage updated to ${body.stage}`,
          description: `Lead transitioned from ${existing.stage} to ${body.stage}`,
        },
      });

      await logAuditEvent({
        workspaceId: caller.workspaceId,
        userId: caller.userId,
        action: "LEAD_STAGE_CHANGED",
        entityType: "Lead",
        entityId: existing.id,
        details: { from: existing.stage, to: body.stage },
      });
    }

    return apiSuccess(updated, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("PATCH /api/v1/leads/[id] error:", error);
    return apiError("Failed to update lead", 500, "LEAD_UPDATE_ERROR", error.message);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (!PERMISSIONS.DELETE_LEAD(caller.role)) {
      return apiError("Insufficient permissions to delete leads", 403, "FORBIDDEN");
    }

    const { id } = await params;

    const existing = await prisma.lead.findFirst({
      where: {
        id,
        workspaceId: caller.workspaceId,
        deletedAt: null,
      },
    });

    if (!existing) {
      return apiError("Lead not found", 404, "NOT_FOUND");
    }

    // Soft delete
    await prisma.lead.update({
      where: { id: existing.id },
      data: { deletedAt: new Date() },
    });

    await logAuditEvent({
      workspaceId: caller.workspaceId,
      userId: caller.userId,
      action: "LEAD_DELETED",
      entityType: "Lead",
      entityId: existing.id,
    });

    return apiSuccess({ message: "Lead removed successfully", id: existing.id }, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("DELETE /api/v1/leads/[id] error:", error);
    return apiError("Failed to delete lead", 500, "LEAD_DELETE_ERROR", error.message);
  }
}

