import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IntentLevel, LeadStage } from "@prisma/client";

export function IntentBadge({ level }: { level: IntentLevel | string }) {
  const styles: Record<string, string> = {
    HOT: "bg-red-500/10 text-red-400 border-red-500/30",
    HIGH: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    WARM: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    LOW: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    COLD: "bg-zinc-800 text-zinc-400 border-zinc-700",
  };

  const icons: Record<string, string> = {
    HOT: "🔥 Hot Intent",
    HIGH: "⚡ High Intent",
    WARM: "🌤 Warm",
    LOW: "❄ Low Intent",
    COLD: "🧊 Cold",
  };

  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles[level] || styles.COLD
      )}
    >
      {icons[level] || level}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  let color = "text-zinc-400 bg-zinc-800/80 border-zinc-700";
  if (score >= 85) color = "text-red-400 bg-red-500/10 border-red-500/30 font-bold";
  else if (score >= 70) color = "text-amber-400 bg-amber-500/10 border-amber-500/30 font-semibold";
  else if (score >= 50) color = "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
  else if (score >= 30) color = "text-blue-400 bg-blue-500/10 border-blue-500/30";

  return (
    <span
      className={twMerge(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono border",
        color
      )}
    >
      {score}
    </span>
  );
}

export function StageBadge({ stage }: { stage: LeadStage | string }) {
  const styles: Record<string, string> = {
    NEW: "bg-slate-500/10 text-slate-300 border-slate-600/40",
    CONTACTED: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    ENGAGED: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    QUALIFIED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    MEETING: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30",
    PROPOSAL: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    NEGOTIATION: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    WON: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    LOST: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  const labels: Record<string, string> = {
    NEW: "New",
    CONTACTED: "Contacted",
    ENGAGED: "Engaged",
    QUALIFIED: "Qualified",
    MEETING: "Meeting Booked",
    PROPOSAL: "Proposal",
    NEGOTIATION: "Negotiation",
    WON: "Closed Won",
    LOST: "Closed Lost",
  };

  return (
    <span
      className={twMerge(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        styles[stage] || styles.NEW
      )}
    >
      {labels[stage] || stage}
    </span>
  );
}

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger" | "cyan" | "outline";
}) {
  const variants = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    danger: "bg-red-500/10 text-red-400 border-red-500/30",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    outline: "bg-transparent text-slate-400 border-slate-700",
  };

  return (
    <span
      className={twMerge(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
