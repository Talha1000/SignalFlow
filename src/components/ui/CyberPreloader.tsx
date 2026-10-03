"use client";

import React, { useEffect, useState } from "react";
import { Activity, Sparkles } from "lucide-react";

export function CyberPreloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const pInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(pInterval);
          setTimeout(() => setVisible(false), 200);
          return 100;
        }
        return prev + 25;
      });
    }, 60);

    return () => clearInterval(pInterval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060913] transition-opacity duration-300">
      {/* Ambient background glow */}
      <div className="absolute h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none" />

      {/* Holographic Radar Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer counter-rotating dashed ring */}
        <div
          className="absolute h-24 w-24 rounded-full border-2 border-dashed border-indigo-500/40 animate-spin"
          style={{ animationDuration: "3s", animationDirection: "reverse" }}
        />

        {/* Inner rotating gradient ring */}
        <div
          className="h-20 w-20 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 border-r-cyan-400 animate-spin"
          style={{ animationDuration: "0.8s" }}
        />

        {/* Center glowing logo */}
        <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
          <Activity className="h-6 w-6 text-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Status Ticker */}
      <div className="mt-8 text-center space-y-2 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>SYNCHRONIZING REVENUE TELEMETRY</span>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Engine Status: <span className="text-cyan-400 font-bold">{progress}%</span>
        </div>

        {/* High-speed neon progress bar */}
        <div className="w-56 h-1.5 bg-slate-900 rounded-full overflow-hidden mx-auto mt-2 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
