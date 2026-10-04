import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { PERMISSIONS } from "@/lib/auth/rbac";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateSequenceSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "DRAFT"]).optional().default("ACTIVE"),
  steps: z
    .array(
      z.object({
        stepOrder: z.number().int().min(1),
        delayDays: z.number().int().min(0).default(0),
        stepType: z.enum(["EMAIL", "WAIT", "TASK"]).default("EMAIL"),
        subject: z.string().max(300).optional(),
        body: z.string().min(1, "Body is required"),
      })
    )
    .optional()
    .default([]),
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
      if (!PERMISSIONS.VIEW_SEQUENCES(caller.role)) {
        return apiError("Insufficient permissions to view sequences", 403, "FORBIDDEN");
      }
    }

    const sequences = await prisma.sequence.findMany({
      where: { workspaceId: caller.workspaceId },
      include: {
        steps: { orderBy: { stepOrder: "asc" } },
        enrollments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(sequences, { total: sequences.length, durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("GET /api/v1/sequences error:", error);
    return apiError("Failed to fetch sequences", 500, "SEQUENCES_FETCH_ERROR", error.message);
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
      if (!PERMISSIONS.MANAGE_SEQUENCES(caller.role)) {
        return apiError("Insufficient permissions to create sequences", 403, "FORBIDDEN");
      }
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = CreateSequenceSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError("Invalid sequence parameters", 400, "VALIDATION_ERROR", parseResult.error.format());
    }

    const { name, description, status, steps } = parseResult.data;

    const sequence = await prisma.sequence.create({
      data: {
        workspaceId: caller.workspaceId,
        name,
        description: description || null,
        status,
        enrolledCount: 0,
        openRate: 0,
        clickRate: 0,
        replyRate: 0,
        steps: {
          create: steps.map((s, idx) => ({
            stepOrder: s.stepOrder || idx + 1,
            delayDays: s.delayDays,
            stepType: s.stepType,
            subject: s.subject || null,
            body: s.body,
          })),
        },
      },
      include: {
        steps: { orderBy: { stepOrder: "asc" } },
        enrollments: true,
      },
    });

    return apiSuccess(sequence, { durationMs: Date.now() - startTime }, 201);
  } catch (error: any) {
    console.error("POST /api/v1/sequences error:", error);
    return apiError("Failed to create sequence", 500, "SEQUENCE_CREATE_ERROR", error.message);
  }
}
