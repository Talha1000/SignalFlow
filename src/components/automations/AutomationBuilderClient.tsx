"use client";

import React, { useState } from "react";
import {
  Layers,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  GitBranch,
  ArrowDown,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "action" | "aiAction" | "delay";
  title: string;
  description: string;
  data: Record<string, any>;
  nextId?: string;
  branchYesId?: string;
  branchNoId?: string;
}

const defaultNodes: WorkflowNode[] = [
  {
    id: "node-1",
    type: "trigger",
    title: "Trigger: Score Crosses 80",
    description: "Evaluates when an incoming signal brings a prospect score >= 80",
    data: { threshold: 80 },
    nextId: "node-2",
  },
  {
    id: "node-2",
    type: "condition",
    title: "Condition: Has Opened Email in 72h?",
    description: "Branch based on prospect outbound email engagement",
    data: { event: "EMAIL_OPEN", timeframe: 72 },
    branchYesId: "node-3",
    branchNoId: "node-6",
  },
  {
    id: "node-3",
    type: "action",
    title: "Action: Notify Sales Rep on Slack",
    description: "Direct message assigned rep with live activity log",
    data: { channel: "#sales-hot-leads" },
    nextId: "node-4",
  },
  {
    id: "node-4",
    type: "aiAction",
    title: "AI Action: Personalize Architecture Playbook",
    description: "Generate technical angle based on prospect tech stack & visited docs",
    data: { tone: "consultative" },
    nextId: "node-5",
  },
  {
    id: "node-5",
    type: "action",
    title: "Action: Enroll in Rapid Cadence",
    description: "Trigger High-Intent 2-Hour Response Sequence",
    data: { sequenceName: "Rapid Response" },
  },
  {
    id: "node-6",
    type: "delay",
    title: "Delay: Wait 2 Business Days",
    description: "Allow time for organic website return visit before nudging",
    data: { days: 2 },
    nextId: "node-7",
  },
  {
    id: "node-7",
    type: "action",
    title: "Action: Send Automated Case Study Email",
    description: "Send educational industry benchmark report",
    data: { template: "benchmark_report" },
  },
];

