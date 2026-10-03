import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import { TopProgressBar } from "../components/layout/TopProgressBar";

export const metadata: Metadata = {
  title: "SignalFlow – Autonomous Revenue Intelligence & AI Sales Enablement",
  description:
    "Turn silent buyer signals into closed enterprise pipeline with explainable AI lead scoring, telemetry ingestion, and autonomous cadences.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#060913] text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        <TopProgressBar />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
