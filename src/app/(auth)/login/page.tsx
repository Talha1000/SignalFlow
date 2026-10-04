"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, UserCheck, ShieldCheck, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activePersonaLoading, setActivePersonaLoading] = useState<string | null>(null);
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
        setError(data.error || "Invalid login credentials. Please check your email and password.");
      } else {
        // Full navigation ensures cookie is committed to browser before hitting protected app shell
        window.location.href = "/app/dashboard";
      }
    } catch {
      setError("Unable to connect to authentication service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, personaKey: string) => {
    setActivePersonaLoading(personaKey);
    setError("");

    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Demo persona login unavailable.");
      } else {
        window.location.href = "/app/dashboard";
      }
    } catch {
      setError("Demo authentication encountered a network error.");
    } finally {
      setActivePersonaLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] light:bg-[#f7f7f7] text-white light:text-[#121212] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Ambient background glow */}
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

      {/* Main Authentication Card */}
      <main className="my-auto sm:mx-auto sm:w-full sm:max-w-md z-10 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white light:text-[#121212]">
            Welcome back
          </h1>
          <p className="mt-2 text-xs text-slate-300 light:text-[#4a5053]">
            Access your real-time revenue telemetry and AI scoring pipeline.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-7 sm:p-8 shadow-2xl backdrop-blur-xl transition-colors">
          {error && (
            <div className="mb-5 rounded-2xl bg-red-500/10 border border-red-500/30 p-3.5 text-xs text-red-400 light:text-red-600 flex items-start gap-2.5">
              <span className="font-bold">Error:</span>
              <span className="flex-1">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="alex.morgan@signalflow.io"
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

            <Button
              type="submit"
              variant="pill"
              size="md"
              className="w-full justify-center shadow-lg mt-2"
              loading={loading}
            >
              Sign In to Workspace <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Personas */}
          <div className="mt-7 pt-6 border-t border-white/10 light:border-black/10">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-semibold text-slate-300 light:text-[#121212] flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" />
                One-Click Demo Personas:
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 light:bg-black/5 text-[#38b6ff] light:text-[#0284c7] border border-white/10 light:border-black/10">
                Instant Access
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={Boolean(activePersonaLoading) || loading}
                onClick={() => handleDemoLogin("alex.morgan@signalflow.io", "alex")}
                className="group p-3 rounded-2xl border border-white/10 light:border-black/10 bg-[#252a2b]/70 light:bg-[#f0f2f3] hover:border-[#38b6ff]/50 light:hover:border-[#0284c7]/50 hover:bg-[#252a2b] light:hover:bg-[#e4e6e8] transition-all text-left cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white light:text-[#121212] group-hover:text-[#38b6ff] light:group-hover:text-[#0284c7] transition-colors">
                    Alex Morgan
                  </span>
                  {activePersonaLoading === "alex" && (
                    <span className="h-2 w-2 rounded-full bg-[#38b6ff] animate-ping" />
                  )}
                </div>
                <div className="text-[10px] font-mono text-[#38b6ff] light:text-[#0284c7] mt-0.5">
                  Owner / Founder
                </div>
              </button>

              <button
                type="button"
                disabled={Boolean(activePersonaLoading) || loading}
                onClick={() => handleDemoLogin("sarah.connor@signalflow.io", "sarah")}
                className="group p-3 rounded-2xl border border-white/10 light:border-black/10 bg-[#252a2b]/70 light:bg-[#f0f2f3] hover:border-[#38b6ff]/50 light:hover:border-[#0284c7]/50 hover:bg-[#252a2b] light:hover:bg-[#e4e6e8] transition-all text-left cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white light:text-[#121212] group-hover:text-[#38b6ff] light:group-hover:text-[#0284c7] transition-colors">
                    Sarah Connor
                  </span>
                  {activePersonaLoading === "sarah" && (
                    <span className="h-2 w-2 rounded-full bg-[#38b6ff] animate-ping" />
                  )}
                </div>
                <div className="text-[10px] font-mono text-amber-400 light:text-amber-700 mt-0.5">
                  Admin / Manager
                </div>
              </button>

              <button
                type="button"
                disabled={Boolean(activePersonaLoading) || loading}
                onClick={() => handleDemoLogin("liam.vance@signalflow.io", "liam")}
                className="group p-3 rounded-2xl border border-white/10 light:border-black/10 bg-[#252a2b]/70 light:bg-[#f0f2f3] hover:border-[#38b6ff]/50 light:hover:border-[#0284c7]/50 hover:bg-[#252a2b] light:hover:bg-[#e4e6e8] transition-all text-left cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white light:text-[#121212] group-hover:text-[#38b6ff] light:group-hover:text-[#0284c7] transition-colors">
                    Liam Vance
                  </span>
                  {activePersonaLoading === "liam" && (
                    <span className="h-2 w-2 rounded-full bg-[#38b6ff] animate-ping" />
                  )}
                </div>
                <div className="text-[10px] font-mono text-emerald-400 light:text-emerald-700 mt-0.5">
                  Senior Sales Rep
                </div>
              </button>

              <button
                type="button"
                disabled={Boolean(activePersonaLoading) || loading}
                onClick={() => handleDemoLogin("maya.patel@signalflow.io", "maya")}
                className="group p-3 rounded-2xl border border-white/10 light:border-black/10 bg-[#252a2b]/70 light:bg-[#f0f2f3] hover:border-[#38b6ff]/50 light:hover:border-[#0284c7]/50 hover:bg-[#252a2b] light:hover:bg-[#e4e6e8] transition-all text-left cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white light:text-[#121212] group-hover:text-[#38b6ff] light:group-hover:text-[#0284c7] transition-colors">
                    Maya Patel
                  </span>
                  {activePersonaLoading === "maya" && (
                    <span className="h-2 w-2 rounded-full bg-[#38b6ff] animate-ping" />
                  )}
                </div>
                <div className="text-[10px] font-mono text-indigo-400 light:text-indigo-700 mt-0.5">
                  Enterprise SDR
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 light:border-black/10 text-center">
            <p className="text-xs text-slate-400 light:text-[#787e82]">
              Need a new organization?{" "}
              <Link
                href="/signup"
                className="text-[#38b6ff] light:text-[#0284c7] hover:underline font-semibold"
              >
                Create workspace →
              </Link>
            </p>
          </div>
        </div>
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
