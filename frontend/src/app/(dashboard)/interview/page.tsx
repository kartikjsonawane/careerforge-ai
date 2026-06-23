"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, Code, Users, Cpu, Play, ChevronRight, Clock, Star,
  CheckCircle, XCircle, AlertCircle, BarChart3, ArrowLeft,
  Send, Lightbulb, MessageSquare
} from "lucide-react";
import { cn, scoreToColor, scoreToGradient } from "@/lib/utils";

type InterviewType = "technical" | "behavioral" | "system-design";
type Stage = "config" | "active" | "report";

const INTERVIEW_TYPES = [
  {
    id: "technical" as const,
    icon: Code,
    label: "Technical",
    description: "DSA, algorithms, coding problems",
    color: "from-blue-500 to-indigo-500",
    duration: "45 min",
  },
  {
    id: "behavioral" as const,
    icon: Users,
    label: "Behavioral",
    description: "STAR method, soft skills, culture fit",
    color: "from-violet-500 to-purple-500",
    duration: "30 min",
  },
  {
    id: "system-design" as const,
    icon: Cpu,
    label: "System Design",
    description: "Architecture, scalability, trade-offs",
    color: "from-emerald-500 to-teal-500",
    duration: "60 min",
  },
];

const ROLES = ["Software Engineer", "ML Engineer", "Data Scientist", "Backend Engineer", "Full Stack Dev"];
const DIFFICULTIES = ["Junior (0-2 yrs)", "Mid-level (2-5 yrs)", "Senior (5+ yrs)"];

const MOCK_QUESTIONS = [
  "Design a URL shortener like bit.ly that handles 100M requests/day. Walk me through your architecture.",
  "How would you handle hot partitions in your design?",
  "What's your caching strategy, and what are the trade-offs?",
];

const MOCK_REPORT = {
  overall: 74,
  technical: 78,
  communication: 82,
  problemSolving: 68,
  systemDesign: 74,
  strengths: ["Clear problem decomposition", "Good communication of trade-offs", "Asked clarifying questions"],
  improvements: ["Dive deeper into data modeling", "Quantify capacity estimates", "Discuss monitoring and observability"],
  questionScores: [{ q: "System Design", score: 74 }, { q: "Hot Partitions", score: 68 }, { q: "Caching", score: 80 }],
};

export default function InterviewArenaPage() {
  const [stage, setStage] = useState<Stage>("config");
  const [selectedType, setSelectedType] = useState<InterviewType>("technical");
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedDiff, setSelectedDiff] = useState(DIFFICULTIES[0]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);

  const startInterview = () => {
    setStage("active");
    setCurrentQ(0);
    setAnswer("");
  };

  const submitAnswer = () => {
    if (currentQ < MOCK_QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
      setAnswer("");
      setShowHint(false);
    } else {
      setStage("report");
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mock Interview Arena</h1>
          <p className="text-white/50 text-sm mt-1">Technical · Behavioral · System Design — with AI scoring</p>
        </div>
        {stage !== "config" && (
          <button onClick={() => setStage("config")} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Config */}
        {stage === "config" && (
          <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
            {/* Interview Type */}
            <div className="glass-card p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Interview Type</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {INTERVIEW_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        "relative p-5 rounded-xl border text-left transition-all",
                        selectedType === type.id
                          ? "border-forge-500/40 bg-forge-500/10"
                          : "border-white/5 hover:border-white/10 bg-white/2"
                      )}
                    >
                      {selectedType === type.id && (
                        <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-forge-500 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="font-semibold text-white text-sm">{type.label}</div>
                      <div className="text-xs text-white/40 mt-1">{type.description}</div>
                      <div className="text-xs text-white/30 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {type.duration}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role & Difficulty */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="glass-card p-5">
                <h2 className="text-sm font-semibold text-white mb-3">Target Role</h2>
                <div className="space-y-2">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all",
                        selectedRole === r ? "bg-forge-500/15 text-forge-300" : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-5">
                <h2 className="text-sm font-semibold text-white mb-3">Experience Level</h2>
                <div className="space-y-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDiff(d)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all",
                        selectedDiff === d ? "bg-forge-500/15 text-forge-300" : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-white/5">
                  <div className="text-xs text-white/40 mb-2">Your last scores</div>
                  {[{ label: "Technical", score: 74 }, { label: "Behavioral", score: 88 }].map(({ label, score }) => (
                    <div key={label} className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-white/50 w-20">{label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${scoreToGradient(score)}`} style={{ width: `${score}%` }} />
                      </div>
                      <span className={`text-xs font-medium ${scoreToColor(score)}`}>{score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={startInterview}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-forge-500 to-violet-500 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity hover:scale-[1.01]"
            >
              <Play className="w-5 h-5" />
              Start {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Interview
            </button>
          </motion.div>
        )}

        {/* Active Interview */}
        {stage === "active" && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Progress bar */}
            <div className="glass-card p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
                  <span>Question {currentQ + 1} of {MOCK_QUESTIONS.length}</span>
                  <span className="text-orange-400 flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(timeLeft)}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-forge-500 transition-all duration-500" style={{ width: `${((currentQ) / MOCK_QUESTIONS.length) * 100}%` }} />
                </div>
              </div>
              <span className="badge-forge text-xs">{selectedType}</span>
            </div>

            {/* Question */}
            <div className="glass-card p-6">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-forge-500/15 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-forge-400" />
                </div>
                <div>
                  <div className="text-xs text-white/30 mb-1">Interviewer</div>
                  <p className="text-white leading-relaxed">{MOCK_QUESTIONS[currentQ]}</p>
                </div>
              </div>

              {/* Hint */}
              {showHint && (
                <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/80">
                  <strong className="text-amber-400">Hint:</strong> Think about the read/write ratio, start with a simple architecture, then add caching, CDN, and database sharding as you scale.
                </div>
              )}

              {/* Answer */}
              <div className="border border-white/10 rounded-xl p-4 focus-within:border-forge-500/30 transition-colors">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here. Think out loud — explain your reasoning as you go..."
                  rows={8}
                  className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/20 outline-none resize-none"
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-1.5 text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" /> Request Hint
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={!answer.trim()}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
                    answer.trim()
                      ? "bg-forge-500 text-white hover:bg-forge-400"
                      : "bg-white/5 text-white/20 cursor-not-allowed"
                  )}
                >
                  {currentQ < MOCK_QUESTIONS.length - 1 ? (
                    <><span>Next Question</span><ChevronRight className="w-4 h-4" /></>
                  ) : (
                    <><span>Submit & Get Score</span><Send className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Report */}
        {stage === "report" && (
          <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="glass-card p-6">
              <h2 className="font-semibold text-white text-lg mb-5">Interview Report</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Overall", value: MOCK_REPORT.overall },
                  { label: "Technical", value: MOCK_REPORT.technical },
                  { label: "Communication", value: MOCK_REPORT.communication },
                  { label: "Problem Solving", value: MOCK_REPORT.problemSolving },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center p-4 rounded-xl bg-white/3">
                    <div className={`text-3xl font-bold ${scoreToColor(value)}`}>{value}</div>
                    <div className="text-xs text-white/40 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Strengths
                </h3>
                <div className="space-y-2">
                  {MOCK_REPORT.strengths.map((s) => (
                    <div key={s} className="flex items-start gap-2 text-sm text-white/60">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />{s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" /> Improve Next Time
                </h3>
                <div className="space-y-2">
                  {MOCK_REPORT.improvements.map((s) => (
                    <div key={s} className="flex items-start gap-2 text-sm text-white/60">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />{s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setStage("config")} className="w-full py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm transition-colors">
              Start New Interview
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
