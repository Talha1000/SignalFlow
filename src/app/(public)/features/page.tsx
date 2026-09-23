import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Target,
  Zap,
  Layers,
  Bot,
  Activity,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  FileCode,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FeaturesPage() {
  const deepFeatures = [
    {
      title: "Explainable Lead Scoring Engine",
      subtitle: "Deterministic transparency instead of black-box guesses",
      description:
        "Every lead score (0–100) breaks down into exact positive and negative factors: Title authority, Company scale, Pricing page visits, API documentation views, and Recency decay. Your reps always know why a score changed.",
      bullets: [
        "Person fit (VP, C-level, Seniority scoring weights)",
        "Company ICP fit (Industry, Revenue, Tech Stack)",
        "Real-time behavioral telemetry with decay modeling",
        "Mathematical + and - point factor logs for every lead",
      ],
      icon: Activity,
    },
    {
      title: "Real-time Sales Priority Queue",
      subtitle: "Focus sales reps on buyers with high purchase velocity",
      description:
        "Stop sorting leads alphabetically or chronologically. The SignalFlow Priority Queue elevates hot leads with active signals right now, paired with AI-recommended next actions and response urgency deadlines.",
      bullets: [
        "🔥 Hot leads (Score 85+) surfaced immediately",
        "⚡ Surging intent alerts (+15 pts in 7 days)",
        "📩 Contextual follow-ups due today",
        "⚠️ Cooling lead alerts before opportunities stall",
      ],
      icon: Target,
    },
    {
      title: "Drip Cadences with Instant Auto-Stop",
      subtitle: "Automated follow-ups that never sound like spam",
      description:
        "Trigger sequences based on scoring thresholds and form submissions. The moment a prospect replies or books a meeting, SignalFlow automatically halts all scheduled cadence emails across all reps.",
      bullets: [
        "Multi-step day cadences (Day 0, Day 2, Day 5, Day 8)",
        "Dynamic template variables ({{first_name}}, {{company}})",
        "AI tone personalization (Direct, Consultative, Technical)",
        "Auto-stop on prospect reply detection",
      ],
      icon: Zap,
    },
    {
      title: "Interactive Visual Workflow Builder",
      subtitle: "Map lead signals to sales execution visually",
      description:
        "Build sophisticated automation workflows with drag-and-connect nodes. Trigger actions based on behavioral events, branch on email engagement, and dispatch notifications directly to Slack or webhooks.",
      bullets: [
        "Trigger, Condition, Delay, Action, and AI Action nodes",
        "Automated rep assignment and tag management",
        "Live execution history and failure handling",
        "Webhook dispatching to internal tools & CRM",
      ],
      icon: Layers,
    },
    {
      title: "In-App Contextual Sales Copilot",
      subtitle: "Query live workspace data in natural language",
      description:
        "The AI Copilot operates with full visibility into your workspace's leads, activities, and pipeline. Ask questions like 'Who should I contact today?' or 'Summarize Acme Corp' and receive grounded, accurate answers.",
      bullets: [
        "Grounded strictly in actual workspace records",
        "Answers account summaries and buying signals",
        "Drafts personalized outreach emails on demand",
        "Zero hallucinated purchase probabilities",
      ],
      icon: Bot,
    },
    {
      title: "Account-Based Marketing (ABM) Intelligence",
      subtitle: "Aggregate multi-stakeholder intent across companies",
      description:
        "In B2B, individuals don't buy alone—companies do. SignalFlow unites signals from engineers, directors, and executives at the same company into a unified account intent profile.",
      bullets: [
        "Rolls up individual contact activity into Company intent",
        "Detects multi-stakeholder consensus building",
        "Analyzes tech stack and firmographic data",
        "Tracks pipeline deal value across accounts",
      ],
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-medium text-cyan-400">
          <Sparkles className="h-3 w-3" /> Comprehensive Feature Tour
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Everything your sales team needs to prioritize and close
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          From behavioral signal capture to explainable scoring and automated cadences.
        </p>
      </div>

      <div className="space-y-12">
        {deepFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          const isEven = idx % 2 === 0;
          return (
            <div
              key={feat.title}
              className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                !isEven ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    {feat.subtitle}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">{feat.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {feat.bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-3 font-mono text-xs text-slate-400">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-500">
                  <span>signalflow://features/{feat.title.toLowerCase().replace(/\s+/g, "-")}</span>
                  <span className="text-emerald-400">● LIVE</span>
                </div>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  Engineered with strict tenant isolation, PostgreSQL indexing, and zero black-box
                  fabrication.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-500">Benchmark Latency</span>
                  <span className="text-cyan-400 font-bold">&lt; 40ms</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-8">
        <Link href="/signup">
          <Button variant="gradient" size="lg" className="px-8">
            Experience SignalFlow Live <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
