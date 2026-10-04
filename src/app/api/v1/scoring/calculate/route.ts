import { NextResponse } from "next/server";
import { calculateLeadScore, ScoringInput } from "@/lib/scoring/engine";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body: ScoringInput = await request.json();

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

    return apiSuccess(scoreResult, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("Scoring calculation error:", error);
    return apiError("Failed to calculate lead score", 500, "SCORING_ERROR", error.message);
  }
}
