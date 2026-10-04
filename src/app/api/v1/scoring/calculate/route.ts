import { NextResponse } from "next/server";
import { calculateLeadScore, ScoringInput, validateCustomThresholds } from "@/lib/scoring/engine";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    // 1. Authenticate caller (Session or API key required)
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError(
        "Authentication required: Please provide a valid session or Bearer API key",
        401,
        "UNAUTHORIZED"
      );
    }

    // 2. Check API key permissions (requires at least 'read')
    if (caller.isApiKey && !caller.permissions?.includes("read")) {
      return apiError("API key lacks required 'read' permission", 403, "FORBIDDEN");
    }

    // 3. Rate limiting (60 calculations per minute per workspace / caller)
    const clientIp = getClientIp(request);
    const rateLimitKey = `scoring:${caller.workspaceId}:${caller.userId || caller.apiKeyId || clientIp}`;
    const rateLimit = checkRateLimit(rateLimitKey, { limit: 60, windowMs: 60000 });
    if (!rateLimit.success) {
      return apiError(
        `Scoring calculation rate limit exceeded. Reset in ${Math.ceil(rateLimit.resetMs / 1000)}s`,
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    const body: ScoringInput = await request.json();

    // 4. Validate custom thresholds if provided
    if (body.customThresholds) {
      const validation = validateCustomThresholds(body.customThresholds);
      if (!validation.valid) {
        return apiError(
          validation.error || "Invalid scoring threshold distribution",
          400,
          "INVALID_THRESHOLDS"
        );
      }
    }

    const scoreResult = calculateLeadScore({
      title: body.title || "Engineering Director",
      department: body.department || "Engineering",
      companySize: body.companySize || "250-1000",
      industry: body.industry || "Enterprise SaaS",
      activities: (body.activities || []).map((a: any) => ({
        type: a.type || "PAGE_VIEW",
        createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
        title: a.title,
        description: a.description,
      })),
      customThresholds: body.customThresholds,
    });

    return apiSuccess(
      {
        ...scoreResult,
        workspaceId: caller.workspaceId,
      },
      { durationMs: Date.now() - startTime }
    );
  } catch (error: any) {
    console.error("Scoring calculation error:", error);
    return apiError("Failed to calculate lead score", 500, "SCORING_ERROR", error.message);
  }
}
