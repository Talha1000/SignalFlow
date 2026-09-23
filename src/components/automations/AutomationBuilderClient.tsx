"use client";

import React, { useState } from "react";
import {
  Layers,
  Zap,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  GitBranch,
  ArrowDown,
  Settings,
  X,
  Mail,
  UserCheck,
  Bell,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

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
        return <Zap className="h-4 w-4 text-amber-400" />;
      case "condition":
        return <GitBranch className="h-4 w-4 text-purple-400" />;
      case "aiAction":
        return <Sparkles className="h-4 w-4 text-cyan-400" />;
      case "delay":
        return <Clock className="h-4 w-4 text-blue-400" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
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
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-cyan-400" />
            Visual Workflow Automation Builder
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Orchestrate instant routing, AI-generated touchpoints, and cadence enrollments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Workflow Status:</span>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border transition-all ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-slate-800 text-slate-400 border-slate-700"
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
          <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 relative overflow-hidden min-h-[600px] flex flex-col items-center">
            {/* Toolbar */}
            <div className="w-full flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs">
              <span className="font-semibold text-slate-300">Hot Lead Routing Workflow</span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode("action")}
                  className="text-[11px] h-7 px-2"
                >
                  + Add Action
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode("aiAction")}
                  className="text-[11px] h-7 px-2 border-cyan-500/30 text-cyan-300"
                >
                  <Sparkles className="h-3 w-3 mr-1" /> + AI Action
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddNode("delay")}
                  className="text-[11px] h-7 px-2"
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
                    className={`rounded-xl border p-4 cursor-pointer transition-all duration-150 relative shadow-sm ${
                      selectedNode?.id === n.id
                        ? "bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/20"
                        : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                          {getNodeIcon(n.type)}
                        </div>
                        <span className="text-xs font-bold text-white">{n.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {n.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      {n.description}
                    </p>
                  </div>

                  {i < nodes.length - 1 && (
                    <div className="flex justify-center -my-1">
                      <ArrowDown className="h-4 w-4 text-cyan-500/60" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Node Inspector Side Panel */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="h-4 w-4 text-cyan-400" />
                Node Inspector
              </h3>
              {selectedNode && (
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
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
                  <label className="block text-slate-300">Description</label>
                  <textarea
                    rows={3}
                    value={selectedNode.description}
                    onChange={(e) =>
                      setSelectedNode({ ...selectedNode, description: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-semibold text-slate-300">Execution Parameters</span>
                  <div className="font-mono text-[11px] text-slate-400">
                    {JSON.stringify(selectedNode.data, null, 2)}
                  </div>
                </div>

                <Button
                  variant="gradient"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => alert("Node parameters updated successfully!")}
                >
                  Save Node Configuration
                </Button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-12">
                Click any node on the canvas to inspect its configuration.
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Execution Runs Log */
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Recent Automation Executions</h3>
          <div className="divide-y divide-slate-800 text-xs">
            {[
              { lead: "Sarah Chen (Acme Tech)", trigger: "Score 91 reached", time: "10m ago", status: "SUCCESS" },
              { lead: "Marcus Vance (ApexCloud)", trigger: "Demo page visited", time: "42m ago", status: "SUCCESS" },
              { lead: "Victor Stone (SecurityZero)", trigger: "API specs evaluated", time: "1h ago", status: "SUCCESS" },
              { lead: "Kieran O'Connor (HyperScale)", trigger: "Score 89 reached", time: "3h ago", status: "SUCCESS" },
            ].map((run, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{run.lead}</div>
                  <div className="text-[11px] text-slate-400">{run.trigger}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-emerald-400 text-[10px] font-bold">
                    ✔ {run.status}
                  </span>
                  <div className="text-[10px] text-slate-500">{run.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
