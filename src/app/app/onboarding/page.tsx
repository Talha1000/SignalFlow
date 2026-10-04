"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
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
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { useTheme } from "@/components/theme/ThemeProvider";
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
  const { theme, toggleTheme } = useTheme();
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
      job_title: "CTO & Co-Founder",
      industry: "Cloud & Devops",
      company_size: "50-100",
      source: "DOCS",
    },
    {
      first_name: "Elena",
      last_name: "Rostova",
      email: "elena@vertexscale.com",
      company: "Vertex Scale Inc",
      job_title: "Director of Product",
      industry: "B2B SaaS",
      company_size: "500-1000",
      source: "PRICING",
    },
  ]);
  const [importProgress, setImportProgress] = useState<number | null>(null);

  // Step 4 state: ICP
  const [icpTitles, setIcpTitles] = useState(["VP Engineering", "CTO", "Head of Product"]);
  const [icpIndustries, setIcpIndustries] = useState(["Developer Tools", "Cloud Infrastructure", "B2B SaaS"]);

  // Step 5 state: Scoring Weights
  const [hotThreshold, setHotThreshold] = useState(85);
  const [pricingVisitWeight, setPricingVisitWeight] = useState(25);

  // Step 6 state: Email Provider
  const [emailProvider, setEmailProvider] = useState("Google Workspace");

  // Step 7 state: Cadence
  const [cadenceName, setCadenceName] = useState("Tier-1 Inbound Buying Surge Sequence");

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
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
    <div className="min-h-screen bg-[#121212] light:bg-[#f7f7f7] text-white light:text-[#121212] flex flex-col justify-between p-4 sm:p-8 transition-colors relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#38b6ff]/10 light:bg-[#0284c7]/10 blur-[130px]" />

      {/* Top Header Progress */}
      <div className="max-w-4xl mx-auto w-full z-10">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 light:border-black/10">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e2224] light:bg-[#ffffff] border border-white/15 light:border-black/10 shadow-xs">
                <Activity className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white light:text-[#121212]">
                SignalFlow
              </span>
            </Link>
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/10 light:bg-black/5 text-[#38b6ff] light:text-[#0284c7] border border-white/10 light:border-black/10">
              Step {step} of {totalSteps}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sliding Pill Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="relative flex items-center justify-between w-[64px] h-7 px-1.5 rounded-full bg-[#1e2224] light:bg-[#eaeaea] border border-white/15 light:border-black/15 transition-all shadow-inner cursor-pointer"
              title="Toggle Light / Dark mode"
              aria-label="Toggle Theme"
            >
              <span
                className={`absolute top-0.5 bottom-0.5 w-5 rounded-full transition-all duration-300 ease-in-out ${
                  theme === "dark"
                    ? "left-1 bg-[#121212] border border-white/25 shadow-xs"
                    : "left-[37px] bg-[#ffffff] border border-black/15 shadow-xs"
                }`}
              />
              <Moon
                className={`relative z-10 h-3 w-3 transition-colors ${
                  theme === "dark" ? "text-[#34feff]" : "text-gray-400"
                }`}
              />
              <Sun
                className={`relative z-10 h-3 w-3 transition-colors ${
                  theme === "dark" ? "text-gray-500" : "text-[#f2be01]"
                }`}
              />
            </button>

            <button
              onClick={() => router.push("/app/dashboard")}
              className="text-xs text-slate-400 light:text-[#787e82] hover:text-white light:hover:text-[#121212] transition-colors"
            >
              Skip to Dashboard →
            </button>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="mt-4 grid grid-cols-8 gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i + 1 <= step
                  ? "bg-[#38b6ff] light:bg-[#0284c7]"
                  : "bg-[#252a2b] light:bg-[#e4e6e8]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Step Body */}
      <div className="max-w-2xl mx-auto w-full my-8 z-10">
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-7 sm:p-8 shadow-2xl backdrop-blur-xl transition-colors">
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#38b6ff]/10 light:bg-[#0284c7]/10 text-[#38b6ff] light:text-[#0284c7] border border-[#38b6ff]/30 light:border-[#0284c7]/30">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white light:text-[#121212]">
                  Welcome to SignalFlow!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 light:text-[#4a5053] max-w-md mx-auto leading-relaxed">
                  In the next 3 minutes, we'll set up your workspace, import your leads, and
                  activate real-time intent prioritization.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-4">
                <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-1">
                  <span className="text-xs font-bold text-white light:text-[#121212]">1. Capture Signals</span>
                  <p className="text-[11px] text-slate-400 light:text-[#787e82]">Web visits, docs, pricing interactions</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-1">
                  <span className="text-xs font-bold text-[#38b6ff] light:text-[#0284c7]">2. Score & Explain</span>
                  <p className="text-[11px] text-slate-400 light:text-[#787e82]">Calibrated scoring with positive drivers</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-1">
                  <span className="text-xs font-bold text-emerald-400 light:text-emerald-700">3. Act Instantly</span>
                  <p className="text-[11px] text-slate-400 light:text-[#787e82]">Next action guidance & auto-cadences</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Workspace Setup */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white light:text-[#121212]">Workspace Configuration</h2>
                <p className="text-xs text-slate-400 light:text-[#787e82]">
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
                <h2 className="text-xl font-bold text-white light:text-[#121212]">Import Your Leads</h2>
                <p className="text-xs text-slate-400 light:text-[#787e82]">
                  Upload a CSV file or verify our pre-parsed sample records.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={handleSimulateCSVUpload}
                className="border-2 border-dashed border-white/20 light:border-black/20 hover:border-[#38b6ff]/50 light:hover:border-[#0284c7]/50 rounded-2xl p-6 text-center cursor-pointer bg-[#252a2b]/50 light:bg-[#f0f2f3]/50 transition-colors"
              >
                <Upload className="h-8 w-8 text-[#38b6ff] light:text-[#0284c7] mx-auto mb-2" />
                <div className="text-xs font-semibold text-white light:text-[#121212]">
                  Click to select CSV or drag and drop
                </div>
                <div className="text-[10px] text-slate-400 light:text-[#787e82] mt-1">
                  Supports columns: first_name, last_name, email, company, job_title, industry
                </div>
              </div>

              {importProgress !== null && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-slate-300 light:text-[#4a5053]">
                    <span>Processing CSV records & detecting columns...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#252a2b] light:bg-[#e4e6e8] overflow-hidden">
                    <div
                      className="h-full bg-[#38b6ff] light:bg-[#0284c7] transition-all duration-300 rounded-full"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Live Preview Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 light:text-[#121212]">
                  <span>Detected Columns & Preview (3 records)</span>
                  <span className="text-emerald-400 light:text-emerald-700 text-[10px]">✔ 0 Duplicates Detected</span>
                </div>
                <div className="rounded-2xl border border-white/10 light:border-black/10 bg-[#252a2b]/70 light:bg-[#f0f2f3] overflow-x-auto text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-[#181b1c] light:bg-white border-b border-white/10 light:border-black/10 text-slate-400 light:text-[#787e82]">
                      <tr>
                        <th className="p-2.5">Name</th>
                        <th className="p-2.5">Email</th>
                        <th className="p-2.5">Company</th>
                        <th className="p-2.5">Title</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 light:divide-black/10 text-slate-300 light:text-[#4a5053]">
                      {csvData.map((row, i) => (
                        <tr key={i}>
                          <td className="p-2.5 font-medium text-white light:text-[#121212]">{row.first_name} {row.last_name}</td>
                          <td className="p-2.5 font-mono text-slate-400 light:text-[#787e82]">{row.email}</td>
                          <td className="p-2.5">{row.company}</td>
                          <td className="p-2.5 text-[#38b6ff] light:text-[#0284c7] font-medium">{row.job_title}</td>
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
                <h2 className="text-xl font-bold text-white light:text-[#121212]">Ideal Customer Profile (ICP)</h2>
                <p className="text-xs text-slate-400 light:text-[#787e82]">
                  Define high-value target titles and industries to boost initial fit scoring.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300 light:text-[#121212]">
                    Target Job Titles (comma separated)
                  </label>
                  <Input
                    value={icpTitles.join(", ")}
                    onChange={(e) => setIcpTitles(e.target.value.split(", "))}
                    placeholder="e.g. VP Engineering, CTO, Head of Product"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300 light:text-[#121212]">
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
                <h2 className="text-xl font-bold text-white light:text-[#121212]">Calibrate Scoring Weights</h2>
                <p className="text-xs text-slate-400 light:text-[#787e82]">
                  Fine-tune how points are assigned across behavior and authority.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-2">
                  <div className="flex justify-between font-medium text-slate-200 light:text-[#121212]">
                    <span>Hot Intent Threshold</span>
                    <span className="font-mono text-[#38b6ff] light:text-[#0284c7] font-bold">{hotThreshold} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="95"
                    value={hotThreshold}
                    onChange={(e) => setHotThreshold(Number(e.target.value))}
                    className="w-full accent-[#38b6ff] light:accent-[#0284c7]"
                  />
                  <p className="text-[10px] text-slate-400 light:text-[#787e82]">
                    Leads reaching this score are placed at the top of the Priority Queue.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-2">
                  <div className="flex justify-between font-medium text-slate-200 light:text-[#121212]">
                    <span>Pricing Page Visit Weight</span>
                    <span className="font-mono text-[#38b6ff] light:text-[#0284c7] font-bold">+{pricingVisitWeight} pts</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    value={pricingVisitWeight}
                    onChange={(e) => setPricingVisitWeight(Number(e.target.value))}
                    className="w-full accent-[#38b6ff] light:accent-[#0284c7]"
                  />
                  <p className="text-[10px] text-slate-400 light:text-[#787e82]">
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
                <h2 className="text-xl font-bold text-white light:text-[#121212]">Connect Outbound Email</h2>
                <p className="text-xs text-slate-400 light:text-[#787e82]">
                  Select your outbound email provider to send cadences and sync replies.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {["Google Workspace", "Microsoft 365", "Custom SMTP", "Resend API"].map((prov) => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setEmailProvider(prov)}
                    className={`p-4 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                      emailProvider === prov
                        ? "bg-[#38b6ff]/10 light:bg-[#0284c7]/10 border-[#38b6ff] light:border-[#0284c7] text-[#38b6ff] light:text-[#0284c7] font-semibold"
                        : "bg-[#252a2b] light:bg-[#f0f2f3] border-white/10 light:border-black/10 text-slate-400 light:text-[#787e82] hover:text-white light:hover:text-[#121212]"
                    }`}
                  >
                    <Mail className="h-5 w-5 mb-2 text-[#38b6ff] light:text-[#0284c7]" />
                    {prov}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 light:text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Default sandbox email connection ready for testing.</span>
              </div>
            </div>
          )}

          {/* STEP 7: Create First Cadence */}
          {step === 7 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white light:text-[#121212]">First Automated Cadence</h2>
                <p className="text-xs text-slate-400 light:text-[#787e82]">
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
                  <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white light:text-[#121212]">Day 0: Initial Touch</div>
                      <div className="text-slate-400 light:text-[#787e82] text-[11px]">Subject: Quick question re: {`{{company}}`}'s evaluation</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#38b6ff] light:text-[#0284c7] uppercase">Step 1</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white light:text-[#121212]">Day 2: Architecture Follow-Up</div>
                      <div className="text-slate-400 light:text-[#787e82] text-[11px]">Subject: Technical benchmark + case study</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#38b6ff] light:text-[#0284c7] uppercase">Step 2</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white light:text-[#121212]">Day 5: Auto-Stop on Reply</div>
                      <div className="text-slate-400 light:text-[#787e82] text-[11px]">Halts immediately when prospect replies</div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 light:text-emerald-700">Auto-Guard</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Finish */}
          {step === 8 && (
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 light:text-emerald-700 border border-emerald-500/30">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white light:text-[#121212]">
                  You're Ready to Launch!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 light:text-[#4a5053] max-w-md mx-auto leading-relaxed">
                  Your workspace is initialized with calibrated scoring, imported leads, and an
                  automated cadence.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 text-xs text-slate-400 light:text-[#787e82] text-left space-y-1.5">
                <div className="text-white light:text-[#121212] font-semibold">What to do first in your dashboard:</div>
                <div>🔥 Review your top 3 Hot Leads in the Priority Queue.</div>
                <div>💡 Inspect the AI explainability panel on Sarah Chen (Score 91).</div>
                <div>📩 Send an AI-personalized follow-up with one click.</div>
              </div>
            </div>
          )}

          {/* Footer Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-white/10 light:border-black/10 flex items-center justify-between">
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

            <Button variant="pill" size="md" onClick={handleNext} className="gap-1.5 shadow-lg">
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
