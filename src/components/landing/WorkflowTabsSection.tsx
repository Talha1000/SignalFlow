"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, Send, Layers, ArrowRight, ShieldCheck, Database, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SectorTab {
  id: string;
  name: string;
  color: string;
  lightColor: string;
  leadHeading: string;
  leadParagraph: string;
  cards: {
    title: string;
    description: string;
    stat: string;
    statLabel: string;
  }[];
  codeSnippet: string;
}

const SECTORS: SectorTab[] = [
  {
    id: "telemetry",
    name: "Intent Telemetry",
    color: "#34FEFF",
    lightColor: "#007B7C",
    leadHeading: "Accelerate Pipeline with 1st-Party Intent Telemetry",
    leadParagraph:
      "Our edge-computed de-anonymization engine monitors dark-funnel buying patterns across documentation, API sandboxes, and pricing interactions with zero third-party cookie dependencies.",
    cards: [
      {
        title: "Deep Technical Networks",
        description:
          "Capture anonymous IP and session activity from high-value accounts evaluating your architecture, pricing models, and security compliance.",
        stat: "18,500+",
        statLabel: "Signals / Sec Ingested",
      },
      {
        title: "Zero-Cookie Accuracy",
        description:
          "100% compliant with GDPR, CCPA, and Safari ITP restrictions by leveraging first-party server-side telemetry and cryptographic fingerprinting.",
        stat: "99.99%",
        statLabel: "Data Freshness SLA",
      },
      {
        title: "Seamless Global Ingestion",
        description:
          "Stream events from Segment, Rudderstack, Cloudflare Workers, or our native 4KB TypeScript SDK with sub-10ms delivery latency.",
        stat: "< 12ms",
        statLabel: "Ingestion Latency",
      },
    ],
    codeSnippet: `// 1st-Party Edge Ingestion
import { SignalFlow } from "@signalflow/sdk";

SignalFlow.ingest({
  event: "high_intent_pricing_toggle",
  metadata: {
    tier: "enterprise_annual",
    sessionDepth: 7,
    securityWhitepaperDownloaded: true
  }
});`,
  },
  {
    id: "ai-scoring",
    name: "Behavioral AI",
    color: "#38B6FF",
    lightColor: "#0284c7",
    leadHeading: "Deterministic Lead Scoring with Explainable Machine Learning",
    leadParagraph:
      "Eliminate sales guesswork. SignalFlow calculates ICP fit, intent velocity, and buying committee recency—giving your team a transparent point-by-point score breakdown.",
    cards: [
      {
        title: "Multi-Persona Attribution",
        description:
          "Detect when multiple stakeholders from the same enterprise (Engineering, VP Finance, Procurement) converge on your digital properties within a 48-hour window.",
        stat: "94.2%",
        statLabel: "Predictive Win Accuracy",
      },
      {
        title: "Mathematical Intent Decay",
        description:
          "Intent cools rapidly. Our dynamic decay algorithms prioritize surging in-market prospects over stale accounts that haven't visited in 30 days.",
        stat: "3.8x",
        statLabel: "Pipeline Velocity",
      },
      {
        title: "Explainable Factor Matrix",
        description:
          "Every score is transparent. Reps see exactly why an account scored 94/100, including persona seniority, pricing triggers, and contract timeline signals.",
        stat: "100%",
        statLabel: "Deterministic Auditing",
      },
    ],
    codeSnippet: `// Explainable AI Attribution Engine
{
  "account": "Stripe Technologies",
  "calculatedScore": 96,
  "confidence": "Optimal ICP",
  "factors": [
    { "factor": "VP Engineering Authority", "pts": +30 },
    { "factor": "Enterprise Security Audit Check", "pts": +25 },
    { "factor": "3 Active Team Members (24h)", "pts": +20 }
  ]
}`,
  },
  {
    id: "autonomous-cadence",
    name: "Autonomous Outbound",
    color: "#FF914D",
    lightColor: "#e06c27",
    leadHeading: "Instant Multi-Channel Engagement Before Intent Cools",
    leadParagraph:
      "When enterprise accounts cross high-intent thresholds, SignalFlow triggers hyper-tailored outbound communications and alerts account executives via Slack in under 90 seconds.",
    cards: [
      {
        title: "Contextual AI Copilot",
        description:
          "Draft hyper-relevant outreach that references the exact technical documentation and features the prospective buying committee was evaluating.",
        stat: "< 90s",
        statLabel: "Time-to-Engagement",
      },
      {
        title: "Collision Safety Protocols",
        description:
          "Auto-pauses sequences immediately when an account replies or already has an active sales opportunity in Salesforce or HubSpot.",
        stat: "0%",
        statLabel: "Outbound Collisions",
      },
      {
        title: "Slack Real-Time Claiming",
        description:
          "Deliver actionable notifications to dedicated AE channels with one-click lead claiming, LinkedIn profile deep links, and pre-drafted email copies.",
        stat: "62%",
        statLabel: "AE Claim Rate < 5m",
      },
    ],
    codeSnippet: `// Autonomous Outbound Cadence Dispatch
await SignalFlow.cadences.dispatch({
  leadId: "lead_enterprise_418",
  channel: "email_and_slack",
  template: "executive_architecture_review",
  autoHaltOnReply: true
});`,
  },
  {
    id: "crm-sync",
    name: "CRM Synchronization",
    color: "#F2BE01",
    lightColor: "#b88600",
    leadHeading: "Bi-Directional Synchronization Across Modern Revenue Stacks",
    leadParagraph:
      "Maintain absolute source-of-truth across your CRM, data warehouse, and messaging applications with enterprise-grade webhooks and field mapping.",
    cards: [
      {
        title: "Native Salesforce & HubSpot Sync",
        description:
          "Map enriched intent scores, company firmographics, and verified contact emails directly to standard or custom CRM fields automatically.",
        stat: "Bi-directional",
        statLabel: "Real-time Delta Sync",
      },
      {
        title: "Snowflake & BigQuery Streaming",
        description:
          "Replicate raw intent events to your cloud data warehouse for deeper business intelligence and custom revenue reporting.",
        stat: "Sub-Minute",
        statLabel: "Warehouse Replication",
      },
      {
        title: "Role-Based Access Governance",
        description:
          "Enforce strict least-privilege permissions, SSO authentication, and complete immutable audit logs across your sales organization.",
        stat: "SOC-2",
        statLabel: "Type II Certified",
      },
    ],
    codeSnippet: `// Bi-Directional CRM Sync Stream
const syncResult = await SignalFlow.crm.sync({
  destination: "Salesforce",
  recordType: "Account",
  updateFields: ["Intent_Score__c", "Surge_Status__c", "Last_Intent_Date__c"]
});`,
  },
];

