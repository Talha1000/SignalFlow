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
        "Up to 3 Account Executive seats",
        "2,500 monthly tracked accounts",
        "Explainable AI Lead Scoring",
        "Pricing & Website telemetry webhooks",
        "Auto-stop cadence safety protection",
        "Community & RevOps Slack support",
      ],
      ctaText: "Start 14-Day Free Trial",
      ctaLink: "/signup",
    },
    {
      name: "Growth",
      tagline: "For scaling B2B sales orgs closing mid-market & enterprise pipeline",
      monthlyPrice: 249,
      annualPrice: 199,
      badge: "MOST POPULAR",
      highlight: true,
      features: [
        "Up to 15 Account Executive seats",
        "25,000 monthly tracked accounts",
        "Adaptive ICP Intent Radar",
        "API docs & GitHub telemetry ingestion",
        "Visual Workflow Automation Builder",
        "Salesforce & HubSpot bidirectional sync",
        "AI Copilot personalized sales plays",
        "Priority 24/7 RevOps Support & SLA",
      ],
      ctaText: "Deploy Growth Platform",
      ctaLink: "/signup",
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
        "Unlimited AE & Manager seats",
        "Unlimited custom signal ingestion pipes",
        "Dedicated isolated multi-tenant VPC",
        "SAML 2.0 / Okta SSO & SCIM directory",
        "Zero data retention on AI models",
        "Dedicated Solutions Architect & 99.99% SLA",
        "SOC2 Type II & HIPAA compliance pack",
      ],
      ctaText: "Schedule Executive Briefing",
      ctaLink: "/contact",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-950/70 light:bg-slate-100/70 border-t border-slate-800/80 light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 light:border-blue-200 light:bg-blue-50 light:text-blue-700 text-xs font-semibold tracking-wide mb-4">
            <Zap className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" />
            <span>TRANSPARENT VALUE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white light:text-slate-900 tracking-tight">
            Predictable Pricing for{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 light:from-blue-600 light:via-indigo-600 light:to-blue-800 bg-clip-text text-transparent">
              Enterprise Pipeline
            </span>
          </h2>
          <p className="mt-4 text-slate-300 light:text-slate-600 text-base sm:text-lg">
            No punitive usage traps. Every tier includes our core explainable scoring mathematics.
          </p>

          {/* Monthly / Annual Switcher */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 rounded-full bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                !annual
                  ? "bg-slate-800 light:bg-slate-100 text-white light:text-slate-900 font-semibold shadow-sm"
                  : "text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                annual
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900"
              }`}
            >
              Annual Billing
              <span className="text-[10px] bg-blue-800 text-white light:bg-blue-700 px-1.5 py-0.2 rounded font-medium">
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
                  ? "border-2 border-blue-500 bg-slate-900/95 light:bg-white shadow-2xl shadow-blue-500/15 scale-[1.02]"
                  : "border border-slate-800 light:border-slate-200 bg-slate-900/60 light:bg-white hover:border-slate-700 light:hover:border-slate-300"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white font-semibold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white light:text-slate-900">{tier.name}</h3>
                  <p className="text-xs text-slate-400 light:text-slate-600 mt-1 min-h-[32px]">{tier.tagline}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  {tier.annualPrice !== null ? (
                    <>
                      <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white light:text-slate-900">
                        ${annual ? tier.annualPrice : tier.monthlyPrice}
                      </span>
                      <span className="text-xs font-mono text-slate-400 light:text-slate-500">/ month / team</span>
                    </>
                  ) : (
                    <span className="text-4xl font-extrabold text-white light:text-slate-900">Custom</span>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80 light:border-slate-200 space-y-3">
                  <span className="text-xs uppercase tracking-wider text-slate-400 light:text-slate-500 font-semibold block">
                    What's included:
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-300 light:text-slate-700">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-emerald-400 light:text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link href={tier.ctaLink} className="block w-full">
                  <Button
                    variant={tier.highlight ? "primary" : "secondary"}
                    size="lg"
                    className="w-full justify-center font-semibold gap-2"
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
