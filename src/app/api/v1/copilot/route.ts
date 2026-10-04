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

    if (caller.isApiKey && !caller.permissions?.includes("read")) {
      return apiError("API key lacks 'read' permission", 403, "FORBIDDEN");
    }

    // Rate limiting: 20 Copilot queries per minute per caller
    const clientIp = getClientIp(request);
    const rateLimitKey = `copilot:${caller.workspaceId}:${caller.userId || caller.apiKeyId || clientIp}`;
    const rateLimit = checkRateLimit(rateLimitKey, { limit: 20, windowMs: 60000 });
    if (!rateLimit.success) {
      return apiError(
        `Copilot query rate limit exceeded. Reset in ${Math.ceil(rateLimit.resetMs / 1000)}s`,
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    const { query } = await request.json();
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return apiError("A valid query string is required", 400, "VALIDATION_FAILED");
    }

    // Query real data strictly scoped to caller's workspace
    const [leads, companies, activities] = await Promise.all([
      prisma.lead.findMany({
        where: { workspaceId: caller.workspaceId, deletedAt: null },
        take: 15,
        orderBy: { score: "desc" },
        include: { company: true, contact: true },
      }),
      prisma.company.findMany({
        where: { workspaceId: caller.workspaceId },
        take: 6,
        orderBy: { intentScore: "desc" },
      }),
      prisma.activity.findMany({
        where: { workspaceId: caller.workspaceId },
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const hotCount = leads.filter((l) => l.score >= 85).length;
    const surgingCount = leads.filter((l) => l.score >= 70).length;
    const totalPipeline = leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

    const context = {
      hotLeadsCount: hotCount,
      surgingCount: surgingCount,
      pipelineValue: totalPipeline,
      topAccounts: companies.map((c) => `${c.name} (Intent Score: ${c.intentScore})`),
      recentActivities: activities.map((a) => `${a.title}: ${a.description || ""}`),
    };

    // Execute with atomic quota protection: quota is only consumed if Copilot query SUCCEEDS
    const quotaResult = await executeWithPlanQuota(caller.workspaceId, "aiCredits", 1, async () => {
      return await aiService.askSalesCopilot(query, context);
    });

    if (!quotaResult.success) {
      return apiError(
        `AI credit limit reached (${quotaResult.current}/${quotaResult.limit}). Please upgrade your workspace tier.`,
        403,
        "QUOTA_EXCEEDED"
      );
    }

    return apiSuccess({ answer: quotaResult.result }, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("Copilot API error:", error);
    return apiError("Failed to generate answer", 500, "COPILOT_ERROR", error.message);
  }
}
