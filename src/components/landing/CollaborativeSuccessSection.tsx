"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, TrendingUp, Globe2, Cpu, CheckCircle2 } from "lucide-react";

const MILESTONES = [
  {
    number: "418",
    suffix: "+",
    label: "Enterprises Scaled",
    description: "We foster pipeline growth and outbound velocity through strategic first-party buyer detection.",
    bgColor: "#34FEFF",
    textColor: "#121212",
    icon: Building2,
  },
  {
    number: "1,850",
    suffix: "+",
    label: "High-Value Deals Closed",
    description: "We connect sales reps with in-market buyers at the peak moment of evaluation and intent.",
    bgColor: "#38B6FF",
    textColor: "#121212",
    icon: TrendingUp,
  },
  {
    number: "40",
    suffix: "+",
    label: "Global Data Centers",
    description: "We process telemetry at the edge, delivering sub-50ms signal processing across 40+ cloud regions worldwide.",
    bgColor: "#FF914D",
    textColor: "#ffffff",
    icon: Globe2,
  },
  {
    number: "110",
    suffix: "M+",
    label: "Signals Evaluated",
    description: "A deep, continuous intent graph across documentation, pricing calculators, and product interactions.",
    bgColor: "#F2BE01",
    textColor: "#121212",
    icon: Cpu,
  },
];

export function CollaborativeSuccessSection() {
  return (
    <section className="py-24 md:py-32 bg-[#121212] light:bg-[#f7f7f7] border-t border-white/10 light:border-black/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 light:bg-black/5 border border-white/10 light:border-black/10 text-slate-300 light:text-[#121212] text-xs font-mono uppercase tracking-widest mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f2be01]" />
            <span>Proven Track Record</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white light:text-[#121212] tracking-tight leading-tight">
            Collaborative Success
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 light:text-[#4a5053]">
            Trusted by revenue leaders and engineering teams who demand precision and speed.
          </p>
        </div>

        {/* 4 Colored Milestone Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MILESTONES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col rounded-[20px] overflow-hidden bg-[#1e2224] light:bg-white border border-white/10 light:border-black/10 shadow-lg group hover:-translate-y-1 transition-transform"
              >
                {/* Large Colored Number Card */}
                <div
                  className="p-8 flex flex-col justify-between min-h-[160px] transition-transform duration-300"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <div className="flex justify-between items-start">
                    <Icon className="h-6 w-6 opacity-80" style={{ color: item.textColor }} />
                    <span
                      className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/10 text-current"
                      style={{ color: item.textColor }}
                    >
                      Verified
                    </span>
                  </div>
                  <div
                    className="text-5xl font-black font-mono tracking-tight"
                    style={{ color: item.textColor }}
                  >
                    {item.number}
                    <span className="text-3xl">{item.suffix}</span>
                  </div>
                </div>

                {/* Description Bottom */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white light:text-[#121212] tracking-tight mb-2">
                      {item.label}
                    </h3>
                    <p className="text-sm text-slate-300 light:text-[#5a6266] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
