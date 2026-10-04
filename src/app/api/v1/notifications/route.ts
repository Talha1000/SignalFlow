import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`notifs_get:${caller.workspaceId}:${clientIp}`, {
      limit: 60,
      windowMs: 60000,
    });
    if (!rateLimit.success) {
      return apiError("Rate limit exceeded", 429, "RATE_LIMIT_EXCEEDED");
    }

    const notifications = await prisma.notification.findMany({
      where: {
        workspaceId: caller.workspaceId,
        OR: [
          { userId: caller.userId || undefined },
          { userId: null },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        workspaceId: caller.workspaceId,
        read: false,
        OR: [
          { userId: caller.userId || undefined },
          { userId: null },
        ],
      },
    });

    return apiSuccess(
      {
        notifications,
        unreadCount,
      },
      { durationMs: Date.now() - startTime }
    );
  } catch (error: any) {
    console.error("Fetch notifications error:", error);
    return apiError("Failed to fetch notifications", 500, "NOTIFICATIONS_ERROR", error.message);
  }
}

export async function PATCH(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    const body = await request.json().catch(() => ({}));
    const { id, markAllRead } = body;

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: {
          workspaceId: caller.workspaceId,
          read: false,
          OR: [
            { userId: caller.userId || undefined },
            { userId: null },
          ],
        },
        data: { read: true },
      });
      return apiSuccess({ updated: true, all: true }, { durationMs: Date.now() - startTime });
    }

    if (!id) {
      return apiError("Notification 'id' or 'markAllRead' is required", 400, "VALIDATION_FAILED");
    }

    const updated = await prisma.notification.updateMany({
      where: {
        id,
        workspaceId: caller.workspaceId,
      },
      data: { read: true },
    });

    return apiSuccess({ updated: updated.count > 0, id }, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("Update notification error:", error);
    return apiError("Failed to update notification", 500, "NOTIFICATIONS_ERROR", error.message);
  }
}
