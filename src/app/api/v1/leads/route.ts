import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { calculateLeadScore } from "@/lib/scoring/engine";
import { logAuditEvent } from "@/lib/audit/logger";
import { executeWorkspaceAutomations } from "@/lib/automations/executor";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType, LeadStage, Prisma } from "@prisma/client";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { checkAndConsumePlanQuota, PLAN_LIMITS } from "@/lib/billing/usage";
import { z } from "zod";

const CreateLeadSchema = z.object({
  companyName: z.string().max(255).optional(),
  contactName: z.string().max(255).optional(),
  email: z.string().email("Invalid email format").max(255).optional(),
  title: z.string().max(255).optional(),
  department: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  domain: z.string().max(255).optional(),
  dealValue: z.union([z.number(), z.string()]).optional(),
  stage: z.string().max(50).optional(),
  source: z.string().max(100).optional(),
  nextAction: z.string().max(255).optional(),
  industry: z.string().max(100).optional(),
  companySize: z.string().max(50).optional(),
  annualRevenue: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
}).refine((data) => data.companyName || data.contactName, {
  message: "Missing required fields: at least 'companyName' or 'contactName' is required.",
});

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

    // Rate Limiting: 60 lead creations per minute per caller
    const clientIp = getClientIp(request);
    const rateKey = `leads:create:${caller.apiKeyId || caller.userId || clientIp}`;
    const rateCheck = checkRateLimit(rateKey, { limit: 60, windowMs: 60000 });
    if (!rateCheck.success) {
      return apiError("Lead creation rate limit exceeded (60 requests/min)", 429, "RATE_LIMITED");
    }

    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return apiError("Malformed JSON request payload", 400, "BAD_REQUEST");
    }

    const parseResult = CreateLeadSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(issue, 400, "VALIDATION_FAILED", parseResult.error.format());
    }

    const body = parseResult.data;

    const companyName = body.companyName || "Unknown Organization";
    const contactName = body.contactName || "Primary Contact";
    const nameParts = contactName.split(" ");
    const firstName = nameParts[0] || contactName;
    const lastName = nameParts.slice(1).join(" ") || "";
    const domain = body.domain || `${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
    const contactEmail = body.email || `contact@${domain}`;

    // Atomically execute lead creation, company/contact resolution, score records, and quota increment
    // If any database operation fails, the transaction rolls back completely and NO quota is consumed.
    const createdData = await prisma.$transaction(async (tx) => {
      // 1. Check workspace plan quota within transaction
      const workspace = await tx.workspace.findUnique({
        where: { id: caller.workspaceId },
        include: { usage: true },
      });
      if (!workspace) throw new Error("Workspace not found");

      const limits = PLAN_LIMITS[workspace.plan];
      const currentLeads = workspace.usage ? workspace.usage.leadsCount : 0;
      if (currentLeads + 1 > limits.leads) {
        throw new Error(`QUOTA_EXCEEDED:${currentLeads}:${limits.leads}`);
      }

      // 2. Find or create Company strictly scoped to workspace
      let company = await tx.company.findFirst({
        where: {
          workspaceId: caller.workspaceId,
          OR: [{ name: companyName }, { domain }],
        },
      });

      if (!company) {
        company = await tx.company.create({
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

      // 3. Find or create Contact strictly scoped to workspace
      let contact = await tx.contact.findFirst({
        where: {
          workspaceId: caller.workspaceId,
          email: contactEmail,
        },
      });

      if (!contact) {
        contact = await tx.contact.create({
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

      // 4. Calculate score deterministically
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

      // 5. Create Lead in database
      const lead = await tx.lead.create({
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

      // 6. Create LeadScore record
      const leadScore = await tx.leadScore.create({
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

      // 7. Record initial ScoreEvent
      await tx.scoreEvent.create({
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

      // 8. Record Activity
      await tx.activity.create({
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

      // 9. Consume quota atomically inside the same transaction
      await tx.usageRecord.upsert({
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

      return { lead, leadScore, scoreResult, company, contact };
    });

    const { lead, leadScore, scoreResult, company, contact } = createdData;

    // Write Audit Log
    await logAuditEvent({
      workspaceId: caller.workspaceId,
      userId: caller.userId,
      action: "LEAD_CREATED",
      entityType: "Lead",
      entityId: lead.id,
      ipAddress: clientIp,
      details: {
        companyName: company.name,
        contactEmail: contact.email,
        initialScore: scoreResult.score,
      },
    });

    // Execute workspace automations asynchronously (non-blocking)
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

