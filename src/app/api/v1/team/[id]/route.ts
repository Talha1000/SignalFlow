import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { apiSuccess, apiError } from "@/lib/api/response";
import { Role } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateRoleSchema = z.object({
  role: z.enum(["OWNER", "ADMIN", "MANAGER", "SALES_REP", "VIEWER"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (!PERMISSIONS.MANAGE_TEAM(caller.role)) {
      return apiError("Insufficient permissions to update roles", 403, "FORBIDDEN");
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: { id, workspaceId: caller.workspaceId },
    });

    if (!membership) {
      return apiError("Team member not found", 404, "NOT_FOUND");
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = UpdateRoleSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError("Invalid role value", 400, "VALIDATION_ERROR", parseResult.error.format());
    }

    // Protect last owner from demotion
    if (membership.role === "OWNER" && parseResult.data.role !== "OWNER") {
      const ownerCount = await prisma.workspaceMember.count({
        where: { workspaceId: caller.workspaceId, role: "OWNER" },
      });
      if (ownerCount <= 1) {
        return apiError("Cannot demote the sole owner of the workspace", 400, "LAST_OWNER_PROTECTION");
      }
    }

    const updated = await prisma.workspaceMember.update({
      where: { id },
      data: { role: parseResult.data.role as Role },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });

    return apiSuccess(updated);
  } catch (error: any) {
    console.error("PATCH /api/v1/team/[id] error:", error);
    return apiError("Failed to update member role", 500, "TEAM_UPDATE_ERROR", error.message);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (!PERMISSIONS.MANAGE_TEAM(caller.role)) {
      return apiError("Insufficient permissions to remove team members", 403, "FORBIDDEN");
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: { id, workspaceId: caller.workspaceId },
    });

    if (!membership) {
      return apiError("Team member not found", 404, "NOT_FOUND");
    }

    // Prevent removing the sole owner
    if (membership.role === "OWNER") {
      const ownerCount = await prisma.workspaceMember.count({
        where: { workspaceId: caller.workspaceId, role: "OWNER" },
      });
      if (ownerCount <= 1) {
        return apiError("Cannot remove the sole owner of the workspace", 400, "LAST_OWNER_PROTECTION");
      }
    }

    await prisma.workspaceMember.delete({
      where: { id },
    });

    // Decrement teamMembersCount
    await prisma.usageRecord.updateMany({
      where: { workspaceId: caller.workspaceId, teamMembersCount: { gt: 1 } },
      data: { teamMembersCount: { decrement: 1 } },
    });

    return apiSuccess({ removed: true, id });
  } catch (error: any) {
    console.error("DELETE /api/v1/team/[id] error:", error);
    return apiError("Failed to remove member", 500, "TEAM_DELETE_ERROR", error.message);
  }
}
