import { NextResponse } from "next/server";
import { getSession, getCurrentUserAndWorkspace } from "@/lib/auth/session";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    const userAndWs = await getCurrentUserAndWorkspace();
    if (!userAndWs || !userAndWs.user) {
      return apiError("Session is invalid or user no longer exists", 401, "INVALID_SESSION");
    }

    return apiSuccess({
      isAuthenticated: true,
      user: {
        id: userAndWs.user.id,
        name: userAndWs.user.name,
        email: userAndWs.user.email,
        avatarUrl: userAndWs.user.avatarUrl,
        role: userAndWs.role,
      },
      workspace: userAndWs.workspace
        ? {
            id: userAndWs.workspace.id,
            name: userAndWs.workspace.name,
            slug: userAndWs.workspace.slug,
            domain: userAndWs.workspace.domain,
            plan: userAndWs.workspace.plan,
          }
        : null,
    });
  } catch (error: any) {
    return apiError("Failed to fetch session", 500, "SESSION_ERROR", error.message);
  }
}

