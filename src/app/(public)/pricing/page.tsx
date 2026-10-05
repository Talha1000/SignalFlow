"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: "Free",
      description: "For solo founders and consultants testing signal-based prioritization.",
      monthlyPrice: 0,
      annualPrice: 0,
      leads: "100",
      aiCredits: "50 / mo",
      seats: "1 user",
      features: [
        "100 prioritized leads",
        "Explainable score breakdowns",
        "1 active follow-up cadence",
        "Standard CSV import",
        "Community support",
      ],
      cta: "Get Started Free",
      highlight: false,
    },
    {
      name: "Starter",
      description: "For early sales teams and agencies needing automated qualification.",
      monthlyPrice: 59,
      annualPrice: 49,
      leads: "1,000",
      aiCredits: "500 / mo",
      seats: "3 users",
      features: [
        "1,000 prioritized leads",
        "Real-time Priority Queue",
        "5 automated cadences",
        "Automated reply detection & pause",
        "AI action recommendations",
        "Standard integrations (Webhooks)",
        "Email support",
      ],
      cta: "Start 14-Day Free Trial",
      highlight: false,
    },
    {
      name: "Growth",
      description: "Our most popular tier for high-velocity B2B sales teams.",
      monthlyPrice: 179,
      annualPrice: 149,
      leads: "10,000",
      aiCredits: "2,500 / mo",
      seats: "10 users",
      features: [
        "10,000 prioritized leads",
        "Visual Automation Builder (25 workflows)",
        "In-App Sales Copilot",
        "Account-based intelligence (ABM)",
        "Multi-stakeholder signal aggregation",
        "Executive Revenue Analytics",
        "Priority Slack & email support",
      ],
      cta: "Start 14-Day Free Trial",
      highlight: true,
      badge: "Most Popular",
    },
    {
      name: "Business",
      description: "For scaled revenue organizations requiring advanced RBAC & APIs.",
      monthlyPrice: 479,
      annualPrice: 399,
      leads: "50,000",
      aiCredits: "10,000 / mo",
      seats: "30 users",
      features: [
        "50,000 prioritized leads",
        "Unlimited cadences & workflows",
        "Role-based access control (RBAC)",
        "Full REST API & webhook keys",
        "Detailed audit logging",
        "Custom scoring threshold configurations",
        "Dedicated Customer Success Manager",
      ],
      cta: "Upgrade to Business",
      highlight: false,
    },
  ];

  return (
    <div className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#38b6ff]/30 bg-[#38b6ff]/10 px-3.5 py-1 text-xs font-semibold text-[#38b6ff] light:text-[#0284c7]">
          <Sparkles className="h-3.5 w-3.5" /> Transparent Commercial Pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white light:text-[#121212]">
          Predictable pricing that scales with revenue
        </h1>
        <p className="text-sm sm:text-base text-slate-300 light:text-[#4a5053]">
          Prioritize your pipeline with explainable AI. No hidden overage charges or lock-ins.
        </p>

        {/* Annual / Monthly Toggle */}
        <div className="pt-6 flex items-center justify-center gap-3">
          <span className={`text-xs font-medium ${!annual ? "text-white light:text-[#121212]" : "text-slate-400 light:text-[#787e82]"}`}>
            Billed Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative h-6 w-12 rounded-full bg-[#252a2b] light:bg-[#e2e8f0] p-0.5 transition-colors focus:outline-none border border-white/10 light:border-black/10"
            aria-label="Toggle annual billing"
          >
            <div
              className={`h-5 w-5 rounded-full bg-[#38b6ff] light:bg-[#0284c7] transition-transform ${
                annual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-medium ${annual ? "text-white light:text-[#121212]" : "text-slate-400 light:text-[#787e82]"} flex items-center gap-1.5`}>
            Billed Annually
            <span className="rounded-full bg-[#38b6ff]/20 text-[#38b6ff] light:text-[#0284c7] text-[10px] font-bold px-2 py-0.5 border border-[#38b6ff]/30">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-3xl border flex flex-col justify-between p-6 transition-all duration-200 relative ${
              tier.highlight
                ? "bg-[#1e2224] light:bg-[#ffffff] border-[#38b6ff] light:border-[#0284c7] shadow-xl ring-2 ring-[#38b6ff]/30 light:ring-[#0284c7]/30"
                : "bg-[#1e2224] light:bg-[#ffffff] border-white/10 light:border-black/10 shadow-sm hover:border-[#38b6ff]/40"
            }`}
          >
            {tier.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#38b6ff] text-slate-950 px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-md">
                {tier.badge}
              </span>
            )}

            <div>
              <h3 className="text-lg font-bold text-white light:text-[#121212]">{tier.name}</h3>
              <p className="mt-1 text-xs text-slate-400 light:text-[#787e82] min-h-[36px]">{tier.description}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold font-mono text-white light:text-[#121212]">
                  ${annual ? tier.annualPrice : tier.monthlyPrice}
                </span>
                <span className="text-xs text-slate-400 light:text-[#787e82]">/ month</span>
              </div>
              {annual && tier.annualPrice > 0 && (
                <p className="text-[10px] text-[#38b6ff] light:text-[#0284c7] font-medium mt-0.5">Billed annually</p>
              )}

              <div className="mt-6 pt-6 border-t border-white/10 light:border-black/10 space-y-2.5 text-xs">
                <div className="text-white light:text-[#121212] font-semibold">Included Quotas:</div>
                <div className="text-slate-400 light:text-[#787e82] flex items-center justify-between">
                  <span>Lead Capacity:</span>
                  <span className="font-mono text-white light:text-[#121212] font-medium">{tier.leads}</span>
                </div>
                <div className="text-slate-400 light:text-[#787e82] flex items-center justify-between">
                  <span>AI Intelligence Credits:</span>
                  <span className="font-mono text-white light:text-[#121212] font-medium">{tier.aiCredits}</span>
                </div>
                <div className="text-slate-400 light:text-[#787e82] flex items-center justify-between">
                  <span>Team Seats:</span>
                  <span className="font-mono text-white light:text-[#121212] font-medium">{tier.seats}</span>
                </div>

                <div className="pt-4 text-white light:text-[#121212] font-semibold">Capabilities:</div>
                <ul className="space-y-2 pt-1 text-slate-300 light:text-[#4a5053]">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link href={`/signup?plan=${tier.name.toLowerCase()}`}>
                <Button
                  variant={tier.highlight ? "pill" : "outline"}
                  className="w-full justify-center"
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise callout */}
      <div className="mt-16 rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white light:text-[#121212]">Enterprise & Custom Workspaces</h3>
          <p className="text-xs text-slate-300 light:text-[#4a5053] mt-1 max-w-2xl leading-relaxed">
            Need custom tenant isolation, dedicated database instances, custom CRM connectors, or
            custom AI scoring weight calibration? Let our solutions engineering team assist.
          </p>
        </div>
        <Link href="/contact">
          <Button variant="secondary" size="md">
            Contact Enterprise Sales
          </Button>
        </Link>
      </div>
    </div>
  );
}
