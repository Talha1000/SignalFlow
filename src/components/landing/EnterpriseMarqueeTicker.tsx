"use client";

import React from "react";
import { Sparkles, ShieldCheck, Zap, Activity, Cpu, ArrowUpRight } from "lucide-react";

const BADGES = [
  { text: "FIRST-PARTY INTENT TELEMETRY", icon: Activity, color: "#34feff" },
  { text: "ZERO THIRD-PARTY COOKIES", icon: ShieldCheck, color: "#38b6ff" },
  { text: "< 50MS SIGNAL INGESTION", icon: Zap, color: "#ff914d" },
  { text: "94.2% ML PREDICTIVE ACCURACY", icon: Cpu, color: "#f2be01" },
  { text: "SOC-2 TYPE II & ISO 27001", icon: ShieldCheck, color: "#34feff" },
  { text: "BI-DIRECTIONAL CRM SYNCHRONIZATION", icon: ArrowUpRight, color: "#38b6ff" },
  { text: "$480M+ ENTERPRISE PIPELINE INFLUENCED", icon: Sparkles, color: "#f2be01" },
  { text: "99.99% REAL-TIME SLA", icon: Zap, color: "#ff914d" },
];

export function EnterpriseMarqueeTicker() {
  return (
    <div className="w-full border-y border-white/10 light:border-black/10 bg-[#171a1c] light:bg-[#f0f2f3] py-3.5 overflow-hidden scroll-edge-fade transition-colors select-none">
      <div className="flex w-max animate-marquee space-x-8">
        {[...BADGES, ...BADGES].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-3 text-xs font-mono font-semibold tracking-widest text-slate-300 light:text-[#2d3133]"
            >
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: item.color }}
              />
              <Icon className="h-3.5 w-3.5 opacity-75" style={{ color: item.color }} />
              <span className="hover:text-white light:hover:text-black transition-colors">
                {item.text}
              </span>
              <span className="text-white/20 light:text-black/20 ml-5 font-sans">/</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
