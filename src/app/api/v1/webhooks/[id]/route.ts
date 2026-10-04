import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateWebhookSchema = z.object({
  active: z.boolean().optional(),
  name: z.string().min(1).max(100).optional(),
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

    if (!PERMISSIONS.MANAGE_WORKSPACE(caller.role)) {
      return apiError("Insufficient permissions to update webhooks", 403, "FORBIDDEN");
    }

    const existing = await prisma.webhook.findFirst({
      where: { id, workspaceId: caller.workspaceId },
    });
    if (!existing) {
      return apiError("Webhook not found", 404, "NOT_FOUND");
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = UpdateWebhookSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError("Invalid update payload", 400, "VALIDATION_ERROR", parseResult.error.format());
    }

    const updated = await prisma.webhook.update({
      where: { id },
      data: parseResult.data,
    });

    return apiSuccess(updated);
  } catch (error: any) {
    console.error("PATCH /api/v1/webhooks/[id] error:", error);
    return apiError("Failed to update webhook", 500, "WEBHOOK_UPDATE_ERROR", error.message);
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

    if (!PERMISSIONS.MANAGE_WORKSPACE(caller.role)) {
      return apiError("Insufficient permissions to delete webhooks", 403, "FORBIDDEN");
    }

    const existing = await prisma.webhook.findFirst({
      where: { id, workspaceId: caller.workspaceId },
    });
    if (!existing) {
      return apiError("Webhook not found", 404, "NOT_FOUND");
    }

    await prisma.webhook.delete({
      where: { id },
    });

    return apiSuccess({ deleted: true, id });
  } catch (error: any) {
    console.error("DELETE /api/v1/webhooks/[id] error:", error);
    return apiError("Failed to delete webhook", 500, "WEBHOOK_DELETE_ERROR", error.message);
  }
}
