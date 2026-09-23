import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "signalflow_dev_secret_key_2026";
const COOKIE_NAME = "signalflow_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  workspaceId: string;
  role: Role;
}

export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
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
  if (!session) return null;

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

  if (!user) return null;

  const currentMembership = user.memberships.find(
    (m) => m.workspaceId === session.workspaceId
  ) || user.memberships[0];

  return {
    user,
    workspace: currentMembership ? currentMembership.workspace : null,
    role: currentMembership ? currentMembership.role : Role.VIEWER,
  };
}
