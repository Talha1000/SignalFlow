import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { aiService } from "@/lib/ai/provider";
import { executeWithPlanQuota } from "@/lib/billing/usage";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (caller.isApiKey && !caller.permissions?.includes("write")) {
      return apiError("API key lacks 'write' permission", 403, "FORBIDDEN");
    }

    // Rate limiting: 20 AI email generations per minute per workspace
    const clientIp = getClientIp(request);
    const rateLimitKey = `ai_email:${caller.workspaceId}:${caller.userId || caller.apiKeyId || clientIp}`;
    const rateLimit = checkRateLimit(rateLimitKey, { limit: 20, windowMs: 60000 });
    if (!rateLimit.success) {
      return apiError(
        `AI generation rate limit reached. Reset in ${Math.ceil(rateLimit.resetMs / 1000)}s`,
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    const { leadId, tone = "consultative", customInstructions } = await request.json();

    if (!leadId) {
      return apiError("A valid 'leadId' is required for email generation", 400, "VALIDATION_FAILED");
    }

    // Verify lead strictly exists in caller's workspace
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        workspaceId: caller.workspaceId,
        deletedAt: null,
      },
      include: {
        company: true,
        contact: true,
        activities: { take: 8, orderBy: { createdAt: "desc" } },
      },
    });

    if (!lead) {
      return apiError("Lead not found in workspace", 404, "NOT_FOUND");
    }

    const resolvedTitle =
      lead.contact?.title ||
      (lead.company?.name ? `Leader at ${lead.company.name}` : "Decision Maker");

    const leadContext = {
      firstName: lead.contact?.firstName || "there",
      lastName: lead.contact?.lastName || "",
      title: resolvedTitle,
      companyName: lead.company?.name || "your company",
      industry: lead.company?.industry || "Enterprise B2B",
      score: lead.score,
      intentLevel: lead.intentLevel,
      activities: lead.activities.map((a) => ({
        title: a.title,
        type: a.type,
        description: a.description,
        createdAt: a.createdAt,
      })),
    };

    // Execute with atomic quota protection: quota is only consumed if AI generation SUCCEEDS
    const quotaResult = await executeWithPlanQuota(caller.workspaceId, "aiCredits", 1, async () => {
      return await aiService.generatePersonalizedEmail(leadContext, tone, customInstructions);
    });

    if (!quotaResult.success) {
      return apiError(
        `AI credit limit reached (${quotaResult.current}/${quotaResult.limit}). Please upgrade your workspace tier.`,
        403,
        "QUOTA_EXCEEDED"
      );
    }

    return apiSuccess(quotaResult.result, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("AI email generation error:", error);
    return apiError("Failed to generate email", 500, "AI_EMAIL_ERROR", error.message);
  }
}
