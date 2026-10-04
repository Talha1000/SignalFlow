import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { generateApiKey } from "@/lib/auth/apikey";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateApiKeySchema = z.object({
  name: z.string().min(1, "Key name is required").max(100),
  permissions: z.array(z.enum(["read", "write"])).optional().default(["read", "write"]),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (!PERMISSIONS.MANAGE_API_KEYS(caller.role)) {
      return apiError("Insufficient permissions to view API keys", 403, "FORBIDDEN");
    }

    const keys = await prisma.apiKey.findMany({
      where: { workspaceId: caller.workspaceId },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        permissions: true,
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const sanitizedKeys = keys.map((k) => ({
      id: k.id,
      name: k.name,
      maskedKey: `sf_live_${k.keyPrefix}_••••••••••••••••`,
      permissions: k.permissions,
      lastUsedAt: k.lastUsedAt,
      createdAt: k.createdAt,
      expiresAt: k.expiresAt,
    }));

    return apiSuccess(sanitizedKeys, { total: sanitizedKeys.length, durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("GET /api/v1/keys error:", error);
    return apiError("Failed to fetch API keys", 500, "API_KEYS_FETCH_ERROR", error.message);
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    if (!PERMISSIONS.MANAGE_API_KEYS(caller.role)) {
      return apiError("Insufficient permissions to generate API keys", 403, "FORBIDDEN");
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = CreateApiKeySchema.safeParse(body);
    if (!parseResult.success) {
      return apiError("Invalid key request parameters", 400, "VALIDATION_ERROR", parseResult.error.format());
    }

    const { name, permissions, expiresInDays } = parseResult.data;

    const { fullKey, keyPrefix, keyHash } = generateApiKey(name);

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const record = await prisma.apiKey.create({
      data: {
        workspaceId: caller.workspaceId,
        name,
        keyPrefix,
        keyHash,
        permissions,
        expiresAt,
      },
    });

    return apiSuccess(
      {
        id: record.id,
        name: record.name,
        keyPrefix: record.keyPrefix,
        rawKey: fullKey, // plaintext key returned only once upon creation
        permissions: record.permissions,
        createdAt: record.createdAt,
        expiresAt: record.expiresAt,
      },
      { durationMs: Date.now() - startTime },
      201
    );
  } catch (error: any) {
    console.error("POST /api/v1/keys error:", error);
    return apiError("Failed to generate API key", 500, "API_KEY_CREATE_ERROR", error.message);
  }
}
