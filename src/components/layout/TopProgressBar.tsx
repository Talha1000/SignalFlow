"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-slate-900 pointer-events-none">
      <div className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-300 animate-pulse-glow" style={{ width: "100%" }} />
    </div>
  );
}
