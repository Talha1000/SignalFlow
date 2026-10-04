import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { calculateLeadScore } from "@/lib/scoring/engine";
import { executeWorkspaceAutomations } from "@/lib/automations/executor";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType, IntentLevel, LeadStage } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const SignalSchema = z.object({
  domain: z.string().min(1, "Domain is required").max(255),
  companyName: z.string().max(255).optional(),
  signalType: z.enum([
    "PRICING_VISIT",
    "DOCS_VIEW",
    "DEMO_VISIT",
    "GITHUB_STAR",
    "EXECUTIVE_HIRE",
    "EMAIL_REPLY",
    "PAGE_VIEW",
  ]),
  title: z.string().max(255).optional(),
  contactEmail: z.string().email("Invalid contact email format").max(255).optional(),
  contactName: z.string().max(255).optional(),
  contactTitle: z.string().max(255).optional(),
  metadata: z
    .record(z.string(), z.any())
    .optional()
    .refine(
      (val) => !val || JSON.stringify(val).length <= 32768,
      "Metadata payload exceeds maximum size limit (32KB)"
    ),
});

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required (Cookie session or Bearer API key)", 401, "UNAUTHORIZED");
    }

    if (caller.isApiKey && !caller.permissions?.includes("write")) {
      return apiError("API key lacks 'write' permission", 403, "FORBIDDEN");
    }

    // Rate Limiting: 300 signals/min per caller (API key or session user), plus 600 signals/min per workspace ceiling
    const callerRateKey = `signals:caller:${caller.apiKeyId || caller.userId || getClientIp(request)}`;
    const callerLimit = checkRateLimit(callerRateKey, { limit: 300, windowMs: 60000 });
    if (!callerLimit.success) {
      return apiError(
        "Signal ingestion rate limit exceeded (300 requests/minute). Please throttle client bursts.",
        429,
        "RATE_LIMITED"
      );
    }

    const wsRateKey = `signals:ws:${caller.workspaceId}`;
    const wsLimit = checkRateLimit(wsRateKey, { limit: 600, windowMs: 60000 });
    if (!wsLimit.success) {
      return apiError(
        "Workspace global signal ingestion limit exceeded (600 requests/minute).",
        429,
        "RATE_LIMITED"
      );
    }

    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return apiError("Malformed JSON request payload", 400, "BAD_REQUEST");
    }

    // Runtime Schema Validation with Zod
    const parseResult = SignalSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(`Invalid signal payload: ${issue}`, 400, "VALIDATION_FAILED", parseResult.error.format());
    }

    const body = parseResult.data;

    const cleanDomain = body.domain
      .toLowerCase()
      .trim()
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0];

    // Map signalType to ActivityType
    let actType: ActivityType = ActivityType.PAGE_VIEW;
    let factorDescription = "Engaged with web telemetry";

    switch (body.signalType) {
      case "PRICING_VISIT":
        actType = ActivityType.PRICING_VISIT;
        factorDescription = "Explored enterprise pricing tiers";
        break;
      case "DOCS_VIEW":
        actType = ActivityType.DOCS_VIEW;
        factorDescription = "Reviewed API specifications and documentation";
        break;
      case "DEMO_VISIT":
        actType = ActivityType.DEMO_VISIT;
        factorDescription = "Submitted demo request inquiry";
        break;
      case "EMAIL_REPLY":
        actType = ActivityType.EMAIL_REPLY;
        factorDescription = "Prospect replied to email sequence";
        break;
      case "GITHUB_STAR":
        actType = ActivityType.GITHUB_STAR;
        factorDescription = "Developer starred repository; open-source product adoption signal";
        break;
      case "EXECUTIVE_HIRE":
        actType = ActivityType.EXECUTIVE_HIRE;
        factorDescription = "Executive hire announced; organizational budget expansion signal";
        break;
      default:
        actType = ActivityType.PAGE_VIEW;
        factorDescription = "Web page session activity";
    }

    // 1-5. Execute Company, Contact, Activity, LeadScore update, and ScoreEvent in a single atomic transaction
    // This serializes scoring recalculation, prevents race conditions from concurrent webhook bursts, and guarantees ACID consistency.
    const transactionResult = await prisma.$transaction(async (tx) => {
      // 1. Find or create Company in caller's workspace
      let company = await tx.company.findFirst({
        where: {
          workspaceId: caller.workspaceId,
          domain: cleanDomain,
        },
      });

      if (!company) {
        const generatedName =
          body.companyName ||
          cleanDomain.split(".")[0].replace(/^./, (str) => str.toUpperCase()) + " Inc";

        company = await tx.company.create({
          data: {
            workspaceId: caller.workspaceId,
            domain: cleanDomain,
            name: generatedName,
            industry: "Technology",
            size: "100-500",
            intentScore: 40,
          },
        });
      }

      // 2. Find or create Contact if provided
      let contact = null;
      if (body.contactEmail) {
        contact = await tx.contact.findFirst({
          where: {
            workspaceId: caller.workspaceId,
            email: body.contactEmail.toLowerCase().trim(),
          },
        });

        if (!contact) {
          const cName = body.contactName || "Inbound Contact";
          const parts = cName.split(" ");
          contact = await tx.contact.create({
            data: {
              workspaceId: caller.workspaceId,
              companyId: company.id,
              email: body.contactEmail.toLowerCase().trim(),
              firstName: parts[0] || cName,
              lastName: parts.slice(1).join(" ") || "",
              title: body.contactTitle || "Decision Maker",
            },
          });
        }
      }

      // 3. Find matching active Lead for company in caller's workspace
      let lead = await tx.lead.findFirst({
        where: {
          workspaceId: caller.workspaceId,
          companyId: company.id,
          deletedAt: null,
        },
        include: {
          activities: {
            take: 15,
            orderBy: { createdAt: "desc" },
          },
        },
      });

      // 4. Record Activity in database
      const activity = await tx.activity.create({
        data: {
          workspaceId: caller.workspaceId,
          companyId: company.id,
          leadId: lead?.id || null,
          contactId: contact?.id || lead?.contactId || null,
          type: actType,
          title: body.title || `${body.signalType} registered`,
          description: factorDescription,
          metadata: body.metadata || undefined,
        },
      });

      // 5. Recalculate lead score if lead exists
      let previousScore = lead?.score ?? 0;
      let newScore = previousScore;
      let intentLevel: IntentLevel = lead?.intentLevel ?? IntentLevel.COLD;
      let scoreResult = null;

      if (lead) {
        const existingActivities = [
          ...lead.activities,
          {
            type: actType,
            createdAt: new Date(),
            title: activity.title,
            description: activity.description,
          },
        ];

        scoreResult = calculateLeadScore({
          title: body.contactTitle || "Engineering Leader",
          companySize: company.size,
          industry: company.industry,
          activities: existingActivities.map((a) => ({
            type: a.type,
            createdAt: a.createdAt,
            title: a.title,
            description: a.description,
          })),
        });

        newScore = scoreResult.score;
        intentLevel = scoreResult.intentLevel;
        const pointChange = newScore - previousScore;

        // Update lead in transaction
        await tx.lead.update({
          where: { id: lead.id },
          data: {
            score: newScore,
            intentLevel,
            lastActivityAt: new Date(),
          },
        });

        // Calculate true historical 7-day score movement from actual ScoreEvents inside transaction
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const pastEvents = await tx.scoreEvent.findMany({
          where: {
            leadId: lead.id,
            createdAt: { gte: sevenDaysAgo },
          },
          select: { delta: true },
        });
        const historicalMovement7d = pastEvents.reduce((acc, ev) => acc + ev.delta, 0) + pointChange;

        // Upsert LeadScore record
        await tx.leadScore.upsert({
          where: { leadId: lead.id },
          update: {
            currentScore: newScore,
            intentLevel,
            positiveFactors: scoreResult.positiveFactors as any,
            negativeFactors: scoreResult.negativeFactors as any,
            delta7d: historicalMovement7d,
            explanation: scoreResult.explanation,
            evidenceStrength: scoreResult.evidenceStrength,
            lastCalculatedAt: new Date(),
          },
          create: {
            workspaceId: caller.workspaceId,
            leadId: lead.id,
            currentScore: newScore,
            intentLevel,
            positiveFactors: scoreResult.positiveFactors as any,
            negativeFactors: scoreResult.negativeFactors as any,
            delta7d: historicalMovement7d,
            explanation: scoreResult.explanation,
            evidenceStrength: scoreResult.evidenceStrength,
          },
        });

        // Record ScoreEvent
        if (pointChange !== 0) {
          await tx.scoreEvent.create({
            data: {
              workspaceId: caller.workspaceId,
              leadId: lead.id,
              previousScore,
              newScore,
              delta: pointChange,
              factorName: body.signalType,
              reason: factorDescription,
            },
          });
        }
      }

      return { company, contact, lead, activity, previousScore, newScore, intentLevel, scoreResult };
    });

    const { company, lead, activity, previousScore, newScore, intentLevel, scoreResult } = transactionResult;

    // 6. Execute matching workspace automations in the background (non-blocking for fast API response)
    executeWorkspaceAutomations({
      workspaceId: caller.workspaceId,
      leadId: lead?.id,
      triggerType: newScore >= 80 ? "SCORE_THRESHOLD" : "SIGNAL_RECEIVED",
      currentScore: newScore,
      intentLevel,
      signalType: body.signalType,
      domain: cleanDomain,
      companyName: company.name,
    }).catch((err) => console.error("Background automation execution error:", err));

    return apiSuccess(
      {
        signal: {
          id: activity.id,
          signalType: body.signalType,
          domain: cleanDomain,
          companyId: company.id,
          companyName: company.name,
          recordedAt: activity.createdAt,
        },
        scoring: {
          leadId: lead?.id || null,
          previousScore,
          newScore,
          pointsDelta: newScore - previousScore,
          intentLevel,
          isSurging: newScore >= 80,
          factors: scoreResult?.positiveFactors || [],
          explanation: scoreResult?.explanation || "Activity registered into company telemetry timeline.",
        },
        automations: {
          status: "DISPATCHED_ASYNC",
          mode: "BACKGROUND",
        },
      },
      { durationMs: Date.now() - startTime },
      201
    );
  } catch (error: any) {
    console.error("Signal ingestion error:", error);
    return apiError("Failed to process inbound signal", 500, "INGESTION_ERROR", error.message);
  }
}

