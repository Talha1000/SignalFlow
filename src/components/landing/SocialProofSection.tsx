"use client";

import React from "react";
import { Star, CheckCircle2, TrendingUp, ShieldCheck } from "lucide-react";

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
    <section className="py-24 relative overflow-hidden bg-slate-950 light:bg-slate-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-300 light:border-emerald-200 light:bg-emerald-50 light:text-emerald-700 text-xs font-semibold tracking-wide mb-4">
            <Star className="h-3.5 w-3.5 text-emerald-400 light:text-emerald-600 fill-emerald-400" />
            <span>EXECUTIVE TESTIMONIALS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white light:text-slate-900 tracking-tight">
            Trusted by Modern{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 light:from-emerald-600 light:via-teal-600 light:to-blue-700 bg-clip-text text-transparent">
              Revenue Leaders
            </span>
          </h2>
          <p className="mt-4 text-slate-300 light:text-slate-600 text-base sm:text-lg">
            See how high-performing revenue organizations replace blind guesswork with signal-driven execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-slate-800 light:border-slate-200 bg-slate-900/60 light:bg-white p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-blue-500/40 transition-all shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 light:text-emerald-700 bg-emerald-500/10 light:bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-500/20 light:border-emerald-200 font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> {t.metric}
                  </span>
                </div>

                <p className="text-sm text-slate-300 light:text-slate-700 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 light:border-slate-200 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="h-10 w-10 rounded-full object-cover border border-slate-700 light:border-slate-300"
                />
                <div>
                  <div className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-1.5">
                    {t.author}
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" />
                  </div>
                  <div className="text-xs text-slate-400 light:text-slate-500">
                    {t.role} • <span className="text-slate-300 light:text-slate-700 font-medium">{t.company}</span>
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
