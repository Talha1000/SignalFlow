import React from "react";
import Link from "next/link";
import { Shield, Lock, Key, Database, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SecurityPage() {
  const securityPillars = [
    {
      icon: Database,
      title: "Hard Multi-Tenant Isolation",
      description:
        "Every single tenant-owned database record is strictly bound to its workspace_id. All queries and API requests enforce workspace scoping at the database and service layer, preventing cross-tenant data leaks.",
    },
    {
      icon: Lock,
      title: "Role-Based Access Control (RBAC)",
      description:
        "Five granular roles (Owner, Admin, Manager, Sales Rep, Viewer) enforce strict server-side permissions for lead creation, pipeline modification, cadence triggers, and billing administration.",
    },
    {
      icon: Key,
      title: "Secure Authentication & API Keys",
      description:
        "Passwords hashed with bcrypt. Sessions managed via secure HTTP-only cookies. Integrations authenticate using workspace-scoped API keys stored exclusively as one-way SHA-256 cryptographic hashes.",
    },
    {
      icon: FileText,
      title: "Comprehensive Audit Logging",
      description:
        "Every significant workspace event—including score adjustments, sequence enrollments, team member invites, and webhook updates—is logged with actor ID, IP address, timestamp, and metadata diff.",
    },
  ];

  return (
    <div className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-medium text-cyan-400">
          <Shield className="h-3 w-3" /> Enterprise Security & Compliance
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Security built as an immutable foundation
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          SignalFlow was architected from line one to protect enterprise customer data and ensure
          flawless multi-tenant boundary integrity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {securityPillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 space-y-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{p.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{p.description}</p>
            </div>
          );
        })}
      </div>

      {/* Compliance standards table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-4">
        <h3 className="text-lg font-bold text-white">Enterprise Standards & Specifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-mono font-semibold">SOC2 Type II Ready</span>
            <p className="text-slate-400">Security, Availability, and Confidentiality controls</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-mono font-semibold">GDPR & CCPA Compliant</span>
            <p className="text-slate-400">Full data subject request and export capabilities</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-mono font-semibold">TLS 1.3 & AES-256</span>
            <p className="text-slate-400">Encrypted in transit and at rest at all times</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link href="/contact">
          <Button variant="outline" size="md">
            Request Full Security Whitepaper
          </Button>
        </Link>
      </div>
    </div>
  );
}
