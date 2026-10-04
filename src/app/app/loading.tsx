import React from "react";

export default function AppLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 light:border-black/10">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-[#252a2b] light:bg-[#e2e8f0] rounded-xl" />
          <div className="h-4 w-96 bg-[#252a2b]/60 light:bg-[#e2e8f0]/80 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-28 bg-[#252a2b] light:bg-[#e2e8f0] rounded-full" />
          <div className="h-9 w-32 bg-[#252a2b] light:bg-[#e2e8f0] rounded-full" />
        </div>
      </div>

      {/* 4 Metric Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] shadow-sm space-y-3"
          >
            <div className="flex justify-between">
              <div className="h-3 w-20 bg-[#252a2b] light:bg-[#e2e8f0] rounded" />
              <div className="h-6 w-6 bg-[#252a2b] light:bg-[#e2e8f0] rounded-full" />
            </div>
            <div className="h-8 w-24 bg-[#252a2b] light:bg-[#e2e8f0] rounded-lg" />
            <div className="h-2 w-full bg-[#252a2b]/50 light:bg-[#e2e8f0]/60 rounded-full" />
          </div>
        ))}
      </div>

      {/* Center Table / Board Skeleton */}
      <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-white/10 light:border-black/10">
          <div className="h-5 w-40 bg-[#252a2b] light:bg-[#e2e8f0] rounded-lg" />
          <div className="h-4 w-24 bg-[#252a2b] light:bg-[#e2e8f0] rounded-lg" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 w-full bg-[#252a2b] light:bg-[#f8fafc] rounded-2xl border border-white/10 light:border-black/10 flex items-center justify-between px-4"
          >
            <div className="h-4 w-36 bg-[#1e2224] light:bg-[#e2e8f0] rounded" />
            <div className="h-4 w-20 bg-[#1e2224] light:bg-[#e2e8f0] rounded" />
            <div className="h-4 w-28 bg-[#1e2224] light:bg-[#e2e8f0] rounded" />
            <div className="h-6 w-16 bg-[#1e2224] light:bg-[#e2e8f0] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
