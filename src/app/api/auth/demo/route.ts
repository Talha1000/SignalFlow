import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { attachSessionCookie, setSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // In production, demo mode is enabled if DEMO_MODE=true or if not in strict prod
    const isDemoAllowed = process.env.DEMO_MODE === "true" || process.env.NODE_ENV !== "production";
    if (!isDemoAllowed) {
      return NextResponse.json(
        { error: "Demo persona login is disabled. Please use your credentials." },
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

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      workspaceId: membership.workspaceId,
      role: membership.role,
    };

    // Set cookie in AsyncLocalStorage store
    await setSessionCookie(sessionPayload, request);

    // Also attach cookie header explicitly to outgoing response
    const response = NextResponse.json({
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

    attachSessionCookie(response, sessionPayload, request);

    return response;
  } catch (error: any) {
    console.error("Demo login error:", error);
    return NextResponse.json({ error: "Demo login failed" }, { status: 500 });
  }
}

