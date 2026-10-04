import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

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

    if (!PERMISSIONS.MANAGE_API_KEYS(caller.role)) {
      return apiError("Insufficient permissions to revoke API keys", 403, "FORBIDDEN");
    }

    const existing = await prisma.apiKey.findFirst({
      where: { id, workspaceId: caller.workspaceId },
    });
    if (!existing) {
      return apiError("API key not found", 404, "NOT_FOUND");
    }

    await prisma.apiKey.delete({
      where: { id },
    });

    return apiSuccess({ revoked: true, id });
  } catch (error: any) {
    console.error("DELETE /api/v1/keys/[id] error:", error);
    return apiError("Failed to revoke API key", 500, "API_KEY_REVOKE_ERROR", error.message);
  }
}
