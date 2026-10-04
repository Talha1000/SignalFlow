import { NextResponse } from "next/server";
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

    // Rate limiting: 20 AI replies per minute per workspace
    const clientIp = getClientIp(request);
    const rateLimitKey = `ai_reply:${caller.workspaceId}:${caller.userId || caller.apiKeyId || clientIp}`;
    const rateLimit = checkRateLimit(rateLimitKey, { limit: 20, windowMs: 60000 });
    if (!rateLimit.success) {
      return apiError(
        `AI reply rate limit reached. Reset in ${Math.ceil(rateLimit.resetMs / 1000)}s`,
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    const body = await request.json();
    const { sender, company, subject, history, sentiment, leadScore } = body;

    if (!sender || !company || !subject || !Array.isArray(history)) {
      return apiError("Missing required thread context fields: sender, company, subject, history", 400, "VALIDATION_FAILED");
    }

    // Execute with atomic quota protection: quota consumed only on success
    const quotaResult = await executeWithPlanQuota(caller.workspaceId, "aiCredits", 1, async () => {
      return await aiService.generateInboxReply({
        sender,
        company,
        subject,
        history,
        sentiment,
        leadScore,
      });
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
    console.error("AI reply generation error:", error);
    return apiError("Failed to generate contextual reply", 500, "AI_REPLY_ERROR", error.message);
  }
}
