import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // In production, demo mode is disabled unless explicitly enabled via DEMO_MODE=true
    if (process.env.NODE_ENV === "production" && process.env.DEMO_MODE !== "true") {
      return NextResponse.json(
        { error: "Demo persona login is disabled in production. Please use your credentials." },
        { status: 403 }
      );
    }

    let email = "alex.morgan@signalflow.io";
    try {
      const body = await request.json();
      if (body?.email) email = body.email;
    } catch {
      // empty body fallback
    }

    const targetEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!user || user.memberships.length === 0) {
      return NextResponse.json(
        { error: `Demo account (${targetEmail}) not found in database. Please run 'npm run seed' first.` },
        { status: 404 }
      );
    }

    const membership = user.memberships[0];

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      workspaceId: membership.workspaceId,
      role: membership.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        workspaceId: membership.workspaceId,
        workspaceName: membership.workspace.name,
        role: membership.role,
      },
    });
  } catch (error: any) {
    console.error("Demo login error:", error);
    return NextResponse.json({ error: "Demo login failed" }, { status: 500 });
  }
}

