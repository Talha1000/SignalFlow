import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "gradient";
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
    "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none rounded-lg select-none active:scale-[0.98]";

  const variants = {
    primary:
      "bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-semibold shadow-sm shadow-cyan-500/20 focus:ring-cyan-400",
    secondary:
      "bg-slate-800 text-slate-100 hover:bg-slate-700/80 border border-slate-700/60 focus:ring-slate-400",
    outline:
      "border border-slate-700/80 bg-transparent text-slate-200 hover:bg-slate-800/60 hover:text-white focus:ring-cyan-500",
    ghost:
      "bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white focus:ring-slate-400",
    destructive:
      "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 focus:ring-red-500",
    gradient:
      "bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-slate-950 font-semibold hover:opacity-90 shadow-lg shadow-cyan-500/25 focus:ring-cyan-400",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5",
    icon: "h-9 w-9 p-0",
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
