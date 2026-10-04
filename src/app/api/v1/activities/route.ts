import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType } from "@prisma/client";
import { checkRateLimitAsync, getClientIp, getRateLimitHeaders } from "@/lib/security/rateLimit";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateActivitySchema = z.object({
  leadId: z.string().optional(),
  companyId: z.string().optional(),
  contactId: z.string().optional(),
  type: z.nativeEnum(ActivityType),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(5000).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export async function GET(request: Request) {
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId") || undefined;
    const companyId = searchParams.get("companyId") || undefined;
    const typeStr = searchParams.get("type");
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 50));

    const where: any = {
      workspaceId: caller.workspaceId,
    };

    if (leadId) where.leadId = leadId;
    if (companyId) where.companyId = companyId;
    if (typeStr && Object.values(ActivityType).includes(typeStr as ActivityType)) {
      where.type = typeStr as ActivityType;
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        contact: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return apiSuccess(activities);
  } catch (error) {
    console.error("GET /api/v1/activities error:", error);
    return apiError("Failed to fetch activities", 500, "INTERNAL_ERROR");
  }
}

export async function POST(request: Request) {
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (caller.isApiKey && !caller.permissions?.includes("write")) {
      return apiError("API key lacks write permission", 403, "FORBIDDEN");
    }

    // Rate limiting: 120 activity creations per minute per caller
    const rateKey = `activity:create:${caller.apiKeyId || caller.userId || getClientIp(request)}`;
    const rateCheck = await checkRateLimitAsync(rateKey, { limit: 120, windowMs: 60000 });
    if (!rateCheck.success) {
      const errRes = apiError("Activity logging rate limit exceeded (120 req/min)", 429, "RATE_LIMITED");
      Object.entries(getRateLimitHeaders(rateCheck)).forEach(([k, v]) => errRes.headers.set(k, v));
      return errRes;
    }

    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return apiError("Malformed JSON request payload", 400, "BAD_REQUEST");
    }

    const parseResult = CreateActivitySchema.safeParse(rawBody);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(`Validation failed: ${issue}`, 400, "VALIDATION_FAILED", parseResult.error.format());
    }

    const body = parseResult.data;

    // Execute in transaction to verify workspace isolation and update lead activity timestamp atomically
    const activity = await prisma.$transaction(async (tx) => {
      let resolvedCompanyId = body.companyId || null;
      let resolvedContactId = body.contactId || null;

      if (body.leadId) {
        // Enforce strict workspace isolation on lead
        const lead = await tx.lead.findFirst({
          where: {
            id: body.leadId,
            workspaceId: caller.workspaceId,
            deletedAt: null,
          },
          select: { id: true, companyId: true, contactId: true },
        });

        if (!lead) {
          throw new Error("LEAD_NOT_FOUND");
        }

        if (!resolvedCompanyId && lead.companyId) {
          resolvedCompanyId = lead.companyId;
        }
        if (!resolvedContactId && lead.contactId) {
          resolvedContactId = lead.contactId;
        }

        // Update last activity timestamp on the lead record
        await tx.lead.update({
          where: { id: body.leadId },
          data: { lastActivityAt: new Date() },
        });
      }

      if (resolvedCompanyId) {
        const companyExists = await tx.company.findFirst({
          where: { id: resolvedCompanyId, workspaceId: caller.workspaceId },
          select: { id: true },
        });
        if (!companyExists) resolvedCompanyId = null;
      }

      if (resolvedContactId) {
        const contactExists = await tx.contact.findFirst({
          where: { id: resolvedContactId, workspaceId: caller.workspaceId },
          select: { id: true },
        });
        if (!contactExists) resolvedContactId = null;
      }

      return await tx.activity.create({
        data: {
          workspaceId: caller.workspaceId,
          leadId: body.leadId || null,
          companyId: resolvedCompanyId,
          contactId: resolvedContactId,
          type: body.type,
          title: body.title,
          description: body.description || null,
          metadata: body.metadata || undefined,
        },
      });
    });

    return apiSuccess(activity, undefined, 201);
  } catch (error: any) {
    if (error?.message === "LEAD_NOT_FOUND") {
      return apiError("Lead not found or access denied", 404, "NOT_FOUND");
    }
    console.error("POST /api/v1/activities error:", error);
    return apiError("Failed to record activity", 500, "INTERNAL_ERROR");
  }
}
