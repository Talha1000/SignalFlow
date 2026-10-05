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

export async function getSession(request?: Request): Promise<SessionPayload | null> {
  // 1. Direct cookie header extraction when request is provided
  if (request) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
      if (match && match[1]) {
        return verifySessionToken(decodeURIComponent(match[1]));
      }
    }
  }

  // 2. Next.js dynamic cookie store fallback
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export function getCookieOptions(req?: Request) {
  const host = req?.headers.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const isHttps = req?.headers.get("x-forwarded-proto") === "https" || (req?.url?.startsWith("https://") ?? false);
  // Browsers strictly reject Secure cookies on insecure HTTP localhost.
  const secure = !isLocal && (isHttps || (process.env.NODE_ENV === "production" && process.env.COOKIE_INSECURE !== "true"));

  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };
}

export function attachSessionCookie(response: any, payload: SessionPayload, req?: Request): string {
  const token = signSessionToken(payload);
  const opts = getCookieOptions(req);
  response.cookies.set(COOKIE_NAME, token, opts);
  return token;
}

export async function setSessionCookie(payload: SessionPayload, req?: Request): Promise<string> {
  const token = signSessionToken(payload);
  const opts = getCookieOptions(req);
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, opts);
  } catch {
    // If called outside AsyncLocalStorage context
  }
  return token;
}

export async function clearSessionCookie(response?: any): Promise<void> {
  if (response?.cookies) {
    response.cookies.delete(COOKIE_NAME);
  }
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch {
    // ignore
  }
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
        avatarUrl: "https://ui-avatars.com/api/?name=Demo&background=38b6ff&color=121212",
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

