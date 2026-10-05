import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const ContactInquirySchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Valid work email is required").max(255),
  company: z.string().trim().min(1, "Company name is required").max(200),
  teamSize: z.string().max(50).default("1-10"),
  message: z.string().trim().min(1, "Inquiry message is required").max(2000),
});

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`contact:inquiry:${ip}`, { limit: 5, windowMs: 60000 });
    if (!rateCheck.success) {
      return apiError(
        "Too many inquiry submissions from this IP. Please wait a minute before trying again.",
        429,
        "RATE_LIMITED"
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return apiError("Invalid JSON body", 400, "INVALID_BODY");
    }

    const parseResult = ContactInquirySchema.safeParse(body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(issue, 400, "VALIDATION_FAILED", parseResult.error.format());
    }

    const { firstName, lastName, email, company, teamSize, message } = parseResult.data;

    // Find default workspace to record inbound sales inquiry
    const targetWorkspace = await prisma.workspace.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (targetWorkspace) {
      // 1. Record an audit log entry for compliance tracking
      await prisma.auditLog.create({
        data: {
          workspaceId: targetWorkspace.id,
          action: "CONTACT_SALES_INQUIRY",
          entityType: "INBOUND_LEAD",
          ipAddress: ip,
          details: {
            firstName,
            lastName,
            email,
            company,
            teamSize,
            message,
          },
        },
      });

      // 2. Notify workspace admins
      await prisma.notification.create({
        data: {
          workspaceId: targetWorkspace.id,
          title: `New Inbound Sales Lead: ${company}`,
          message: `${firstName} ${lastName} (${email}, team: ${teamSize}) submitted an inquiry: "${message.slice(0, 100)}..."`,
          type: "LEAD_HOT",
          link: "/app/leads",
        },
      });
    }

    return apiSuccess(
      {
        received: true,
        company,
        email,
        notice: "Inquiry logged and routed to solutions engineering.",
      },
      { durationMs: Date.now() - startTime }
    );
  } catch (error: any) {
    console.error("POST /api/contact error:", error);
    return apiError("Failed to record inquiry", 500, "CONTACT_ERROR", error.message);
  }
}
