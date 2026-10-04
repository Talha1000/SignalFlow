"use client";

import React, { useEffect, useState } from "react";
import { Activity, ShieldCheck, Sparkles } from "lucide-react";

export function CyberPreloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const pInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(pInterval);
          setTimeout(() => setVisible(false), 220);
          return 100;
        }
        return prev + 25;
      });
    }, 50);

    return () => clearInterval(pInterval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080c14] transition-opacity duration-300">
      {/* Subtle ambient corporate aura */}
      <div className="absolute h-96 w-96 rounded-full bg-blue-600/10 blur-[140px] pointer-events-none" />

      {/* Elegant Corporate Emblem Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer subtle hairline ring */}
        <div className="absolute h-20 w-20 rounded-full border border-slate-800" />

        {/* Precision orbital indicator */}
        <div
          className="h-20 w-20 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-600 animate-spin"
          style={{ animationDuration: "0.9s" }}
        />

        {/* Center luxury corporate crest */}
        <div className="absolute flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 border border-slate-700/80 shadow-lg shadow-blue-950/40">
          <Activity className="h-5 w-5 text-blue-400" />
        </div>
      </div>

      {/* Corporate Status Information */}
      <div className="mt-7 text-center space-y-2 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-xs font-medium tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>SIGNALFLOW ENTERPRISE</span>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Revenue Intelligence Engine Initialized
        </div>

        {/* Executive precision progress indicator */}
        <div className="w-52 h-1 bg-slate-900 rounded-full overflow-hidden mx-auto mt-2 border border-slate-800/80">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
