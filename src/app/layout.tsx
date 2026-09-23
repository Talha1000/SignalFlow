import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "SignalFlow — Know Who Wants to Buy. Know What to Do Next.",
  description:
    "SignalFlow turns scattered B2B signals into clear sales priorities—so your team knows who to contact, why now, and what to say.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
