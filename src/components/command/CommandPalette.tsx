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

const navigationItems: SearchItem[] = [
  { id: "nav-1", title: "Priority Queue & Dashboard", subtitle: "Revenue command center", category: "pages", href: "/app/dashboard" },
  { id: "nav-2", title: "Visual Pipeline Kanban", subtitle: "Deal pipeline by stages", category: "pages", href: "/app/pipeline" },
  { id: "nav-3", title: "Sequences & Cadences", subtitle: "Drip campaigns with auto-stop", category: "pages", href: "/app/sequences" },
  { id: "nav-4", title: "Workflow Automations", subtitle: "Visual node builder", category: "pages", href: "/app/automations" },
  { id: "nav-5", title: "Executive Analytics", subtitle: "Velocity & conversion metrics", category: "pages", href: "/app/analytics" },
  { id: "nav-6", title: "AI Insights Center", subtitle: "Surging accounts & alerts", category: "pages", href: "/app/ai-insights" },
  { id: "nav-7", title: "API Keys & Webhooks", subtitle: "REST API v1 configuration", category: "pages", href: "/app/settings/api" },
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
  const [remoteResults, setRemoteResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/v1/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.data?.results) {
            setRemoteResults(data.data.results);
          }
        })
        .catch((err) => console.warn("Search error:", err))
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [isOpen, query]);

  if (!isOpen) return null;

  const matchingNavItems = query.trim()
    ? navigationItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
      )
    : navigationItems.slice(0, 4);

  const combinedResults = [...remoteResults, ...matchingNavItems];

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
      <div className="relative w-full max-w-xl rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] shadow-2xl z-10 overflow-hidden text-white light:text-[#121212] flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 light:border-black/10 gap-3">
          <Search className="h-5 w-5 text-[#38b6ff] light:text-[#0284c7] shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, prospect, company, or search ('hot leads')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white light:text-[#121212] placeholder-slate-400 light:placeholder-[#8a9296] focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-[#252a2b] light:bg-[#f0f2f3] px-2 py-0.5 text-[10px] font-mono text-slate-400 light:text-[#787e82] border border-white/10 light:border-black/10">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {loading && combinedResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 light:text-[#787e82]">
              Searching workspace records...
            </div>
          ) : combinedResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 light:text-[#787e82]">
              No matching leads, companies, or commands found for "{query}".
            </div>
          ) : (
            combinedResults.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.href)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#252a2b] light:hover:bg-[#f0f2f3] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-[#252a2b] light:bg-[#f0f2f3] text-slate-400 light:text-[#787e82] group-hover:text-[#38b6ff] light:group-hover:text-[#0284c7] group-hover:bg-[#38b6ff]/10">
                    {item.category === "leads" && <Target className="h-4 w-4" />}
                    {item.category === "companies" && <Building className="h-4 w-4" />}
                    {item.category === "pages" && <Layers className="h-4 w-4" />}
                    {item.category === "actions" && <Flame className="h-4 w-4 text-amber-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white light:text-[#121212] flex items-center gap-2">
                      {item.title}
                      {item.score && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 light:text-red-700 border border-red-500/20">
                          {item.score}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <div className="text-[11px] text-slate-400 light:text-[#787e82]">{item.subtitle}</div>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 light:text-[#787e82] group-hover:text-white light:group-hover:text-[#121212]" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-white/10 light:border-black/10 bg-[#181b1c] light:bg-[#fafafa] flex items-center justify-between text-[11px] text-slate-400 light:text-[#787e82]">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#252a2b] light:bg-[#f0f2f3] text-slate-300 light:text-[#121212] text-[10px]">↑↓</kbd>
            <span>Select:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#252a2b] light:bg-[#f0f2f3] text-slate-300 light:text-[#121212] text-[10px]">↵</kbd>
          </div>
          <span className="text-[#38b6ff] light:text-[#0284c7] font-mono">SignalFlow Quick-Command</span>
        </div>
      </div>
    </div>
  );
}
