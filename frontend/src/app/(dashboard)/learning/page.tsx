"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Target, ChevronRight, CheckCircle2, Circle,
  Lock, Flame, Clock, TrendingUp, Zap, ExternalLink, Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JOB_ROLES } from "@/lib/utils";

const WEEKS = [
  {
    week: 1,
    theme: "Python & ML Foundations",
    isCompleted: true,
    goals: ["NumPy & Pandas mastery", "Scikit-learn basics", "Statistical foundations"],
    resources: [
      { title: "Fast.ai Practical Deep Learning", type: "course", isFree: true, duration: "20h" },
      { title: "Python for Data Analysis (O'Reilly)", type: "book", isFree: false, duration: "15h" },
    ],
    hours: 18,
  },
  {
    week: 2,
    theme: "Neural Networks & Deep Learning",
    isCompleted: true,
    goals: ["Feedforward networks", "Backpropagation", "PyTorch basics"],
    resources: [
      { title: "Deep Learning Specialization (Andrew Ng)", type: "course", isFree: false, duration: "30h" },
      { title: "The Annotated Transformer", type: "article", isFree: true, duration: "4h" },
    ],
    hours: 24,
  },
  {
    week: 3,
    theme: "MLOps & Model Deployment",
    isCompleted: false,
    isActive: true,
    goals: ["Docker for ML", "FastAPI model serving", "CI/CD pipelines for ML"],
    resources: [
      { title: "Full Stack Deep Learning", type: "course", isFree: true, duration: "12h" },
      { title: "MLOps Specialization (Coursera)", type: "course", isFree: false, duration: "20h" },
    ],
    hours: 20,
  },
  {
    week: 4,
    theme: "Cloud Platforms & Scale",
    isCompleted: false,
    goals: ["AWS SageMaker", "GCP Vertex AI", "Distributed training"],
    resources: [
      { title: "AWS Machine Learning Specialty", type: "course", isFree: false, duration: "40h" },
    ],
    hours: 22,
  },
  {
    week: 5,
    theme: "System Design for ML",
    isCompleted: false,
    goals: ["Feature stores", "Online/offline serving", "A/B testing ML models"],
    resources: [
      { title: "Designing Machine Learning Systems", type: "book", isFree: false, duration: "10h" },
    ],
    hours: 16,
  },
  {
    week: 6,
    theme: "Capstone Project",
    isCompleted: false,
    goals: ["End-to-end ML project", "Deploy to production", "Write case study"],
    resources: [],
    hours: 30,
  },
];

const RESOURCE_COLORS: Record<string, string> = {
  course: "badge-forge",
  book: "badge-success",
  article: "badge-warning",
  video: "badge-danger",
};

export default function LearningHubPage() {
  const [selectedRole, setSelectedRole] = useState("Machine Learning Engineer");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(3);
  const completedWeeks = WEEKS.filter((w) => w.isCompleted).length;
  const totalHours = WEEKS.reduce((sum, w) => sum + w.hours, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Learning Hub</h1>
          <p className="text-white/50 text-sm mt-1">AI-generated roadmap · Adapts to your progress</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm outline-none focus:border-forge-500/30 transition-colors"
          >
            {JOB_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Weeks Complete", value: `${completedWeeks}/${WEEKS.length}`, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Total Hours", value: `${totalHours}h`, icon: Clock, color: "text-blue-400" },
          { label: "Current Streak", value: "14 days", icon: Flame, color: "text-orange-400" },
          { label: "Readiness", value: "68%", icon: TrendingUp, color: "text-violet-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40">{s.label}</span>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Roadmap Progress</h2>
          <span className="text-xs text-white/40">{Math.round((completedWeeks / WEEKS.length) * 100)}% complete</span>
        </div>
        <div className="flex gap-1.5">
          {WEEKS.map((w) => (
            <div
              key={w.week}
              className={cn(
                "flex-1 h-2 rounded-full transition-all",
                w.isCompleted ? "bg-forge-500" : (w as any).isActive ? "bg-forge-500/40" : "bg-white/5"
              )}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-white/30">
          <span>Wk 1</span><span>Wk {WEEKS.length}</span>
        </div>
      </div>

      {/* Weeks */}
      <div className="space-y-3">
        {WEEKS.map((week) => {
          const isExpanded = expandedWeek === week.week;
          const isLocked = !week.isCompleted && !(week as any).isActive && week.week > 3;

          return (
            <motion.div
              key={week.week}
              className={cn(
                "glass-card overflow-hidden transition-all",
                (week as any).isActive && "border-forge-500/30"
              )}
            >
              <button
                onClick={() => setExpandedWeek(isExpanded ? null : week.week)}
                disabled={isLocked}
                className={cn("w-full p-5 flex items-center gap-4 text-left", isLocked && "opacity-40 cursor-not-allowed")}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  week.isCompleted ? "bg-emerald-500/15" : (week as any).isActive ? "bg-forge-500/15" : "bg-white/5"
                )}>
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-white/30" />
                  ) : week.isCompleted ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                  ) : (
                    <BookOpen className={`w-4.5 h-4.5 ${(week as any).isActive ? "text-forge-400" : "text-white/40"}`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white/30">Week {week.week}</span>
                    {(week as any).isActive && <span className="badge-forge text-[10px]">In Progress</span>}
                    {week.isCompleted && <span className="badge-success text-[10px]">Complete</span>}
                  </div>
                  <div className="text-sm font-medium text-white mt-0.5">{week.theme}</div>
                </div>

                <div className="flex items-center gap-3 text-xs text-white/30 flex-shrink-0">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{week.hours}h</span>
                  <ChevronRight className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-90")} />
                </div>
              </button>

              {isExpanded && !isLocked && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5"
                >
                  <div className="p-5 grid md:grid-cols-2 gap-5">
                    <div>
                      <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Learning Goals</h4>
                      <div className="space-y-2">
                        {week.goals.map((g) => (
                          <div key={g} className="flex items-start gap-2 text-sm text-white/70">
                            <Target className="w-3.5 h-3.5 text-forge-400 mt-0.5 flex-shrink-0" />
                            {g}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Resources</h4>
                      <div className="space-y-2.5">
                        {week.resources.map((r) => (
                          <div key={r.title} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white/80 truncate group-hover:text-white transition-colors">{r.title}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={RESOURCE_COLORS[r.type] + " text-[10px]"}>{r.type}</span>
                                <span className="text-[10px] text-white/30">{r.duration}</span>
                                {r.isFree && <span className="text-[10px] text-emerald-400">Free</span>}
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {(week as any).isActive && (
                    <div className="px-5 pb-5">
                      <button className="w-full py-2.5 rounded-xl bg-forge-500/15 border border-forge-500/20 text-forge-400 text-sm font-medium hover:bg-forge-500/20 transition-colors flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4" /> Mark Week as Complete
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