export function AutomationBuilderClient({ initialAutomations }: { initialAutomations: any[] }) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(defaultNodes);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(nodes[0]);
  const [isActive, setIsActive] = useState(true);
  const [activeTab, setActiveTab] = useState<"builder" | "executions">("builder");

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "trigger":
        return <Zap className="h-4 w-4 text-amber-500" />;
      case "condition":
        return <GitBranch className="h-4 w-4 text-purple-400" />;
      case "aiAction":
        return <Sparkles className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" />;
      case "delay":
        return <Clock className="h-4 w-4 text-blue-400" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    }
  };

  const handleAddNode = (type: "trigger" | "condition" | "action" | "aiAction" | "delay") => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      title: `${type.toUpperCase()}: New Automation Step`,
      description: "Custom workflow step configured by user",
      data: {},
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
            <Layers className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
            Visual Workflow Automation Builder
          </h1>
          <p className="text-xs text-slate-300 light:text-[#4a5053] mt-0.5">
            Orchestrate instant routing, AI-generated touchpoints, and cadence enrollments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 light:text-[#787e82]">Workflow Status:</span>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-500 light:text-emerald-600 border-emerald-500/30"
                  : "bg-[#252a2b] light:bg-[#e2e8f0] text-slate-400 light:text-[#787e82] border-white/10 light:border-black/10"
              }`}
            >
              {isActive ? "● ACTIVE" : "○ PAUSED"}
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab(activeTab === "builder" ? "executions" : "builder")}
            className="text-xs"
          >
            {activeTab === "builder" ? "View Run Logs (47)" : "Back to Canvas"}
          </Button>
        </div>
      </div>

      {activeTab === "builder" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Canvas Area */}
          <div className="lg:col-span-8 rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 sm:p-8 shadow-sm relative overflow-hidden min-h-[600px] flex flex-col items-center">
            {/* Toolbar */}
            <div className="w-full flex items-center justify-between pb-4 mb-6 border-b border-white/10 light:border-black/10 text-xs">
              <span className="font-bold text-white light:text-[#121212]">Hot Lead Routing Workflow</span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode("action")}
                  className="text-[11px] h-7 px-2.5"
                >
                  + Add Action
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode("aiAction")}
                  className="text-[11px] h-7 px-2.5 border-[#38b6ff]/30 text-[#38b6ff] light:text-[#0284c7]"
                >
                  <Sparkles className="h-3 w-3 mr-1" /> + AI Action
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode("delay")}
                  className="text-[11px] h-7 px-2.5"
                >
                  + Delay
                </Button>
              </div>
            </div>

            {/* Nodes Stack */}
            <div className="w-full max-w-md space-y-4 relative">
              {nodes.map((n, i) => (
                <React.Fragment key={n.id}>
                  <div
                    onClick={() => setSelectedNode(n)}
                    className={`rounded-2xl border p-4 cursor-pointer transition-all duration-150 relative shadow-sm ${
                      selectedNode?.id === n.id
                        ? "bg-[#252a2b] light:bg-[#f0f2f3] border-[#38b6ff] light:border-[#0284c7] ring-2 ring-[#38b6ff]/20"
                        : "bg-[#252a2b] light:bg-[#ffffff] border-white/10 light:border-black/10 hover:border-[#38b6ff]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-xl bg-[#1e2224] light:bg-[#f0f2f3] border border-white/10 light:border-black/10">
                          {getNodeIcon(n.type)}
                        </div>
                        <span className="text-xs font-bold text-white light:text-[#121212]">{n.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 light:text-[#787e82] uppercase font-semibold">
                        {n.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 light:text-[#4a5053] mt-2 leading-relaxed">
                      {n.description}
                    </p>
                  </div>

                  {i < nodes.length - 1 && (
                    <div className="flex justify-center -my-1">
                      <ArrowDown className="h-4 w-4 text-[#38b6ff]/70 light:text-[#0284c7]/70" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Node Inspector Side Panel */}
          <div className="lg:col-span-4 rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 light:border-black/10">
              <h3 className="text-sm font-bold text-white light:text-[#121212] flex items-center gap-2">
                <Settings className="h-4 w-4 text-[#38b6ff] light:text-[#0284c7]" />
                Node Inspector
              </h3>
              {selectedNode && (
                <span className="text-[10px] font-mono text-[#38b6ff] light:text-[#0284c7] bg-[#38b6ff]/10 px-2.5 py-0.5 rounded-full border border-[#38b6ff]/20 font-semibold">
                  {selectedNode.type}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-4 text-xs">
                <Input
                  label="Node Title"
                  value={selectedNode.title}
                  onChange={(e) =>
                    setSelectedNode({ ...selectedNode, title: e.target.value })
                  }
                />

                <div className="space-y-1.5">
                  <label className="block text-white light:text-[#121212] font-semibold">Description</label>
                  <textarea
                    rows={3}
                    value={selectedNode.description}
                    onChange={(e) =>
                      setSelectedNode({ ...selectedNode, description: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 light:border-black/10 bg-[#252a2b] light:bg-[#f0f2f3] p-3 text-white light:text-[#121212] text-xs focus:border-[#38b6ff] focus:outline-none"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#252a2b] light:bg-[#f0f2f3] border border-white/10 light:border-black/10 space-y-2">
                  <span className="font-bold text-white light:text-[#121212]">Execution Parameters</span>
                  <div className="font-mono text-[11px] text-slate-300 light:text-[#4a5053]">
                    {JSON.stringify(selectedNode.data, null, 2)}
                  </div>
                </div>

                <Button
                  variant="pill"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => alert("Node parameters updated successfully!")}
                >
                  Save Node Configuration
                </Button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 light:text-[#787e82] text-center py-12">
                Click any node on the canvas to inspect its configuration.
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Execution Runs Log */
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white light:text-[#121212]">Recent Automation Executions</h3>
          <div className="divide-y divide-white/10 light:divide-black/10 text-xs">
            {[
              { lead: "Sarah Chen (Acme Tech)", trigger: "Score 91 reached", time: "10m ago", status: "SUCCESS" },
              { lead: "Marcus Vance (ApexCloud)", trigger: "Demo page visited", time: "42m ago", status: "SUCCESS" },
              { lead: "Victor Stone (SecurityZero)", trigger: "API specs evaluated", time: "1h ago", status: "SUCCESS" },
              { lead: "Kieran O'Connor (HyperScale)", trigger: "Score 89 reached", time: "3h ago", status: "SUCCESS" },
            ].map((run, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white light:text-[#121212]">{run.lead}</div>
                  <div className="text-[11px] text-slate-400 light:text-[#787e82]">{run.trigger}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-emerald-500 font-bold text-[10px]">
                    ✔ {run.status}
                  </span>
                  <div className="text-[10px] text-slate-400 light:text-[#787e82]">{run.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
