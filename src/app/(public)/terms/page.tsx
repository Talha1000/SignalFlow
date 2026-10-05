import React from "react";
import Link from "next/link";
import { FileText, CheckCircle2, ShieldAlert, Scale, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Terms of Service – SignalFlow",
  description: "Terms of service, subscription tiers, API fair use policies, and SLA commitments for SignalFlow.",
};

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#38b6ff] light:text-[#0284c7] shadow-xs">
          <Scale className="h-3.5 w-3.5" /> Commercial Agreement
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-[#121212]">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-slate-400 light:text-[#787e82]">
          Last Revised: October 5, 2026 • Version 2.1
        </p>
      </div>

      <div className="space-y-8 text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">
        {/* Section 1 */}
        <section className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-white light:text-[#121212]">
            1. Acceptance of Terms & Services
          </h2>
          <p>
            By registering for an account, accessing the SignalFlow platform, or invoking our REST API and webhook ingestion endpoints, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;) between your organization (&ldquo;Customer&rdquo;) and SignalFlow Technologies Inc. (&ldquo;SignalFlow&rdquo;).
          </p>
          <p>
            If you are entering into this agreement on behalf of a corporation or entity, you represent that you possess the legal authority to bind that entity to these Terms.
          </p>
        </section>

        {/* Section 2 */}
        <section className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-white light:text-[#121212]">
            2. Subscription Plans, Quotas & Fair Use
          </h2>
          <p>
            SignalFlow offers tiered subscription tiers (Free, Starter, Growth, Business, and Enterprise). Each tier carries defined monthly quotas:
          </p>
          <ul className="space-y-1.5 pl-4 list-disc marker:text-[#38b6ff]">
            <li><strong>Lead Capacity:</strong> Maximum active prioritized prospect records stored in the workspace.</li>
            <li><strong>AI Intelligence Credits:</strong> Quotas for real-time generative Sales Copilot responses and contextual sequence drafts.</li>
            <li><strong>Team Seats:</strong> Number of authorized workspace seats allocated per tenant organization.</li>
          </ul>
          <p className="pt-1">
            Usage quotas are enforced via atomic transactional verification. Quota increments are committed only when upstream actions complete successfully. Automated attempts to bypass quota caps or flood ingestion endpoints may result in rate-limiting (HTTP 429) or temporary endpoint throttling.
          </p>
        </section>

        {/* Section 3 */}
        <section className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-white light:text-[#121212]">
            3. API Keys & Webhook Security
          </h2>
          <p>
            Customers are solely responsible for maintaining the confidentiality of their generated workspace API credentials:
          </p>
          <ul className="space-y-1.5 pl-4 list-disc marker:text-[#38b6ff]">
            <li>Customer administrators must generate distinct API keys for each automated system and rotate them promptly upon credential exposure.</li>
            <li>Outbound webhooks registered with SignalFlow must target secure HTTPS endpoints. SignalFlow blocks deliveries to private IP ranges, cloud metadata addresses (169.254.169.254), and loopback hosts to protect infrastructure integrity.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-white light:text-[#121212]">
            4. Customer Data Ownership & Confidentiality
          </h2>
          <p>
            The Customer retains all right, title, and interest in and to all lead information, proprietary CRM data, and inbound business signals imported into the platform. SignalFlow obtains no ownership rights in Customer Data.
          </p>
          <p>
            SignalFlow processes Customer Data solely to provide the contracted services and will not disclose Customer Data to unauthorized third parties without prior written consent, except where required by law.
          </p>
        </section>

        {/* Section 5 */}
        <section className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-white light:text-[#121212]">
            5. Service Availability & Support
          </h2>
          <p>
            SignalFlow strives to achieve 99.9% scheduled monthly uptime for all production tiers. Enterprise tier agreements include custom Service Level Agreements (SLAs) with 99.99% availability commitments and dedicated incident response channels.
          </p>
        </section>

        {/* Section 6 */}
        <section className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-white light:text-[#121212]">
            6. Termination & Governing Law
          </h2>
          <p>
            Either party may terminate the subscription for convenience upon 30 days written notice or immediately in the event of material breach. Upon termination, Customer may export their workspace data via CSV or API within 30 days, after which data is deleted per our retention policy.
          </p>
          <p className="pt-1">
            These Terms are governed by and construed in accordance with the laws of the State of California, without regard to conflict of law principles.
          </p>
        </section>
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-white/10 light:border-black/10 text-xs text-slate-400">
        <Link href="/privacy" className="hover:text-[#38b6ff] transition-colors">
          View Privacy Policy →
        </Link>
        <Link href="/contact" className="hover:text-[#38b6ff] transition-colors">
          Questions? Contact Legal Team →
        </Link>
      </div>
    </div>
  );
}
