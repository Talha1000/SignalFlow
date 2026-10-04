"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Shield, ArrowRight, Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/theme/ThemeProvider";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "Live Dashboard", href: "/app/dashboard" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/security" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/85 dark:border-slate-800/80 dark:bg-[#080c14]/85 light:border-slate-200 light:bg-white/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 light:bg-white">
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white light:text-slate-900">
              SignalFlow
            </span>
            <span className="text-[10px] font-medium tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 light:bg-blue-50 light:text-blue-700 light:border-blue-200">
              Enterprise
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
                className={`text-sm font-medium transition-colors hover:text-blue-400 light:hover:text-blue-600 ${
                  isActive
                    ? "text-blue-400 light:text-blue-600 font-semibold"
                    : "text-slate-300 light:text-slate-600"
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
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100 transition-colors"
            title="Toggle color theme"
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>

          <Link href="/signup">
            <Button variant="primary" size="sm" className="gap-1.5 font-semibold">
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-300 hover:text-white light:text-slate-700 light:hover:text-slate-900"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0c1220] light:bg-white light:border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-slate-200 light:text-slate-700 hover:text-blue-400 light:hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-800 light:border-slate-200 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" size="sm" className="w-full justify-center gap-1.5 font-semibold">
                Get Started <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
