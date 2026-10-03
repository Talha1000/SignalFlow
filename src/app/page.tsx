import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { InteractiveRoiCalculator } from "@/components/landing/InteractiveRoiCalculator";
import { BentoGridSection } from "@/components/landing/BentoGridSection";
import { WorkflowTabsSection } from "@/components/landing/WorkflowTabsSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";

export const metadata = {
  title: "SignalFlow – Autonomous Revenue Intelligence & AI Sales Enablement",
  description:
    "Turn silent buyer signals into closed enterprise pipeline with explainable AI lead scoring, telemetry ingestion, and autonomous cadences.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
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
