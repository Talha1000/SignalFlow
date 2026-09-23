"use client";

import React, { useState } from "react";
import {
  Mail,
  Sparkles,
  Send,
  Clock,
  CheckCircle2,
  Sliders,
  FileText,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
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
  const [subject, setSubject] = useState(
    lead ? `Prioritizing revenue signals at ${lead.company}` : "Quick follow-up"
  );
  const [body, setBody] = useState(
    lead
      ? `Hi ${lead.name.split(" ")[0]},\n\nI noticed your team at ${lead.company} has been evaluating our real-time intent prioritization and webhook architecture.\n\nWould you be open to a 15-minute briefing this Thursday?\n\nBest regards,\nLiam Vance\nSignalFlow Sales Team`
      : ""
  );
  const [tone, setTone] = useState<"consultative" | "direct" | "technical" | "professional">("consultative");
  const [isAiRewriting, setIsAiRewriting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleAiRewrite = async () => {
    if (!lead) return;
    setIsAiRewriting(true);
    try {
      const res = await fetch("/api/v1/ai/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          tone,
        }),
      });
      const data = await res.json();
      if (data.subject && data.body) {
        setSubject(data.subject);
        setBody(data.body);
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
    } finally {
      setIsAiRewriting(false);
    }
  };

  const handleSend = () => {
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1200);
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
          <h3 className="text-base font-bold text-white">Email Sent & Logged</h3>
          <p className="text-xs text-slate-400">
            Outreach recorded in lead activity timeline. Next cadence step scheduled.
          </p>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {/* Recipient info bar */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <div>
              <span className="text-slate-500">To: </span>
              <span className="font-semibold text-white">{lead.name}</span>{" "}
              <span className="font-mono text-slate-400">&lt;{lead.email}&gt;</span>
            </div>
            <span className="font-mono text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded">
              Score: {lead.score}
            </span>
          </div>

          {/* AI Assist Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-800/40">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="font-semibold text-cyan-300">AI Personalize:</span>
              <select
                value={tone}
                onChange={(e: any) => setTone(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
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
              className="text-xs py-1 h-7 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            >
              <Sparkles className="h-3 w-3 mr-1" /> Re-draft with AI
            </Button>
          </div>

          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">Body</label>
              <span className="text-[10px] text-slate-500">
                Variables: {`{{first_name}}, {{company}}, {{job_title}}`}
              </span>
            </div>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                Auto-stop cadence rule: <span className="text-emerald-400">ACTIVE</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="gradient" size="sm" onClick={handleSend} className="gap-1.5">
                Send Email Now <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
