"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Activity, ArrowRight, Building, User, ShieldCheck, Sun, Moon, Sparkles } from "lucide-react";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/theme/ThemeProvider";

function SignupForm() {
  const searchParams = useSearchParams();
  const planQuery = searchParams.get("plan") || "starter";
  const [accountType, setAccountType] = useState<"company" | "individual">("company");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("B2B SaaS / Developer Tools");
  const [companySize, setCompanySize] = useState("50-200");
  const [roleInCompany, setRoleInCompany] = useState("Head of Sales / VP");
  const [primaryGoal, setPrimaryGoal] = useState("Prioritize high-intent leads");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          accountType,
          companyName,
          website,
          industry,
          companySize,
          roleInCompany,
          primaryGoal,
          plan: planQuery,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed. Please try a different email.");
      } else {
        // Complete page reload guarantees cookie is committed before entering app
        window.location.href = "/app/onboarding";
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-7 sm:p-8 shadow-2xl backdrop-blur-xl transition-colors">
      {/* Tier Badge if selected */}
      <div className="mb-4 flex items-center justify-between text-xs">
        <span className="text-slate-400 light:text-[#787e82]">Selected Tier:</span>
        <span className="font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#38b6ff]/10 text-[#38b6ff] light:text-[#0284c7] border border-[#38b6ff]/20">
          {planQuery}
        </span>
      </div>

      {/* Account Type Selector */}
      <div className="mb-6 grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
        <button
          type="button"
          onClick={() => setAccountType("company")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            accountType === "company"
              ? "bg-[#181b1c] text-white light:bg-white light:text-[#121212] shadow-sm border border-white/10 light:border-black/10"
              : "text-slate-400 light:text-[#787e82] hover:text-white light:hover:text-[#121212]"
          }`}
        >
          <Building className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" /> Company / Team
        </button>
        <button
          type="button"
          onClick={() => setAccountType("individual")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            accountType === "individual"
              ? "bg-[#181b1c] text-white light:bg-white light:text-[#121212] shadow-sm border border-white/10 light:border-black/10"
              : "text-slate-400 light:text-[#787e82] hover:text-white light:hover:text-[#121212]"
          }`}
        >
          <User className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" /> Individual User
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-500/10 border border-red-500/30 p-3.5 text-xs text-red-400 light:text-red-600 flex items-start gap-2.5">
          <span className="font-bold">Error:</span>
          <span className="flex-1">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Sarah Connor"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Work Email"
          type="email"
          placeholder="sarah@signalflow.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password (min. 8 characters)"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        {accountType === "company" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Company Name"
                placeholder="Acme Tech"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <Input
                label="Website Domain"
                placeholder="acmetech.io"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                options={[
                  { label: "B2B SaaS / Dev Tools", value: "B2B SaaS / Developer Tools" },
                  { label: "Cybersecurity & Cloud", value: "Cybersecurity & Cloud" },
                  { label: "Fintech & Banking", value: "Fintech & Banking" },
                  { label: "Healthcare & Biotech", value: "Healthcare & Biotech" },
                  { label: "E-Commerce & Retail", value: "E-Commerce & Retail" },
                  { label: "Other Enterprise", value: "Other Enterprise" },
                ]}
              />
              <Select
                label="Company Size"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                options={[
                  { label: "1-10 employees", value: "1-10" },
                  { label: "11-50 employees", value: "11-50" },
                  { label: "50-200 employees", value: "50-200" },
                  { label: "201-1000 employees", value: "201-1000" },
                  { label: "1000+ employees", value: "1000+" },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Your Role"
                value={roleInCompany}
                onChange={(e) => setRoleInCompany(e.target.value)}
                options={[
                  { label: "Head of Sales / VP", value: "Head of Sales / VP" },
                  { label: "CRO / Revenue Executive", value: "CRO / Revenue Executive" },
                  { label: "Sales Operations Lead", value: "Sales Operations Lead" },
                  { label: "Account Executive / SDR", value: "Account Executive / SDR" },
                  { label: "Founder / CEO", value: "Founder / CEO" },
                ]}
              />
              <Select
                label="Primary Goal"
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                options={[
                  { label: "Prioritize hot leads", value: "Prioritize high-intent leads" },
                  { label: "Automate sales sequences", value: "Automate sales sequences" },
                  { label: "Detect buying signals", value: "Detect real-time buying signals" },
                  { label: "Reduce rep manual admin", value: "Reduce rep manual admin" },
                ]}
              />
            </div>
          </>
        ) : (
          <Select
            label="Professional Focus"
            value={roleInCompany}
            onChange={(e) => setRoleInCompany(e.target.value)}
            options={[
              { label: "Independent Sales Consultant", value: "Independent Sales Consultant" },
              { label: "Solo Founder / Creator", value: "Solo Founder / Creator" },
              { label: "Growth Marketer", value: "Growth Marketer" },
              { label: "Freelancer / Recruiter", value: "Freelancer / Recruiter" },
            ]}
          />
        )}

        <Button
          type="submit"
          variant="pill"
          size="md"
          className="w-full justify-center shadow-lg mt-3"
          loading={loading}
        >
          Create Workspace & Continue <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-white/10 light:border-black/10 text-center">
        <p className="text-xs text-slate-400 light:text-[#787e82]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#38b6ff] light:text-[#0284c7] hover:underline font-semibold"
          >
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#121212] light:bg-[#f7f7f7] text-white light:text-[#121212] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#38b6ff]/10 light:bg-[#0284c7]/10 blur-[130px]" />

      {/* Top Bar with Brand & Theme Switcher */}
      <header className="mx-auto w-full max-w-5xl flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e2224] light:bg-[#ffffff] border border-white/15 light:border-black/10 shadow-xs transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5 text-[#38b6ff] light:text-[#0284c7]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white light:text-[#121212]">
              SignalFlow
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 light:bg-black/5 text-[#38b6ff] light:text-[#0284c7] border border-white/10 light:border-black/10">
              Intelligence
            </span>
          </div>
        </Link>

        {/* Architectural Sliding Pill Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="relative flex items-center justify-between w-[68px] h-8 px-1.5 rounded-full bg-[#1e2224] light:bg-[#eaeaea] border border-white/15 light:border-black/15 transition-all shadow-inner cursor-pointer"
          title="Toggle Light / Dark mode"
          aria-label="Toggle Theme"
        >
          <span
            className={`absolute top-1 bottom-1 w-6 rounded-full transition-all duration-300 ease-in-out ${
              theme === "dark"
                ? "left-1 bg-[#121212] border border-white/25 shadow-xs"
                : "left-[37px] bg-[#ffffff] border border-black/15 shadow-xs"
            }`}
          />
          <Moon
            className={`relative z-10 h-3.5 w-3.5 transition-colors ${
              theme === "dark" ? "text-[#34feff]" : "text-gray-400"
            }`}
          />
          <Sun
            className={`relative z-10 h-3.5 w-3.5 transition-colors ${
              theme === "dark" ? "text-gray-500" : "text-[#f2be01]"
            }`}
          />
        </button>
      </header>

      {/* Main Form Body */}
      <main className="my-auto sm:mx-auto sm:w-full sm:max-w-lg z-10 py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white light:text-[#121212]">
            Create your revenue workspace
          </h1>
          <p className="mt-2 text-xs text-slate-300 light:text-[#4a5053]">
            Start orchestrating autonomous intent telemetry with instant AI scoring.
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading form...</div>}>
          <SignupForm />
        </Suspense>
      </main>

      {/* Footer Note */}
      <footer className="mx-auto w-full max-w-5xl text-center z-10 py-4">
        <div className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-400 light:text-[#787e82]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
          <span>Multi-tenant cryptographic workspace isolation active.</span>
        </div>
      </footer>
    </div>
  );
}
