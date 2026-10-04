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
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[380px] bg-[#181b1c] light:bg-[#ffffff] text-white light:text-[#121212] border-l border-white/10 light:border-black/10 shadow-2xl flex flex-col animate-slideInRight">
      {/* Header */}
      <div className="p-4 border-b border-white/10 light:border-black/10 flex items-center justify-between bg-[#1e2224] light:bg-white">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#38b6ff] light:text-[#0284c7]" />
          <h3 className="text-sm font-bold text-white light:text-[#121212]">Notifications</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#38b6ff]/10 light:bg-[#0284c7]/10 text-[#38b6ff] light:text-[#0284c7] border border-[#38b6ff]/20">
            {items.filter((i) => !i.read).length} new
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllRead}
            className="text-[11px] text-slate-400 light:text-[#787e82] hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors px-2 py-1 rounded"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 light:text-[#787e82] hover:text-white light:hover:text-[#121212] hover:bg-[#252a2b] light:hover:bg-[#f0f2f3]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/10 light:divide-black/10">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => markItemRead(item.id)}
            className={`p-4 transition-colors hover:bg-[#252a2b]/60 light:hover:bg-[#f0f2f3] cursor-pointer ${
              !item.read ? "bg-[#38b6ff]/5 light:bg-[#0284c7]/5" : "bg-transparent"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold text-white light:text-[#121212]">{item.title}</span>
              {!item.read && (
                <span className="h-2 w-2 rounded-full bg-[#38b6ff] light:bg-[#0284c7] shrink-0 mt-1" />
              )}
            </div>
            <p className="text-xs text-slate-400 light:text-[#787e82] mt-1 leading-relaxed">{item.message}</p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 light:text-[#787e82]">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {item.time}
              </span>
              {item.link && (
                <Link
                  href={item.link}
                  onClick={onClose}
                  className="text-[#38b6ff] light:text-[#0284c7] hover:underline font-medium"
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
