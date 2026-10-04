import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType, EnrollmentStatus } from "@prisma/client";
import { checkRateLimitAsync, getClientIp, getRateLimitHeaders } from "@/lib/security/rateLimit";
import { z } from "zod";

export const dynamic = "force-dynamic";

const EnrollSchema = z.object({
  sequenceId: z.string().min(1, "Sequence ID is required"),
  leadId: z.string().min(1, "Lead ID is required"),
});

export async function POST(request: Request) {
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (caller.isApiKey && !caller.permissions?.includes("write")) {
      return apiError("API key lacks write permission", 403, "FORBIDDEN");
    }

    // Rate limiting: 60 enrollments per minute per caller
    const rateKey = `sequence:enroll:${caller.apiKeyId || caller.userId || getClientIp(request)}`;
    const rateCheck = await checkRateLimitAsync(rateKey, { limit: 60, windowMs: 60000 });
    if (!rateCheck.success) {
      const errRes = apiError("Enrollment rate limit exceeded (60 req/min)", 429, "RATE_LIMITED");
      Object.entries(getRateLimitHeaders(rateCheck)).forEach(([k, v]) => errRes.headers.set(k, v));
      return errRes;
    }

    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return apiError("Malformed JSON request payload", 400, "BAD_REQUEST");
    }

    const parseResult = EnrollSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(`Validation failed: ${issue}`, 400, "VALIDATION_FAILED");
    }

    const { sequenceId, leadId } = parseResult.data;

    // Execute in transaction to verify workspace isolation, check duplicate, and record enrollment
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify lead belongs to caller's workspace
      const lead = await tx.lead.findFirst({
        where: { id: leadId, workspaceId: caller.workspaceId, deletedAt: null },
        include: { company: true, contact: true },
      });
      if (!lead) throw new Error("LEAD_NOT_FOUND");

      // 2. Verify sequence belongs to caller's workspace
      const sequence = await tx.sequence.findFirst({
        where: { id: sequenceId, workspaceId: caller.workspaceId },
        include: { steps: { orderBy: { stepOrder: "asc" }, take: 1 } },
      });
      if (!sequence) throw new Error("SEQUENCE_NOT_FOUND");

      // 3. Check for active enrollment
      const existing = await tx.sequenceEnrollment.findUnique({
        where: { sequenceId_leadId: { sequenceId, leadId } },
      });

      if (existing && existing.status === EnrollmentStatus.ACTIVE) {
        throw new Error("ALREADY_ACTIVE");
      }

      // 4. Create or update enrollment
      const enrollment = await tx.sequenceEnrollment.upsert({
        where: { sequenceId_leadId: { sequenceId, leadId } },
        update: {
          status: EnrollmentStatus.ACTIVE,
          currentStep: 1,
          enrolledAt: new Date(),
          lastStepExecutedAt: null,
        },
        create: {
          workspaceId: caller.workspaceId,
          sequenceId,
          leadId,
          currentStep: 1,
          status: EnrollmentStatus.ACTIVE,
          enrolledAt: new Date(),
        },
      });

      // 5. Increment enrolledCount on sequence
      await tx.sequence.update({
        where: { id: sequenceId },
        data: { enrolledCount: { increment: 1 } },
      });

      // 6. Record activity in lead timeline
      await tx.activity.create({
        data: {
          workspaceId: caller.workspaceId,
          leadId,
          companyId: lead.companyId,
          contactId: lead.contactId,
          type: ActivityType.CADENCE_ENROLLED,
          title: `Enrolled in Cadence: ${sequence.name}`,
          description: `Outbound cadence initiated. Auto-pause configured upon prospect response.`,
          metadata: { sequenceId, sequenceName: sequence.name },
        },
      });

      // 7. Update lead's lastActivityAt
      await tx.lead.update({
        where: { id: leadId },
        data: { lastActivityAt: new Date() },
      });

      return { enrollment, sequenceName: sequence.name };
    });

    return apiSuccess(result, undefined, 201);
  } catch (error: any) {
    if (error?.message === "LEAD_NOT_FOUND") {
      return apiError("Lead not found or access denied", 404, "NOT_FOUND");
    }
    if (error?.message === "SEQUENCE_NOT_FOUND") {
      return apiError("Sequence not found or access denied", 404, "NOT_FOUND");
    }
    if (error?.message === "ALREADY_ACTIVE") {
      return apiError("Lead is already actively enrolled in this cadence", 409, "CONFLICT");
    }
    console.error("POST /api/v1/sequences/enroll error:", error);
    return apiError("Failed to enroll lead in cadence", 500, "INTERNAL_ERROR");
  }
}