export function WorkflowTabsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const current = SECTORS[activeTab];

  return (
    <section id="sectors" className="py-24 md:py-32 relative overflow-hidden bg-[#121212] light:bg-[#f7f7f7] border-t border-white/10 light:border-black/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header: "What We Do / We are SignalFlow" */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 light:bg-black/5 border border-white/10 light:border-black/10 text-slate-300 light:text-[#121212] text-xs font-mono uppercase tracking-widest mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34feff] light:bg-[#007b7c]" />
              <span>What We Do</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white light:text-[#121212] tracking-tight leading-tight">
              We are SignalFlow.
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base sm:text-lg text-slate-300 light:text-[#4a5053] leading-relaxed">
              The leading revenue intelligence engine connecting innovative companies with real-time buyer intent across web, CRM, and developer activity.
            </p>
          </div>
        </div>

        {/* Floating Sector Tab Navigation */}
        <div className="relative mb-8">
          <div
            className="inline-flex p-1.5 rounded-full bg-[#1e2224] light:bg-white border transition-all duration-300 shadow-md max-w-full overflow-x-auto"
            style={{ borderColor: current.color }}
          >
            {SECTORS.map((sector, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={sector.id}
                  onClick={() => setActiveTab(idx)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-tight transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? "text-[#121212] shadow-sm font-bold"
                      : "text-slate-400 light:text-[#6c7377] hover:text-white light:hover:text-black"
                  }`}
                  style={{
                    backgroundColor: isActive ? sector.color : "transparent",
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: isActive ? "#121212" : sector.color,
                    }}
                  />
                  <span>{sector.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Panel Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-8 sm:p-12 rounded-[24px] bg-[#1e2224] light:bg-white border border-white/10 light:border-black/10 shadow-xl transition-colors"
          >
            {/* Lead Title & Description */}
            <div className="max-w-3xl mb-12">
              <h3 className="text-2xl sm:text-4xl font-black text-white light:text-[#121212] tracking-tight leading-snug">
                {current.leadHeading}
              </h3>
              <p className="mt-4 text-base sm:text-lg text-slate-300 light:text-[#4a5053] leading-relaxed">
                {current.leadParagraph}
              </p>
            </div>

            {/* 3 Architectural Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {current.cards.map((card, cIdx) => (
                <div
                  key={cIdx}
                  className="p-6 rounded-[20px] bg-[#252a2b] light:bg-[#f7f7f7] border border-white/10 light:border-black/10 hover:border-white/20 light:hover:border-black/20 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="text-2xl font-black font-mono tracking-tight text-white light:text-[#121212]">
                      {card.stat}
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 light:text-[#787e82] mb-4">
                      {card.statLabel}
                    </div>
                    <h4 className="text-lg font-bold text-white light:text-[#121212] tracking-tight mb-2 group-hover:text-[#38b6ff] transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-sm text-slate-300 light:text-[#5a6266] leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Telemetry Code Inspector Preview */}
            <div className="rounded-[18px] bg-[#121212] border border-white/10 p-5 overflow-x-auto text-left">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>runtime_telemetry.ts</span>
                </div>
                <span className="text-[#38b6ff] font-semibold">Active Execution</span>
              </div>
              <pre className="text-xs font-mono text-emerald-400/90 leading-relaxed overflow-x-auto">
                <code>{current.codeSnippet}</code>
              </pre>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
