"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, Building, User, Sparkles } from "lucide-react";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"individual" | "company">("company");
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
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        router.push("/app/onboarding");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-cyan-600/10 blur-[120px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Activity className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">SignalFlow</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white">Create your revenue workspace</h2>
        <p className="mt-1 text-xs text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Account Type Selector */}
          <div className="mb-6 grid grid-cols-2 gap-3 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setAccountType("company")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                accountType === "company"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building className="h-4 w-4" /> Company / Workspace
            </button>
            <button
              type="button"
              onClick={() => setAccountType("individual")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                accountType === "individual"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="h-4 w-4" /> Individual User
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name"
                placeholder="Sarah Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Work Email"
                type="email"
                placeholder="sarah@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {accountType === "company" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Company Name"
                    placeholder="Acme Technologies"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                  <Input
                    label="Company Website"
                    placeholder="https://acme.io"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select
                    label="Industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    options={[
                      { label: "B2B SaaS / Developer Tools", value: "B2B SaaS / Developer Tools" },
                      { label: "Fintech & Banking", value: "Fintech & Banking" },
                      { label: "Healthcare & Life Sciences", value: "Healthcare & Life Sciences" },
                      { label: "Cybersecurity & Edge", value: "Cybersecurity & Edge" },
                      { label: "Agency & Consulting", value: "Agency & Consulting" },
                      { label: "Other", value: "Other" },
                    ]}
                  />
                  <Select
                    label="Company Size"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    options={[
                      { label: "1-10 employees", value: "1-10" },
                      { label: "11-50 employees", value: "11-50" },
                      { label: "51-200 employees", value: "51-200" },
                      { label: "201-1000 employees", value: "201-1000" },
                      { label: "1000+ employees", value: "1000+" },
                    ]}
                  />
                </div>

                <Select
                  label="Primary Sales Goal"
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  options={[
                    { label: "Prioritize high-intent leads automatically", value: "Prioritize high-intent leads" },
                    { label: "Automate outbound follow-up cadences", value: "Automate outbound follow-up cadences" },
                    { label: "Track multi-stakeholder website signals", value: "Track multi-stakeholder website signals" },
                    { label: "Replace manual lead qualification", value: "Replace manual lead qualification" },
                  ]}
                />
              </>
            ) : (
              <Select
                label="Your Primary Role"
                value={roleInCompany}
                onChange={(e) => setRoleInCompany(e.target.value)}
                options={[
                  { label: "Solo Founder / Consultant", value: "Solo Founder / Consultant" },
                  { label: "Sales Executive / Account Exec", value: "Sales Executive / Account Exec" },
                  { label: "Growth / Demand Gen Marketer", value: "Growth / Demand Gen Marketer" },
                  { label: "Freelancer / Recruiter", value: "Freelancer / Recruiter" },
                ]}
              />
            )}

            <Button type="submit" variant="gradient" className="w-full justify-center mt-2" loading={loading}>
              Create Workspace & Continue <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
