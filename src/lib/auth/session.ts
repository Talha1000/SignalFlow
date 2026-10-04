import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing in production.");
    }
    return "signalflow_dev_secret_key_2026";
  }
  return secret;
}

const COOKIE_NAME = "signalflow_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  workspaceId: string;
  role: Role;
}

export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = signSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUserAndWorkspace() {
  const session = await getSession();
  
  if (session) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          memberships: {
            include: {
              workspace: true,
            },
          },
        },
      });

      if (user && user.memberships.length > 0) {
        const currentMembership = user.memberships.find(
          (m) => m.workspaceId === session.workspaceId
        ) || user.memberships[0];

        return {
          user,
          workspace: currentMembership ? currentMembership.workspace : null,
          role: currentMembership ? currentMembership.role : session.role,
        };
      }
    } catch (err) {
      console.error("Database query failed in getCurrentUserAndWorkspace:", err);
    }
  }

  // Explicit demo fallback permitted ONLY in non-production when DEMO_MODE is true
  if (process.env.NODE_ENV !== "production" && process.env.DEMO_MODE === "true") {
    return {
      user: {
        id: session?.userId || "user-demo",
        email: session?.email || "demo@signalflow.io",
        name: session?.name || "Demo User",
        avatarUrl: "https://avatar.vercel.sh/demo",
        memberships: [],
      },
      workspace: {
        id: session?.workspaceId || "ws-demo",
        name: "Demo Workspace",
        slug: "demo-workspace",
        domain: "signalflow.io",
        plan: "GROWTH" as any,
      },
      role: session?.role || Role.OWNER,
    };
  }

  // Strictly unauthenticated
  return null;
}

