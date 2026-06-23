"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, CheckCheck, Trash2, Filter,
  Sparkles, Trophy, AlertCircle, BookOpen,
  Briefcase, Mic, Target, Brain, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

type NotifType = "achievement" | "alert" | "info" | "interview" | "job" | "mentor";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "achievement",
    title: "Resume Score Improved!",
    message: "Your resume score jumped from 72% to 87% after the latest AI analysis. You're in the top 15% of applicants for SWE roles.",
    time: new Date(Date.now() - 1000 * 60 * 10),
    read: false,
  },
  {
    id: "2",
    type: "job",
    title: "5 New Job Matches",
    message: "We found 5 new jobs matching your profile: 3 at FAANG companies and 2 at top startups. Best match: 94% at Google.",
    time: new Date(Date.now() - 1000 * 60 * 45),
    read: false,
  },
  {
    id: "3",
    type: "interview",
    title: "Interview Practice Reminder",
    message: "You haven't practiced system design in 3 days. Your interview is in 2 weeks — keep the streak going!",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: "4",
    type: "mentor",
    title: "AI Mentor Insight",
    message: "Based on your recent activity, focusing on Dynamic Programming this week could increase your DSA score by ~18%.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
  },
  {
    id: "5",
    type: "info",
    title: "Learning Roadmap Updated",
    message: "Week 3 of your Backend Engineer roadmap is ready. New resources added: System Design Primer + 12 LeetCode problems.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
  {
    id: "6",
    type: "achievement",
    title: "7-Day Streak! 🔥",
    message: "You've practiced on CareerForge for 7 days in a row. Keep going — consistency is the #1 predictor of interview success.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    read: true,
  },
  {
    id: "7",
    type: "alert",
    title: "Skill Gap Detected",
    message: "Kubernetes is required in 68% of DevOps roles you're targeting but absent from your resume. Consider adding it.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    read: true,
  },
  {
    id: "8",
    type: "job",
    title: "Application Deadline Soon",
    message: "Stripe's Backend Engineer role closes in 48 hours. Your match score is 89% — don't miss this one.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    read: true,
  },
];

const TYPE_CONFIG: Record<NotifType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  achievement: { icon: Trophy,      color: "text-amber-400",   bg: "bg-amber-500/15",  label: "Achievement" },
  alert:       { icon: AlertCircle, color: "text-red-400",     bg: "bg-red-500/15",    label: "Alert" },
  info:        { icon: BookOpen,    color: "text-blue-400",    bg: "bg-blue-500/15",   label: "Info" },
  interview:   { icon: Mic,         color: "text-violet-400",  bg: "bg-violet-500/15", label: "Interview" },
  job:         { icon: Briefcase,   color: "text-emerald-400", bg: "bg-emerald-500/15",label: "Jobs" },
  mentor:      { icon: Brain,       color: "text-forge-400",   bg: "bg-forge-500/15",  label: "Mentor" },
};

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const FILTERS = ["All", "Unread", "Achievement", "Jobs", "Interview", "Mentor", "Alert"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("All");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    return TYPE_CONFIG[n.type].label === filter;
  });

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const deleteOne = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const clearAll = () => setNotifications([]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-forge-400" />
            Notifications
            {unreadCount > 0 && (
              <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-forge-500/20 text-forge-300 border border-forge-500/30">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Stay on top of your career progress</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-white/10 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              filter === f
                ? "bg-forge-500/20 text-forge-300 border border-forge-500/30"
                : "text-white/40 hover:text-white/70 border border-white/5 hover:border-white/10"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No notifications here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif, i) => {
            const cfg = TYPE_CONFIG[notif.type];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "group relative flex gap-4 p-4 rounded-xl border transition-all",
                  notif.read
                    ? "bg-white/2 border-white/5 hover:bg-white/4"
                    : "bg-forge-500/5 border-forge-500/20 hover:bg-forge-500/8"
                )}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-forge-400" />
                )}

                {/* Icon */}
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", cfg.bg)}>
                  <Icon className={cn("w-4 h-4", cfg.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-16">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-[10px] font-semibold uppercase tracking-wider", cfg.color)}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-white/30">{timeAgo(notif.time)}</span>
                  </div>
                  <p className="text-sm font-medium text-white mb-1">{notif.title}</p>
                  <p className="text-xs text-white/50 leading-relaxed">{notif.message}</p>
                </div>

                {/* Actions */}
                <div className="absolute right-3 bottom-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.read && (
                    <button
                      onClick={() => markRead(notif.id)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-forge-400 hover:bg-forge-500/10 transition-all"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteOne(notif.id)}
                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
