import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType } from "@prisma/client";

export const dynamic = "force-dynamic";

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export async function GET(request: Request) {
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    // Fetch leads in this workspace with contacts, companies, and email activities
    const leads = await prisma.lead.findMany({
      where: {
        workspaceId: caller.workspaceId,
        deletedAt: null,
      },
      include: {
        company: true,
        contact: true,
        activities: {
          where: {
            type: {
              in: [
                ActivityType.EMAIL_REPLY,
                ActivityType.EMAIL_SENT,
                ActivityType.NOTE,
                ActivityType.MEETING,
              ],
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [
        { score: "desc" },
        { updatedAt: "desc" },
      ],
      take: 20,
    });

    const threads = leads
      .filter((lead) => lead.company && (lead.activities.length > 0 || lead.score >= 50))
      .map((lead) => {
        const contact = lead.contact;
        const senderName = contact
          ? `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || contact.email
          : lead.company?.name || "Prospect";
        const senderEmail = contact?.email || `contact@${lead.company?.domain || "example.com"}`;
        const senderTitle = contact?.title || "Decision Maker";
        const companyName = lead.company?.name || "Target Account";

        // Build dialogue history from real database activities
        const history = lead.activities.map((act) => {
          const isProspect = act.type === ActivityType.EMAIL_REPLY;
          const meta = (act.metadata as any) || {};
          const text =
            meta.body ||
            act.description ||
            act.title ||
            "Message content recorded";

          return {
            activityId: act.id,
            sender: (isProspect ? "prospect" : "rep") as "prospect" | "rep",
            text,
            time: formatRelativeTime(act.createdAt),
            createdAt: act.createdAt.toISOString(),
          };
        });

        // If no explicit email activities exist yet, provide initial touchpoint context
        if (history.length === 0) {
          history.push({
            activityId: `init-${lead.id}`,
            sender: "prospect",
            text: `Interested in evaluating SignalFlow for ${companyName}.`,
            time: formatRelativeTime(lead.createdAt),
            createdAt: lead.createdAt.toISOString(),
          });
        }

        const latestActivity = lead.activities[lead.activities.length - 1];
        const latestMeta = (latestActivity?.metadata as any) || {};

        // Determine subject
        const subject =
          latestMeta.subject ||
          (latestActivity ? latestActivity.title : `Prioritizing revenue signals at ${companyName}`);

        // Determine sentiment from intent level or metadata
        let sentiment: "MEETING_REQUESTED" | "TECHNICAL_INQUIRY" | "OBJECTION" | "INTERESTED" = "INTERESTED";
        if (latestMeta.sentiment) {
          sentiment = latestMeta.sentiment;
        } else if (lead.intentLevel === "HOT" || lead.score >= 85) {
          sentiment = "MEETING_REQUESTED";
        } else if (lead.intentLevel === "HIGH" || lead.score >= 70) {
          sentiment = "TECHNICAL_INQUIRY";
        } else if (lead.intentLevel === "COLD" || lead.score < 30) {
          sentiment = "OBJECTION";
        }

        const snippet = history[history.length - 1]?.text || "No message history";
        const time = latestActivity ? formatRelativeTime(latestActivity.createdAt) : formatRelativeTime(lead.updatedAt);
        const unread = latestActivity ? latestActivity.type === ActivityType.EMAIL_REPLY : false;

        return {
          id: lead.id,
          leadId: lead.id,
          contactId: lead.contactId,
          companyId: lead.companyId,
          sender: senderName,
          email: senderEmail,
          title: senderTitle,
          company: companyName,
          score: lead.score,
          subject,
          snippet,
          sentiment,
          time,
          unread,
          history,
        };
      });

    return apiSuccess({ threads, total: threads.length });
  } catch (error) {
    console.error("GET /api/v1/inbox/threads error:", error);
    return apiError("Failed to fetch inbox threads", 500, "INTERNAL_ERROR");
  }
}
