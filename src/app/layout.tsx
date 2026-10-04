import type { Metadata } from "next";
import { DM_Sans, Dosis } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import { TopProgressBar } from "../components/layout/TopProgressBar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dosis = Dosis({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-dosis",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SignalFlow – Autonomous Revenue Intelligence & AI Sales Enablement",
  description:
    "Turn silent buyer signals into closed enterprise pipeline with explainable AI lead scoring, telemetry ingestion, and autonomous cadences.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${dmSans.variable} ${dosis.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans bg-background text-foreground antialiased selection:bg-[#38b6ff] selection:text-[#121212]">
        <TopProgressBar />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
