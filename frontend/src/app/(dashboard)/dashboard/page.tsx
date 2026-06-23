"use client";

import { motion } from "framer-motion";
import {
  FileText, Brain, Mic, Target, TrendingUp,
  Zap, ArrowRight, CheckCircle2, Clock, Flame
} from "lucide-react";
import Link from "next/link";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { useAuthStore } from "@/store/useAuthStore";
import { scoreToColor, scoreToGradient } from "@/lib/utils";

const QUICK_ACTIONS = [
  { href: "/resume", icon: FileText, label: "Analyze Resume", color: "text-blue-400", bg: "bg-blue-500/10" },
  { href: "/mentor", icon: Brain, label: "Ask Mentor", color: "text-violet-400", bg: "bg-violet-500/10" },
  { href: "/interview", icon: Mic, label: "Mock Interview", color: "text-orange-400", bg: "bg-orange-500/10" },
  { href: "/learning", icon: Target, label: "View Roadmap", color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

const RADAR_DATA = [
  { skill: "DSA", current: 65, target: 90 },
  { skill: "System Design", current: 40, target: 85 },
  { skill: "ML/AI", current: 72, target: 80 },
  { skill: "Backend", current: 80, target: 90 },
  { skill: "Frontend", current: 60, target: 75 },
  { skill: "DevOps", current: 35, target: 70 },
];

const PROGRESS_DATA = [
  { week: "Wk 1", skills: 4, hours: 8, interviews: 1 },
  { week: "Wk 2", skills: 7, hours: 12, interviews: 2 },
  { week: "Wk 3", skills: 6, hours: 10, interviews: 1 },
  { week: "Wk 4", skills: 11, hours: 16, interviews: 3 },
  { week: "Wk 5", skills: 9, hours: 14, interviews: 2 },
  { week: "Wk 6", skills: 15, hours: 20, interviews: 4 },
];

const RECENT_ACTIVITY = [
  { icon: FileText, text: "Resume analyzed — ATS score: 87%", time: "2h ago", color: "text-blue-400" },
  { icon: Mic, text: "Mock interview: System Design — Score: 74/100", time: "1d ago", color: "text-orange-400" },
  { icon: CheckCircle2, text: "Completed: Docker Fundamentals", time: "2d ago", color: "text-emerald-400" },
  { icon: Brain, text: "AI Mentor session — Resume Review", time: "3d ago", color: "text-violet-400" },
];

const STATS = [
  { label: "Resume Score", value: 87, unit: "%", icon: FileText, trend: "+12", color: "blue" },
  { label: "Interview Score", value: 74, unit: "/100", icon: Mic, trend: "+8", color: "orange" },
  { label: "Skills Matched", value: 68, unit: "%", icon: Target, trend: "+5%", color: "violet" },
  { label: "Study Streak", value: 14, unit: " days", icon: Flame, trend: "🔥", color: "rose" },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting}, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Target Role: <span className="text-forge-400">{user?.targetRole || "Set a target role →"}</span>
          </p>
        </div>
        <Link
          href="/resume"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-forge-500/10 border border-forge-500/20 text-forge-400 text-sm font-medium hover:bg-forge-500/20 transition-colors"
        >
          <Zap className="w-4 h-4" />
          Quick Analyze
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/40">{stat.label}</span>
                <Icon className="w-4 h-4 text-white/20" />
              </div>
              <div className="flex items-end gap-1.5">
                <span className={`text-3xl font-bold ${scoreToColor(stat.value)}`}>
                  {stat.value}
                </span>
                <span className="text-sm text-white/40 mb-0.5">{stat.unit}</span>
              </div>
              <div className="mt-2 text-xs text-emerald-400">{stat.trend} this week</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Radar Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white text-sm">Skill Coverage</h2>
            <span className="badge-forge">vs Target Role</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke="rgba(97,114,243,0.3)"
                fill="rgba(97,114,243,0.08)"
                strokeWidth={1.5}
              />
              <Radar
                name="Current"
                dataKey="current"
                stroke="#6172f3"
                fill="rgba(97,114,243,0.2)"
                strokeWidth={2}
                dot={{ fill: "#6172f3", strokeWidth: 0 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white text-sm">Weekly Progress</h2>
            <span className="badge-success">6-week view</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={PROGRESS_DATA}>
              <defs>
                <linearGradient id="skillsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6172f3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6172f3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} width={25} />
              <Tooltip
                contentStyle={{ background: "#0f1322", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: "rgba(255,255,255,0.7)" }}
                labelStyle={{ color: "white" }}
              />
              <Area type="monotone" dataKey="skills" stroke="#6172f3" strokeWidth={2} fill="url(#skillsGrad)" name="Skills Learned" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white text-sm mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer text-center">
                    <div className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${action.color}`} />
                    </div>
                    <span className="text-xs text-white/60">{action.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white text-sm">Recent Activity</h2>
            <Link href="/analytics" className="text-xs text-forge-400 hover:text-forge-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 truncate">{item.text}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/30 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
