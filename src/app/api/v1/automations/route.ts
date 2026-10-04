import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { executeWorkspaceAutomations } from "@/lib/automations/executor";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (caller.isApiKey) {
      if (!caller.permissions?.includes("read")) {
        return apiError("API key lacks 'read' permission", 403, "FORBIDDEN");
      }
    } else {
      if (!PERMISSIONS.VIEW_SEQUENCES(caller.role)) {
        return apiError("Insufficient permissions to view automations", 403, "FORBIDDEN");
      }
    }

    const automations = await prisma.automation.findMany({
      where: { workspaceId: caller.workspaceId },
      include: {
        executions: {
          take: 5,
          orderBy: { triggeredAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(automations, { total: automations.length, durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("GET /api/v1/automations error:", error);
    return apiError("Failed to fetch automations", 500, "AUTOMATIONS_ERROR", error.message);
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (caller.isApiKey) {
      if (!caller.permissions?.includes("write")) {
        return apiError("API key lacks 'write' permission", 403, "FORBIDDEN");
      }
    } else {
      if (!PERMISSIONS.MANAGE_AUTOMATIONS(caller.role)) {
        return apiError("Insufficient permissions to trigger automations", 403, "FORBIDDEN");
      }
    }

    const body = await request.json();
    const { automationId, eventType, leadId } = body;

    // Verify automation belongs to caller's workspace if automationId provided
    if (automationId) {
      const auto = await prisma.automation.findFirst({
        where: { id: automationId, workspaceId: caller.workspaceId },
      });
      if (!auto) {
        return apiError("Automation not found in workspace", 404, "NOT_FOUND");
      }
    }

    // Verify lead belongs to caller's workspace if leadId provided
    let lead = null;
    if (leadId) {
      lead = await prisma.lead.findFirst({
        where: { id: leadId, workspaceId: caller.workspaceId, deletedAt: null },
        include: { company: true },
      });
      if (!lead) {
        return apiError("Lead not found in workspace", 404, "NOT_FOUND");
      }
    }

    const effectiveTrigger = eventType || "SCORE_THRESHOLD";

    // Truthful telemetry: score-based triggers require an actual lead
    if (effectiveTrigger === "SCORE_THRESHOLD" && !lead) {
      return apiError(
        "A valid 'leadId' belonging to this workspace is required to evaluate SCORE_THRESHOLD automations.",
        400,
        "VALIDATION_FAILED"
      );
    }

    const outcomes = await executeWorkspaceAutomations({
      workspaceId: caller.workspaceId,
      automationId: automationId || undefined,
      leadId: lead?.id,
      triggerType: effectiveTrigger,
      currentScore: lead?.score,
      intentLevel: lead?.intentLevel,
      companyName: lead?.company?.name || undefined,
    });

    return apiSuccess(
      {
        executedCount: outcomes.length,
        outcomes,
      },
      { durationMs: Date.now() - startTime }
    );
  } catch (error: any) {
    console.error("POST /api/v1/automations error:", error);
    return apiError("Failed to trigger automation", 500, "TRIGGER_ERROR", error.message);
  }
}
