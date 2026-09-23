import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth/session";
import { Plan, Role } from "@prisma/client";

export async function POST(request: Request) {
  try {
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

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        passwordHash,
        avatarUrl: `https://avatar.vercel.sh/${encodeURIComponent(name)}`,
      },
    });

    // Create workspace
    const wsName = accountType === "company" && companyName ? companyName : `${name}'s Workspace`;
    const slug = wsName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

    const workspace = await prisma.workspace.create({
      data: {
        name: wsName,
        slug,
        domain: website || null,
        plan: Plan.STARTER,
        settings: {
          accountType,
          industry,
          companySize,
          roleInCompany,
          primaryGoal,
        },
      },
    });

    // Join as Owner
    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: Role.OWNER,
      },
    });

    // Set usage record & subscription
    await prisma.usageRecord.create({
      data: {
        workspaceId: workspace.id,
        leadsCount: 0,
        aiCreditsUsed: 0,
        emailsSentCount: 0,
        teamMembersCount: 1,
      },
    });

    await prisma.subscription.create({
      data: {
        workspaceId: workspace.id,
        plan: Plan.STARTER,
        status: "ACTIVE",
      },
    });

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      workspaceId: workspace.id,
      role: Role.OWNER,
    });

    return NextResponse.json({
      success: true,
      workspaceId: workspace.id,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Account creation failed" }, { status: 500 });
  }
}
