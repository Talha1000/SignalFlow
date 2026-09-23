import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { aiService } from "@/lib/ai/provider";

export async function POST(request: Request) {
  try {
    const { leadId, tone = "consultative", customInstructions } = await request.json();

    let leadContext: any = {
      firstName: "Sarah",
      lastName: "Chen",
      title: "VP of Engineering",
      companyName: "Acme Technologies",
      industry: "Developer Infrastructure",
      score: 91,
      intentLevel: "HOT",
      activities: [
        { title: "Viewed enterprise pricing 3 times", type: "PRICING_VISIT", createdAt: new Date() },
        { title: "Looked at API webhook documentation", type: "DOCS_VIEW", createdAt: new Date() },
      ],
    };

    if (leadId) {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        include: {
          company: true,
          contact: true,
          activities: { take: 5, orderBy: { createdAt: "desc" } },
        },
      });

      if (lead) {
        leadContext = {
          firstName: lead.contact?.firstName || "there",
          lastName: lead.contact?.lastName || "",
          title: lead.contact?.title || "Decision Maker",
          companyName: lead.company?.name || "your company",
          industry: lead.company?.industry || "Technology",
          score: lead.score,
          intentLevel: lead.intentLevel,
          activities: lead.activities.map((a) => ({
            title: a.title,
            type: a.type,
            description: a.description,
            createdAt: a.createdAt,
          })),
        };
      }
    }

    const email = await aiService.generatePersonalizedEmail(leadContext, tone, customInstructions);
    return NextResponse.json(email);
  } catch (error: any) {
    console.error("AI email generation error:", error);
    return NextResponse.json({ error: "Failed to generate email" }, { status: 500 });
  }
}
