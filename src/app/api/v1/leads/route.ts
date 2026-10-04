import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { calculateLeadScore } from "@/lib/scoring/engine";
import { logAuditEvent } from "@/lib/audit/logger";
import { checkPlanQuota } from "@/lib/billing/usage";
import { executeWorkspaceAutomations } from "@/lib/automations/executor";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType, LeadStage, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (caller.isApiKey && !caller.permissions?.includes("read")) {
      return apiError("API key lacks 'read' permission", 403, "FORBIDDEN");
    }

    if (!caller.isApiKey && !PERMISSIONS.VIEW_LEADS(caller.role)) {
      return apiError("Insufficient permissions to view leads", 403, "FORBIDDEN");
    }

    const { searchParams } = new URL(request.url);
    const intent = searchParams.get("intent");
    const stage = searchParams.get("stage");
    const minScore = searchParams.get("minScore") ? Number(searchParams.get("minScore")) : null;
    const search = searchParams.get("search")?.toLowerCase().trim();
    const sortBy = searchParams.get("sortBy") || "score";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));

    // Build multi-tenant Prisma where clause strictly scoped to caller's workspace
    const where: Prisma.LeadWhereInput = {
      workspaceId: caller.workspaceId,
      deletedAt: null,
    };

    if (intent) {
      where.intentLevel = intent.toUpperCase() as any;
    }
    if (stage) {
      where.stage = stage.toUpperCase() as any;
    }
    if (minScore !== null && !isNaN(minScore)) {
      where.score = { gte: minScore };
    }
    if (search) {
      where.OR = [
        { company: { name: { contains: search, mode: "insensitive" } } },
        { contact: { firstName: { contains: search, mode: "insensitive" } } },
        { contact: { lastName: { contains: search, mode: "insensitive" } } },
        { contact: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Determine sorting field
    const orderBy: Prisma.LeadOrderByWithRelationInput = {};
    if (sortBy === "dealValue") {
      orderBy.dealValue = order;
    } else if (sortBy === "createdAt") {
      orderBy.createdAt = order;
    } else if (sortBy === "lastActivityAt") {
      orderBy.lastActivityAt = order;
    } else {
      orderBy.score = order;
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          company: true,
          contact: true,
          owner: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
          leadScore: true,
          activities: {
            take: 5,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
    ]);

    return apiSuccess(leads, {
      total,
      page,
      limit,
      durationMs: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error("GET /api/v1/leads error:", error);
    return apiError("Failed to fetch leads", 500, "LEADS_FETCH_ERROR", error.message);
  }
}

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

    if (!caller.isApiKey && !PERMISSIONS.CREATE_LEAD(caller.role)) {
      return apiError("Insufficient permissions to create leads", 403, "FORBIDDEN");
    }

    // Check workspace plan quota
    const quotaCheck = await checkPlanQuota(caller.workspaceId, "leads");
    if (!quotaCheck.allowed) {
      return apiError(
        `Workspace lead limit reached (${quotaCheck.current}/${quotaCheck.limit}). Please upgrade plan.`,
        403,
        "QUOTA_EXCEEDED"
      );
    }

    const body = await request.json();

    if (!body.companyName && !body.contactName) {
      return apiError(
        "Missing required fields: at least 'companyName' or 'contactName' is required.",
        400,
        "VALIDATION_FAILED"
      );
    }

    const companyName = body.companyName || "Unknown Organization";
    const contactName = body.contactName || "Primary Contact";
    const nameParts = contactName.split(" ");
    const firstName = nameParts[0] || contactName;
    const lastName = nameParts.slice(1).join(" ") || "";
    const domain = body.domain || `${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
    const contactEmail = body.email || `contact@${domain}`;

    // 1. Find or create Company strictly scoped to workspace
    let company = await prisma.company.findFirst({
      where: {
        workspaceId: caller.workspaceId,
        OR: [{ name: companyName }, { domain }],
      },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          workspaceId: caller.workspaceId,
          name: companyName,
          domain,
          industry: body.industry || "B2B Technology",
          size: body.companySize || "100-500",
          annualRevenue: body.annualRevenue || "$10M-$50M",
          location: body.location || "North America",
          intentScore: 50,
        },
      });
    }

    // 2. Find or create Contact strictly scoped to workspace
    let contact = await prisma.contact.findFirst({
      where: {
        workspaceId: caller.workspaceId,
        email: contactEmail,
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          workspaceId: caller.workspaceId,
          companyId: company.id,
          firstName,
          lastName,
          email: contactEmail,
          title: body.title || "Decision Maker",
          department: body.department || "Operations",
          phone: body.phone || null,
        },
      });
    }

    // 3. Calculate score deterministically
    const scoreResult = calculateLeadScore({
      title: body.title || contact.title,
      companySize: company.size,
      industry: company.industry,
      activities: [
        {
          type: ActivityType.PAGE_VIEW,
          createdAt: new Date(),
          title: "Initial lead ingestion",
          description: "Created via SignalFlow CRM",
        },
      ],
    });

    const dealValue = Number(body.dealValue || 45000);

    // 4. Create Lead in database
    const lead = await prisma.lead.create({
      data: {
        workspaceId: caller.workspaceId,
        companyId: company.id,
        contactId: contact.id,
        ownerId: caller.userId || null,
        stage: (body.stage?.toUpperCase() as LeadStage) || LeadStage.NEW,
        dealValue,
        score: scoreResult.score,
        intentLevel: scoreResult.intentLevel,
        source: body.source || "WEBSITE",
        nextAction: body.nextAction || "Initiate qualification sequence",
      },
      include: {
        company: true,
        contact: true,
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });

    // 5. Create LeadScore record
    const leadScore = await prisma.leadScore.create({
      data: {
        workspaceId: caller.workspaceId,
        leadId: lead.id,
        currentScore: scoreResult.score,
        intentLevel: scoreResult.intentLevel,
        positiveFactors: scoreResult.positiveFactors as any,
        negativeFactors: scoreResult.negativeFactors as any,
        delta7d: scoreResult.scoreChange7d,
        explanation: scoreResult.explanation,
        evidenceStrength: scoreResult.evidenceStrength,
      },
    });

    // 6. Record initial ScoreEvent
    await prisma.scoreEvent.create({
      data: {
        workspaceId: caller.workspaceId,
        leadId: lead.id,
        previousScore: 0,
        newScore: scoreResult.score,
        delta: scoreResult.score,
        factorName: "INITIAL_CALCULATION",
        reason: "Initial lead profile scoring",
      },
    });

    // 7. Record Activity
    await prisma.activity.create({
      data: {
        workspaceId: caller.workspaceId,
        leadId: lead.id,
        companyId: company.id,
        contactId: contact.id,
        type: ActivityType.PAGE_VIEW,
        title: "Lead Profile Created",
        description: `Lead registered with intent score ${scoreResult.score}`,
      },
    });

    // 8. Write Audit Log
    await logAuditEvent({
      workspaceId: caller.workspaceId,
      userId: caller.userId,
      action: "LEAD_CREATED",
      entityType: "Lead",
      entityId: lead.id,
      details: {
        companyName: company.name,
        contactEmail: contact.email,
        initialScore: scoreResult.score,
      },
    });

    // 9. Increment UsageRecord
    await prisma.usageRecord.upsert({
      where: { workspaceId: caller.workspaceId },
      update: { leadsCount: { increment: 1 } },
      create: {
        workspaceId: caller.workspaceId,
        leadsCount: 1,
        aiCreditsUsed: 0,
        emailsSentCount: 0,
        teamMembersCount: 1,
      },
    });

    // 10. Execute workspace automations for LEAD_CREATED
    executeWorkspaceAutomations({
      workspaceId: caller.workspaceId,
      leadId: lead.id,
      triggerType: "LEAD_CREATED",
      currentScore: scoreResult.score,
      intentLevel: scoreResult.intentLevel,
      companyName: company.name,
    }).catch((e) => console.error("Automations execution error:", e));

    return apiSuccess(
      {
        ...lead,
        leadScore,
      },
      { durationMs: Date.now() - startTime },
      201
    );
  } catch (error: any) {
    console.error("POST /api/v1/leads error:", error);
    return apiError("Failed to create lead", 500, "LEAD_CREATE_ERROR", error.message);
  }
}

