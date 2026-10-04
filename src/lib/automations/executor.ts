import { prisma } from "@/lib/prisma";
import { ActivityType, LeadStage, Prisma } from "@prisma/client";

export interface AutomationTriggerContext {
  workspaceId: string;
  automationId?: string;
  leadId?: string;
  triggerType: "SCORE_THRESHOLD" | "LEAD_CREATED" | "SIGNAL_RECEIVED" | "STAGE_CHANGE";
  currentScore?: number;
  intentLevel?: string;
  signalType?: string;
  domain?: string;
  companyName?: string;
}

export interface AutomationExecutionOutcome {
  automationId: string;
  automationName: string;
  status: "SUCCESS" | "NOT_CONFIGURED" | "SKIPPED" | "FAILED";
  actionsExecuted: Array<{
    type: string;
    status: "COMPLETED" | "NOT_CONFIGURED" | "FAILED";
    message: string;
  }>;
}

import {
  isSafePublicWebhookUrl,
  isSafePublicWebhookUrlAsync,
  isPrivateIp,
} from "@/lib/security/ssrf";

export {
  isSafePublicWebhookUrl,
  isSafePublicWebhookUrlAsync,
  isPrivateIp,
};

/**
 * Evaluates and executes active automations in the workspace matching the event.
 * Uses atomic Prisma transactions for internal database updates and records failed states honestly.
 */
