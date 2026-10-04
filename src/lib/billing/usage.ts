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
