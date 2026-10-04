import { NextResponse } from "next/server";
import { calculateLeadScore, ScoringInput, validateCustomThresholds } from "@/lib/scoring/engine";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CalculateScoreSchema = z.object({
  title: z.string().max(255).optional(),
  department: z.string().max(255).optional(),
  companySize: z.string().max(255).optional(),
  industry: z.string().max(255).optional(),
  activities: z
    .array(
      z.object({
        type: z.string().max(100).optional(),
        title: z.string().max(255).optional(),
        description: z.string().max(1000).optional(),
        createdAt: z.union([z.string(), z.date()]).optional(),
      })
    )
    .max(100, "Maximum 100 activities allowed per calculation batch")
    .optional(),
  customThresholds: z
    .object({
      coldMax: z.number().min(0).max(100),
      lowMax: z.number().min(0).max(100),
      warmMax: z.number().min(0).max(100),
      highMax: z.number().min(0).max(100),
      hotMin: z.number().min(0).max(100),
    })
    .optional(),
});

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

    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return apiError("Malformed JSON request payload", 400, "BAD_REQUEST");
    }

    const parseResult = CalculateScoreSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(issue, 400, "VALIDATION_FAILED", parseResult.error.format());
    }

    const body = parseResult.data;

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
