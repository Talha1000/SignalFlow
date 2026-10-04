"use client";

import React, { useState } from "react";
import { Zap, Plus, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea, Select } from "@/components/ui/Input";

interface SequenceStep {
  id?: string;
  stepOrder: number;
  delayDays: number;
  stepType?: string;
  subject?: string | null;
  body: string;
}

interface SequenceItem {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  openRate?: number | null;
  clickRate?: number | null;
  replyRate?: number | null;
  enrolledCount?: number | null;
  steps?: SequenceStep[];
  enrollments?: any[];
}

export function SequencesClientView({
  initialSequences,
}: {
  initialSequences: SequenceItem[];
}) {
  const [sequences, setSequences] = useState<SequenceItem[]>(initialSequences);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New sequence form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<
    { stepOrder: number; delayDays: number; subject: string; body: string }[]
  >([
    {
      stepOrder: 1,
      delayDays: 0,
      subject: "Quick question regarding {{company}}'s workflows",
      body: "Hi {{firstName}},\n\nNoticed your team is scaling operations. Would love to share our technical benchmark.\n\nBest,\nYour Name",
    },
    {
      stepOrder: 2,
      delayDays: 3,
      subject: "Case study: How teams like {{company}} improved response velocity",
      body: "Hi {{firstName}},\n\nFollowing up on my previous note with a brief case study on latency & conversion improvements.\n\nBest,\nYour Name",
    },
  ]);

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        stepOrder: steps.length + 1,
        delayDays: (steps[steps.length - 1]?.delayDays || 0) + 3,
        subject: "Follow-up",
        body: "Checking in to see if you had a moment to review.",
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    const updated = steps.filter((_, i) => i !== index).map((s, idx) => ({ ...s, stepOrder: idx + 1 }));
    setSteps(updated);
  };

  const handleCreateSequence = async () => {
    if (!name.trim()) {
      setErrorMsg("Please provide a cadence name.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          status: "ACTIVE",
          steps: steps.map((s) => ({
            stepOrder: s.stepOrder,
            delayDays: Number(s.delayDays),
            stepType: "EMAIL",
            subject: s.subject.trim(),
            body: s.body.trim(),
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || "Failed to create cadence");
      }

      setSequences([data.data, ...sequences]);
      setModalOpen(false);
      setName("");
      setDescription("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create cadence");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
            Cadences & Outbound Sequences
          </h1>
          <p className="text-xs text-slate-400 light:text-[#787e82] mt-0.5">
            Automated multi-step drip cadences triggered by buying signals with instant auto-stop on reply.
          </p>
        </div>
        <Button
          variant="pill"
          size="sm"
          onClick={() => {
            setErrorMsg(null);
            setModalOpen(true);
          }}
          className="gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" /> New Cadence
        </Button>
      </div>

      {sequences.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] space-y-4">
          <Zap className="h-8 w-8 text-[#38b6ff] light:text-[#0284c7] mx-auto opacity-70" />
          <div>
            <h3 className="font-bold text-white light:text-[#121212] text-sm">No cadences created yet</h3>
            <p className="text-xs text-slate-400 light:text-[#787e82] mt-1 max-w-md mx-auto">
              Create an automated multi-step sequence to deliver contextual follow-ups whenever high-intent signals are detected.
            </p>
          </div>
          <Button variant="pill" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Create First Cadence
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sequences.map((seq) => {
            const enrolledCount = seq.enrolledCount ?? seq.enrollments?.length ?? 0;
            const openRatePercent = seq.openRate != null ? (seq.openRate * 100).toFixed(0) : "0";
            const clickRatePercent = seq.clickRate != null ? (seq.clickRate * 100).toFixed(0) : "0";
            const replyRatePercent = seq.replyRate != null ? (seq.replyRate * 100).toFixed(0) : "0";

            return (
              <div
                key={seq.id}
                className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 space-y-5 hover:border-[#38b6ff]/30 light:hover:border-[#0284c7]/30 transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white light:text-[#121212]">{seq.name}</h3>
                      <p className="text-xs text-slate-400 light:text-[#787e82] mt-1">{seq.description || "Active sales cadence"}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 light:text-emerald-700 border border-emerald-500/20 font-semibold">
                      {seq.status}
                    </span>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 light:text-[#787e82] uppercase font-mono">Open Rate</div>
                      <div className="text-sm font-bold font-mono text-[#38b6ff] light:text-[#0284c7] mt-0.5">
                        {openRatePercent}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 light:text-[#787e82] uppercase font-mono">Click Rate</div>
                      <div className="text-sm font-bold font-mono text-indigo-400 light:text-indigo-700 mt-0.5">
                        {clickRatePercent}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 light:text-[#787e82] uppercase font-mono">Reply Rate</div>
                      <div className="text-sm font-bold font-mono text-emerald-400 light:text-emerald-700 mt-0.5">
                        {replyRatePercent}%
                      </div>
                    </div>
                  </div>

                  {/* Steps overview */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-semibold text-slate-400 light:text-[#787e82] uppercase font-mono">
                      Cadence Steps ({(seq.steps || []).length})
                    </span>
                    <div className="space-y-1 text-slate-300 light:text-[#4a5053]">
                      {(seq.steps || []).map((st) => (
                        <div
                          key={st.id || `${st.stepOrder}-${st.delayDays}`}
                          className="p-2.5 rounded-xl bg-[#252a2b]/70 light:bg-[#f0f2f3] border border-white/10 light:border-black/10 flex items-center justify-between text-[11px]"
                        >
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-[#38b6ff] light:text-[#0284c7] shrink-0" />
                            <span className="font-semibold text-white light:text-[#121212]">Day {st.delayDays}:</span>
                            <span className="truncate max-w-[260px] text-slate-300 light:text-[#4a5053]">{st.subject || "Outbound email"}</span>
                          </div>
                          <span className="font-mono text-slate-400 light:text-[#787e82] text-[10px]">
                            Step {st.stepOrder}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 light:border-black/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 light:text-[#787e82]">
                    <strong className="text-white light:text-[#121212] font-mono">{enrolledCount}</strong> prospects enrolled
                  </span>
                  <span className="text-emerald-400 light:text-emerald-700 text-[11px] flex items-center gap-1 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Auto-pause on reply active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Cadence Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Cadence" maxWidth="2xl">
        <div className="space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Cadence Name"
              placeholder="e.g. Inbound Demo Request Accelerator"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              label="Description"
              placeholder="Target ICP and intent signals that trigger this cadence..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white light:text-[#121212] uppercase font-mono">
                Cadence Steps ({steps.length})
              </h4>
              <Button variant="ghost" size="sm" onClick={handleAddStep} className="text-xs text-[#38b6ff] light:text-[#0284c7]">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Step
              </Button>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {steps.map((st, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white light:text-[#121212]">
                      Step {st.stepOrder} (Email)
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 light:text-[#787e82]">
                        <span>Delay:</span>
                        <input
                          type="number"
                          min={0}
                          max={90}
                          className="w-14 px-2 py-0.5 rounded border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] text-white light:text-[#121212] text-xs text-center focus:outline-none"
                          value={st.delayDays}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const copy = [...steps];
                            copy[idx].delayDays = val;
                            setSteps(copy);
                          }}
                        />
                        <span>days</span>
                      </div>
                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-slate-400 hover:text-rose-400 text-xs ml-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Subject line..."
                    className="w-full px-3 py-1.5 rounded-xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] text-white light:text-[#121212] text-xs focus:outline-none focus:border-[#38b6ff]"
                    value={st.subject}
                    onChange={(e) => {
                      const copy = [...steps];
                      copy[idx].subject = e.target.value;
                      setSteps(copy);
                    }}
                  />

                  <textarea
                    rows={3}
                    placeholder="Email body template (supports {{firstName}}, {{company}})..."
                    className="w-full px-3 py-1.5 rounded-xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] text-white light:text-[#121212] text-xs focus:outline-none focus:border-[#38b6ff]"
                    value={st.body}
                    onChange={(e) => {
                      const copy = [...steps];
                      copy[idx].body = e.target.value;
                      setSteps(copy);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 light:border-black/10 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="pill" size="sm" onClick={handleCreateSequence} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Save Cadence"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
