import React from "react";
import Link from "next/link";
import { Shield, Lock, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Privacy Policy – SignalFlow",
  description: "SignalFlow's commitment to customer data privacy, GDPR, CCPA compliance, and tenant isolation.",
};

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#38b6ff] light:text-[#0284c7] shadow-xs">
          <Shield className="h-3.5 w-3.5" /> Data Protection & Governance
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-[#121212]">
          SignalFlow Privacy Policy
        </h1>
        <p className="text-xs font-mono text-slate-400 light:text-[#787e82]">
          Effective Date: October 5, 2026 • Version 2.4
        </p>
      </div>

      <div className="space-y-8 text-xs text-slate-300 light:text-[#4a5053] leading-relaxed">
        {/* Section 1 */}
        <section className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-white light:text-[#121212] flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" />
            1. Overview & Tenant Isolation Architecture
          </h2>
          <p>
            SignalFlow Technologies Inc. (&ldquo;SignalFlow&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) provides autonomous revenue intelligence and lead prioritization infrastructure to B2B software organizations. We take the privacy and sovereignty of enterprise customer data seriously.
          </p>
          <p>
            Our architecture is founded on strict multi-tenant boundary isolation. Every tenant-owned database record—including leads, contacts, behavioral signals, scores, cadences, and automation workflows—is cryptographically or relationally partitioned by a dedicated workspace identifier (<code className="px-1.5 py-0.5 rounded bg-black/20 text-[#38b6ff] light:text-[#0284c7]">workspace_id</code>). We do not pool customer training data or use proprietary workspace telemetry to train cross-tenant AI models.
          </p>
        </section>

        {/* Section 2 */}
        <section className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-white light:text-[#121212]">
            2. Data Collected & Telemetry Scope
          </h2>
          <p>We process information submitted by you or collected via your configured signal ingestion webhooks:</p>
          <ul className="space-y-2 pl-4 list-disc marker:text-[#38b6ff]">
            <li>
              <strong>Account & Profile Information:</strong> Name, work email address, company name, industry, and encrypted authentication credentials.
            </li>
            <li>
              <strong>Business Contact & CRM Data:</strong> Names, job titles, business email addresses, company ICP attributes, and deal values ingested into your workspace.
            </li>
            <li>
              <strong>Behavioral Signals & Telemetry:</strong> Inbound HTTPS webhook signals, documentation views, pricing visits, and cadence email interaction timestamps sent to our ingestion endpoints.
            </li>
            <li>
              <strong>Audit Logs & Security Metadata:</strong> Actor identifiers, request timestamps, and client IP addresses recorded for enterprise audit trails and anomaly prevention.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-white light:text-[#121212]">
            3. GDPR & CCPA / CPRA Compliance
          </h2>
          <p>
            Under European data protection regulations (GDPR) and the California Consumer Privacy Act (CCPA/CPRA), data subjects maintain sovereign rights regarding their personal data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-1">
              <span className="font-semibold text-white light:text-[#121212]">Right to Erasure & Deletion</span>
              <p className="text-[11px] text-slate-400 light:text-[#787e82]">
                Permanent soft or hard deletion of lead records and associated telemetry upon verifiable request.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-1">
              <span className="font-semibold text-white light:text-[#121212]">Right to Data Portability</span>
              <p className="text-[11px] text-slate-400 light:text-[#787e82]">
                Full export of customer-owned leads, cadences, and scored signals via standard CSV and REST API endpoints.
              </p>
            </div>
          </div>
          <p className="pt-2">
            To submit automated data subject access or deletion requests, authorized workspace administrators can utilize our programmatic privacy endpoint at <code className="px-1.5 py-0.5 rounded bg-black/20 text-[#38b6ff] light:text-[#0284c7]">/api/v1/privacy/data-subject</code> or email <a href="mailto:privacy@signalflow.io" className="text-[#38b6ff] hover:underline">privacy@signalflow.io</a>.
          </p>
        </section>

        {/* Section 4 */}
        <section className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-white light:text-[#121212]">
            4. Data Retention & Cryptographic Security
          </h2>
          <p>
            We implement industry-standard encryption controls for data in transit (TLS 1.3) and secure hashing for sensitive credentials:
          </p>
          <ul className="space-y-1.5 pl-4 list-disc marker:text-[#38b6ff]">
            <li>API keys are stored strictly as irreversible SHA-256 digests; raw keys are never written to persistent logs or storage.</li>
            <li>Outbound webhook deliveries enforce fail-closed RFC1918 SSRF filters and support HMAC SHA-256 signature verification.</li>
            <li>Customer data is retained for the active duration of the customer subscription plus 30 days for disaster recovery failover, after which tenant records are purged.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-white light:text-[#121212]">
            5. Contact Our Privacy Team
          </h2>
          <p>
            For privacy inquiries, Data Processing Agreement (DPA) execution, or security review documentation:
          </p>
          <div className="p-4 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 text-xs font-mono space-y-1">
            <div className="text-white light:text-[#121212] font-sans font-semibold">SignalFlow Technologies Inc. – Privacy & Security Office</div>
            <div>Email: <a href="mailto:privacy@signalflow.io" className="text-[#38b6ff]">privacy@signalflow.io</a></div>
            <div>Address: 548 Market St, Suite 72401, San Francisco, CA 94104</div>
          </div>
        </section>
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-white/10 light:border-black/10 text-xs text-slate-400">
        <Link href="/terms" className="hover:text-[#38b6ff] transition-colors">
          View Terms of Service →
        </Link>
        <Link href="/contact" className="hover:text-[#38b6ff] transition-colors">
          Contact Privacy Officer →
        </Link>
      </div>
    </div>
  );
}
