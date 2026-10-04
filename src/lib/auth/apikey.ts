import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export interface ApiKeyValidationResult {
  valid: boolean;
  workspaceId?: string;
  keyId?: string;
  name?: string;
  permissions?: string[];
  error?: string;
}

/**
 * Validates a Bearer API key against the database using SHA-256 hash lookup.
 * API key format: sf_live_<prefix>_<secret>
 */
export async function validateApiKey(rawKey: string): Promise<ApiKeyValidationResult> {
  if (!rawKey || typeof rawKey !== "string") {
    return { valid: false, error: "Missing API key" };
  }

  const cleanKey = rawKey.replace(/^Bearer\s+/i, "").trim();

  // Pattern: sf_live_[8 chars]_[rest]
  const parts = cleanKey.split("_");
  if (parts.length < 4 || parts[0] !== "sf" || parts[1] !== "live") {
    return { valid: false, error: "Invalid API key format" };
  }

  const keyPrefix = parts[2];
  const hash = crypto.createHash("sha256").update(cleanKey).digest("hex");

  try {
    const keyRecord = await prisma.apiKey.findFirst({
      where: {
        keyPrefix,
      },
    });

    if (!keyRecord) {
      return { valid: false, error: "API key not found" };
    }

    // Constant-time comparison
    const expectedBuffer = Buffer.from(keyRecord.keyHash, "hex");
    const actualBuffer = Buffer.from(hash, "hex");

    if (expectedBuffer.length !== actualBuffer.length || !crypto.timingSafeEqual(expectedBuffer, actualBuffer)) {
      return { valid: false, error: "Invalid API key credentials" };
    }

    // Check expiration
    if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
      return { valid: false, error: "API key has expired" };
    }

    // Safely update lastUsedAt
    try {
      await prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { lastUsedAt: new Date() },
      });
    } catch {
      // In case key was concurrently removed in testing
    }

    const permissions = Array.isArray(keyRecord.permissions)
      ? (keyRecord.permissions as string[])
      : ["read", "write"];

    return {
      valid: true,
      workspaceId: keyRecord.workspaceId,
      keyId: keyRecord.id,
      name: keyRecord.name,
      permissions,
    };
  } catch (err: any) {
    console.error("API Key validation error:", err);
    return { valid: false, error: "API key verification failure" };
  }
}

/**
 * Generates a new API key pair: the plaintext secret to return once to the user,
 * and the database fields (keyPrefix, keyHash).
 */
export function generateApiKey(name: string) {
  const prefix = crypto.randomBytes(4).toString("hex"); // 8 chars
  const secret = crypto.randomBytes(24).toString("hex"); // 48 chars
  const fullKey = `sf_live_${prefix}_${secret}`;
  const keyHash = crypto.createHash("sha256").update(fullKey).digest("hex");

  return {
    fullKey,
    keyPrefix: prefix,
    keyHash,
  };
}
