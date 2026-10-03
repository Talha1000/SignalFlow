"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      tagline: "For early-stage SaaS teams validating signal outbound",
      monthlyPrice: 99,
      annualPrice: 79,
      badge: null,
      highlight: false,
      features: [
        "Up to 3 Sales Rep seats",
        "2,500 monthly tracked leads",
        "Standard Explainable AI Scoring",
        "Website & Pricing page webhooks",
        "Auto-stop cadence protection",
        "Community support & Slack channel",
      ],
      ctaText: "Start Free 14-Day Trial",
      ctaLink: "/signup",
    },
    {
      name: "Growth",
      tagline: "For scaling B2B teams closing mid-market & enterprise pipeline",
      monthlyPrice: 249,
      annualPrice: 199,
      badge: "MOST POPULAR",
      highlight: true,
      features: [
        "Up to 15 Sales Rep seats",
        "25,000 monthly tracked leads",
        "Adaptive AI Intent Radar",
        "Docs & API telemetry ingestion",
        "Visual Workflow Automation Builder",
        "Salesforce & HubSpot bidirectional sync",
        "AI Copilot personalized email generator",
        "Priority 24/7 RevOps support",
      ],
      ctaText: "Deploy Growth Engine",
      ctaLink: "/signup",
    },
    {
      name: "Enterprise",
      tagline: "For global sales organizations demanding sovereign data isolation",
      monthlyPrice: null,
      annualPrice: null,
      customText: "Custom",
      badge: "SOVEREIGN ARCHITECTURE",
      highlight: false,
      features: [
        "Unlimited Sales Rep & Manager seats",
        "Unlimited custom signal ingestion pipes",
        "Dedicated isolated multi-tenant VPC",
        "SAML 2.0 / Okta SSO & SCIM directory",
        "Zero data retention on AI models",
        "Custom Monte Carlo win-rate algorithms",
        "Dedicated Solutions Architect & SLA",
        "SOC2 Type II & HIPAA compliance pack",
      ],
      ctaText: "Schedule Executive Briefing",
      ctaLink: "/contact",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-950/70 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-4">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>TRANSPARENT VALUE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Predictable Pricing for{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Explosive Pipeline Growth
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            No hidden seat penalties. Every tier includes our core explainable scoring engine.
          </p>

          {/* Monthly / Annual Switcher */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 rounded-full bg-slate-900 border border-slate-800">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                !annual ? "bg-slate-800 text-white font-semibold shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                annual ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              Annual Billing
              <span className="text-[10px] bg-slate-950 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
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
              className={`rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between transition-all relative ${
                tier.highlight
                  ? "border-2 border-cyan-500 bg-slate-900/95 shadow-2xl shadow-cyan-500/20 scale-[1.03]"
                  : "border border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold font-mono text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{tier.tagline}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  {tier.annualPrice !== null ? (
                    <>
                      <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white">
                        ${annual ? tier.annualPrice : tier.monthlyPrice}
                      </span>
                      <span className="text-xs font-mono text-slate-400">/ month / team</span>
                    </>
                  ) : (
                    <span className="text-4xl font-extrabold text-white">Custom</span>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    What's included:
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link href={tier.ctaLink} className="block w-full">
                  <Button
                    variant={tier.highlight ? "gradient" : "secondary"}
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
