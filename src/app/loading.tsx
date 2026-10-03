import React from "react";
import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060913] text-white">
      {/* Ambient background glow */}
      <div className="absolute h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Holographic Radar Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer counter-rotating dashed ring */}
        <div
          className="absolute h-24 w-24 rounded-full border-2 border-dashed border-indigo-500/30 animate-spin"
          style={{ animationDuration: "6s", animationDirection: "reverse" }}
        />

        {/* Inner rotating gradient ring */}
        <div
          className="h-20 w-20 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 border-r-cyan-400 animate-spin"
          style={{ animationDuration: "1.2s" }}
        />

        {/* Center glowing logo */}
        <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.35)]">
          <Activity className="h-6 w-6 text-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Loading Status & Ticker */}
      <div className="mt-8 text-center space-y-2 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>INITIALIZING SIGNALFLOW 2027</span>
        </div>

        <p className="text-sm font-medium text-slate-300">
          Synthesizing real-time revenue telemetry...
        </p>

        {/* High-speed neon progress bar */}
        <div className="w-56 h-1 bg-slate-800 rounded-full overflow-hidden mx-auto mt-3">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 rounded-full animate-pulse-glow" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );
}
