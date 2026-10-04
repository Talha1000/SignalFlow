import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { apiSuccess, apiError } from "@/lib/api/response";
import { logAuditEvent } from "@/lib/audit/logger";
import { getClientIp } from "@/lib/security/rateLimit";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * Data Subject Export (GDPR Article 15 / CCPA)
 * Exports all customer personal data, activities, leads, and audit records scoped to workspace.
 */
export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required for privacy data export", 401, "UNAUTHORIZED");
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!email) {
      return apiError("An 'email' query parameter is required for data export", 400, "VALIDATION_FAILED");
    }

    const contacts = await prisma.contact.findMany({
      where: {
        workspaceId: caller.workspaceId,
        email,
      },
      include: {
        company: true,
        leads: {
          include: {
            leadScore: true,
            activities: true,
            scoreEvents: true,
          },
        },
      },
    });

    await logAuditEvent({
      workspaceId: caller.workspaceId,
      userId: caller.userId,
      action: "PRIVACY_DATA_EXPORTED",
      entityType: "Contact",
      ipAddress: getClientIp(request),
      details: { email, recordCount: contacts.length },
    });

    return apiSuccess({
      subject: email,
      exportedAt: new Date().toISOString(),
      contacts,
    }, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    return apiError("Data export failed", 500, "PRIVACY_EXPORT_ERROR", error.message);
  }
}

/**
 * Right to Erasure / Data Deletion (GDPR Article 17 / CCPA)
 * Permanently removes or anonymizes prospect and contact data upon verified request.
 */
export async function DELETE(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required for erasure request", 401, "UNAUTHORIZED");
    }

    if (caller.role !== Role.ADMIN && caller.role !== Role.OWNER) {
      return apiError("Admin permissions required to execute data erasure", 403, "FORBIDDEN");
    }

    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return apiError("A valid 'email' string is required for data erasure", 400, "VALIDATION_FAILED");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const deleteResult = await prisma.$transaction(async (tx) => {
      const contacts = await tx.contact.findMany({
        where: { workspaceId: caller.workspaceId, email: normalizedEmail },
        select: { id: true },
      });

      const contactIds = contacts.map((c) => c.id);

      // Anonymize/delete associated activities
      await tx.activity.updateMany({
        where: { contactId: { in: contactIds }, workspaceId: caller.workspaceId },
        data: { contactId: null, description: "[REDACTED - PRIVACY ERASURE REQUEST]" },
      });

      // Delete contacts
      const deletedContacts = await tx.contact.deleteMany({
        where: { workspaceId: caller.workspaceId, email: normalizedEmail },
      });

      return { deletedCount: deletedContacts.count };
    });

    await logAuditEvent({
      workspaceId: caller.workspaceId,
      userId: caller.userId,
      action: "PRIVACY_DATA_ERASED",
      entityType: "Contact",
      ipAddress: getClientIp(request),
      details: { email: normalizedEmail, erasedCount: deleteResult.deletedCount },
    });

    return apiSuccess({
      message: `Data erasure executed for ${normalizedEmail}`,
      recordsRemoved: deleteResult.deletedCount,
    }, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    return apiError("Data erasure failed", 500, "PRIVACY_ERASURE_ERROR", error.message);
  }
}
