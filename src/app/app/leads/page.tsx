import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Target,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  Mail,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import { IntentBadge, ScoreBadge, StageBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LeadsListClient } from "@/components/leads/LeadsListClient";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { score: "desc" },
    include: {
      company: true,
      contact: true,
      owner: true,
      leadScore: true,
    },
  });

  return <LeadsListClient initialLeads={leads as any} />;
}
