import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { CyberPreloader } from "@/components/ui/CyberPreloader";

// Dynamically split below-the-fold modules for blazing fast initial viewport rendering
const InteractiveRoiCalculator = dynamic(
  () => import("@/components/landing/InteractiveRoiCalculator").then((m) => m.InteractiveRoiCalculator),
  { ssr: true }
);

const BentoGridSection = dynamic(
  () => import("@/components/landing/BentoGridSection").then((m) => m.BentoGridSection),
  { ssr: true }
);

const WorkflowTabsSection = dynamic(
  () => import("@/components/landing/WorkflowTabsSection").then((m) => m.WorkflowTabsSection),
  { ssr: true }
);

const SocialProofSection = dynamic(
  () => import("@/components/landing/SocialProofSection").then((m) => m.SocialProofSection),
  { ssr: true }
);

const PricingSection = dynamic(
  () => import("@/components/landing/PricingSection").then((m) => m.PricingSection),
  { ssr: true }
);

const FaqSection = dynamic(
  () => import("@/components/landing/FaqSection").then((m) => m.FaqSection),
  { ssr: true }
);

const FinalCtaSection = dynamic(
  () => import("@/components/landing/FinalCtaSection").then((m) => m.FinalCtaSection),
  { ssr: true }
);

export const metadata = {
  title: "SignalFlow – Autonomous Revenue Intelligence & AI Sales Enablement",
  description:
    "Turn silent buyer signals into closed enterprise pipeline with explainable AI lead scoring, telemetry ingestion, and autonomous cadences.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#060913] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* 2027 Futuristic Entrance Preloader */}
      <CyberPreloader />

      {/* Top Futuristic Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section with Live Telemetry Simulator & Social Proof */}
        <HeroSection />

        {/* 2. Interactive Revenue Lift & ROI Modeler */}
        <InteractiveRoiCalculator />

        {/* 3. 2027 Bento Grid: Telemetry, Radar, Scoring, Auto-Stop Cadences, Security */}
        <BentoGridSection />

        {/* 4. Interactive 3-Step Live Pipeline Walkthrough */}
        <WorkflowTabsSection />

        {/* 5. Executive Social Proof & Verified Testimonials */}
        <SocialProofSection />

        {/* 6. Transparent Interactive Pricing (Monthly / Annual) */}
        <PricingSection />

        {/* 7. Comprehensive Interactive FAQs */}
        <FaqSection />

        {/* 8. Grand Cyber-Portal Final Call to Action */}
        <FinalCtaSection />
      </main>

      {/* Comprehensive System Footer */}
      <Footer />
    </div>
  );
}
