"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Building,
  Target,
  Zap,
  Layers,
  BarChart3,
  Bot,
  Settings,
  ArrowRight,
  Flame,
} from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  category: "leads" | "companies" | "pages" | "actions";
  href: string;
  subtitle?: string;
  score?: number;
}

const mockSearchItems: SearchItem[] = [
  // Hot leads
  { id: "lead-1", title: "Sarah Chen", subtitle: "Acme Technologies — VP Engineering", category: "leads", href: "/app/leads", score: 91 },
  { id: "lead-2", title: "Marcus Vance", subtitle: "ApexCloud Platforms — CTO", category: "leads", href: "/app/leads", score: 88 },
  { id: "lead-3", title: "Victor Stone", subtitle: "SecurityZero Corp — CIO", category: "leads", href: "/app/leads", score: 92 },
  { id: "lead-4", title: "Kieran O'Connor", subtitle: "HyperScale Networks — VP Product", category: "leads", href: "/app/leads", score: 89 },
  // Companies
  { id: "comp-1", title: "Acme Technologies", subtitle: "Developer Infrastructure (Score: 91)", category: "companies", href: "/app/companies" },
  { id: "comp-2", title: "ApexCloud Platforms", subtitle: "Cloud & DevOps (Score: 88)", category: "companies", href: "/app/companies" },
  { id: "comp-3", title: "Quantix Financial", subtitle: "Fintech & Banking (Score: 84)", category: "companies", href: "/app/companies" },
  // Navigation
  { id: "nav-1", title: "Priority Queue & Dashboard", subtitle: "Revenue command center", category: "pages", href: "/app/dashboard" },
  { id: "nav-2", title: "Visual Pipeline Kanban", subtitle: "Deal pipeline by stages", category: "pages", href: "/app/pipeline" },
  { id: "nav-3", title: "Sequences & Cadences", subtitle: "Drip campaigns with auto-stop", category: "pages", href: "/app/sequences" },
  { id: "nav-4", title: "Workflow Automations", subtitle: "Visual node builder", category: "pages", href: "/app/automations" },
  { id: "nav-5", title: "Executive Analytics", subtitle: "Velocity & conversion metrics", category: "pages", href: "/app/analytics" },
  { id: "nav-6", title: "AI Insights Center", subtitle: "Surging accounts & alerts", category: "pages", href: "/app/ai-insights" },
  { id: "nav-7", title: "API Keys & Webhooks", subtitle: "REST API v1 configuration", category: "pages", href: "/app/settings/api" },
  // Actions
  { id: "act-1", title: "Filter: Show Hot Leads (Score 85+)", subtitle: "Quick priority filter", category: "actions", href: "/app/leads?intent=HOT" },
  { id: "act-2", title: "Action: Import Leads from CSV", subtitle: "Start CSV upload wizard", category: "actions", href: "/app/onboarding" },
];

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent can toggle
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? mockSearchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
      )
    : mockSearchItems.slice(0, 8);

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Palette box */}
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl z-10 overflow-hidden text-slate-100 flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="h-5 w-5 text-cyan-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, prospect, company, or search ('hot leads')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching leads, companies, or commands found for "{query}".
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.href)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10">
                    {item.category === "leads" && <Target className="h-4 w-4" />}
                    {item.category === "companies" && <Building className="h-4 w-4" />}
                    {item.category === "pages" && <Layers className="h-4 w-4" />}
                    {item.category === "actions" && <Flame className="h-4 w-4 text-amber-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      {item.title}
                      {item.score && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                          {item.score}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-300" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">↑↓</kbd>
            <span>Select:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">↵</kbd>
          </div>
          <span className="text-cyan-400 font-mono">SignalFlow Quick-Command</span>
        </div>
      </div>
    </div>
  );
}
