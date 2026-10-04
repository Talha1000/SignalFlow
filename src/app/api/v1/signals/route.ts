import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { calculateLeadScore } from "@/lib/scoring/engine";
import { executeWorkspaceAutomations } from "@/lib/automations/executor";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType, IntentLevel, LeadStage } from "@prisma/client";

export const dynamic = "force-dynamic";

interface SignalPayload {
  domain: string;
  companyName?: string;
  signalType: "PRICING_VISIT" | "DOCS_VIEW" | "DEMO_VISIT" | "GITHUB_STAR" | "EXECUTIVE_HIRE" | "EMAIL_REPLY" | "PAGE_VIEW";
  title?: string;
  contactEmail?: string;
  contactName?: string;
  contactTitle?: string;
  metadata?: Record<string, any>;
}

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

    const body: SignalPayload = await request.json();

    if (!body.domain || !body.signalType) {
      return apiError("Missing required fields: 'domain' and 'signalType' are mandatory.", 400, "VALIDATION_FAILED");
    }

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

    // 1. Find or create Company in caller's workspace
    let company = await prisma.company.findFirst({
      where: {
        workspaceId: caller.workspaceId,
        domain: cleanDomain,
      },
    });

    if (!company) {
      const generatedName =
        body.companyName ||
        cleanDomain.split(".")[0].replace(/^./, (str) => str.toUpperCase()) + " Inc";

      company = await prisma.company.create({
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
      contact = await prisma.contact.findFirst({
        where: {
          workspaceId: caller.workspaceId,
          email: body.contactEmail.toLowerCase().trim(),
        },
      });

      if (!contact) {
        const cName = body.contactName || "Inbound Contact";
        const parts = cName.split(" ");
        contact = await prisma.contact.create({
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
    let lead = await prisma.lead.findFirst({
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
    const activity = await prisma.activity.create({
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

      // Update lead in Prisma
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          score: newScore,
          intentLevel,
          lastActivityAt: new Date(),
        },
      });

      // Upsert LeadScore record
      await prisma.leadScore.upsert({
        where: { leadId: lead.id },
        update: {
          currentScore: newScore,
          intentLevel,
          positiveFactors: scoreResult.positiveFactors as any,
          negativeFactors: scoreResult.negativeFactors as any,
          delta7d: scoreResult.scoreChange7d,
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
          delta7d: scoreResult.scoreChange7d,
          explanation: scoreResult.explanation,
          evidenceStrength: scoreResult.evidenceStrength,
        },
      });

      // Record ScoreEvent
      if (pointChange !== 0) {
        await prisma.scoreEvent.create({
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

    // 6. Execute matching workspace automations
    const automationOutcomes = await executeWorkspaceAutomations({
      workspaceId: caller.workspaceId,
      leadId: lead?.id,
      triggerType: newScore >= 80 ? "SCORE_THRESHOLD" : "SIGNAL_RECEIVED",
      currentScore: newScore,
      intentLevel,
      signalType: body.signalType,
      domain: cleanDomain,
      companyName: company.name,
    });

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
          triggeredCount: automationOutcomes.length,
          outcomes: automationOutcomes,
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

