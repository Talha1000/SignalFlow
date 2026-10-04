import { NextResponse } from "next/server";
import { calculateLeadScore } from "@/lib/scoring/engine";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType } from "@prisma/client";

export const dynamic = "force-dynamic";

interface SignalPayload {
  domain: string;
  companyName?: string;
  signalType: "PRICING_VISIT" | "DOCS_VIEW" | "DEMO_VISIT" | "GITHUB_STAR" | "EXECUTIVE_HIRE" | "EMAIL_REPLY";
  title?: string;
  contactEmail?: string;
  contactName?: string;
  contactTitle?: string;
  metadata?: Record<string, any>;
}

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body: SignalPayload = await request.json();

    if (!body.domain || !body.signalType) {
      return apiError("Missing required fields: 'domain' and 'signalType' are mandatory.", 400, "VALIDATION_FAILED");
    }

    // Map signalType to ActivityType
    let actType: ActivityType = ActivityType.PAGE_VIEW;
    let basePoints = 10;
    let factorDescription = "Engaged with web telemetry";

    switch (body.signalType) {
      case "PRICING_VISIT":
        actType = ActivityType.PRICING_VISIT;
        basePoints = 18;
        factorDescription = "High-intent pricing page exploration (3x)";
        break;
      case "DOCS_VIEW":
        actType = ActivityType.DOCS_VIEW;
        basePoints = 14;
        factorDescription = "API documentation and rate-limit specification review";
        break;
      case "DEMO_VISIT":
        actType = ActivityType.DEMO_VISIT;
        basePoints = 25;
        factorDescription = "Submitted Enterprise Demo request form";
        break;
      case "EMAIL_REPLY":
        actType = ActivityType.EMAIL_REPLY;
        basePoints = 20;
        factorDescription = "Prospect replied to outbound email cadence";
        break;
      default:
        actType = ActivityType.PAGE_VIEW;
        basePoints = 8;
        factorDescription = "Generic website session telemetry";
    }

    // Run deterministic scoring calculation
    const scoreResult = calculateLeadScore({
      title: body.contactTitle || "Engineering Leader",
      department: "Engineering",
      companySize: "100-500",
      industry: "Enterprise B2B",
      activities: [
        {
          type: actType,
          createdAt: new Date(),
          title: body.title || `${body.signalType} registered`,
          description: factorDescription,
        },
      ],
    });

    const isHotSurge = scoreResult.score >= 80;
    const recommendedAction = isHotSurge
      ? "Immediate executive touchpoint. Schedule technical architecture review sandbox."
      : "Enroll in consultative industry benchmark sequence.";

    const result = {
      event: {
        id: `sig_${Math.random().toString(36).substring(2, 9)}`,
        signalType: body.signalType,
        domain: body.domain.toLowerCase(),
        companyName: body.companyName || body.domain.split(".")[0].toUpperCase(),
        timestamp: new Date().toISOString(),
      },
      telemetry: {
        pointsAdded: basePoints,
        newComputedScore: scoreResult.score,
        intentLevel: scoreResult.intentLevel,
        isSurging: isHotSurge,
        explanation: scoreResult.explanation,
        positiveFactors: scoreResult.positiveFactors,
      },
      automationTriggers: {
        slackAlertDispatched: isHotSurge,
        targetChannel: isHotSurge ? "#sales-hot-leads" : null,
        cadenceStatus: body.signalType === "EMAIL_REPLY" ? "HALTED_REPLY_DETECTED" : "ACTIVE",
        recommendedNextPlay: recommendedAction,
      },
    };

    return apiSuccess(result, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("Signal ingestion error:", error);
    return apiError("Failed to process inbound signal", 500, "INGESTION_ERROR", error.message);
  }
}
