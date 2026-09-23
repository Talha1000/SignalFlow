import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { aiService } from "@/lib/ai/provider";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Query real workspace data
    const workspace = await prisma.workspace.findFirst({
      include: {
        leads: {
          take: 10,
          orderBy: { score: "desc" },
          include: { company: true, contact: true },
        },
        companies: {
          take: 5,
          orderBy: { intentScore: "desc" },
        },
        activities: {
          take: 8,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json({ answer: "No active workspace data found." });
    }

    const hotCount = workspace.leads.filter((l) => l.score >= 85).length;
    const surgingCount = workspace.leads.filter((l) => l.score >= 70).length;
    const totalPipeline = workspace.leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

    const context = {
      hotLeadsCount: hotCount,
      surgingCount: surgingCount,
      pipelineValue: totalPipeline,
      topAccounts: workspace.companies.map((c) => `${c.name} (Score: ${c.intentScore})`),
      recentActivities: workspace.activities.map((a) => `${a.title}: ${a.description || ""}`),
    };

    const answer = await aiService.askSalesCopilot(query, context);

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Copilot API error:", error);
    return NextResponse.json({ error: "Failed to generate answer" }, { status: 500 });
  }
}
