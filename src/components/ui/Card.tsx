import React from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export function Card({
  className,
  children,
  glass = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.div> & { glass?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={twMerge(
        clsx(
          "rounded-3xl border transition-all duration-200",
          glass
            ? "glass-panel"
            : "bg-[#1e2224] light:bg-[#ffffff] border-white/10 light:border-black/10 text-white light:text-[#121212] shadow-sm",
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
    <div className={twMerge("p-5 sm:p-6 border-b border-white/10 light:border-black/10", className)} {...props}>
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
      className={twMerge("text-base font-bold tracking-tight text-white light:text-[#121212]", className)}
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
    <p className={twMerge("text-xs text-slate-300 light:text-[#4a5053] mt-1", className)} {...props}>
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
    <div className={twMerge("p-5 sm:p-6", className)} {...props}>
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
      className={twMerge("p-5 sm:p-6 border-t border-white/10 light:border-black/10 flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}
