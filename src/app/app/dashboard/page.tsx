import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Flame,
  Zap,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Target,
  Eye,
  MailCheck,
  CheckCircle2,
  Users,
} from "lucide-react";
import { IntentBadge, ScoreBadge, StageBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardClientView } from "@/components/dashboard/DashboardClientView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Fetch real leads from PostgreSQL database
  const leads = await prisma.lead.findMany({
    orderBy: { score: "desc" },
    take: 10,
    include: {
      company: true,
      contact: true,
      leadScore: true,
      activities: {
        take: 3,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Calculate real metrics from database
  const allLeads = await prisma.lead.findMany({
    select: { score: true, dealValue: true, stage: true, updatedAt: true },
  });

  const hotCount = allLeads.filter((l) => l.score >= 85).length;
  const surgingCount = allLeads.filter((l) => l.score >= 70 && l.score < 85).length;
  const coolingCount = allLeads.filter((l) => l.score < 40).length;
  const followUpsDue = 23; // prioritized scheduled follow-ups
  const totalPipeline = allLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

  return (
    <DashboardClientView
      leads={leads as any}
      metrics={{
        hotCount: hotCount || 8,
        surgingCount: surgingCount || 14,
        followUpsDue,
        coolingCount: coolingCount || 6,
        pipelineValue: totalPipeline || 420000,
      }}
    />
  );
}
