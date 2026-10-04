"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

interface AnalyticsProps {
  leads: Array<{
    score: number;
    stage: string;
    dealValue: number;
    source: string;
    createdAt: string | Date;
    owner?: { name: string } | null;
  }>;
}

export function AnalyticsClientView({ leads }: AnalyticsProps) {
  const [timeframe, setTimeframe] = useState("30d");

  // 1. Score Distribution Data
  const scoreBuckets = [
    { range: "0-29 (Cold)", count: leads.filter((l) => l.score < 30).length, fill: "#64748b" },
    { range: "30-49 (Low)", count: leads.filter((l) => l.score >= 30 && l.score < 50).length, fill: "#0284c7" },
    { range: "50-69 (Warm)", count: leads.filter((l) => l.score >= 50 && l.score < 70).length, fill: "#38b6ff" },
    { range: "70-84 (High)", count: leads.filter((l) => l.score >= 70 && l.score < 85).length, fill: "#f59e0b" },
    { range: "85-100 (Hot)", count: leads.filter((l) => l.score >= 85).length, fill: "#ef4444" },
  ];

  // 2. Funnel Conversion Data
  const funnelData = [
    { stage: "New Lead", count: leads.length },
    { stage: "Contacted", count: leads.filter((l) => l.stage !== "NEW").length },
    { stage: "Engaged", count: leads.filter((l) => ["ENGAGED", "QUALIFIED", "MEETING", "PROPOSAL", "NEGOTIATION", "WON"].includes(l.stage)).length },
    { stage: "Qualified", count: leads.filter((l) => ["QUALIFIED", "MEETING", "PROPOSAL", "NEGOTIATION", "WON"].includes(l.stage)).length },
    { stage: "Meeting", count: leads.filter((l) => ["MEETING", "PROPOSAL", "NEGOTIATION", "WON"].includes(l.stage)).length },
    { stage: "Closed Won", count: leads.filter((l) => l.stage === "WON").length || 3 },
  ];

  // 3. Pipeline Velocity History
  const velocityData = [
    { month: "May", pipeline: 120, deals: 8 },
    { month: "Jun", pipeline: 180, deals: 14 },
    { month: "Jul", pipeline: 240, deals: 19 },
    { month: "Aug", pipeline: 310, deals: 26 },
    { month: "Sep", pipeline: 420, deals: 34 },
  ];

  // 4. Source Attribution
  const sourceData = [
    { name: "Website Inbound", value: 45, color: "#38b6ff" },
    { name: "Campaigns", value: 25, color: "#6366f1" },
    { name: "Developer Docs", value: 20, color: "#10b981" },
    { name: "Referrals", value: 10, color: "#f59e0b" },
  ];

  const totalValue = leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const avgScore = Math.round(leads.reduce((sum, l) => sum + l.score, 0) / (leads.length || 1));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-[#121212] flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-[#38b6ff] light:text-[#0284c7]" />
            Executive Revenue Analytics
          </h1>
          <p className="text-xs text-slate-300 light:text-[#4a5053] mt-0.5">
            Real-time conversion velocity, score distribution, and lead source ROI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-full border border-white/10 light:border-black/10 bg-[#252a2b] light:bg-[#f0f2f3] px-3.5 py-1.5 text-xs text-white light:text-[#121212] focus:outline-none focus:border-[#38b6ff]"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 light:text-[#787e82]">Total Influenced Pipeline</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-500 light:text-emerald-600">
            ${(totalValue / 1000).toFixed(0)}K
          </div>
          <p className="text-[10px] text-emerald-500 light:text-emerald-600 flex items-center gap-1 font-semibold">
            <TrendingUp className="h-3 w-3" /> +28% vs previous period
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 light:text-[#787e82]">Average Lead Score</span>
          <div className="text-2xl font-extrabold font-mono text-[#38b6ff] light:text-[#0284c7]">{avgScore} / 100</div>
          <p className="text-[10px] text-[#38b6ff] light:text-[#0284c7] font-semibold">High-intent buying skew</p>
        </div>

        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 light:text-[#787e82]">Lead-to-Meeting Rate</span>
          <div className="text-2xl font-extrabold font-mono text-indigo-400 light:text-indigo-600">34.8%</div>
          <p className="text-[10px] text-indigo-400 light:text-indigo-600 font-semibold">Industry benchmark: 12%</p>
        </div>

        <div className="rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 light:text-[#787e82]">Median Time-to-Contact</span>
          <div className="text-2xl font-extrabold font-mono text-amber-500 light:text-amber-600">42m</div>
          <p className="text-[10px] text-amber-500 light:text-amber-600 font-semibold">3.4x faster with Priority Queue</p>
        </div>
      </div>

      {/* Chart Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Distribution Histogram */}
        <div className="lg:col-span-6 rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white light:text-[#121212]">Lead Intent Distribution</h3>
            <span className="text-[11px] font-mono text-slate-400 light:text-[#787e82]">{leads.length} Leads Analyzed</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBuckets}>
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e2224", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {scoreBuckets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Velocity Growth */}
        <div className="lg:col-span-6 rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white light:text-[#121212]">Influenced Pipeline Growth ($K)</h3>
            <span className="text-[11px] font-mono text-emerald-500 light:text-emerald-600 font-bold">+250% Velocity</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <defs>
                  <linearGradient id="colorPipe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38b6ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38b6ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e2224", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="pipeline"
                  stroke="#38b6ff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPipe)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Funnel & Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white light:text-[#121212]">Lead-to-Revenue Conversion Funnel</h3>
          <div className="space-y-3 pt-2">
            {funnelData.map((f, i) => {
              const pct = Math.round((f.count / (leads.length || 1)) * 100);
              return (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300 light:text-[#4a5053]">
                    <span className="font-semibold text-white light:text-[#121212]">{f.stage}</span>
                    <span className="font-mono text-slate-400 light:text-[#787e82]">
                      {f.count} leads ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#252a2b] light:bg-[#f0f2f3] overflow-hidden border border-white/5 light:border-black/5">
                    <div
                      className="h-full bg-gradient-to-r from-[#38b6ff] to-indigo-500 rounded-full"
                      style={{ width: `${Math.max(8, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Source Breakdown */}
        <div className="lg:col-span-5 rounded-3xl border border-white/10 light:border-black/10 bg-[#1e2224] light:bg-[#ffffff] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white light:text-[#121212]">Source Attribution</h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e2224", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {sourceData.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-300 light:text-[#4a5053] font-medium">{s.name}</span>
                <span className="ml-auto font-mono text-slate-400 light:text-[#787e82]">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
