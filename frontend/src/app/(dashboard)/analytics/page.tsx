"use client";

import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";
import { TrendingUp, FileText, Mic, Briefcase, Award, Target, ArrowUp, ArrowDown } from "lucide-react";
import { scoreToColor } from "@/lib/utils";

const WEEKLY = [
  { week: "Wk 1", skills: 4, hours: 8, interviews: 1 },
  { week: "Wk 2", skills: 7, hours: 12, interviews: 2 },
  { week: "Wk 3", skills: 6, hours: 10, interviews: 1 },
  { week: "Wk 4", skills: 11, hours: 16, interviews: 3 },
  { week: "Wk 5", skills: 9, hours: 14, interviews: 2 },
  { week: "Wk 6", skills: 15, hours: 20, interviews: 4 },
];

const INTERVIEW_HISTORY = [
  { date: "Jun 1", technical: 62, behavioral: 71 },
  { date: "Jun 5", technical: 68, behavioral: 74 },
  { date: "Jun 10", technical: 71, behavioral: 80 },
  { date: "Jun 15", technical: 74, behavioral: 82 },
  { date: "Jun 20", technical: 78, behavioral: 85 },
];

const FUNNEL = [
  { stage: "Bookmarked", count: 24, color: "#6172f3" },
  { stage: "Applied", count: 18, color: "#8b5cf6" },
  { stage: "Screening", count: 9, color: "#10b981" },
  { stage: "Interview", count: 5, color: "#f59e0b" },
  { stage: "Offer", count: 2, color: "#34d399" },
];

const SKILL_PROGRESS = [
  { skill: "Python", before: 60, after: 88 },
  { skill: "ML/AI", before: 45, after: 72 },
  { skill: "System Design", before: 30, after: 58 },
  { skill: "Docker", before: 10, after: 45 },
  { skill: "SQL", before: 70, after: 82 },
];

const METRICS = [
  { label: "Resume Score", value: 87, prev: 75, unit: "%", icon: FileText, color: "text-blue-400" },
  { label: "Avg Interview", value: 78, prev: 70, unit: "/100", icon: Mic, color: "text-orange-400" },
  { label: "Applications", value: 18, prev: 12, unit: " sent", icon: Briefcase, color: "text-violet-400" },
  { label: "Skills Gained", value: 52, prev: 38, unit: " total", icon: Award, color: "text-emerald-400" },
];

const TOOLTIP_STYLE = {
  contentStyle: { background: "#0f1322", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 },
  itemStyle: { color: "rgba(255,255,255,0.7)" },
  labelStyle: { color: "white" },
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-white/50 text-sm mt-1">Track every dimension of your career progress</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m, i) => {
          const Icon = m.icon;
          const delta = m.value - m.prev;
          const isUp = delta >= 0;
          return (
            <motion.div key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40">{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className={`text-3xl font-bold ${m.color}`}>{m.value}<span className="text-sm text-white/40 font-normal">{m.unit}</span></div>
              <div className={`mt-1.5 flex items-center gap-1 text-xs ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {isUp ? "+" : ""}{delta} from last month
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Weekly Activity */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={WEEKLY} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} width={25} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="skills" fill="#6172f3" radius={[4, 4, 0, 0]} name="Skills" />
              <Bar dataKey="interviews" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Interviews" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Interview Trend */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Interview Score Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={INTERVIEW_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} width={25} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="technical" stroke="#6172f3" strokeWidth={2} dot={{ fill: "#6172f3", strokeWidth: 0, r: 4 }} name="Technical" />
              <Line type="monotone" dataKey="behavioral" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", strokeWidth: 0, r: 4 }} name="Behavioral" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Skill Progress */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Skill Level Progress</h2>
          <div className="space-y-4">
            {SKILL_PROGRESS.map(({ skill, before, after }) => (
              <div key={skill}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-white/60">{skill}</span>
                  <span className={`font-medium ${scoreToColor(after)}`}>{before} → {after}</span>
                </div>
                <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="absolute h-full rounded-full bg-white/10" style={{ width: `${before}%` }} />
                  <motion.div
                    initial={{ width: `${before}%` }}
                    animate={{ width: `${after}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute h-full rounded-full bg-gradient-to-r from-forge-500 to-violet-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Funnel */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Application Funnel</h2>
          <div className="space-y-3">
            {FUNNEL.map((stage, i) => (
              <div key={stage.stage} className="flex items-center gap-3">
                <span className="text-xs text-white/40 w-20 flex-shrink-0">{stage.stage}</span>
                <div className="flex-1 h-7 bg-white/5 rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stage.count / FUNNEL[0].count) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-lg flex items-center justify-end pr-3"
                    style={{ background: stage.color + "33", border: `1px solid ${stage.color}44` }}
                  >
                    <span className="text-xs font-medium" style={{ color: stage.color }}>{stage.count}</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-xs text-white/30">
            Conversion rate: <span className="text-emerald-400">8.3%</span> (Bookmarked → Offer)
          </div>
        </div>
      </div>
    </div>
  );
}
