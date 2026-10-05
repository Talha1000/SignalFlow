import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType, EnrollmentStatus, IntentLevel } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const SimulateReplySchema = z.object({
  leadId: z.string().min(1, "leadId is required"),
  subject: z.string().min(1, "subject is required"),
  body: z.string().min(1, "body is required"),
  sentiment: z.enum(["MEETING_REQUESTED", "TECHNICAL_INQUIRY", "OBJECTION", "INTERESTED"]).default("MEETING_REQUESTED"),
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

    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return apiError("Malformed JSON request payload", 400, "BAD_REQUEST");
    }

    const parseResult = SimulateReplySchema.safeParse(rawBody);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(`Validation failed: ${issue}`, 400, "VALIDATION_FAILED");
    }

    const { leadId, subject, body, sentiment } = parseResult.data;

    // Verify lead belongs to caller workspace
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        workspaceId: caller.workspaceId,
        deletedAt: null,
      },
      include: {
        company: true,
        contact: true,
      },
    });

    if (!lead) {
      return apiError("Lead not found or access denied", 404, "NOT_FOUND");
    }

    const senderName = lead.contact
      ? `${lead.contact.firstName || ""} ${lead.contact.lastName || ""}`.trim() || lead.contact.email
      : lead.company?.name || "Prospect";

    // 1. Record inbound EMAIL_REPLY activity in PostgreSQL
    const activity = await prisma.activity.create({
      data: {
        workspaceId: caller.workspaceId,
        leadId: lead.id,
        companyId: lead.companyId,
        contactId: lead.contactId,
        type: ActivityType.EMAIL_REPLY,
        title: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
        description: body,
        metadata: {
          sender: senderName,
          email: lead.contact?.email || null,
          subject,
          body,
          sentiment,
          simulated: true,
          receivedAt: new Date().toISOString(),
        },
      },
    });

    // 2. Automatically pause any active sequence enrollments for this lead
    const pausedEnrollments = await prisma.sequenceEnrollment.updateMany({
      where: {
        leadId: lead.id,
        status: EnrollmentStatus.ACTIVE,
      },
      data: {
        status: EnrollmentStatus.PAUSED_REPLIED,
      },
    });

    // 3. Compute score adjustment based on reply sentiment
    let scoreDelta = 10;
    let newIntent: IntentLevel = lead.intentLevel;
    let reason = "Inbound prospect reply received";

    if (sentiment === "MEETING_REQUESTED") {
      scoreDelta = 15;
      newIntent = IntentLevel.HOT;
      reason = "Prospect requested meeting / demo via email";
    } else if (sentiment === "TECHNICAL_INQUIRY") {
      scoreDelta = 10;
      newIntent = IntentLevel.HIGH;
      reason = "Prospect submitted technical architecture questions";
    } else if (sentiment === "INTERESTED") {
      scoreDelta = 8;
      newIntent = IntentLevel.HIGH;
      reason = "Prospect expressed interest in solution";
    } else if (sentiment === "OBJECTION") {
      scoreDelta = -4;
      reason = "Prospect raised procurement or timeline objection";
    }

    const previousScore = lead.score;
    const newScore = Math.min(100, Math.max(0, previousScore + scoreDelta));

    // 4. Update lead score, intent, and lastActivityAt
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        score: newScore,
        intentLevel: newIntent,
        lastActivityAt: new Date(),
      },
    });

    // 5. Record ScoreEvent
    await prisma.scoreEvent.create({
      data: {
        workspaceId: caller.workspaceId,
        leadId: lead.id,
        previousScore,
        newScore,
        delta: scoreDelta,
        factorName: "Email Reply Ingestion",
        reason,
      },
    });

    // 6. Create workspace notification
    await prisma.notification.create({
      data: {
        workspaceId: caller.workspaceId,
        type: "LEAD_HOT",
        title: `New Reply: ${senderName} (${lead.company?.name})`,
        message: `${senderName} replied: "${body.substring(0, 100)}...". Outbound sequence automatically paused.`,
        link: `/app/leads/${lead.id}`,
      },
    });

    return apiSuccess({
      activityId: activity.id,
      leadId: lead.id,
      newScore,
      scoreDelta,
      intentLevel: newIntent,
      sequencesPaused: pausedEnrollments.count,
      message: `Inbound reply recorded to database. Lead score updated (+${scoreDelta}) and sequences paused.`,
    });
  } catch (error) {
    console.error("POST /api/v1/inbox/simulate error:", error);
    return apiError("Failed to simulate inbound reply", 500, "INTERNAL_ERROR");
  }
}
