import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PLAN_LIMITS } from "@/lib/billing/usage";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: caller.workspaceId },
      include: {
        usage: true,
        subscription: true,
        _count: {
          select: {
            members: true,
            leads: true,
            automations: true,
          },
        },
      },
    });

    if (!workspace) {
      return apiError("Workspace not found", 404, "NOT_FOUND");
    }

    const limits = PLAN_LIMITS[workspace.plan];
    const actualLeads = workspace.usage?.leadsCount ?? workspace._count.leads;
    const actualEmails = workspace.usage?.emailsSentCount ?? 0;
    const actualAiCredits = workspace.usage?.aiCreditsUsed ?? 0;
    const actualMembers = workspace.usage?.teamMembersCount ?? workspace._count.members;
    const actualAutomations = workspace._count.automations;

    return apiSuccess({
      plan: workspace.plan,
      subscription: workspace.subscription,
      usage: {
        leads: { current: actualLeads, limit: limits.leads },
        emails: { current: actualEmails, limit: limits.emailsPerMonth },
        aiCredits: { current: actualAiCredits, limit: limits.aiCredits },
        teamMembers: { current: actualMembers, limit: limits.teamMembers },
        automations: { current: actualAutomations, limit: limits.automations },
      },
    }, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("GET /api/v1/workspace/usage error:", error);
    return apiError("Failed to fetch workspace usage", 500, "USAGE_FETCH_ERROR", error.message);
  }
}
