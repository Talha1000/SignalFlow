"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Shield, ArrowRight, Sun, Moon, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/theme/ThemeProvider";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/security" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Activity className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              SignalFlow
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                2026
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                  isActive ? "text-cyan-400 font-semibold" : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>

          <Link href="/signup">
            <Button variant="gradient" size="sm" className="gap-1.5">
              Start Free <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/95 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-slate-200 hover:text-cyan-400"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)}>
              <Button variant="gradient" className="w-full justify-center">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
