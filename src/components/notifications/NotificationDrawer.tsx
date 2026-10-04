"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, Flame, AlertCircle, X, Sparkles, Clock } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string | null;
  createdAt: string | Date;
}

function formatRelativeTime(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export function NotificationDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    fetch("/api/v1/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const fetched = data.data?.notifications || [];
        setItems(fetched);
      })
      .catch((err) => {
        console.warn("Failed to load notifications:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const markAllRead = async () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    try {
      await fetch("/api/v1/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
    } catch (err) {
      console.warn("Failed to mark all notifications read:", err);
    }
  };

  const markItemRead = async (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
    try {
      await fetch("/api/v1/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.warn("Failed to mark notification read:", err);
    }
  };

  if (!isOpen) return null;

  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[380px] bg-[#181b1c] light:bg-[#ffffff] text-white light:text-[#121212] border-l border-white/10 light:border-black/10 shadow-2xl flex flex-col animate-slideInRight">
      {/* Header */}
      <div className="p-4 border-b border-white/10 light:border-black/10 flex items-center justify-between bg-[#1e2224] light:bg-white">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#38b6ff] light:text-[#0284c7]" />
          <h3 className="text-sm font-bold text-white light:text-[#121212]">Notifications</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#38b6ff]/10 light:bg-[#0284c7]/10 text-[#38b6ff] light:text-[#0284c7] border border-[#38b6ff]/20">
            {unreadCount} new
          </span>
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[11px] text-slate-400 light:text-[#787e82] hover:text-[#38b6ff] light:hover:text-[#0284c7] transition-colors px-2 py-1 rounded"
            >
              Mark all read
            </button>
          )}
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
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading notifications...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Bell className="h-8 w-8 mx-auto text-slate-500 opacity-60" />
            <h4 className="text-xs font-semibold text-slate-300 light:text-[#4a5053]">No notifications yet</h4>
            <p className="text-[11px] text-slate-500 light:text-[#787e82] leading-relaxed">
              Real-time alerts will appear here when accounts reach hot buying thresholds or when high-intent signals are ingested.
            </p>
          </div>
        ) : (
          items.map((item) => (
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
                  <Clock className="h-3 w-3" /> {formatRelativeTime(item.createdAt)}
                </span>
                {item.link && (
                  <Link
                    href={item.link}
                    onClick={onClose}
                    className="text-[#38b6ff] light:text-[#0284c7] hover:underline font-medium"
                  >
                    View details →
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
