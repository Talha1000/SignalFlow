import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { CyberPreloader } from "@/components/ui/CyberPreloader";
import { EnterpriseMarqueeTicker } from "@/components/landing/EnterpriseMarqueeTicker";
import { WorkflowTabsSection } from "@/components/landing/WorkflowTabsSection";
import { CollaborativeSuccessSection } from "@/components/landing/CollaborativeSuccessSection";

// Dynamically split below-the-fold modules for blazing fast initial viewport rendering
const BentoGridSection = dynamic(
  () => import("@/components/landing/BentoGridSection").then((m) => m.BentoGridSection),
  { ssr: true }
);

const InteractiveRoiCalculator = dynamic(
  () => import("@/components/landing/InteractiveRoiCalculator").then((m) => m.InteractiveRoiCalculator),
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

const InsightsSection = dynamic(
  () => import("@/components/landing/InsightsSection").then((m) => m.InsightsSection),
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
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      {/* Entrance Preloader */}
      <CyberPreloader />

      {/* Top Floating Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section with Sector Color Cycle & Simulator */}
        <HeroSection />

        {/* 2. Enterprise Telemetry Marquee Ticker */}
        <EnterpriseMarqueeTicker />

        {/* 3. "What we do / We are SignalFlow" + Sector Tabs */}
        <WorkflowTabsSection />

        {/* 4. Collaborative Success / Milestone Metrics */}
        <div id="milestones">
          <CollaborativeSuccessSection />
        </div>

        {/* 5. Core Platform Architecture Bento Grid */}
        <BentoGridSection />

        {/* 6. Interactive ROI & Pipeline Calculator */}
        <div id="calculator">
          <InteractiveRoiCalculator />
        </div>

        {/* 7. Verified Executive Testimonials */}
        <SocialProofSection />

        {/* 8. Transparent Pricing Matrix */}
        <div id="pricing">
          <PricingSection />
        </div>

        {/* 9. Editorial Intelligence & Insights Grid */}
        <div id="insights">
          <InsightsSection />
        </div>

        {/* 10. Enterprise FAQ Accordion */}
        <FaqSection />

        {/* 11. Grand Final CTA: Empower Revenue Velocity */}
        <FinalCtaSection />
      </main>

      {/* Architectural Enterprise Footer */}
      <Footer />
    </div>
  );
}
