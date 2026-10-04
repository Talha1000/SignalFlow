import { getSession } from "./session";
import { validateApiKey } from "./apikey";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export interface CallerContext {
  workspaceId: string;
  userId?: string;
  role: Role;
  isApiKey: boolean;
  apiKeyName?: string;
  permissions: string[];
}

/**
 * Resolves the authenticated caller for API requests, accepting either:
 * 1. An HTTP-only cookie session (web application client)
 * 2. A Bearer API key (external telemetry / integrations)
 * 
 * Security guarantees:
 * - Session cookies are dynamically revalidated against live WorkspaceMember records in PostgreSQL.
 * - Stale JWTs after membership removal or role changes are rejected immediately.
 * - API keys are checked for explicit permissions (read, write, admin) and assigned corresponding role.
 */
export async function resolveCaller(request: Request): Promise<CallerContext | null> {
  // 1. Check for Bearer API token
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const rawToken = authHeader.substring(7).trim();
    if (rawToken.startsWith("sf_live_")) {
      const keyResult = await validateApiKey(rawToken);
      if (keyResult.valid && keyResult.workspaceId) {
        const perms = keyResult.permissions && keyResult.permissions.length > 0
          ? keyResult.permissions
          : ["read"];

        // Derive caller role strictly from granted permissions
        const role = perms.includes("admin")
          ? Role.ADMIN
          : perms.includes("write")
          ? Role.SALES_REP
          : Role.VIEWER;

        return {
          workspaceId: keyResult.workspaceId,
          role,
          isApiKey: true,
          apiKeyName: keyResult.name,
          permissions: perms,
        };
      }
      return null;
    }
  }

  // 2. Check for session cookie
  const session = await getSession();
  if (session) {
    try {
      // Revalidate membership in database to prevent stale JWT privilege retention
      const membership = await prisma.workspaceMember.findFirst({
        where: {
          userId: session.userId,
          workspaceId: session.workspaceId,
        },
      });

      if (membership) {
        return {
          workspaceId: membership.workspaceId,
          userId: session.userId,
          role: membership.role, // Live role from database
          isApiKey: false,
          permissions: ["read", "write", "admin"],
        };
      }
    } catch (err) {
      console.error("Failed to revalidate workspace membership in resolveCaller:", err);
    }

    // Explicit demo fallback permitted ONLY in non-production when DEMO_MODE is true
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.DEMO_MODE === "true" &&
      session.userId === "user-demo"
    ) {
      return {
        workspaceId: session.workspaceId,
        userId: session.userId,
        role: session.role,
        isApiKey: false,
        permissions: ["read", "write", "admin"],
      };
    }

    // Session has no valid active membership in target workspace
    return null;
  }

  return null;
}

