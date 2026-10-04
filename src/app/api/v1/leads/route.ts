import { NextResponse } from "next/server";
import { getLeadsSafe, MOCK_LEADS } from "@/lib/mockData";
import { calculateLeadScore } from "@/lib/scoring/engine";
import { apiSuccess, apiError } from "@/lib/api/response";
import { ActivityType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const intent = searchParams.get("intent");
    const stage = searchParams.get("stage");
    const minScore = searchParams.get("minScore") ? Number(searchParams.get("minScore")) : null;
    const search = searchParams.get("search")?.toLowerCase().trim();
    const sortBy = searchParams.get("sortBy") || "score";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));

    let leads = await getLeadsSafe();

    // Filtering
    if (intent) {
      leads = leads.filter((l: any) => l.intent === intent.toUpperCase());
    }
    if (stage) {
      leads = leads.filter((l: any) => l.stage === stage.toUpperCase());
    }
    if (minScore !== null && !isNaN(minScore)) {
      leads = leads.filter((l: any) => (l.score || 0) >= minScore);
    }
    if (search) {
      leads = leads.filter((l: any) => {
        const comp = l.company?.name?.toLowerCase() || "";
        const cont = l.contact?.name?.toLowerCase() || "";
        const title = l.title?.toLowerCase() || "";
        return comp.includes(search) || cont.includes(search) || title.includes(search);
      });
    }

    // Sorting
    leads.sort((a: any, b: any) => {
      let valA = a[sortBy] ?? 0;
      let valB = b[sortBy] ?? 0;
      if (sortBy === "dealValue") {
        valA = Number(a.dealValue || 0);
        valB = Number(b.dealValue || 0);
      }
      return order === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });

    const total = leads.length;
    const paginatedLeads = leads.slice((page - 1) * limit, page * limit);

    return apiSuccess(
      paginatedLeads,
      {
        total,
        page,
        limit,
        durationMs: Date.now() - startTime,
      }
    );
  } catch (error: any) {
    console.error("GET /api/v1/leads error:", error);
    return apiError("Failed to fetch leads", 500, "LEADS_FETCH_ERROR", error.message);
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();

    if (!body.companyName || !body.contactName) {
      return apiError("Missing required fields: 'companyName' and 'contactName' are required.", 400, "VALIDATION_FAILED");
    }

    // Calculate score deterministically
    const scoreResult = calculateLeadScore({
      title: body.title || "Decision Maker",
      companySize: body.companySize || "100-500",
      industry: body.industry || "B2B Tech",
      activities: [
        {
          type: ActivityType.PAGE_VIEW,
          createdAt: new Date(),
          title: "New lead created via API",
        },
      ],
    });

    const newLead = {
      id: `lead_${Math.random().toString(36).substring(2, 9)}`,
      workspaceId: "ws-default",
      title: body.title || "VP of Technology",
      score: scoreResult.score,
      stage: body.stage || "NEW",
      intent: scoreResult.intentLevel,
      dealValue: Number(body.dealValue || 45000),
      notes: body.notes || "Lead created via enterprise API ingestion",
      company: {
        id: `comp_${Math.random().toString(36).substring(2, 7)}`,
        name: body.companyName,
        domain: body.domain || `${body.companyName.toLowerCase().replace(/\s+/g, "")}.com`,
      },
      contact: {
        id: `cont_${Math.random().toString(36).substring(2, 7)}`,
        name: body.contactName,
        email: body.email || `contact@${body.domain || "example.com"}`,
        title: body.title || "Decision Maker",
      },
      owner: {
        id: "user-1",
        name: "Alex Morgan",
        email: "alex@signalflow.io",
      },
      leadScore: {
        totalScore: scoreResult.score,
        factors: scoreResult.positiveFactors,
        insights: scoreResult.explanation,
      },
      activities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return apiSuccess(newLead, { durationMs: Date.now() - startTime }, 201);
  } catch (error: any) {
    console.error("POST /api/v1/leads error:", error);
    return apiError("Failed to create lead", 500, "LEAD_CREATE_ERROR", error.message);
  }
}
