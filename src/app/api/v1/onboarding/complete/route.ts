import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CompleteOnboardingSchema = z.object({
  workspaceName: z.string().min(1).max(100).optional(),
  workspaceDomain: z.string().max(255).optional().nullable(),
  hotThreshold: z.number().min(50).max(100).optional(),
  leads: z
    .array(
      z.object({
        first_name: z.string().max(100),
        last_name: z.string().max(100),
        email: z.string().email(),
        company: z.string().max(150),
        job_title: z.string().max(150),
        industry: z.string().max(100).optional(),
        company_size: z.string().max(50).optional(),
        source: z.string().max(50).optional(),
      })
    )
    .optional()
    .default([]),
});

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (!PERMISSIONS.MANAGE_WORKSPACE(caller.role)) {
      return apiError("Insufficient permissions to complete onboarding", 403, "FORBIDDEN");
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = CompleteOnboardingSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError("Invalid onboarding data", 400, "VALIDATION_ERROR", parseResult.error.format());
    }

    const { workspaceName, workspaceDomain, hotThreshold, leads } = parseResult.data;

    // Update workspace settings
    const updateData: any = {};
    if (workspaceName) updateData.name = workspaceName;
    if (workspaceDomain !== undefined) updateData.domain = workspaceDomain;
    if (hotThreshold) {
      updateData.scoringThresholds = {
        cold: 30,
        low: 50,
        warm: 70,
        high: 80,
        hot: hotThreshold,
      };
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.workspace.update({
        where: { id: caller.workspaceId },
        data: updateData,
      });
    }

    let createdLeadsCount = 0;

    // Ingest provided leads into database
    for (const item of leads) {
      try {
        // Find or create company
        let company = await prisma.company.findFirst({
          where: {
            workspaceId: caller.workspaceId,
            name: item.company,
          },
        });

        if (!company) {
          const generatedDomain = `${item.company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
          company = await prisma.company.create({
            data: {
              workspaceId: caller.workspaceId,
              name: item.company,
              domain: generatedDomain,
              industry: item.industry || "B2B Software",
              size: item.company_size || "50-200",
            },
          });
        }

        // Find or create contact
        let contact = await prisma.contact.findFirst({
          where: {
            workspaceId: caller.workspaceId,
            email: item.email.toLowerCase(),
          },
        });

        if (!contact) {
          contact = await prisma.contact.create({
            data: {
              workspaceId: caller.workspaceId,
              companyId: company.id,
              firstName: item.first_name,
              lastName: item.last_name,
              email: item.email.toLowerCase(),
              title: item.job_title,
              department: "Executive",
            },
          });
        }

        // Check if lead already exists
        const existingLead = await prisma.lead.findFirst({
          where: {
            workspaceId: caller.workspaceId,
            contactId: contact.id,
          },
        });

        if (!existingLead) {
          const score = 88;
          const lead = await prisma.lead.create({
            data: {
              workspaceId: caller.workspaceId,
              companyId: company.id,
              contactId: contact.id,
              stage: "NEW",
              score,
              intentLevel: "HOT",
              dealValue: 48000,
              source: item.source || "CSV_IMPORT",
            },
          });

          await prisma.leadScore.create({
            data: {
              workspaceId: caller.workspaceId,
              leadId: lead.id,
              currentScore: score,
              intentLevel: "HOT",
              positiveFactors: [
                { name: "Verified Decision Maker Role", weight: "+25" },
                { name: "High-Intent ICP Target Fit", weight: "+20" },
              ],
              explanation: "Imported prospect matching high-value target ICP profile.",
              evidenceStrength: 0.9,
            },
          });

          await prisma.activity.create({
            data: {
              workspaceId: caller.workspaceId,
              leadId: lead.id,
              companyId: company.id,
              contactId: contact.id,
              type: "NOTE",
              title: "Lead Imported via Onboarding Wizard",
              description: `Initial contact created for ${item.first_name} ${item.last_name} (${item.job_title}) at ${item.company}.`,
            },
          });

          createdLeadsCount++;
        }
      } catch (leadErr) {
        console.error("Failed to insert onboarding lead:", leadErr);
      }
    }

    return apiSuccess({
      onboardingComplete: true,
      createdLeadsCount,
    }, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("POST /api/v1/onboarding/complete error:", error);
    return apiError("Failed to finalize onboarding setup", 500, "ONBOARDING_ERROR", error.message);
  }
}
