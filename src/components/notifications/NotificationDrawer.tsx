"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Check, Flame, AlertCircle, X, Sparkles, Clock } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  time: string;
  link?: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "🔥 Sarah Chen reached Hot Intent (Score: 91)",
    message: "Acme Technologies has 3 active stakeholders viewing enterprise docs.",
    type: "LEAD_HOT",
    read: false,
    time: "10m ago",
    link: "/app/leads",
  },
  {
    id: "notif-2",
    title: "⚡ Marcus Vance booked Architecture Review",
    message: "ApexCloud Platforms requested a calendar slot for tomorrow at 2 PM.",
    type: "ALERT",
    read: false,
    time: "42m ago",
    link: "/app/leads",
  },
  {
    id: "notif-3",
    title: "📩 Follow-up due today: PeakFlow Systems",
    message: "Tobias Meyer opened Sequence Email #2 twice this morning.",
    type: "ALERT",
    read: true,
    time: "2h ago",
    link: "/app/leads",
  },
  {
    id: "notif-4",
    title: "✨ Cadence auto-stopped: Lumina Health",
    message: "Dr. Rachel Adams replied to email #1. Outbound cadence halted.",
    type: "CADENCE",
    read: true,
    time: "5h ago",
    link: "/app/sequences",
  },
];

export function NotificationDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<NotificationItem[]>(mockNotifications);

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const markItemRead = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[380px] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 animate-slideInRight">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Notifications</h3>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {items.filter((i) => !i.read).length} new
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllRead}
            className="text-[11px] text-slate-400 hover:text-cyan-400 transition-colors px-2 py-1 rounded"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => markItemRead(item.id)}
            className={`p-4 transition-colors hover:bg-slate-900/80 ${
              !item.read ? "bg-cyan-950/20" : "bg-slate-950"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold text-white">{item.title}</span>
              {!item.read && (
                <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0 mt-1" />
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.message}</p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {item.time}
              </span>
              {item.link && (
                <Link
                  href={item.link}
                  onClick={onClose}
                  className="text-cyan-400 hover:underline font-medium"
                >
                  View lead →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
