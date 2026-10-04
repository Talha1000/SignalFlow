import React from "react";
import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080c14] text-white">
      {/* Subtle ambient corporate aura */}
      <div className="absolute h-96 w-96 rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

      {/* Elegant Corporate Emblem Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-20 w-20 rounded-full border border-slate-800" />
        <div
          className="h-20 w-20 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-600 animate-spin"
          style={{ animationDuration: "0.9s" }}
        />
        <div className="absolute flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 border border-slate-700/80 shadow-lg shadow-blue-950/40">
          <Activity className="h-5 w-5 text-blue-400" />
        </div>
      </div>

      {/* Loading Status */}
      <div className="mt-7 text-center space-y-2 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-xs font-medium tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>SIGNALFLOW ENTERPRISE</span>
        </div>

        <p className="text-sm font-medium text-slate-300">
          Loading revenue platform...
        </p>

        <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden mx-auto mt-3 border border-slate-800">
          <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );
}
