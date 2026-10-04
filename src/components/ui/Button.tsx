import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "gradient" | "pill";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]";

  const variants = {
    primary:
      "bg-white text-[#121212] hover:bg-slate-200 dark:bg-white dark:text-[#121212] dark:hover:bg-slate-200 light:bg-[#121212] light:text-white light:hover:bg-black font-semibold rounded-full shadow-sm focus:ring-[#38b6ff]",
    pill:
      "bg-[#38b6ff] text-[#121212] hover:bg-[#34feff] dark:bg-[#38b6ff] dark:text-[#121212] dark:hover:bg-[#34feff] light:bg-[#0284c7] light:text-white light:hover:bg-[#0369a1] font-semibold rounded-full shadow-sm focus:ring-[#38b6ff]",
    secondary:
      "bg-[#252a2b] text-white hover:bg-[#2d3234] dark:bg-[#252a2b] dark:text-white dark:hover:bg-[#2d3234] light:bg-[#f0f2f3] light:text-[#121212] light:hover:bg-[#e4e6e8] border border-white/10 light:border-black/10 rounded-full focus:ring-[#38b6ff]",
    outline:
      "bg-transparent text-white dark:text-white light:text-[#121212] border border-white/20 dark:border-white/20 light:border-black/20 hover:bg-white/10 light:hover:bg-black/5 rounded-full focus:ring-[#38b6ff]",
    ghost:
      "bg-transparent text-slate-300 dark:text-slate-300 light:text-[#4a5053] hover:text-white dark:hover:text-white light:hover:text-[#121212] hover:bg-white/5 light:hover:bg-black/5 rounded-full focus:ring-[#38b6ff]",
    destructive:
      "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-full focus:ring-red-500",
    gradient:
      "bg-gradient-to-r from-[#38b6ff] to-[#0284c7] text-[#121212] font-semibold hover:opacity-95 shadow-md rounded-full focus:ring-[#38b6ff]",
  };

  const sizes = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
    icon: "h-9 w-9 p-0 rounded-full",
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}
