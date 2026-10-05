"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: {
    id: string;
    name: string;
    email: string;
    company: string;
    title?: string;
    score?: number;
  } | null;
}

export function EmailComposerModal({ isOpen, onClose, lead }: EmailComposerProps) {
  const [subject, setSubject] = useState("Quick follow-up");
  const [body, setBody] = useState("");
  const [tone, setTone] = useState<"consultative" | "direct" | "technical" | "professional">("consultative");
  const [isAiRewriting, setIsAiRewriting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  React.useEffect(() => {
    if (lead) {
      const firstName = lead.name?.split(" ")[0] || "there";
      const company = lead.company || "your team";
      setSubject(`Prioritizing revenue signals at ${company}`);
      setBody(
        `Hi ${firstName},\n\nI noticed your team at ${company} has been evaluating our real-time intent prioritization and webhook architecture.\n\nWould you be open to a 15-minute briefing this Thursday?\n\nBest regards,\nLiam Vance\nSignalFlow Sales Team`
      );
    }
  }, [lead]);

  const [generationMeta, setGenerationMeta] = useState<{ source: "ai" | "template"; provider: string | null } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [providerUnconfigured, setProviderUnconfigured] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAiRewrite = async () => {
    if (!lead) return;
    setIsAiRewriting(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/v1/ai/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          tone,
        }),
      });
      const resJson = await res.json();
      const payload = resJson.data || resJson;
      if (payload.subject && payload.body) {
        setSubject(payload.subject);
        setBody(payload.body);
        if (payload.source) {
          setGenerationMeta({ source: payload.source, provider: payload.provider || null });
        }
      } else if (resJson.error) {
        setErrorMessage(resJson.error);
      }
    } catch {
      // Fallback local tone generator
      if (tone === "direct") {
        setSubject(`Quick question re: ${lead.company}`);
        setBody(`Hi ${lead.name.split(" ")[0]},\n\nSaw you exploring our documentation and enterprise pricing.\n\nAre you reviewing solutions for this quarter?\n\nBest,\nLiam`);
      } else if (tone === "technical") {
        setSubject(`SignalFlow tenant isolation & webhook architecture for ${lead.company}`);
        setBody(`Hi ${lead.name.split(" ")[0]},\n\nNoticed your interest in our webhook latency and PostgreSQL tenant isolation specs.\n\nHappy to share our engineering benchmarks or set up an API sandbox for ${lead.company}.\n\nBest,\nLiam`);
      }
      setGenerationMeta({ source: "template", provider: null });
    } finally {
      setIsAiRewriting(false);
    }
  };

  const handleSend = async () => {
    if (!lead) return;
    setIsSending(true);
    setErrorMessage(null);
    setProviderUnconfigured(false);

    try {
      const res = await fetch("/api/v1/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          to: lead.email,
          subject,
          body,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503 || data.code === "PROVIDER_NOT_CONFIGURED") {
          setProviderUnconfigured(true);
          setErrorMessage(data.error || "Email provider is not configured. Set RESEND_API_KEY in your environment.");
        } else {
          setErrorMessage(data.error || "Failed to send email. Please check quota or connection.");
        }
        return;
      }

      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Network error while sending email.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Compose Email to ${lead.name}`}
      description={`${lead.title || "Contact"} at ${lead.company} (Score: ${lead.score || 85})`}
      maxWidth="2xl"
    >
      {sentSuccess ? (
        <div className="py-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white light:text-[#121212]">Email Sent & Logged</h3>
          <p className="text-xs text-slate-400 light:text-[#787e82]">
            Outreach recorded in lead activity timeline. Next cadence step scheduled.
          </p>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {/* Provider unconfigured warning */}
          {providerUnconfigured && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 light:text-amber-800 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs">Email Provider Not Configured</p>
                <p className="text-[11px] opacity-90">{errorMessage}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyDraft}
                className="shrink-0 text-xs border-amber-500/30 hover:bg-amber-500/10"
              >
                {copied ? "Copied!" : "Copy Draft"}
              </Button>
            </div>
          )}

          {/* General error message */}
          {errorMessage && !providerUnconfigured && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 light:text-rose-700">
              <p className="font-semibold text-xs">Delivery Failed</p>
              <p className="text-[11px] mt-0.5">{errorMessage}</p>
            </div>
          )}

          {/* Recipient info bar */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 text-slate-300 light:text-[#4a5053]">
            <div>
              <span className="text-slate-400 light:text-[#787e82]">To: </span>
              <span className="font-bold text-white light:text-[#121212]">{lead.name}</span>{" "}
              <span className="font-mono text-slate-400 light:text-[#787e82]">&lt;{lead.email}&gt;</span>
            </div>
            <div className="flex items-center gap-2">
              {generationMeta && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  generationMeta.source === "ai"
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                }`}>
                  {generationMeta.source === "ai" ? "Gemini AI" : "Template"}
                </span>
              )}
              <span className="font-mono text-[#38b6ff] light:text-[#0284c7] font-bold bg-[#38b6ff]/10 px-2.5 py-1 rounded-full border border-[#38b6ff]/20">
                Score: {lead.score}
              </span>
            </div>
          </div>

          {/* AI Assist Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#38b6ff]/10 border border-[#38b6ff]/20">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" />
              <span className="font-semibold text-[#38b6ff] light:text-[#0284c7]">AI Personalize:</span>
              <select
                value={tone}
                onChange={(e: any) => setTone(e.target.value)}
                className="bg-[#1e2224] light:bg-[#ffffff] border border-white/10 light:border-black/10 rounded-xl px-3 py-1.5 text-white light:text-[#121212] text-xs focus:outline-none"
              >
                <option value="consultative">Consultative (ROI focus)</option>
                <option value="direct">Direct & Concise</option>
                <option value="technical">Technical Architecture</option>
                <option value="professional">Professional Formal</option>
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAiRewrite}
              loading={isAiRewriting}
              className="text-xs py-1 h-8 rounded-full border-[#38b6ff]/30 text-[#38b6ff] light:text-[#0284c7] hover:bg-[#38b6ff]/10"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Re-draft with AI
            </Button>
          </div>

          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300 light:text-[#4a5053]">Body</label>
              <span className="text-[10px] text-slate-400 light:text-[#787e82]">
                Variables: {`{{first_name}}, {{company}}, {{job_title}}`}
              </span>
            </div>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-2xl border border-white/10 light:border-black/10 bg-[#252a2b] light:bg-[#f0f2f3] p-3.5 text-xs text-white light:text-[#121212] placeholder-slate-400 light:placeholder-[#787e82] focus:border-[#38b6ff] focus:outline-none focus:ring-1 focus:ring-[#38b6ff] font-sans leading-relaxed"
            />
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-white/10 light:border-black/10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 light:text-[#787e82]">
                Auto-stop cadence rule: <span className="text-emerald-500 font-semibold">ACTIVE</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose} disabled={isSending}>
                Cancel
              </Button>
              <Button
                variant="pill"
                size="sm"
                onClick={handleSend}
                loading={isSending}
                className="gap-1.5"
              >
                Send Email Now <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