export async function executeWorkspaceAutomations(
  context: AutomationTriggerContext
): Promise<AutomationExecutionOutcome[]> {
  const outcomes: AutomationExecutionOutcome[] = [];

  try {
    const whereClause: Prisma.AutomationWhereInput = {
      workspaceId: context.workspaceId,
      status: "ACTIVE",
    };
    if (context.automationId) {
      whereClause.id = context.automationId;
    }

    const automations = await prisma.automation.findMany({
      where: whereClause,
    });

    for (const auto of automations) {
      try {
        // Check if trigger matches
        let matches = false;
        const nodes = Array.isArray(auto.nodes) ? (auto.nodes as any[]) : [];
        const triggerNode = nodes.find((n) => n.type === "trigger" || n.data?.nodeType === "trigger");

        if (
          auto.triggerType === context.triggerType ||
          triggerNode?.data?.triggerType === context.triggerType ||
          (context.triggerType === "SCORE_THRESHOLD" && auto.triggerType.startsWith("SCORE_"))
        ) {
          matches = true;
        }

        if (!matches) continue;

        // Evaluate trigger conditions
        if (context.triggerType === "SCORE_THRESHOLD" && context.currentScore !== undefined) {
          const minScore = triggerNode?.data?.value ?? triggerNode?.data?.minScore ?? 80;
          if (context.currentScore < minScore) {
            continue; // score threshold not met
          }
        }

        const actionsExecuted: AutomationExecutionOutcome["actionsExecuted"] = [];
        let overallStatus: "SUCCESS" | "NOT_CONFIGURED" | "FAILED" = "SUCCESS";

        // Separate external calls from internal database transaction operations
        const actionNodes = nodes.filter((n) => n.type === "action" || n.data?.nodeType === "action");

        // Prepare transactional database operations
        const txOperations: Prisma.PrismaPromise<any>[] = [];

        if (actionNodes.length === 0) {
          // Default fallback action: in-app notification
          txOperations.push(
            prisma.notification.create({
              data: {
                workspaceId: context.workspaceId,
                title: `High Intent Lead Alert: ${context.companyName || "Account"}`,
                message: `Lead scored ${context.currentScore || 85}+ (${context.intentLevel || "HOT"}). Immediate outreach advised.`,
                type: "LEAD_HOT",
                link: context.leadId ? `/app/leads/${context.leadId}` : "/app/leads",
              },
            })
          );
          actionsExecuted.push({
            type: "INTERNAL_NOTIFICATION",
            status: "COMPLETED",
            message: "In-app notification created for revenue team",
          });
        }

        for (const node of actionNodes) {
          const actionType = node.data?.actionType || "INTERNAL_NOTIFICATION";

          if (actionType === "INTERNAL_NOTIFICATION" || actionType === "NOTIFY_ACCOUNT_OWNER") {
            txOperations.push(
              prisma.notification.create({
                data: {
                  workspaceId: context.workspaceId,
                  title: `Automation Alert: ${auto.name}`,
                  message: `Triggered for ${context.companyName || "account"} (Score: ${context.currentScore ?? "N/A"})`,
                  type: "LEAD_HOT",
                  link: context.leadId ? `/app/leads/${context.leadId}` : "/app/leads",
                },
              })
            );
            actionsExecuted.push({
              type: actionType,
              status: "COMPLETED",
              message: "In-app notification queued for revenue team",
            });
          } else if (actionType === "SLACK_ALERT" || actionType === "SLACK_AND_ASSIGN") {
            // Check if workspace has a configured Slack webhook
            const workspace = await prisma.workspace.findUnique({
              where: { id: context.workspaceId },
              select: { settings: true },
            });

            const settings = workspace?.settings as Record<string, any> | null;
            const slackWebhookUrl = settings?.slackWebhookUrl;

            if (slackWebhookUrl && typeof slackWebhookUrl === "string") {
              const isSafe = await isSafePublicWebhookUrlAsync(slackWebhookUrl);
              if (isSafe) {
                // Idempotent dispatch key with retry logic and strict manual redirect SSRF validation
                const idempotencyKey = `sf_auto_${auto.id}_${context.leadId || "global"}_${Date.now()}`;
                let attempts = 0;
                const maxAttempts = 3;
                let delivered = false;
                let lastError = "";
                let currentUrl = slackWebhookUrl;

                while (attempts < maxAttempts && !delivered) {
                  attempts++;
                  try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 6000);
                    
                    // fetch with redirect: "manual" so HTTP 301/302 cannot bypass SSRF filters to internal IP
                    const res = await fetch(currentUrl, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "X-SignalFlow-Idempotency-Key": idempotencyKey,
                        "X-SignalFlow-Delivery-Attempt": String(attempts),
                      },
                      body: JSON.stringify({
                        text: `🔥 *SignalFlow Hot Lead Alert*: ${context.companyName || "Prospect"} reached score ${context.currentScore} (${context.intentLevel}).`,
                      }),
                      redirect: "manual",
                      signal: controller.signal,
                    });
                    clearTimeout(timeoutId);

                    // Check for HTTP redirects (301, 302, 307, 308)
                    if (res.status >= 300 && res.status < 400) {
                      const redirectLocation = res.headers.get("location");
                      if (redirectLocation) {
                        const targetUrl = new URL(redirectLocation, currentUrl).toString();
                        const isRedirectSafe = await isSafePublicWebhookUrlAsync(targetUrl);
                        if (!isRedirectSafe) {
                          throw new Error(`SSRF blocked on redirect destination: ${targetUrl}`);
                        }
                        currentUrl = targetUrl;
                        continue; // follow redirect safely
                      }
                    }

                    if (res.ok) {
                      delivered = true;
                      actionsExecuted.push({
                        type: "SLACK_ALERT",
                        status: "COMPLETED",
                        message: `Alert delivered to configured Slack webhook (attempt ${attempts})`,
                      });
                    } else if (res.status >= 500 && attempts < maxAttempts) {
                      // Transient server error: back off exponentially and retry
                      lastError = `Server responded with ${res.status}`;
                      await new Promise((resolve) => setTimeout(resolve, attempts * 500));
                    } else {
                      lastError = `Slack endpoint responded with HTTP ${res.status}`;
                      break;
                    }
                  } catch (err: any) {
                    lastError = err.message;
                    if (err.message.includes("SSRF blocked")) {
                      break; // Do not retry SSRF blocks
                    }
                    if (attempts < maxAttempts) {
                      await new Promise((resolve) => setTimeout(resolve, attempts * 500));
                    }
                  }
                }

                if (!delivered) {
                  actionsExecuted.push({
                    type: "SLACK_ALERT",
                    status: "FAILED",
                    message: `Slack dispatch error: ${lastError}`,
                  });
                  overallStatus = "FAILED";
                }
              } else {
                actionsExecuted.push({
                  type: "SLACK_ALERT",
                  status: "FAILED",
                  message: "Webhook rejected: destination is an internal/private address (SSRF blocked)",
                });
                overallStatus = "FAILED";
              }
            } else {
              actionsExecuted.push({
                type: "SLACK_ALERT",
                status: "NOT_CONFIGURED",
                message: "No Slack webhook URL configured in workspace settings",
              });
              if (overallStatus !== "FAILED") {
                overallStatus = "NOT_CONFIGURED";
              }
            }
          } else if (actionType === "UPDATE_STAGE" && context.leadId) {
            const targetStage = (node.data?.targetStage as LeadStage) || LeadStage.QUALIFIED;
            txOperations.push(
              prisma.lead.update({
                where: { id: context.leadId },
                data: { stage: targetStage },
              })
            );
            txOperations.push(
              prisma.activity.create({
                data: {
                  workspaceId: context.workspaceId,
                  leadId: context.leadId,
                  type: ActivityType.STAGE_CHANGE,
                  title: `Stage automatically updated to ${targetStage}`,
                  description: `Automated by workflow: ${auto.name}`,
                },
              })
            );
            actionsExecuted.push({
              type: "UPDATE_STAGE",
              status: "COMPLETED",
              message: `Lead stage progressed to ${targetStage}`,
            });
          }
        }

        // Add execution audit log and counter increment to transaction
        txOperations.push(
          prisma.automationExecution.create({
            data: {
              workspaceId: context.workspaceId,
              automationId: auto.id,
              leadId: context.leadId || null,
              status: overallStatus,
              details: {
                trigger: context.triggerType,
                actions: actionsExecuted,
                executedAt: new Date().toISOString(),
              },
            },
          })
        );

        txOperations.push(
          prisma.automation.update({
            where: { id: auto.id },
            data: { executionCount: { increment: 1 } },
          })
        );

        // Execute all database operations atomically
        await prisma.$transaction(txOperations);

        outcomes.push({
          automationId: auto.id,
          automationName: auto.name,
          status: overallStatus,
          actionsExecuted,
        });
      } catch (autoErr: any) {
        console.error(`Automation "${auto.name}" execution failed:`, autoErr);

        // Record failed execution record in database
        try {
          await prisma.automationExecution.create({
            data: {
              workspaceId: context.workspaceId,
              automationId: auto.id,
              leadId: context.leadId || null,
              status: "FAILED",
              details: {
                error: autoErr.message || "Execution exception",
                trigger: context.triggerType,
                failedAt: new Date().toISOString(),
              },
            },
          });
        } catch (dbErr) {
          console.error("Failed to persist automation execution error record:", dbErr);
        }

        outcomes.push({
          automationId: auto.id,
          automationName: auto.name,
          status: "FAILED",
          actionsExecuted: [
            {
              type: "TRANSACTION_EXECUTION",
              status: "FAILED",
              message: autoErr.message || "Internal execution failure",
            },
          ],
        });
      }
    }
  } catch (error: any) {
    console.error("Top-level workspace automations error:", error);
    outcomes.push({
      automationId: "SYSTEM",
      automationName: "Automation Engine",
      status: "FAILED",
      actionsExecuted: [
        {
          type: "ENGINE_PIPELINE",
          status: "FAILED",
          message: error.message || "Failed to query workspace automations",
        },
      ],
    });
  }

  return outcomes;
}
