import React from "react";
import Link from "next/link";
import { Activity, Shield, Terminal, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-slate-950">
                  <Activity className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white">SignalFlow</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-slate-400 max-w-sm">
              Know who wants to buy. Know what to do next. SignalFlow transforms scattered B2B
              digital signals into actionable revenue intelligence and prioritized sales execution.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Systems Operational
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-cyan-400" />
                SOC2 Type II Ready
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Product
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/features" className="hover:text-cyan-400">
                  Explainable Scoring
                </Link>
              </li>
              <li>
                <Link href="/features#priority-queue" className="hover:text-cyan-400">
                  Priority Queue
                </Link>
              </li>
              <li>
                <Link href="/features#cadences" className="hover:text-cyan-400">
                  Smart Cadences
                </Link>
              </li>
              <li>
                <Link href="/features#automations" className="hover:text-cyan-400">
                  Workflow Builder
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-cyan-400">
                  Plans & Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/security" className="hover:text-cyan-400">
                  Tenant Isolation
                </Link>
              </li>
              <li>
                <Link href="/security#rbac" className="hover:text-cyan-400">
                  Enterprise RBAC
                </Link>
              </li>
              <li>
                <Link href="/app/settings/api" className="hover:text-cyan-400">
                  REST API & Webhooks
                </Link>
              </li>
              <li>
                <Link href="/security#compliance" className="hover:text-cyan-400">
                  Audit Logging
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Company
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-cyan-400">
                  About SignalFlow
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400">
                  Contact Sales
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SignalFlow Technologies Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Engineered with strict multi-tenancy & explainable AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
