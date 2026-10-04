"use client";

import React from "react";
import { Star, CheckCircle2, TrendingUp } from "lucide-react";

export function SocialProofSection() {
  const testimonials = [
    {
      quote:
        "SignalFlow completely transformed our outbound strategy. We caught a Fortune 500 company browsing our docs at 2 AM, and our AE engaged them with the exact context within 15 minutes. We signed a $340k contract 3 weeks later.",
      author: "Rachel Sterling",
      role: "Chief Revenue Officer",
      company: "CloudScale Systems",
      metric: "+210% Inbound Pipeline",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    },
    {
      quote:
        "Legacy CRMs are graveyards of stale data. The fact that SignalFlow explains every single point change in plain English means our SDRs actually trust the AI score and call the right people first.",
      author: "Marcus Thorne",
      role: "VP of Sales Operations",
      company: "Vanguard Data",
      metric: "4.2x Meeting Booking Rate",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    },
    {
      quote:
        "The auto-stop cadence protection alone is worth 10x the price. No more embarrassing emails going out to executives who already replied or booked a demo. It protects our brand reputation every single day.",
      author: "Elena Rostova",
      role: "Head of Demand Generation",
      company: "DevSync Global",
      metric: "0% Sequence Collisions",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    },
  ];

  return (
    <section className="py-28 relative overflow-hidden bg-[#121212] light:bg-[#f7f7f7] transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white text-slate-300 light:text-[#121212] text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <Star className="h-3.5 w-3.5 text-[#f2be01] fill-[#f2be01]" />
            <span>EXECUTIVE SOCIAL PROOF</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white light:text-[#121212] tracking-tight leading-tight">
            Trusted by Modern{" "}
            <span className="text-[#38b6ff] light:text-[#0284c7]">
              Revenue Leaders
            </span>
          </h2>
          <p className="mt-4 text-slate-300 light:text-[#4a5053] text-base sm:text-lg">
            See how high-performing revenue organizations replace blind guesswork with signal-driven execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white p-8 sm:p-10 flex flex-col justify-between hover:border-[#38b6ff]/40 light:hover:border-black/30 transition-all shadow-sm"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#f2be01]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#f2be01] text-[#f2be01]" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-[#10b981] bg-[#10b981]/10 px-2.5 py-0.5 rounded-full border border-[#10b981]/20 font-bold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> {t.metric}
                  </span>
                </div>

                <p className="text-sm text-slate-300 light:text-[#4a5053] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 light:border-black/10 flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="h-11 w-11 rounded-full object-cover border border-white/15 light:border-black/15"
                />
                <div>
                  <div className="text-sm font-bold text-white light:text-[#121212] flex items-center gap-1.5">
                    {t.author}
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
                  </div>
                  <div className="text-xs text-slate-400 light:text-[#787e82]">
                    {t.role} • <span className="text-slate-300 light:text-[#121212] font-semibold">{t.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
