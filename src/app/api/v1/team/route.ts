import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (!PERMISSIONS.VIEW_SETTINGS(caller.role)) {
      return apiError("Insufficient permissions to view team members", 403, "FORBIDDEN");
    }

    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId: caller.workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    return apiSuccess(members, { total: members.length, durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("GET /api/v1/team error:", error);
    return apiError("Failed to fetch team members", 500, "TEAM_FETCH_ERROR", error.message);
  }
}
