import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { attachSessionCookie, setSessionCookie } from "@/lib/auth/session";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { Plan, Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. IP-based rate limiting (10 signups per minute per IP)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`signup:${clientIp}`, { limit: 10, windowMs: 60000 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many signup attempts. Please try again in ${Math.ceil(rateLimit.resetMs / 1000)}s` },
        { status: 429 }
      );
    }

    const data = await request.json();
    const {
      email,
      password,
      name,
      accountType, // "individual" | "company"
      companyName,
      website,
      industry,
      companySize,
      roleInCompany,
      primaryGoal,
    } = data;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const requestedPlanStr = typeof data.plan === "string" ? data.plan.toUpperCase() : "STARTER";
    let selectedPlan: Plan = Plan.STARTER;
    if (requestedPlanStr === "FREE") selectedPlan = Plan.FREE;
    else if (requestedPlanStr === "GROWTH") selectedPlan = Plan.GROWTH;
    else if (requestedPlanStr === "BUSINESS") selectedPlan = Plan.BUSINESS;
    else if (requestedPlanStr === "ENTERPRISE") selectedPlan = Plan.ENTERPRISE;

    // 2. Transactional creation: User, Workspace, Member, Usage, Subscription all commit together
    const { user, workspace } = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: cleanEmail,
          name,
          passwordHash,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=38b6ff&color=121212`,
        },
      });

      const wsName = accountType === "company" && companyName ? companyName : `${name}'s Workspace`;
      const slug = wsName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

      const newWorkspace = await tx.workspace.create({
        data: {
          name: wsName,
          slug,
          domain: website || null,
          plan: selectedPlan,
          settings: {
            accountType,
            industry,
            companySize,
            roleInCompany,
            primaryGoal,
          },
        },
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: newWorkspace.id,
          userId: newUser.id,
          role: Role.OWNER,
        },
      });

      await tx.usageRecord.create({
        data: {
          workspaceId: newWorkspace.id,
          leadsCount: 0,
          aiCreditsUsed: 0,
          emailsSentCount: 0,
          teamMembersCount: 1,
        },
      });

      await tx.subscription.create({
        data: {
          workspaceId: newWorkspace.id,
          plan: selectedPlan,
          status: "ACTIVE",
        },
      });

      return { user: newUser, workspace: newWorkspace };
    });

    // 3. Issue and attach authenticated session cookie only after transaction succeeds
    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      workspaceId: workspace.id,
      role: Role.OWNER,
    };

    await setSessionCookie(sessionPayload, request);

    const response = NextResponse.json({
      success: true,
      workspaceId: workspace.id,
    });

    attachSessionCookie(response, sessionPayload, request);

    return response;
  } catch (error: any) {
    console.error("Signup transaction error:", error);
    return NextResponse.json({ error: "Account creation failed" }, { status: 500 });
  }
}
