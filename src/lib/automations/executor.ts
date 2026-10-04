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

/**
 * Strict SSRF protection: validates that webhook destination is an external, public HTTPS endpoint.
 * Disallows localhost, loopback, private RFC1918 IPv4 ranges, link-local, and cloud metadata endpoints.
 */
export function isSafePublicWebhookUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.protocol !== "https:") return false;

    const hostname = url.hostname.toLowerCase();

    // Reject internal hostnames and suffixes
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".corp")
    ) {
      return false;
    }

    // Reject IPv6 loopback and link-local addresses
    if (
      hostname === "[::1]" ||
      hostname === "::1" ||
      hostname.startsWith("fe80:") ||
      hostname.startsWith("[fe80:")
    ) {
      return false;
    }

    // Explicit IPv4 checks against RFC 1918 / loopback / link-local / zero-net
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipv4Regex);
    if (ipMatch) {
      const o1 = parseInt(ipMatch[1], 10);
      const o2 = parseInt(ipMatch[2], 10);
      const o3 = parseInt(ipMatch[3], 10);
      const o4 = parseInt(ipMatch[4], 10);
      if (o1 > 255 || o2 > 255 || o3 > 255 || o4 > 255) return false;

      // 0.0.0.0/8
      if (o1 === 0) return false;
      // 127.0.0.0/8 (Loopback)
      if (o1 === 127) return false;
      // 10.0.0.0/8 (Private RFC 1918)
      if (o1 === 10) return false;
      // 172.16.0.0/12 (Private RFC 1918: 172.16.0.0 - 172.31.255.255)
      if (o1 === 172 && o2 >= 16 && o2 <= 31) return false;
      // 192.168.0.0/16 (Private RFC 1918)
      if (o1 === 192 && o2 === 168) return false;
      // 169.254.0.0/16 (Link-local & AWS/GCP/Azure instance metadata)
      if (o1 === 169 && o2 === 254) return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Validates whether an IP address belongs to private/internal/loopback ranges.
 */
function isPrivateIp(ip: string): boolean {
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("fe80:") || ip.startsWith("fc00:") || ip.startsWith("fd00:")) {
    return true;
  }
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(ipv4Regex);
  if (!match) return false;
  const o1 = parseInt(match[1], 10);
  const o2 = parseInt(match[2], 10);
  if (o1 === 0 || o1 === 127 || o1 === 10) return true;
  if (o1 === 172 && o2 >= 16 && o2 <= 31) return true;
  if (o1 === 192 && o2 === 168) return true;
  if (o1 === 169 && o2 === 254) return true;
  return false;
}

/**
 * Asynchronous deep SSRF validator: resolves DNS records to ensure no public host points to internal IP spaces.
 */
export async function isSafePublicWebhookUrlAsync(urlString: string): Promise<boolean> {
  if (!isSafePublicWebhookUrl(urlString)) return false;

  try {
    const url = new URL(urlString);
    // Dynamic import dns promises to avoid bundling issues on edge runtimes
    const dns = await import("dns/promises");
    const addresses = await dns.resolve(url.hostname).catch(() => []);
    if (!addresses || addresses.length === 0) {
      // If resolution fails or returns no A records, check fallback lookup
      const lookup = await dns.lookup(url.hostname).catch(() => null);
      if (!lookup || !lookup.address) return false;
      return !isPrivateIp(lookup.address);
    }

    for (const addr of addresses) {
      if (isPrivateIp(addr)) return false;
    }
    return true;
  } catch {
    // If DNS check fails or running in constrained environment, fall back to hostname validation result
    return isSafePublicWebhookUrl(urlString);
  }
}

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
                try {
                  const controller = new AbortController();
                  const timeoutId = setTimeout(() => controller.abort(), 6000);
                  const res = await fetch(slackWebhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      text: `🔥 *SignalFlow Hot Lead Alert*: ${context.companyName || "Prospect"} reached score ${context.currentScore} (${context.intentLevel}).`,
                    }),
                    signal: controller.signal,
                  });
                  clearTimeout(timeoutId);

                  if (res.ok) {
                    actionsExecuted.push({
                      type: "SLACK_ALERT",
                      status: "COMPLETED",
                      message: "Alert delivered to configured Slack webhook",
                    });
                  } else {
                    actionsExecuted.push({
                      type: "SLACK_ALERT",
                      status: "FAILED",
                      message: `Slack endpoint responded with HTTP ${res.status}`,
                    });
                    overallStatus = "FAILED";
                  }
                } catch (err: any) {
                  actionsExecuted.push({
                    type: "SLACK_ALERT",
                    status: "FAILED",
                    message: `Slack dispatch network error: ${err.message}`,
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
