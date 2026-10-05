import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  domain: z.string().max(255).optional().nullable(),
  timezone: z.string().max(50).optional(),
  plan: z.enum(["FREE", "STARTER", "GROWTH", "BUSINESS", "ENTERPRISE"]).optional(),
  settings: z.record(z.string(), z.any()).optional(),
  scoringThresholds: z
    .object({
      cold: z.number().min(0).max(100),
      low: z.number().min(0).max(100),
      warm: z.number().min(0).max(100),
      high: z.number().min(0).max(100),
      hot: z.number().min(0).max(100),
    })
    .optional(),
});

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: caller.workspaceId },
      select: {
        id: true,
        name: true,
        slug: true,
        domain: true,
        plan: true,
        settings: true,
        scoringThresholds: true,
        createdAt: true,
      },
    });

    if (!workspace) {
      return apiError("Workspace not found", 404, "NOT_FOUND");
    }

    return apiSuccess(workspace, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("GET /api/v1/workspace error:", error);
    return apiError("Failed to fetch workspace", 500, "WORKSPACE_FETCH_ERROR", error.message);
  }
}

export async function PATCH(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (!PERMISSIONS.MANAGE_WORKSPACE(caller.role)) {
      return apiError("Insufficient permissions to update workspace settings", 403, "FORBIDDEN");
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = UpdateWorkspaceSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError("Invalid update payload", 400, "VALIDATION_ERROR", parseResult.error.format());
    }

    const { name, domain, timezone, plan, settings, scoringThresholds } = parseResult.data;

    // Merge settings if timezone is provided
    const existing = await prisma.workspace.findUnique({
      where: { id: caller.workspaceId },
    });

    const currentSettings = (existing?.settings as Record<string, any>) || {};
    const updatedSettings = {
      ...currentSettings,
      ...(settings || {}),
      ...(timezone ? { timezone } : {}),
    };

    const updateData: any = {};
    if (name) updateData.name = name;
    if (domain !== undefined) updateData.domain = domain;
    if (plan) updateData.plan = plan;
    if (scoringThresholds) updateData.scoringThresholds = scoringThresholds;
    updateData.settings = updatedSettings;

    const updated = await prisma.workspace.update({
      where: { id: caller.workspaceId },
      data: updateData,
    });

    if (plan) {
      await prisma.subscription.upsert({
        where: { workspaceId: caller.workspaceId },
        update: { plan },
        create: {
          workspaceId: caller.workspaceId,
          plan,
          status: "ACTIVE",
        },
      });
    }

    return apiSuccess(updated, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("PATCH /api/v1/workspace error:", error);
    return apiError("Failed to update workspace", 500, "WORKSPACE_UPDATE_ERROR", error.message);
  }
}
