import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { executeWorkspaceAutomations } from "@/lib/automations/executor";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const TriggerAutomationSchema = z.object({
  automationId: z.string().max(255).optional(),
  eventType: z.enum(["SCORE_THRESHOLD", "LEAD_CREATED", "SIGNAL_RECEIVED", "STAGE_CHANGE"]).optional(),
  leadId: z.string().max(255).optional(),
});

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

    // Rate Limiting: 60 automation triggers/minute
    const rateLimitKey = `automations:trigger:${caller.apiKeyId || caller.userId || getClientIp(request)}`;
    const rateCheck = checkRateLimit(rateLimitKey, { limit: 60, windowMs: 60000 });
    if (!rateCheck.success) {
      return apiError("Automation trigger rate limit exceeded (60 requests/minute)", 429, "RATE_LIMITED");
    }

    let rawBody: any = {};
    try {
      rawBody = await request.json();
    } catch {
      rawBody = {};
    }

    const parseResult = TriggerAutomationSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(issue, 400, "VALIDATION_FAILED", parseResult.error.format());
    }

    const { automationId, eventType, leadId } = parseResult.data;

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

export async function PATCH(request: Request) {
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
        return apiError("Insufficient permissions to update automations", 403, "FORBIDDEN");
      }
    }

    const body = await request.json();
    const { id, name, status, nodes, edges } = body;

    let targetId = id;
    let existing = null;

    if (targetId) {
      existing = await prisma.automation.findFirst({
        where: { id: targetId, workspaceId: caller.workspaceId },
      });
    }

    if (!existing) {
      // Create new automation or upsert if default ID was passed
      const created = await prisma.automation.create({
        data: {
          id: targetId && !targetId.startsWith("auto-") ? targetId : undefined,
          workspaceId: caller.workspaceId,
          name: name || "Lead Routing Workflow",
          status: status === "PAUSED" ? "PAUSED" : "ACTIVE",
          nodes: nodes || [],
          edges: edges || [],
        },
      });
      return apiSuccess(created, { durationMs: Date.now() - startTime });
    }

    const updated = await prisma.automation.update({
      where: { id: existing.id },
      data: {
        ...(name !== undefined && { name }),
        ...(status !== undefined && { status }),
        ...(nodes !== undefined && { nodes }),
        ...(edges !== undefined && { edges }),
      },
    });

    return apiSuccess(updated, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("PATCH /api/v1/automations error:", error);
    return apiError("Failed to update automation", 500, "AUTOMATION_UPDATE_ERROR", error.message);
  }
}
