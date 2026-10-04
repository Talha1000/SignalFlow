import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { apiSuccess, apiError } from "@/lib/api/response";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * Enterprise Production Diagnostics & Observability Endpoint
 * Protected by Admin/Owner role authentication to ensure secure metrics visibility.
 */
export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required for diagnostics", 401, "UNAUTHORIZED");
    }

    // Diagnostics requires ADMIN or OWNER role
    if (caller.role !== Role.ADMIN && caller.role !== Role.OWNER) {
      return apiError("Admin access required for telemetry diagnostics", 403, "FORBIDDEN");
    }

    const [dbProbeStart] = [Date.now()];
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - dbProbeStart;

    const [workspaceLeads, workspaceActivities, workspaceAutomations, workspaceAuditCount] =
      await Promise.all([
        prisma.lead.count({ where: { workspaceId: caller.workspaceId, deletedAt: null } }),
        prisma.activity.count({ where: { workspaceId: caller.workspaceId } }),
        prisma.automation.count({ where: { workspaceId: caller.workspaceId, status: "ACTIVE" } }),
        prisma.auditLog.count({ where: { workspaceId: caller.workspaceId } }),
      ]);

    const memoryUsage = process.memoryUsage();

    return apiSuccess({
      observability: {
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        environment: process.env.NODE_ENV || "development",
        nodeVersion: process.version,
        platform: process.platform,
        database: {
          status: "connected",
          latencyMs: dbLatencyMs,
          pool: "prisma-postgresql",
        },
        memory: {
          heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        },
        workspaceTelemetry: {
          activeLeads: workspaceLeads,
          recordedActivities: workspaceActivities,
          activeAutomations: workspaceAutomations,
          auditEventsLogged: workspaceAuditCount,
        },
      },
    });
  } catch (error: any) {
    return apiError("Diagnostics inspection failed", 500, "DIAGNOSTICS_ERROR", error.message);
  }
}
