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
      { label: "Inbox", href: "/app/inbox", icon: Inbox },
      { label: "Priority Leads", href: "/app/leads", icon: Target },
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
      { label: "AI Insights", href: "/app/ai-insights", icon: Sparkles },
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

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
  } | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<{
    id: string;
    name: string;
    slug?: string;
    domain?: string;
    plan?: string;
  } | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.data?.user) setCurrentUser(data.data.user);
        if (data.data?.workspace) setCurrentWorkspace(data.data.workspace);
      })
      .catch((err) => console.warn("Failed to load user info:", err));
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-[#121212] light:bg-[#f7f7f7] text-white light:text-[#121212] overflow-hidden transition-colors">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 light:border-black/10 bg-[#181b1c] light:bg-white select-none">
        {/* Workspace Brand / Selector */}
        <div className="p-5 border-b border-white/10 light:border-black/10 flex items-center justify-between">
          <Link href="/app/dashboard" className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e2224] light:bg-[#f0f2f3] border border-white/15 light:border-black/10 shrink-0">
              <Activity className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-white light:text-[#121212] truncate">
                {currentWorkspace?.name || "SignalFlow"}
              </div>
              <div className="text-[10px] text-slate-400 light:text-[#787e82] font-mono truncate">
                {currentWorkspace?.plan ? `${currentWorkspace.plan} Plan` : "Workspace"}
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <div className="px-3 text-[10px] font-mono uppercase tracking-widest text-slate-500 light:text-[#787e82] font-semibold">
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
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#38b6ff]/15 light:bg-black/5 text-[#38b6ff] light:text-[#121212] font-semibold border border-[#38b6ff]/30 light:border-black/15 shadow-xs"
                        : "text-slate-400 light:text-[#4a5053] hover:text-white light:hover:text-[#121212] hover:bg-white/5 light:hover:bg-black/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? "text-[#38b6ff] light:text-[#0284c7]" : "text-slate-400 light:text-[#787e82]"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${item.badgeColor}`}
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
        <div className="p-4 border-t border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#f0f2f3] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || "user")}&background=38b6ff&color=121212`}
              alt={currentUser?.name || "User"}
              className="h-8 w-8 rounded-full border border-white/15 light:border-black/15 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white light:text-[#121212] truncate">
                {currentUser?.name || "Workspace Member"}
              </div>
              <div className="text-[10px] text-[#38b6ff] light:text-[#0284c7] font-mono truncate">
                {currentUser?.role ? currentUser.role.replace(/_/g, " ") : "Member"}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-full text-slate-400 light:text-[#787e82] hover:text-red-400 hover:bg-white/5 transition-colors shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/10 light:border-black/10 bg-[#121212]/90 light:bg-[#f7f7f7]/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center gap-4">
            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 light:text-[#121212] hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Quick Command Search bar */}
            <button
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1e2224] light:bg-white border border-white/15 light:border-black/15 text-xs text-slate-400 light:text-[#787e82] hover:border-[#38b6ff]/40 transition-colors sm:w-72"
            >
              <Search className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
              <span className="hidden sm:inline">Search accounts, signals...</span>
              <span className="sm:hidden">Search...</span>
              <kbd className="ml-auto rounded-full bg-white/10 light:bg-black/5 px-2 py-0.5 text-[10px] font-mono text-slate-400 light:text-[#787e82]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-3">
            {/* Copilot button */}
            <button
              onClick={() => setCopilotOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1e2224] light:bg-white border border-white/15 light:border-black/15 text-xs font-semibold text-slate-200 light:text-[#121212] hover:border-[#38b6ff]/50 transition-all shadow-xs"
            >
              <Bot className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
              <span className="hidden sm:inline">Sales Copilot</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative p-2 rounded-full text-slate-400 light:text-[#121212] hover:text-white hover:bg-white/5 transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#38b6ff]" />
            </button>

            {/* Architectural Theme Toggle Pill */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e2224] light:bg-white border border-white/15 light:border-black/15 text-xs font-medium text-slate-300 light:text-[#121212] hover:border-[#38b6ff]/50 transition-all"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-[#f2be01]" />
                  <span className="text-[10px] font-mono uppercase">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-[#38b6ff]" />
                  <span className="text-[10px] font-mono uppercase">Dark</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-white/10 light:border-black/10 bg-[#1e2224] light:bg-white p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {navSections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                <div className="text-[10px] font-mono text-slate-500 uppercase">{sec.title}</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {sec.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg text-xs text-slate-300 light:text-[#121212] hover:bg-white/5"
                    >
                      <item.icon className="h-3.5 w-3.5 text-[#38b6ff] light:text-[#0284c7]" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 bg-[#121212] light:bg-[#f7f7f7] transition-colors">
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
