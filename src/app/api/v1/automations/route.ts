import { NextResponse } from "next/server";
import { getAutomationsSafe } from "@/lib/mockData";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    const automations = await getAutomationsSafe();
    return apiSuccess(automations, { total: automations.length, durationMs: Date.now() - startTime });
  } catch (error: any) {
    return apiError("Failed to fetch automations", 500, "AUTOMATIONS_ERROR", error.message);
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();
    const { automationId, eventType, leadId } = body;

    const executionResult = {
      executionId: `exec_${Math.random().toString(36).substring(2, 9)}`,
      automationId: automationId || "auto-1",
      status: "EXECUTED_SUCCESSFULLY",
      action: "SLACK_ALERT_AND_CADENCE_SYNC",
      details: {
        channel: "#sales-hot-leads",
        leadId: leadId || "lead-1",
        eventType: eventType || "SCORE_SURGE_THRESHOLD",
        dispatchedAt: new Date().toISOString(),
      },
    };

    return apiSuccess(executionResult, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    return apiError("Failed to trigger automation", 500, "TRIGGER_ERROR", error.message);
  }
}
