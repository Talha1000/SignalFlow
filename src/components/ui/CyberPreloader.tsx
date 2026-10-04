"use client";

import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";

export function CyberPreloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(25);

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
    }, 45);

    return () => clearInterval(pInterval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121212] transition-opacity duration-300">
      {/* Subtle ambient corporate aura */}
      <div className="absolute h-96 w-96 rounded-full bg-[#38b6ff]/10 blur-[150px] pointer-events-none" />

      {/* Architectural Emblem Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-20 w-20 rounded-full border border-white/10" />

        <div
          className="h-20 w-20 rounded-full border-2 border-transparent border-t-[#38b6ff] border-r-[#34feff] animate-spin"
          style={{ animationDuration: "0.85s" }}
        />

        <div className="absolute flex h-11 w-11 items-center justify-center rounded-full bg-[#1e2224] border border-white/15 shadow-xl">
          <Activity className="h-5 w-5 text-[#38b6ff]" />
        </div>
      </div>

      {/* Corporate Status Information */}
      <div className="mt-8 text-center space-y-2 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-[#1e2224] text-white text-xs font-mono uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-[#38b6ff] animate-pulse" />
          <span>SIGNALFLOW TECH</span>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Revenue Intelligence Initialized
        </div>

        {/* Executive precision progress indicator */}
        <div className="w-48 h-1 bg-[#1e2224] rounded-full overflow-hidden mx-auto mt-3 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#38b6ff] to-[#34feff] rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
