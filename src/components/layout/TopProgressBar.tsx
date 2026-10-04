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
      <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.6)] transition-all duration-300" style={{ width: "100%" }} />
    </div>
  );
}
