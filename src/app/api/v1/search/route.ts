import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCaller } from "@/lib/auth/resolveCaller";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const caller = await resolveCaller(request);
    if (!caller) {
      return apiError("Authentication required", 401, "UNAUTHORIZED");
    }

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();

    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`search:${caller.workspaceId}:${clientIp}`, {
      limit: 60,
      windowMs: 60000,
    });
    if (!rateLimit.success) {
      return apiError("Search rate limit exceeded", 429, "RATE_LIMIT_EXCEEDED");
    }

    if (!query) {
      // Return top hot leads and companies as default quick results
      const [topLeads, topCompanies] = await Promise.all([
        prisma.lead.findMany({
          where: { workspaceId: caller.workspaceId, deletedAt: null },
          orderBy: { score: "desc" },
          take: 4,
          include: { contact: true, company: true },
        }),
        prisma.company.findMany({
          where: { workspaceId: caller.workspaceId },
          take: 3,
        }),
      ]);

      const results = [
        ...topLeads.map((l) => ({
          id: l.id,
          title: l.contact ? `${l.contact.firstName} ${l.contact.lastName}` : l.company?.name || "Lead",
          subtitle: `${l.company?.name || "Account"} — ${l.contact?.title || "Decision Maker"}`,
          category: "leads" as const,
          href: `/app/leads/${l.id}`,
          score: l.score,
        })),
        ...topCompanies.map((c) => ({
          id: c.id,
          title: c.name,
          subtitle: `${c.industry || "B2B"} (Score: ${c.intentScore})`,
          category: "companies" as const,
          href: `/app/companies`,
        })),
      ];

      return apiSuccess({ results }, { durationMs: Date.now() - startTime });
    }

    // Live workspace search
    const [matchingLeads, matchingCompanies] = await Promise.all([
      prisma.lead.findMany({
        where: {
          workspaceId: caller.workspaceId,
          deletedAt: null,
          OR: [
            { contact: { firstName: { contains: query, mode: "insensitive" } } },
            { contact: { lastName: { contains: query, mode: "insensitive" } } },
            { contact: { email: { contains: query, mode: "insensitive" } } },
            { company: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        take: 6,
        include: { contact: true, company: true },
      }),
      prisma.company.findMany({
        where: {
          workspaceId: caller.workspaceId,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { domain: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 4,
      }),
    ]);

    const results = [
      ...matchingLeads.map((l) => ({
        id: l.id,
        title: l.contact ? `${l.contact.firstName} ${l.contact.lastName}` : l.company?.name || "Lead",
        subtitle: `${l.company?.name || "Account"} — ${l.contact?.title || "Decision Maker"}`,
        category: "leads" as const,
        href: `/app/leads/${l.id}`,
        score: l.score,
      })),
      ...matchingCompanies.map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: `${c.industry || "B2B"} (Score: ${c.intentScore})`,
        category: "companies" as const,
        href: `/app/companies`,
      })),
    ];

    return apiSuccess({ results }, { durationMs: Date.now() - startTime });
  } catch (error: any) {
    console.error("Search API error:", error);
    return apiError("Search failed", 500, "SEARCH_ERROR", error.message);
  }
}
