import React from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  className,
  label,
  error,
  helperText,
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-300">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={twMerge(
          "w-full rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 shadow-sm transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Array<{ label: string; value: string }>;
}

export function Select({
  className,
  label,
  error,
  options,
  children,
  id,
  ...props
}: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label htmlFor={selectId} className="block text-xs font-medium text-slate-300">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={twMerge(
          "w-full rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 shadow-sm transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500",
          error && "border-red-500",
          className
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
