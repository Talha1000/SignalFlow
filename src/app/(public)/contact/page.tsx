"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Building2, Send, CheckCircle2 } from "lucide-react";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Speak with our Revenue Intelligence Specialists
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Whether you want an enterprise architecture briefing or need help configuring custom
          scoring algorithms, we're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Direct Channels</h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Enterprise Sales</div>
                  <div className="text-slate-400">sales@signalflow.io</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Developer Support</div>
                  <div className="text-slate-400">api@signalflow.io</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Headquarters</div>
                  <div className="text-slate-400">548 Market St, San Francisco, CA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Inquiry Received</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Thanks for reaching out. A solutions architect will respond within 2 business hours.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <Input label="First Name" placeholder="Sarah" required />
                <Input label="Last Name" placeholder="Chen" required />
              </div>
              <Input label="Work Email" type="email" placeholder="sarah@company.com" required />
              <Input label="Company Name" placeholder="Acme Technologies" required />
              <Select
                label="Team Size"
                options={[
                  { label: "1-10 employees", value: "1-10" },
                  { label: "11-50 employees", value: "11-50" },
                  { label: "51-250 employees", value: "51-250" },
                  { label: "250+ employees", value: "250+" },
                ]}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Message / Goal</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-slate-700/80 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="Tell us about your pipeline and what you're evaluating..."
                  required
                />
              </div>

              <Button type="submit" variant="gradient" className="w-full justify-center">
                Submit Inquiry <Send className="h-3.5 w-3.5 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
