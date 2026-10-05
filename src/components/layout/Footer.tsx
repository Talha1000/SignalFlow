import React from "react";
import Link from "next/link";
import { Activity, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 light:border-black/10 bg-[#121212] light:bg-[#f7f7f7] text-slate-400 light:text-[#4a5053] py-16 sm:py-20 transition-colors">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e2224] light:bg-white border border-white/15 light:border-black/10">
                <Activity className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" />
              </div>
              <span className="text-lg font-bold text-white light:text-[#121212]">SignalFlow</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 light:text-[#4a5053] max-w-sm">
              Know who wants to buy. Know what to do next. SignalFlow transforms scattered B2B
              digital signals into actionable revenue intelligence and prioritized sales execution.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400 light:text-[#787e82] font-mono">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                Systems Operational
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
                SOC2 Type II Certified
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white light:text-[#121212] font-bold mb-4">
              Product
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/features" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  Explainable Scoring
                </Link>
              </li>
              <li>
                <Link href="/features#priority-queue" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  Priority Queue
                </Link>
              </li>
              <li>
                <Link href="/features#cadences" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  Smart Cadences
                </Link>
              </li>
              <li>
                <Link href="/features#automations" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  Workflow Builder
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  Plans & Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white light:text-[#121212] font-bold mb-4">
              Platform
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/security" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  Tenant Isolation
                </Link>
              </li>
              <li>
                <Link href="/security#rbac" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  Enterprise RBAC
                </Link>
              </li>
              <li>
                <Link href="/app/settings?tab=api" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  REST API & Webhooks
                </Link>
              </li>
              <li>
                <Link href="/security#compliance" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  Audit Logging
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white light:text-[#121212] font-bold mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  About SignalFlow
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  Contact Sales
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 light:border-black/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} SignalFlow Technologies Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Enterprise revenue intelligence with sovereign data isolation.
          </p>
        </div>
      </div>
    </footer>
  );
}
