"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Cpu,
  Send,
  Layers,
  ArrowRight,
  ShieldCheck,
  Database,
  Zap,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

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
  previewData: {
    badge: string;
    headline: string;
    status: string;
    items: Array<{ title: string; subtitle: string; tag: string; tagColor: string }>;
    detailNote: string;
  };
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
    previewData: {
      badge: "LIVE 1ST-PARTY STREAM",
      headline: "Real-Time Enterprise Intent Feed",
      status: "Continuous Ingestion Active",
      items: [
        {
          title: "Acme Technologies (Series C)",
          subtitle: "Enterprise pricing calculator evaluated 3x • Session depth 8 pages",
          tag: "+25 Intent Pts",
          tagColor: "#34FEFF",
        },
        {
          title: "Vanguard Systems (Fortune 500)",
          subtitle: "Downloaded SOC-2 Type II audit report & security whitepaper",
          tag: "+20 Intent Pts",
          tagColor: "#38B6FF",
        },
        {
          title: "Apex Cloud Infrastructure",
          subtitle: "3 teammates active in API documentation across past 24 hours",
          tag: "+18 Intent Pts",
          tagColor: "#FF914D",
        },
      ],
      detailNote: "Sub-10ms edge processing • 100% first-party cryptographic attribution",
    },
  },
  {
    id: "ai-scoring",
    name: "Behavioral AI",
    color: "#38B6FF",
    lightColor: "#0284c7",
    leadHeading: "Deterministic Lead Scoring with Explainable Machine Learning",
    leadParagraph:
      "Eliminate sales guesswork. SignalFlow calculates ICP fit, intent velocity, and buying committee recency—giving your revenue team a transparent point-by-point score breakdown.",
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
    previewData: {
      badge: "MATHEMATICAL ATTRIBUTION",
      headline: "Account Fit & Intent Score: 96/100",
      status: "Optimal ICP Target",
      items: [
        {
          title: "VP Engineering Authority Identified",
          subtitle: "Executive buyer seniority match with budget signing jurisdiction",
          tag: "+30 pts",
          tagColor: "#38B6FF",
        },
        {
          title: "High-Volume Pricing Tier Calculation",
          subtitle: "Evaluated 500+ seat enterprise license model",
          tag: "+25 pts",
          tagColor: "#34FEFF",
        },
        {
          title: "Multi-Stakeholder Velocity Surge",
          subtitle: "3 distinct engineering leads active in docs in last 12 hours",
          tag: "+20 pts",
          tagColor: "#F2BE01",
        },
      ],
      detailNote: "Zero hallucination • Full deterministic score traceability in plain English",
    },
  },
  {
    id: "autonomous-cadence",
    name: "Autonomous Outbound",
    color: "#FF914D",
    leadHeading: "Instant Multi-Channel Engagement Before Intent Cools",
    lightColor: "#e06c27",
    leadParagraph:
      "When enterprise accounts cross high-intent thresholds, SignalFlow triggers hyper-tailored outbound communications and alerts dedicated account executives via Slack in under 90 seconds.",
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
    previewData: {
      badge: "AUTONOMOUS EXECUTION",
      headline: "Executive Outbound Dispatch Queue",
      status: "Triggered in 42 seconds",
      items: [
        {
          title: "Contextual Executive Outreach Drafted",
          subtitle: "References visited SSO architecture & compliance docs directly",
          tag: "Ready to Dispatch",
          tagColor: "#FF914D",
        },
        {
          title: "Real-Time Slack Channel Notification",
          subtitle: "Pushed to #enterprise-leads with 1-click AE ownership claim",
          tag: "Delivered",
          tagColor: "#34FEFF",
        },
        {
          title: "Automated Collision Safety Check",
          subtitle: "Zero existing open opportunities detected in Salesforce CRM",
          tag: "Safety Verified",
          tagColor: "#10b981",
        },
      ],
      detailNote: "Automatic sequence halt triggered immediately upon prospect response",
    },
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
        statLabel: "Aligned Architecture",
      },
    ],
    previewData: {
      badge: "BI-DIRECTIONAL SYNC",
      headline: "CRM & Warehouse Pipeline State",
      status: "Synced 2s ago",
      items: [
        {
          title: "Salesforce Account Delta Pushed",
          subtitle: "Field 'Intent_Score__c' updated to 96 • Surge status 'Critical'",
          tag: "Synced (14ms)",
          tagColor: "#F2BE01",
        },
        {
          title: "HubSpot Deal Probability Recalculated",
          subtitle: "Stage advanced to 'Solution Evaluation' based on buying group activity",
          tag: "Synced (18ms)",
          tagColor: "#38B6FF",
        },
        {
          title: "Snowflake Warehouse Event Replicated",
          subtitle: "Audit log entry #9841 stored with immutable SHA-256 signature",
          tag: "Replicated",
          tagColor: "#34FEFF",
        },
      ],
      detailNote: "Zero data conflicts • End-to-end encrypted delta pipeline with SLA backing",
    },
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

            {/* Executive Enterprise Console Preview (Replacing raw code terminal) */}
            <div className="rounded-[20px] bg-[#252a2b] light:bg-[#f7f7f7] border border-white/10 light:border-black/10 p-6 sm:p-8 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 mb-5 border-b border-white/10 light:border-black/10 gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/20 light:bg-black/5"
                    style={{ color: current.color }}
                  >
                    {current.previewData.badge}
                  </span>
                  <h4 className="text-base font-bold text-white light:text-[#121212]">
                    {current.previewData.headline}
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 light:text-emerald-600 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{current.previewData.status}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-6">
                {current.previewData.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-4 rounded-[14px] bg-[#1e2224] light:bg-white border border-white/10 light:border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-white/20 light:hover:border-black/20 transition-all shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: item.tagColor }} />
                      <div>
                        <div className="text-sm font-bold text-white light:text-[#121212]">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-400 light:text-[#6c7377] mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/5 light:bg-black/5 shrink-0 self-start sm:self-auto"
                      style={{ color: item.tagColor }}
                    >
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Trigger & Footnote */}
              <div className="pt-4 border-t border-white/10 light:border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="text-xs font-mono text-slate-400 light:text-[#787e82]">
                  {current.previewData.detailNote}
                </span>

                <Link href="/app/dashboard">
                  <Button
                    variant="pill"
                    size="sm"
                    className="gap-2 font-bold bg-[#262626] hover:bg-black text-white light:bg-[#121212] light:text-white border border-white/20 light:border-black/20"
                  >
                    Start Your Journey with {current.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
