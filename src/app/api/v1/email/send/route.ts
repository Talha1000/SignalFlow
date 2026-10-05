import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType } from "@prisma/client";
import { getEmailProvider } from "@/lib/email/provider";
import { checkPlanQuota, checkAndConsumePlanQuota } from "@/lib/billing/usage";
import { checkRateLimitAsync, getClientIp, getRateLimitHeaders } from "@/lib/security/rateLimit";
import { z } from "zod";

export const dynamic = "force-dynamic";

const SendEmailSchema = z.object({
  leadId: z.string().optional(),
  to: z.string().email("Invalid recipient email address"),
  subject: z.string().min(1, "Subject is required").max(255),
  body: z.string().min(1, "Email body is required").max(10000),
  allowLocalRecord: z.boolean().optional(),
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

    // Rate limiting: 30 email sends per minute per caller
    const rateKey = `email:send:${caller.apiKeyId || caller.userId || getClientIp(request)}`;
    const rateCheck = await checkRateLimitAsync(rateKey, { limit: 30, windowMs: 60000 });
    if (!rateCheck.success) {
      const errRes = apiError("Outbound email rate limit exceeded (30 req/min)", 429, "RATE_LIMITED");
      Object.entries(getRateLimitHeaders(rateCheck)).forEach(([k, v]) => errRes.headers.set(k, v));
      return errRes;
    }

    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return apiError("Malformed JSON request payload", 400, "BAD_REQUEST");
    }

    const parseResult = SendEmailSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(`Validation failed: ${issue}`, 400, "VALIDATION_FAILED");
    }

    const { leadId, to, subject, body, allowLocalRecord } = parseResult.data;

    let lead: any = null;
    if (leadId) {
      lead = await prisma.lead.findFirst({
        where: { id: leadId, workspaceId: caller.workspaceId, deletedAt: null },
        include: { company: true, contact: true },
      });
      if (!lead) {
        return apiError("Lead not found or access denied", 404, "NOT_FOUND");
      }
    } else {
      // Attempt to link to contact/lead by recipient email if leadId was omitted
      lead = await prisma.lead.findFirst({
        where: {
          workspaceId: caller.workspaceId,
          contact: { email: { equals: to, mode: "insensitive" } },
          deletedAt: null,
        },
        include: { company: true, contact: true },
      });
    }

    // Pre-flight monthly email plan quota check
    const quotaCheck = await checkPlanQuota(caller.workspaceId, "emails");
    if (!quotaCheck.allowed) {
      return apiError(
        `Monthly email sending quota exceeded for your workspace plan (${quotaCheck.current}/${quotaCheck.limit}). Please upgrade.`,
        402,
        "QUOTA_EXCEEDED"
      );
    }

    const emailProvider = getEmailProvider();
    if (!emailProvider.isConfigured()) {
      if (allowLocalRecord) {
        // Record truthfully in PostgreSQL as local sandbox activity
        const activity = await prisma.activity.create({
          data: {
            workspaceId: caller.workspaceId,
            leadId: lead?.id || null,
            companyId: lead?.companyId || null,
            contactId: lead?.contactId || null,
            type: ActivityType.EMAIL_SENT,
            title: `Outreach Sent: ${subject}`,
            description: body,
            metadata: {
              recipient: to,
              subject,
              body,
              provider: "local_sandbox",
              status: "RECORDED_LOCALLY",
              recordedAt: new Date().toISOString(),
            },
          },
        });

        if (lead?.id) {
          await prisma.lead.update({
            where: { id: lead.id },
            data: { lastActivityAt: new Date() },
          });
        }

        return apiSuccess({
          status: "RECORDED_LOCALLY",
          message: "Outbound email provider is not configured (RESEND_API_KEY). Message was recorded to the lead's database timeline.",
          activityId: activity.id,
          provider: "local_sandbox",
        });
      }

      return apiError(
        "Outbound email provider is not configured. Please set RESEND_API_KEY in environment variables to deliver live prospect outreach.",
        503,
        "PROVIDER_NOT_CONFIGURED"
      );
    }

    // Send email via configured provider
    const sendResult = await emailProvider.send({
      to,
      subject,
      body,
      workspaceId: caller.workspaceId,
      leadId,
    });

    if (!sendResult.success) {
      return apiError(sendResult.error || "Failed to deliver email through outbound provider", 502, "SEND_FAILED");
    }

    // Atomically consume quota upon SUCCESSFUL send
    await checkAndConsumePlanQuota(caller.workspaceId, "emails", 1);

    // Record activity in lead timeline
    const activity = await prisma.activity.create({
      data: {
        workspaceId: caller.workspaceId,
        leadId: lead?.id || null,
        companyId: lead?.companyId || null,
        contactId: lead?.contactId || null,
        type: ActivityType.EMAIL_SENT,
        title: `Outreach Sent: ${subject}`,
        description: `Delivered to ${to} via ${sendResult.provider}`,
        metadata: {
          messageId: sendResult.messageId,
          recipient: to,
          subject,
          provider: sendResult.provider,
        },
      },
    });

    if (leadId) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { lastActivityAt: new Date() },
      });
    }

    return apiSuccess({
      status: "SENT",
      messageId: sendResult.messageId,
      provider: sendResult.provider,
      activityId: activity.id,
    });
  } catch (error) {
    console.error("POST /api/v1/email/send error:", error);
    return apiError("Failed to process outbound email request", 500, "INTERNAL_ERROR");
  }
}
