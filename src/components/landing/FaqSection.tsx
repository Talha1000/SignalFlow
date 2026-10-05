"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does SignalFlow capture buying intent without violating privacy regulations?",
      a: "SignalFlow adheres strictly to GDPR, CCPA, and SOC2 standards. We capture first-party behavioral telemetry (page visits, docs usage, pricing views, form requests) through transparent SDK webhooks and reverse IP company enrichment. We never buy or sell unlawful consumer data, and all enterprise accounts are isolated.",
    },
    {
      q: "Is the AI Lead Score a black-box algorithm?",
      a: "No! Unlike legacy scoring tools that output an arbitrary percentage, SignalFlow is 100% deterministic and explainable. Every score (0–100) breaks down into exact positive and negative mathematical logs (e.g., +20 for C-Level Seniority, +18 for 3x Pricing Visits, -8 for Recency Decay). Reps always know why a score changed.",
    },
    {
      q: "How does the cadence auto-stop feature prevent embarrassing spam collisions?",
      a: "Our background listener processes inbound webhooks and replies in sub-50 milliseconds. The instant an enrolled prospect replies to any email, books a meeting via calendar link, or changes deal stage, SignalFlow immediately cancels all scheduled subsequent cadence touches across every rep on your team.",
    },
    {
      q: "Does SignalFlow integrate with Salesforce, HubSpot, and Slack?",
      a: "Yes. SignalFlow features native bidirectional synchronization with Salesforce, HubSpot, and Pipedrive. You can automatically push scored leads, update deal stages, and dispatch real-time Slack alerts to dedicated sales channels with 1-click action buttons.",
    },
    {
      q: "How long does enterprise implementation take?",
      a: "Most teams are up and running in under 15 minutes. You simply paste our client SDK script into your application or connect Segment/Stripe, and SignalFlow will start ingesting and scoring buyer intent immediately.",
    },
    {
      q: "What security compliance do you offer for enterprise customers?",
      a: "We provide our comprehensive Security Architecture & SOC2 alignment packet, SAML 2.0 / Okta SSO, custom role-based access control (RBAC), end-to-end encryption in transit (TLS 1.3) and at rest (AES-256), and zero data retention agreements for our AI models.",
    },
  ];

  return (
    <section className="py-28 relative overflow-hidden bg-[#121212] light:bg-[#f7f7f7] transition-colors">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white text-slate-300 light:text-[#121212] text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <HelpCircle className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white light:text-[#121212] tracking-tight leading-tight">
            Frequently Asked{" "}
            <span className="text-[#38b6ff] light:text-[#0284c7]">
              Questions
            </span>
          </h2>
          <p className="mt-4 text-slate-300 light:text-[#4a5053] text-base sm:text-lg">
            Clear answers about data privacy, explainable scoring mathematics, cadence safety, and enterprise integrations.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-white/15 light:border-black/15 bg-[#1e2224] light:bg-white overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-7 text-left flex items-center justify-between gap-4 hover:bg-white/5 light:hover:bg-black/5 transition-colors"
                >
                  <span className="text-lg font-bold text-white light:text-[#121212]">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#38b6ff] light:text-[#0284c7] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-7 pb-7 text-sm text-slate-300 light:text-[#4a5053] leading-relaxed border-t border-white/10 light:border-black/10 pt-5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
