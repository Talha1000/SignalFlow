import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { checkPlanQuota } from "@/lib/billing/usage";
import { apiSuccess, apiError } from "@/lib/api/response";
import { Role } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const InviteMemberSchema = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().min(1, "Name is required").max(100),
  role: z.enum(["ADMIN", "MANAGER", "SALES_REP", "VIEWER"]).default("SALES_REP"),
});

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (!PERMISSIONS.MANAGE_TEAM(caller.role)) {
      return apiError("Insufficient permissions to invite team members", 403, "FORBIDDEN");
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = InviteMemberSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError("Invalid invite parameters", 400, "VALIDATION_ERROR", parseResult.error.format());
    }

    const { email, name, role } = parseResult.data;

    // Check plan teamMembers quota
    const quota = await checkPlanQuota(caller.workspaceId, "teamMembers");
    if (!quota.allowed) {
      return apiError(
        `Team seat limit reached (${quota.current}/${quota.limit}). Upgrade your plan to invite more members.`,
        403,
        "SEAT_LIMIT_EXCEEDED"
      );
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Create user with secure random temporary password hash
      const tempPassword = crypto.randomBytes(16).toString("hex");
      const passwordHash = await bcrypt.hash(tempPassword, 10);
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          passwordHash,
        },
      });
    }

    // Check if membership already exists in this workspace
    const existingMembership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: caller.workspaceId,
          userId: user.id,
        },
      },
    });

    if (existingMembership) {
      return apiError("User is already a member of this workspace", 409, "ALREADY_MEMBER");
    }

    const membership = await prisma.workspaceMember.create({
      data: {
        workspaceId: caller.workspaceId,
        userId: user.id,
        role: role as Role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update usage record for teamMembersCount
    await prisma.usageRecord.upsert({
      where: { workspaceId: caller.workspaceId },
      update: { teamMembersCount: { increment: 1 } },
      create: {
        workspaceId: caller.workspaceId,
        leadsCount: 0,
        aiCreditsUsed: 0,
        emailsSentCount: 0,
        teamMembersCount: 2,
      },
    });

    return apiSuccess(membership, { durationMs: Date.now() - startTime }, 201);
  } catch (error: any) {
    console.error("POST /api/v1/team/invite error:", error);
    return apiError("Failed to invite team member", 500, "TEAM_INVITE_ERROR", error.message);
  }
}
