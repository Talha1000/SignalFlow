"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      tagline: "For early-stage revenue teams validating signal-led outbound",
      monthlyPrice: 99,
      annualPrice: 79,
      badge: null,
      highlight: false,
      features: [
        "Up to 3 Team member seats",
        "1,000 monthly tracked leads",
        "5,000 monthly email sends",
        "500 AI generation credits",
        "5 active workflow automations",
        "Explainable AI Lead Scoring",
        "Auto-stop cadence safety protection",
      ],
      ctaText: "Start 14-Day Free Trial",
      ctaLink: "/signup?plan=starter",
    },
    {
      name: "Growth",
      tagline: "For scaling B2B sales orgs closing mid-market & enterprise pipeline",
      monthlyPrice: 249,
      annualPrice: 199,
      badge: "MOST POPULAR",
      highlight: true,
      features: [
        "Up to 10 Team member seats",
        "10,000 monthly tracked leads",
        "25,000 monthly email sends",
        "2,500 AI generation credits",
        "25 active workflow automations",
        "API docs & GitHub telemetry ingestion",
        "Visual Workflow Automation Builder",
        "Sales Copilot personalized intelligence",
      ],
      ctaText: "Deploy Growth Platform",
      ctaLink: "/signup?plan=growth",
    },
    {
      name: "Enterprise",
      tagline: "For global sales organizations demanding sovereign data isolation",
      monthlyPrice: null,
      annualPrice: null,
      customText: "Custom",
      badge: "SOVEREIGN ENTERPRISE",
      highlight: false,
      features: [
        "Custom & high-volume seat quotas",
        "1,000,000+ monthly tracked leads",
        "1,000,000+ monthly email sends",
        "100,000+ AI generation credits",
        "Unlimited workflow automations",
        "Dedicated tenant isolation & 99.99% SLA",
        "SAML 2.0 / Okta SSO & audit logging",
      ],
      ctaText: "Schedule Executive Briefing",
      ctaLink: "/contact",
    },
  ];

  return (
    <section className="py-28 relative overflow-hidden bg-[#121212] light:bg-[#f7f7f7] border-t border-white/10 light:border-black/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white text-slate-300 light:text-[#121212] text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <Zap className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
            <span>TRANSPARENT VALUE</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white light:text-[#121212] tracking-tight leading-tight">
            Predictable Pricing for{" "}
            <span className="text-[#38b6ff] light:text-[#0284c7]">
              Enterprise Pipeline
            </span>
          </h2>
          <p className="mt-4 text-slate-300 light:text-[#4a5053] text-base sm:text-lg">
            No punitive usage traps. Every tier includes our core explainable scoring mathematics.
          </p>

          {/* Monthly / Annual Switcher Pill */}
          <div className="mt-10 inline-flex items-center gap-3 p-1.5 rounded-full bg-[#1e2224] light:bg-[#f0f2f3] border border-white/15 light:border-black/15 shadow-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                !annual
                  ? "bg-[#252a2b] light:bg-white text-white light:text-[#121212] font-bold shadow-sm"
                  : "text-slate-400 light:text-[#4a5053] hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
                annual
                  ? "bg-[#38b6ff] text-[#121212] light:bg-[#121212] light:text-white font-bold shadow-sm"
                  : "text-slate-400 light:text-[#4a5053] hover:text-white"
              }`}
            >
              Annual Billing
              <span className="text-[10px] bg-black/20 light:bg-white/20 px-2 py-0.5 rounded-full font-mono uppercase font-semibold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all relative ${
                tier.highlight
                  ? "border-2 border-[#38b6ff] light:border-[#121212] bg-[#1e2224] light:bg-white shadow-2xl scale-[1.02]"
                  : "border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white hover:border-white/25 light:hover:border-black/25"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#38b6ff] text-[#121212] light:bg-[#121212] light:text-white font-mono font-bold text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="space-y-7">
                <div>
                  <h3 className="text-2xl font-bold text-white light:text-[#121212]">{tier.name}</h3>
                  <p className="text-xs text-slate-400 light:text-[#787e82] mt-1.5 min-h-[32px]">{tier.tagline}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  {tier.annualPrice !== null ? (
                    <>
                      <span className="text-5xl sm:text-6xl font-black font-mono text-white light:text-[#121212]">
                        ${annual ? tier.annualPrice : tier.monthlyPrice}
                      </span>
                      <span className="text-xs font-mono text-slate-400 light:text-[#787e82]">/ month / team</span>
                    </>
                  ) : (
                    <span className="text-5xl font-black text-white light:text-[#121212]">Custom</span>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 light:border-black/10 space-y-3.5">
                  <span className="text-xs uppercase tracking-wider text-slate-400 light:text-[#787e82] font-mono font-semibold block">
                    What's included:
                  </span>
                  <ul className="space-y-3 text-xs text-slate-300 light:text-[#4a5053]">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-10">
                <Link href={tier.ctaLink} className="block w-full">
                  <Button
                    variant={tier.highlight ? "pill" : "secondary"}
                    size="lg"
                    className="w-full justify-center font-bold gap-2"
                  >
                    {tier.ctaText} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
