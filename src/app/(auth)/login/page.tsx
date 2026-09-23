"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, Lock, Mail, Sparkles, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        router.push("/app/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Demo login failed");
      } else {
        router.push("/app/dashboard");
      }
    } catch {
      setError("Demo login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-cyan-600/10 blur-[120px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Activity className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">SignalFlow</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white">Sign in to your workspace</h2>
        <p className="mt-1 text-xs text-slate-400">
          Or{" "}
          <Link href="/signup" className="text-cyan-400 hover:underline font-medium">
            create a new company account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="gradient" className="w-full justify-center" loading={loading}>
              Sign In <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Login Personas */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-cyan-400" />
                One-Click Demo Personas:
              </span>
              <span className="text-[10px] text-slate-500">Instant Access</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("alex.morgan@signalflow.io")}
                className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-left hover:border-cyan-500/50 hover:bg-slate-800 transition-colors"
              >
                <div className="text-xs font-semibold text-white">Alex Morgan</div>
                <div className="text-[10px] text-cyan-400 font-mono">Owner / Founder</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("sarah.connor@signalflow.io")}
                className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-left hover:border-cyan-500/50 hover:bg-slate-800 transition-colors"
              >
                <div className="text-xs font-semibold text-white">Sarah Connor</div>
                <div className="text-[10px] text-amber-400 font-mono">Admin / Manager</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("liam.vance@signalflow.io")}
                className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-left hover:border-cyan-500/50 hover:bg-slate-800 transition-colors"
              >
                <div className="text-xs font-semibold text-white">Liam Vance</div>
                <div className="text-[10px] text-emerald-400 font-mono">Senior Sales Rep</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("maya.patel@signalflow.io")}
                className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-left hover:border-cyan-500/50 hover:bg-slate-800 transition-colors"
              >
                <div className="text-xs font-semibold text-white">Maya Patel</div>
                <div className="text-[10px] text-indigo-400 font-mono">Enterprise SDR</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
