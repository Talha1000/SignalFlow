import { getSession } from "./session";
import { validateApiKey } from "./apikey";
import { Role } from "@prisma/client";

export interface CallerContext {
  workspaceId: string;
  userId?: string;
  role: Role;
  isApiKey: boolean;
  apiKeyName?: string;
}

/**
 * Resolves the authenticated caller for API requests, accepting either:
 * 1. An HTTP-only cookie session (web application client)
 * 2. A Bearer API key (external telemetry / integrations)
 */
export async function resolveCaller(request: Request): Promise<CallerContext | null> {
  // 1. Check for Bearer API token
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const rawToken = authHeader.substring(7).trim();
    if (rawToken.startsWith("sf_live_")) {
      const keyResult = await validateApiKey(rawToken);
      if (keyResult.valid && keyResult.workspaceId) {
        return {
          workspaceId: keyResult.workspaceId,
          role: Role.ADMIN,
          isApiKey: true,
          apiKeyName: keyResult.name,
        };
      }
      return null;
    }
  }

  // 2. Check for session cookie
  const session = await getSession();
  if (session) {
    return {
      workspaceId: session.workspaceId,
      userId: session.userId,
      role: session.role,
      isApiKey: false,
    };
  }

  return null;
}
