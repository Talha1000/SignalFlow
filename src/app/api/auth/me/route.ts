import { NextResponse } from "next/server";
import { getSession, getCurrentUserAndWorkspace } from "@/lib/auth/session";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      // In demo mode, return default active session
      return apiSuccess({
        isAuthenticated: true,
        isDemo: true,
        user: {
          id: "user-1",
          name: "Alex Morgan",
          email: "alex@signalflow.io",
          role: "OWNER",
        },
        workspace: {
          id: "ws-default",
          name: "Acme Revenue Org",
          plan: "GROWTH",
        },
      });
    }

    const userAndWs = await getCurrentUserAndWorkspace();

    return apiSuccess({
      isAuthenticated: true,
      isDemo: false,
      user: {
        id: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
      },
      workspace: userAndWs?.workspace || {
        id: session.workspaceId,
        name: "Acme Revenue Org",
        plan: "GROWTH",
      },
    });
  } catch (error: any) {
    return apiError("Failed to fetch session", 500, "SESSION_ERROR", error.message);
  }
}
