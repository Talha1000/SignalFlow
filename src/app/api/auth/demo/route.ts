import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const targetEmail = (email || "alex.morgan@signalflow.io").toLowerCase().trim();

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
      return NextResponse.json({ error: "Demo user not found in database" }, { status: 404 });
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
