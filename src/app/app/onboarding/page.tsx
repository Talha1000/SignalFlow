"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Upload,
  Building,
  Target,
  Mail,
  Zap,
  Sliders,
  FileSpreadsheet,
  AlertCircle,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import confetti from "canvas-confetti";

interface CSVRow {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  job_title: string;
  industry?: string;
  company_size?: string;
  source?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  // Step 2 state: Workspace
  const [workspaceName, setWorkspaceName] = useState("SignalFlow Revenue Hub");
  const [workspaceDomain, setWorkspaceDomain] = useState("revenue.acmetech.io");

  // Step 3 state: CSV Import
  const [csvData, setCsvData] = useState<CSVRow[]>([
    {
      first_name: "Sarah",
      last_name: "Chen",
      email: "sarah.chen@acmetech.io",
      company: "Acme Technologies",
      job_title: "VP of Engineering",
      industry: "Developer Infrastructure",
      company_size: "250-500",
      source: "WEBSITE",
    },
    {
      first_name: "Marcus",
      last_name: "Vance",
      email: "m.vance@apexcloud.dev",
      company: "ApexCloud Platforms",
      job_title: "CTO",
      industry: "Cloud & DevOps",
      company_size: "500-1000",
      source: "CAMPAIGN",
    },
    {
      first_name: "Victor",
      last_name: "Stone",
      email: "vstone@securityzero.com",
      company: "SecurityZero Corp",
      job_title: "CIO",
      industry: "Cybersecurity",
      company_size: "100-250",
      source: "INBOUND",
    },
  ]);
  const [importProgress, setImportProgress] = useState<number | null>(null);

  // Step 4 state: ICP
  const [icpIndustries, setIcpIndustries] = useState(["Developer Tools", "B2B SaaS", "Fintech"]);
  const [icpTitles, setIcpTitles] = useState(["VP of Engineering", "CTO", "Head of Product"]);

  // Step 5 state: Scoring
  const [hotThreshold, setHotThreshold] = useState(85);
  const [pricingVisitWeight, setPricingVisitWeight] = useState(18);

  // Step 6 state: Email Provider
  const [emailProvider, setEmailProvider] = useState("Google Workspace");

