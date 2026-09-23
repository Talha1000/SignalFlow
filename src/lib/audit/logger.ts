import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface LogAuditParams {
  workspaceId: string;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Prisma.InputJsonValue;
  ipAddress?: string;
}

export async function logAuditEvent(params: LogAuditParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        workspaceId: params.workspaceId,
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        details: params.details,
        ipAddress: params.ipAddress,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
    return null;
  }
}
