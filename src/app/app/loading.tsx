import React from "react";
import { Activity } from "lucide-react";

export default function AppLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-slate-800 rounded-lg" />
          <div className="h-4 w-96 bg-slate-900 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-28 bg-slate-800 rounded-lg" />
          <div className="h-9 w-32 bg-slate-800 rounded-lg" />
        </div>
      </div>

      {/* 4 Metric Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-3"
          >
            <div className="flex justify-between">
              <div className="h-3 w-20 bg-slate-800 rounded" />
              <div className="h-6 w-6 bg-slate-800 rounded-full" />
            </div>
            <div className="h-8 w-24 bg-slate-800 rounded" />
            <div className="h-2 w-full bg-slate-800/50 rounded" />
          </div>
        ))}
      </div>

      {/* Center Table / Board Skeleton */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
          <div className="h-5 w-40 bg-slate-800 rounded" />
          <div className="h-4 w-24 bg-slate-800 rounded" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 w-full bg-slate-900/80 rounded-xl border border-slate-800/40 flex items-center justify-between px-4"
          >
            <div className="h-4 w-36 bg-slate-800 rounded" />
            <div className="h-4 w-20 bg-slate-800 rounded" />
            <div className="h-4 w-28 bg-slate-800 rounded" />
            <div className="h-6 w-16 bg-slate-800 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
