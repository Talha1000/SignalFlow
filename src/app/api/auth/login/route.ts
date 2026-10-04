import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { attachSessionCookie, setSessionCookie } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
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

    const isValid = await bcrypt.compare(String(password), user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const primaryMembership = user.memberships[0];
    if (!primaryMembership) {
      return NextResponse.json({ error: "User is not assigned to any workspace" }, { status: 403 });
    }

    const wsId = primaryMembership.workspaceId;
    const wsName = primaryMembership.workspace.name;
    const role = primaryMembership.role;

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      workspaceId: wsId,
      role,
    };

    await setSessionCookie(sessionPayload, request);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        workspaceId: wsId,
        workspaceName: wsName,
        role,
      },
    });

    attachSessionCookie(response, sessionPayload, request);

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 });
  }
}

