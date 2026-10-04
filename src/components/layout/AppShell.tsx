"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Target,
  Building,
  Users,
  Trello,
  Zap,
  Layers,
  BarChart3,
  Bot,
  Plug,
  UserCheck,
  Settings,
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  Inbox,
  Menu,
  X,
  Megaphone,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { CommandPalette } from "@/components/command/CommandPalette";
import { SalesCopilotDrawer } from "@/components/copilot/SalesCopilotDrawer";
import { NotificationDrawer } from "@/components/notifications/NotificationDrawer";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

const navSections: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "Core Revenue",
    items: [
      { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
      { label: "Inbox", href: "/app/inbox", icon: Inbox, badge: "3", badgeColor: "bg-blue-500/20 text-blue-300 light:bg-blue-100 light:text-blue-700" },
      { label: "Priority Leads", href: "/app/leads", icon: Target, badge: "8 Hot", badgeColor: "bg-red-500/20 text-red-400 light:bg-red-100 light:text-red-700 font-bold" },
      { label: "Companies", href: "/app/companies", icon: Building },
      { label: "Contacts", href: "/app/contacts", icon: Users },
      { label: "Pipeline", href: "/app/pipeline", icon: Trello },
    ],
  },
  {
    title: "Execution & Cadence",
    items: [
      { label: "Sequences", href: "/app/sequences", icon: Zap },
      { label: "Automations", href: "/app/automations", icon: Layers },
      { label: "Campaigns", href: "/app/campaigns", icon: Megaphone },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "Analytics", href: "/app/analytics", icon: BarChart3 },
      { label: "AI Insights", href: "/app/ai-insights", icon: Sparkles, badge: "New", badgeColor: "bg-amber-500/20 text-amber-300 light:bg-amber-100 light:text-amber-800" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Integrations", href: "/app/integrations", icon: Plug },
      { label: "Team Members", href: "/app/team", icon: UserCheck },
      { label: "Settings", href: "/app/settings", icon: Settings },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [commandOpen, setCommandOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-[#080c14] light:bg-slate-50 text-slate-100 light:text-slate-900 overflow-hidden transition-colors">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800 light:border-slate-200 bg-[#0c1220]/95 light:bg-white select-none">
        {/* Workspace Brand / Selector */}
        <div className="p-4 border-b border-slate-800 light:border-slate-200 flex items-center justify-between">
          <Link href="/app/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-slate-950 light:bg-white">
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white light:text-slate-900 flex items-center gap-1.5">
                SignalFlow
                <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 light:bg-blue-50 light:text-blue-700 border border-blue-500/20 light:border-blue-200">
                  GROWTH
                </span>
              </div>
              <div className="text-[10px] text-slate-400 light:text-slate-500">SignalFlow Global Inc</div>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 light:text-slate-400">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/app/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600/15 light:bg-blue-50 text-blue-400 light:text-blue-700 font-semibold border border-blue-500/30 light:border-blue-200 shadow-xs"
                        : "text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-900 light:hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? "text-blue-400 light:text-blue-600" : "text-slate-400 light:text-slate-500"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-slate-800 light:border-slate-200 bg-slate-900/40 light:bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="https://avatar.vercel.sh/alex"
              alt="Alex Morgan"
              className="h-8 w-8 rounded-full border border-slate-700 light:border-slate-300 bg-slate-800 light:bg-slate-200"
            />
            <div>
              <div className="text-xs font-semibold text-white light:text-slate-900">Alex Morgan</div>
              <div className="text-[10px] text-blue-400 light:text-blue-600 font-medium">Workspace Owner</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 light:text-slate-500 hover:text-red-400 hover:bg-slate-800 light:hover:bg-slate-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 border-b border-slate-800 light:border-slate-200 bg-[#080c14]/85 light:bg-white/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Quick Command Search bar */}
            <button
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 light:bg-slate-100 border border-slate-800 light:border-slate-200 text-xs text-slate-400 light:text-slate-500 hover:border-slate-700 light:hover:border-slate-300 hover:text-slate-200 light:hover:text-slate-800 transition-colors sm:w-64"
            >
              <Search className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" />
              <span className="hidden sm:inline">Search accounts, leads...</span>
              <span className="sm:hidden">Search...</span>
              <kbd className="ml-auto rounded bg-slate-800 light:bg-white px-1.5 py-0.2 text-[10px] font-mono text-slate-400 light:text-slate-600 border border-slate-700 light:border-slate-300">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-2.5">
            {/* Copilot button */}
            <button
              onClick={() => setCopilotOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 light:bg-blue-50 border border-blue-500/30 light:border-blue-200 text-xs font-semibold text-blue-300 light:text-blue-700 hover:bg-blue-600/20 light:hover:bg-blue-100 transition-all shadow-xs"
            >
              <Bot className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" />
              <span className="hidden sm:inline">Sales Copilot</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative p-2 rounded-lg text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-slate-900 light:hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-slate-900 light:hover:bg-slate-100 transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 light:border-slate-200 bg-[#0c1220] light:bg-white p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {navSections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                <div className="text-[10px] font-semibold text-slate-500 light:text-slate-400 uppercase">{sec.title}</div>
                <div className="grid grid-cols-2 gap-1">
                  {sec.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg text-xs text-slate-300 light:text-slate-700 hover:bg-slate-800 light:hover:bg-slate-100"
                    >
                      <item.icon className="h-3.5 w-3.5 text-blue-400 light:text-blue-600" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#080c14]/90 light:bg-slate-50 transition-colors">
          {children}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
      <SalesCopilotDrawer isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
      <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
