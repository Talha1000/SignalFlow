import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { aiService } from "@/lib/ai/provider";
import { checkPlanQuota } from "@/lib/billing/usage";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
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

    // Check workspace AI quota
    const quota = await checkPlanQuota(caller.workspaceId, "aiCredits");
    if (!quota.allowed) {
      return apiError(
        `AI credit limit reached (${quota.current}/${quota.limit}). Please upgrade your workspace tier.`,
        403,
        "QUOTA_EXCEEDED"
      );
    }

    const leadContext = {
      firstName: lead.contact?.firstName || "there",
      lastName: lead.contact?.lastName || "",
      title: lead.contact?.title || lead.company?.name ? "Leader at " + lead.company?.name : "Decision Maker",
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

    const email = await aiService.generatePersonalizedEmail(leadContext, tone, customInstructions);

    // Track usage
    await prisma.usageRecord.upsert({
      where: { workspaceId: caller.workspaceId },
      update: { aiCreditsUsed: { increment: 1 } },
      create: {
        workspaceId: caller.workspaceId,
        leadsCount: 1,
        aiCreditsUsed: 1,
        emailsSentCount: 0,
        teamMembersCount: 1,
      },
    });

    return apiSuccess(email, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("AI email generation error:", error);
    return apiError("Failed to generate email", 500, "AI_EMAIL_ERROR", error.message);
  }
}

