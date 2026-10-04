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
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-300 light:text-[#121212]">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={twMerge(
          "w-full rounded-xl border border-white/10 light:border-black/15 bg-[#181b1c] light:bg-white px-3.5 py-2.5 text-sm text-white light:text-[#121212] placeholder-slate-500 light:placeholder-[#8a9296] shadow-sm transition-colors focus:border-[#38b6ff] light:focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#38b6ff] light:focus:ring-[#0284c7] disabled:opacity-50",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 light:text-[#787e82]">{helperText}</p>
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
        <label htmlFor={selectId} className="block text-xs font-medium text-slate-300 light:text-[#121212]">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={twMerge(
          "w-full rounded-xl border border-white/10 light:border-black/15 bg-[#181b1c] light:bg-white px-3.5 py-2.5 text-sm text-white light:text-[#121212] shadow-sm transition-colors focus:border-[#38b6ff] light:focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#38b6ff] light:focus:ring-[#0284c7]",
          error && "border-red-500",
          className
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#181b1c] text-white light:bg-white light:text-[#121212]">
                {opt.label}
              </option>
            ))
          : children}
      </select>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  className,
  label,
  error,
  helperText,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label htmlFor={textareaId} className="block text-xs font-medium text-slate-300 light:text-[#121212]">
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        className={twMerge(
          "w-full rounded-xl border border-white/10 light:border-black/15 bg-[#181b1c] light:bg-white px-3.5 py-2.5 text-sm text-white light:text-[#121212] placeholder-slate-500 light:placeholder-[#8a9296] shadow-sm transition-colors focus:border-[#38b6ff] light:focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#38b6ff] light:focus:ring-[#0284c7] disabled:opacity-50",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 light:text-[#787e82]">{helperText}</p>
      ) : null}
    </div>
  );
}
