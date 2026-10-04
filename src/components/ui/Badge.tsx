import React from "react";
import { twMerge } from "tailwind-merge";
import { IntentLevel, LeadStage } from "@prisma/client";

export function IntentBadge({ level }: { level: IntentLevel | string }) {
  const styles: Record<string, string> = {
    HOT: "bg-red-500/15 text-red-500 light:text-red-600 border-red-500/30",
    HIGH: "bg-amber-500/15 text-amber-500 light:text-amber-600 border-amber-500/30",
    WARM: "bg-sky-500/15 text-[#38b6ff] light:text-[#0284c7] border-[#38b6ff]/30 light:border-[#0284c7]/30",
    LOW: "bg-slate-500/15 text-slate-400 light:text-slate-600 border-slate-500/30",
    COLD: "bg-zinc-800/60 light:bg-zinc-200 text-zinc-400 light:text-zinc-600 border-white/10 light:border-black/10",
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
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        styles[level] || styles.COLD
      )}
    >
      {icons[level] || level}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  let color = "text-zinc-400 light:text-zinc-600 bg-zinc-800/80 light:bg-zinc-200 border-white/10 light:border-black/10";
  if (score >= 85) color = "text-red-500 light:text-red-600 bg-red-500/15 border-red-500/30 font-bold";
  else if (score >= 70) color = "text-amber-500 light:text-amber-600 bg-amber-500/15 border-amber-500/30 font-bold";
  else if (score >= 50) color = "text-[#38b6ff] light:text-[#0284c7] bg-[#38b6ff]/15 light:bg-[#0284c7]/10 border-[#38b6ff]/30 light:border-[#0284c7]/30 font-semibold";
  else if (score >= 30) color = "text-slate-400 light:text-slate-600 bg-slate-500/15 border-slate-500/30 font-medium";

  return (
    <span
      className={twMerge(
        "inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-mono border",
        color
      )}
    >
      {score}
    </span>
  );
}

export function StageBadge({ stage }: { stage: LeadStage | string }) {
  const styles: Record<string, string> = {
    NEW: "bg-slate-500/15 text-slate-300 light:text-slate-700 border-slate-500/30",
    CONTACTED: "bg-sky-500/15 text-[#38b6ff] light:text-[#0284c7] border-[#38b6ff]/30 light:border-[#0284c7]/30",
    ENGAGED: "bg-indigo-500/15 text-indigo-400 light:text-indigo-600 border-indigo-500/30",
    QUALIFIED: "bg-purple-500/15 text-purple-400 light:text-purple-600 border-purple-500/30",
    MEETING: "bg-fuchsia-500/15 text-fuchsia-400 light:text-fuchsia-600 border-fuchsia-500/30",
    PROPOSAL: "bg-amber-500/15 text-amber-500 light:text-amber-600 border-amber-500/30",
    NEGOTIATION: "bg-orange-500/15 text-orange-500 light:text-orange-600 border-orange-500/30",
    WON: "bg-emerald-500/15 text-emerald-400 light:text-emerald-600 border-emerald-500/30",
    LOST: "bg-red-500/15 text-red-400 light:text-red-600 border-red-500/30",
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
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
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
  variant?: "default" | "success" | "warning" | "danger" | "cyan" | "blue" | "brand" | "outline";
}) {
  const variants = {
    default: "bg-[#252a2b] light:bg-[#f0f2f3] text-slate-300 light:text-[#4a5053] border-white/10 light:border-black/10",
    success: "bg-emerald-500/15 text-emerald-400 light:text-emerald-600 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-500 light:text-amber-600 border-amber-500/30",
    danger: "bg-red-500/15 text-red-400 light:text-red-600 border-red-500/30",
    cyan: "bg-[#38b6ff]/15 text-[#38b6ff] light:text-[#0284c7] border-[#38b6ff]/30 light:border-[#0284c7]/30",
    blue: "bg-[#38b6ff]/15 text-[#38b6ff] light:text-[#0284c7] border-[#38b6ff]/30 light:border-[#0284c7]/30",
    brand: "bg-[#38b6ff]/15 text-[#38b6ff] light:text-[#0284c7] border-[#38b6ff]/30 light:border-[#0284c7]/30",
    outline: "bg-transparent text-slate-400 light:text-[#787e82] border-white/10 light:border-black/10",
  };

  return (
    <span
      className={twMerge(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
