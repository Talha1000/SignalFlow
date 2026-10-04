import { prisma } from "@/lib/prisma";
import { ActivityType, LeadStage } from "@prisma/client";

export interface AutomationTriggerContext {
  workspaceId: string;
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
 * Evaluates and executes active automations in the workspace matching the event.
 */
export async function executeWorkspaceAutomations(
  context: AutomationTriggerContext
): Promise<AutomationExecutionOutcome[]> {
  const outcomes: AutomationExecutionOutcome[] = [];

  try {
    const automations = await prisma.automation.findMany({
      where: {
        workspaceId: context.workspaceId,
        status: "ACTIVE",
      },
    });

    for (const auto of automations) {
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

      // Execute actions defined in nodes
      const actionNodes = nodes.filter((n) => n.type === "action" || n.data?.nodeType === "action");

      if (actionNodes.length === 0) {
        // Fallback default action: Create high-intent notification
        await prisma.notification.create({
          data: {
            workspaceId: context.workspaceId,
            title: `High Intent Lead Alert: ${context.companyName || "Account"}`,
            message: `Lead scored ${context.currentScore || 85}+ (${context.intentLevel || "HOT"}). Immediate outreach advised.`,
            type: "LEAD_HOT",
            link: context.leadId ? `/app/leads/${context.leadId}` : "/app/leads",
          },
        });
        actionsExecuted.push({
          type: "INTERNAL_NOTIFICATION",
          status: "COMPLETED",
          message: "In-app notification created for revenue team",
        });
      }


      for (const node of actionNodes) {
        const actionType = node.data?.actionType || "INTERNAL_NOTIFICATION";

        if (actionType === "INTERNAL_NOTIFICATION" || actionType === "NOTIFY_ACCOUNT_OWNER") {
          await prisma.notification.create({
            data: {
              workspaceId: context.workspaceId,
              title: `Automation Alert: ${auto.name}`,
              message: `Triggered for ${context.companyName || "account"} (Score: ${context.currentScore ?? "N/A"})`,
              type: "LEAD_HOT",
              link: context.leadId ? `/app/leads/${context.leadId}` : "/app/leads",
            },
          });
          actionsExecuted.push({
            type: actionType,
            status: "COMPLETED",
            message: "In-app notification dispatched to revenue team",
          });
        } else if (actionType === "SLACK_ALERT" || actionType === "SLACK_AND_ASSIGN") {
          // Check if workspace has a configured Slack webhook
          const workspace = await prisma.workspace.findUnique({
            where: { id: context.workspaceId },
            select: { settings: true },
          });

          const settings = workspace?.settings as Record<string, any> | null;
          const slackWebhookUrl = settings?.slackWebhookUrl;

          if (slackWebhookUrl && typeof slackWebhookUrl === "string" && slackWebhookUrl.startsWith("https://")) {
            try {
              await fetch(slackWebhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  text: `🔥 *SignalFlow Hot Lead Alert*: ${context.companyName || "Prospect"} reached score ${context.currentScore} (${context.intentLevel}).`,
                }),
              });
              actionsExecuted.push({
                type: "SLACK_ALERT",
                status: "COMPLETED",
                message: "Alert delivered to configured Slack webhook",
              });
            } catch (err: any) {
              actionsExecuted.push({
                type: "SLACK_ALERT",
                status: "FAILED",
                message: `Slack dispatch error: ${err.message}`,
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
          await prisma.lead.update({
            where: { id: context.leadId },
            data: { stage: targetStage },
          });
          await prisma.activity.create({
            data: {
              workspaceId: context.workspaceId,
              leadId: context.leadId,
              type: ActivityType.STAGE_CHANGE,
              title: `Stage automatically updated to ${targetStage}`,
              description: `Automated by workflow: ${auto.name}`,
            },
          });
          actionsExecuted.push({
            type: "UPDATE_STAGE",
            status: "COMPLETED",
            message: `Lead stage progressed to ${targetStage}`,
          });
        }
      }

      // Record execution in database
      await prisma.automationExecution.create({
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
      });

      // Increment execution count
      await prisma.automation.update({
        where: { id: auto.id },
        data: { executionCount: { increment: 1 } },
      });

      outcomes.push({
        automationId: auto.id,
        automationName: auto.name,
        status: overallStatus,
        actionsExecuted,
      });
    }
  } catch (error) {
    console.error("Error executing workspace automations:", error);
  }

  return outcomes;
}
