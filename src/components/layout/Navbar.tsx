"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ArrowRight, Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/theme/ThemeProvider";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Sectors", href: "/#sectors" },
    { label: "Simulator", href: "/#simulator" },
    { label: "Milestones", href: "/#milestones" },
    { label: "Calculator", href: "/#calculator" },
    { label: "Pricing", href: "/pricing" },
    { label: "Insights", href: "/#insights" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 light:border-black/10 bg-[#121212]/90 light:bg-[#f7f7f7]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Brand */}
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm tracking-tight transition-colors hover:text-[#38b6ff] light:hover:text-[#0284c7] ${
                  isActive
                    ? "text-[#38b6ff] light:text-[#0284c7] font-semibold"
                    : "text-slate-300 light:text-[#4a5053] font-medium"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Controls & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          {/* Architectural Sliding Pill Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="relative flex items-center justify-between w-[68px] h-8 px-1.5 rounded-full bg-[#1e2224] light:bg-[#eaeaea] border border-white/15 light:border-black/15 transition-all shadow-inner cursor-pointer"
            title="Toggle Light / Dark mode"
            aria-label="Toggle Theme"
          >
            {/* Sliding Thumb */}
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

          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-semibold text-slate-300 light:text-[#121212]">
              Sign In
            </Button>
          </Link>

          <Link href="/app/dashboard">
            <Button
              variant="pill"
              size="sm"
              className="gap-1.5 shadow-sm bg-[#262626] hover:bg-black text-white light:bg-[#121212] light:text-white border border-white/15 light:border-black/15 font-bold"
            >
              Start Your Journey <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="relative flex items-center justify-between w-16 h-7 px-1 rounded-full bg-[#1e2224] light:bg-[#eaeaea] border border-white/15 light:border-black/15 cursor-pointer"
            aria-label="Toggle theme"
          >
            <span
              className={`absolute top-0.5 bottom-0.5 w-5 rounded-full transition-all duration-300 ease-in-out ${
                theme === "dark"
                  ? "left-0.5 bg-[#121212] border border-white/20"
                  : "left-[38px] bg-[#ffffff] border border-black/10"
              }`}
            />
            <Moon className={`relative z-10 h-3 w-3 ${theme === "dark" ? "text-[#34feff]" : "text-gray-400"}`} />
            <Sun className={`relative z-10 h-3 w-3 ${theme === "dark" ? "text-gray-500" : "text-[#f2be01]"}`} />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-300 light:text-[#121212] hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-white/10 light:border-black/10 bg-[#1e2224] light:bg-white px-6 pt-4 pb-8 space-y-4 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-slate-200 light:text-[#121212] hover:text-[#38b6ff]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-white/10 light:border-black/10 flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/app/dashboard" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" size="sm" className="w-full justify-center gap-1.5">
                Start Your Journey <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
