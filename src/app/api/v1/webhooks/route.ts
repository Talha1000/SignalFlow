import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { validateWebhookUrlAsync } from "@/lib/security/ssrf";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateWebhookSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  url: z.string().url("Valid URL required"),
  eventTypes: z.array(z.string()).optional().default(["lead.created", "lead.score_changed"]),
});

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (caller.isApiKey) {
      if (!caller.permissions?.includes("read")) {
        return apiError("API key lacks 'read' permission", 403, "FORBIDDEN");
      }
    } else {
      if (!PERMISSIONS.VIEW_SETTINGS(caller.role)) {
        return apiError("Insufficient permissions to view webhooks", 403, "FORBIDDEN");
      }
    }

    const webhooks = await prisma.webhook.findMany({
      where: { workspaceId: caller.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(webhooks, { total: webhooks.length, durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("GET /api/v1/webhooks error:", error);
    return apiError("Failed to fetch webhooks", 500, "WEBHOOKS_FETCH_ERROR", error.message);
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (caller.isApiKey) {
      if (!caller.permissions?.includes("write")) {
        return apiError("API key lacks 'write' permission", 403, "FORBIDDEN");
      }
    } else {
      if (!PERMISSIONS.MANAGE_WORKSPACE(caller.role)) {
        return apiError("Insufficient permissions to create webhooks", 403, "FORBIDDEN");
      }
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = CreateWebhookSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError("Invalid webhook parameters", 400, "VALIDATION_ERROR", parseResult.error.format());
    }

    const { name, url, eventTypes } = parseResult.data;

    // Fail-closed comprehensive SSRF validation
    const ssrfCheck = await validateWebhookUrlAsync(url);
    if (!ssrfCheck.valid) {
      return apiError(`SSRF Security Violation: ${ssrfCheck.reason}`, 400, "SSRF_VIOLATION");
    }

    const secret = `whsec_${crypto.randomBytes(24).toString("hex")}`;

    const webhook = await prisma.webhook.create({
      data: {
        workspaceId: caller.workspaceId,
        name,
        url,
        secret,
        eventTypes,
        active: true,
      },
    });

    return apiSuccess(webhook, { durationMs: Date.now() - startTime }, 201);
  } catch (error: any) {
    console.error("POST /api/v1/webhooks error:", error);
    return apiError("Failed to create webhook", 500, "WEBHOOK_CREATE_ERROR", error.message);
  }
}
