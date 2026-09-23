import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const primaryMembership = user.memberships[0];
    if (!primaryMembership) {
      return NextResponse.json({ error: "No workspace found for this user" }, { status: 400 });
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      workspaceId: primaryMembership.workspaceId,
      role: primaryMembership.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        workspaceId: primaryMembership.workspaceId,
        workspaceName: primaryMembership.workspace.name,
        role: primaryMembership.role,
      },
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
