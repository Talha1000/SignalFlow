import React from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export function Card({
  className,
  children,
  glass = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { glass?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={twMerge(
        clsx(
          "rounded-xl border transition-all duration-200",
          glass
            ? "glass-panel"
            : "bg-slate-900/80 border-slate-800/90 text-slate-100 shadow-sm",
          className
        )
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("p-5 border-b border-slate-800/80", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={twMerge("text-base font-semibold tracking-tight text-white", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={twMerge("text-xs text-slate-400 mt-1", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("p-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge("p-5 border-t border-slate-800/80 flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}