  // Step 7 state: Cadence
  const [cadenceName, setCadenceName] = useState("High-Intent Inbound Fast-Response");

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        router.push("/app/dashboard?tour=start");
      }, 1000);
    }
  };

  const handleSimulateCSVUpload = () => {
    setImportProgress(25);
    setTimeout(() => setImportProgress(65), 400);
    setTimeout(() => {
      setImportProgress(100);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header Progress */}
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">SignalFlow Onboarding</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Step {step} of {totalSteps}
            </span>
          </div>
          <button
            onClick={() => router.push("/app/dashboard")}
            className="text-xs text-slate-400 hover:text-white"
          >
            Skip to Dashboard →
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="mt-4 grid grid-cols-8 gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i + 1 <= step ? "bg-cyan-400" : "bg-slate-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Step Body */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white">
                  Welcome to SignalFlow!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  In the next 3 minutes, we'll set up your workspace, import your leads, and
                  activate real-time intent prioritization.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-white">1. Capture Signals</span>
                  <p className="text-[11px] text-slate-400">Web visits, docs, pricing interactions</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-cyan-400">2. Score & Explain</span>
                  <p className="text-[11px] text-slate-400">Calibrated scoring with positive drivers</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-400">3. Act Instantly</span>
                  <p className="text-[11px] text-slate-400">Next action guidance & auto-cadences</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Workspace Setup */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Workspace Configuration</h2>
                <p className="text-xs text-slate-400">
                  Set your organization name and tracking domain.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Workspace Name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g. Acme Sales Team"
                />
                <Input
                  label="Primary Company Domain"
                  value={workspaceDomain}
                  onChange={(e) => setWorkspaceDomain(e.target.value)}
                  placeholder="e.g. acmetech.io"
                />
                <Select
                  label="Workspace Default Timezone"
                  options={[
                    { label: "Eastern Time (US & Canada)", value: "America/New_York" },
                    { label: "Pacific Time (US & Canada)", value: "America/Los_Angeles" },
                    { label: "UTC / GMT", value: "UTC" },
                    { label: "Central European Time", value: "Europe/Berlin" },
                  ]}
                />
              </div>
            </div>
          )}

          {/* STEP 3: CSV Lead Import */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Import Your Leads</h2>
                <p className="text-xs text-slate-400">
                  Upload a CSV file or verify our pre-parsed sample records.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={handleSimulateCSVUpload}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-6 text-center cursor-pointer bg-slate-950/40 transition-colors"
              >
                <Upload className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-white">
                  Click to select CSV or drag and drop
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Supports columns: first_name, last_name, email, company, job_title, industry
                </div>
              </div>

              {importProgress !== null && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>Processing CSV records & detecting columns...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-300 rounded-full"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Live Preview Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Detected Columns & Preview (3 records)</span>
                  <span className="text-emerald-400 text-[10px]">✔ 0 Duplicates Detected</span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950 overflow-x-auto text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Company</th>
                        <th className="p-2">Title</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {csvData.map((row, i) => (
                        <tr key={i}>
                          <td className="p-2 font-medium text-white">{row.first_name} {row.last_name}</td>
                          <td className="p-2 font-mono text-slate-400">{row.email}</td>
                          <td className="p-2">{row.company}</td>
                          <td className="p-2 text-cyan-300">{row.job_title}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Define ICP */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Ideal Customer Profile (ICP)</h2>
                <p className="text-xs text-slate-400">
                  Define high-value target titles and industries to boost initial fit scoring.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Target Job Titles (comma separated)
                  </label>
                  <Input
                    value={icpTitles.join(", ")}
                    onChange={(e) => setIcpTitles(e.target.value.split(", "))}
                    placeholder="e.g. VP Engineering, CTO, Head of Product"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Priority Industries
                  </label>
                  <Input
                    value={icpIndustries.join(", ")}
                    onChange={(e) => setIcpIndustries(e.target.value.split(", "))}
                    placeholder="e.g. Developer Tools, Fintech, B2B SaaS"
                  />
                </div>

                <Select
                  label="Target Company Employee Size"
                  options={[
                    { label: "100 - 1,000 employees (Mid-Market to Enterprise)", value: "mid-enterprise" },
                    { label: "10 - 100 employees (Early Growth)", value: "growth" },
                    { label: "1,000+ employees (Global Enterprise)", value: "enterprise" },
                  ]}
                />
              </div>
            </div>
          )}

          {/* STEP 5: Configure Scoring */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Calibrate Scoring Weights</h2>
                <p className="text-xs text-slate-400">
                  Fine-tune how points are assigned across behavior and authority.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between font-medium text-slate-200">
                    <span>Hot Intent Threshold</span>
                    <span className="font-mono text-cyan-400 font-bold">{hotThreshold} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="95"
                    value={hotThreshold}
                    onChange={(e) => setHotThreshold(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[10px] text-slate-500">
                    Leads reaching this score are placed at the top of the Priority Queue.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between font-medium text-slate-200">
                    <span>Pricing Page Visit Weight</span>
                    <span className="font-mono text-cyan-400 font-bold">+{pricingVisitWeight} pts</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    value={pricingVisitWeight}
                    onChange={(e) => setPricingVisitWeight(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[10px] text-slate-500">
                    Points added when a lead browses commercial pricing tiers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Connect Email */}
          {step === 6 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Connect Outbound Email</h2>
                <p className="text-xs text-slate-400">
                  Select your outbound email provider to send cadences and sync replies.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {["Google Workspace", "Microsoft 365", "Custom SMTP", "Resend API"].map((prov) => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setEmailProvider(prov)}
                    className={`p-4 rounded-xl border text-left text-xs transition-all ${
                      emailProvider === prov
                        ? "bg-cyan-500/10 border-cyan-500/50 text-white font-semibold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Mail className="h-5 w-5 mb-2 text-cyan-400" />
                    {prov}
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Default sandbox email connection ready for testing.</span>
              </div>
            </div>
          )}

          {/* STEP 7: Create First Cadence */}
          {step === 7 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">First Automated Cadence</h2>
                <p className="text-xs text-slate-400">
                  Choose a default sequence that triggers when leads show buying intent.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Sequence Name"
                  value={cadenceName}
                  onChange={(e) => setCadenceName(e.target.value)}
                />

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">Day 0: Initial Touch</div>
                      <div className="text-slate-400 text-[11px]">Subject: Quick question re: {`{{company}}`}'s evaluation</div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">Step 1</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">Day 2: Architecture Follow-Up</div>
                      <div className="text-slate-400 text-[11px]">Subject: Technical benchmark + case study</div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">Step 2</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">Day 5: Auto-Stop on Reply</div>
                      <div className="text-slate-400 text-[11px]">Halts immediately when prospect replies</div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">Auto-Guard</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Finish */}
          {step === 8 && (
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white">
                  You're Ready to Launch!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your workspace is initialized with calibrated scoring, imported leads, and an
                  automated cadence.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-left space-y-1.5">
                <div className="text-white font-semibold">What to do first in your dashboard:</div>
                <div>🔥 Review your top 3 Hot Leads in the Priority Queue.</div>
                <div>💡 Inspect the AI explainability panel on Sarah Chen (Score 91).</div>
                <div>📩 Send an AI-personalized follow-up with one click.</div>
              </div>
            </div>
          )}

          {/* Footer Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(step - 1)}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </Button>
            ) : (
              <div />
            )}

            <Button variant="gradient" size="md" onClick={handleNext} className="gap-1.5">
              {step === totalSteps ? (
                <>
                  Enter Dashboard <Play className="h-4 w-4 ml-1 fill-current" />
                </>
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
