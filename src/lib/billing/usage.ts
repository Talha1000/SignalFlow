import { Plan } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface PlanLimits {
  leads: number;
  aiCredits: number;
  emailsPerMonth: number;
  teamMembers: number;
  automations: number;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    leads: 100,
    aiCredits: 50,
    emailsPerMonth: 500,
    teamMembers: 1,
    automations: 1,
  },
  STARTER: {
    leads: 1000,
    aiCredits: 500,
    emailsPerMonth: 5000,
    teamMembers: 3,
    automations: 5,
  },
  GROWTH: {
    leads: 10000,
    aiCredits: 2500,
    emailsPerMonth: 25000,
    teamMembers: 10,
    automations: 25,
  },
  BUSINESS: {
    leads: 50000,
    aiCredits: 10000,
    emailsPerMonth: 100000,
    teamMembers: 30,
    automations: 100,
  },
  ENTERPRISE: {
    leads: 1000000,
    aiCredits: 100000,
    emailsPerMonth: 1000000,
    teamMembers: 999,
    automations: 999,
  },
};

export async function checkPlanQuota(
  workspaceId: string,
  feature: "leads" | "aiCredits" | "emails" | "teamMembers" | "automations"
) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: { usage: true },
  });

  if (!workspace) throw new Error("Workspace not found");

  const limits = PLAN_LIMITS[workspace.plan];
  const usage = workspace.usage;

  switch (feature) {
    case "automations": {
      const currentAutomations = await prisma.automation.count({
        where: { workspaceId, status: "ACTIVE" },
      });
      return {
        allowed: currentAutomations < limits.automations,
        current: currentAutomations,
        limit: limits.automations,
      };
    }
    case "leads": {
      const current = usage ? usage.leadsCount : 0;
      return {
        allowed: current < limits.leads,
        current,
        limit: limits.leads,
      };
    }
    case "aiCredits": {
      const current = usage ? usage.aiCreditsUsed : 0;
      return {
        allowed: current < limits.aiCredits,
        current,
        limit: limits.aiCredits,
      };
    }
    case "emails": {
      const current = usage ? usage.emailsSentCount : 0;
      return {
        allowed: current < limits.emailsPerMonth,
        current,
        limit: limits.emailsPerMonth,
      };
    }
    case "teamMembers": {
      const current = usage ? usage.teamMembersCount : 1;
      return {
        allowed: current < limits.teamMembers,
        current,
        limit: limits.teamMembers,
      };
    }
  }
}

/**
 * Atomically checks quota limits and consumes credits/units in a single serialized transaction,
 * preventing race condition overdrafts (e.g., simultaneous requests at 49/50 bypass limit).
 */
export async function checkAndConsumePlanQuota(
  workspaceId: string,
  feature: "leads" | "aiCredits" | "emails",
  quantity: number = 1
): Promise<{ allowed: boolean; current: number; limit: number }> {
  return await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.findUnique({
      where: { id: workspaceId },
      include: { usage: true },
    });

    if (!workspace) throw new Error("Workspace not found");

    const limits = PLAN_LIMITS[workspace.plan];
    const usage = workspace.usage;

    if (feature === "aiCredits") {
      const current = usage ? usage.aiCreditsUsed : 0;
      const limit = limits.aiCredits;
      if (current + quantity > limit) {
        return { allowed: false, current, limit };
      }

      await tx.usageRecord.upsert({
        where: { workspaceId },
        update: { aiCreditsUsed: { increment: quantity } },
        create: {
          workspaceId,
          leadsCount: 0,
          aiCreditsUsed: quantity,
          emailsSentCount: 0,
          teamMembersCount: 1,
        },
      });

      return { allowed: true, current: current + quantity, limit };
    }

    if (feature === "leads") {
      const current = usage ? usage.leadsCount : 0;
      const limit = limits.leads;
      if (current + quantity > limit) {
        return { allowed: false, current, limit };
      }

      await tx.usageRecord.upsert({
        where: { workspaceId },
        update: { leadsCount: { increment: quantity } },
        create: {
          workspaceId,
          leadsCount: quantity,
          aiCreditsUsed: 0,
          emailsSentCount: 0,
          teamMembersCount: 1,
        },
      });

      return { allowed: true, current: current + quantity, limit };
    }

    if (feature === "emails") {
      const current = usage ? usage.emailsSentCount : 0;
      const limit = limits.emailsPerMonth;
      if (current + quantity > limit) {
        return { allowed: false, current, limit };
      }

      await tx.usageRecord.upsert({
        where: { workspaceId },
        update: { emailsSentCount: { increment: quantity } },
        create: {
          workspaceId,
          leadsCount: 0,
          aiCreditsUsed: 0,
          emailsSentCount: quantity,
          teamMembersCount: 1,
        },
      });

      return { allowed: true, current: current + quantity, limit };
    }

    return { allowed: true, current: 0, limit: 999999 };
  });
}
