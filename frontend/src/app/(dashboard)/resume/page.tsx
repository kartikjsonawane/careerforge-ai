"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Upload, FileText, Zap, CheckCircle, AlertTriangle, XCircle,
  TrendingUp, Target, Sparkles, ArrowRight, RotateCcw, Download,
  Eye, Layers, Award
} from "lucide-react";
import { cn, scoreToColor, scoreToGradient } from "@/lib/utils";
import { resumeApi } from "@/lib/api";
import { ResumeAnalysis } from "@/types";
import { toast } from "sonner";

type Priority = "high" | "medium" | "low";

const MOCK_ANALYSIS: ResumeAnalysis = {
  overallScore: 78,
  atsScore: 85,
  keywordScore: 72,
  readabilityScore: 81,
  impactScore: 74,
  missingKeywords: ["Kubernetes", "Docker", "CI/CD", "MLOps", "Apache Spark", "Terraform"],
  strengths: [
    "Strong quantified achievements with metrics",
    "Clear progression of responsibilities",
    "Good use of action verbs",
    "Relevant project section with tech stack",
  ],
  weaknesses: [
    "Missing cloud platform certifications",
    "No open-source contributions mentioned",
    "Skills section lacks depth ratings",
  ],
  improvements: [
    {
      section: "Skills",
      issue: "Missing critical DevOps tools",
      suggestion: "Add Docker, Kubernetes, and CI/CD tools to your skills section. These appear in 87% of target job postings.",
      priority: "high",
    },
    {
      section: "Experience",
      issue: "Weak impact statements in internship role",
      suggestion: 'Replace "worked on features" with quantified impact: "Engineered 3 core features reducing load time by 40%, serving 50K+ DAU"',
      priority: "high",
    },
    {
      section: "Summary",
      issue: "Generic summary not tailored to target role",
      suggestion: "Rewrite summary to highlight ML/backend specialization with specific frameworks and measurable outcomes.",
      priority: "medium",
    },
    {
      section: "Projects",
      issue: "Project descriptions lack technical depth",
      suggestion: "Add architecture decisions, scale metrics, and business impact for each project.",
      priority: "medium",
    },
  ],
};

const SCORE_LABELS: Record<string, string> = {
  overallScore: "Overall",
  atsScore: "ATS Pass",
  keywordScore: "Keywords",
  readabilityScore: "Readability",
  impactScore: "Impact",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  high: "border-rose-500/20 bg-rose-500/5",
  medium: "border-amber-500/20 bg-amber-500/5",
  low: "border-blue-500/20 bg-blue-500/5",
};

const PRIORITY_BADGE: Record<Priority, string> = {
  high: "badge-danger",
  medium: "badge-warning",
  low: "badge-forge",
};

export default function ResumeStudioPage() {
  const [step, setStep] = useState<"upload" | "analyzing" | "results">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"scores" | "improvements" | "keywords">("scores");

  const onDrop = useCallback(async (accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setStep("analyzing");

    // Simulate AI analysis
    await new Promise((r) => setTimeout(r, 2800));
    setAnalysis(MOCK_ANALYSIS);
    setStep("results");
    toast.success("Resume analyzed successfully!");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "application/msword": [".doc", ".docx"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Resume Studio</h1>
        <p className="text-white/50 text-sm mt-1">ATS scoring · Keyword analysis · Improvement roadmap</p>
      </div>

      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            {/* Drop Zone */}
            <div
              {...getRootProps()}
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all",
                isDragActive
                  ? "border-forge-500 bg-forge-500/10"
                  : "border-white/10 hover:border-white/20 hover:bg-white/2"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                  isDragActive ? "bg-forge-500/20" : "bg-white/5"
                )}>
                  <Upload className={cn("w-7 h-7", isDragActive ? "text-forge-400" : "text-white/40")} />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {isDragActive ? "Drop it here!" : "Drop your resume here"}
                  </p>
                  <p className="text-white/40 text-sm mt-1">PDF or DOCX · Max 5MB</p>
                </div>
                <button className="px-5 py-2 rounded-lg bg-forge-500 text-white text-sm font-medium hover:bg-forge-400 transition-colors">
                  Browse Files
                </button>
              </div>
            </div>

            {/* Job Description (optional) */}
            <div className="glass-card p-5">
              <label className="block text-sm font-medium text-white/70 mb-3">
                Job Description <span className="text-white/30 font-normal">(optional — for targeted analysis)</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to get a targeted match score and specific keyword recommendations..."
                rows={5}
                className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/20 outline-none resize-none"
              />
            </div>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 gap-6"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-forge-500/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-forge-400 animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-t-forge-500 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">Analyzing your resume...</p>
              <p className="text-white/40 text-sm mt-1">AI is extracting skills, scoring ATS fit, detecting gaps</p>
            </div>
            <div className="flex gap-2">
              {["Parsing PDF", "Extracting Skills", "ATS Check", "Gap Analysis"].map((s, i) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/40 animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}>
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {step === "results" && analysis && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{file?.name}</p>
                  <p className="text-xs text-white/40">Analyzed just now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setStep("upload"); setFile(null); setAnalysis(null); }}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Re-analyze
                </button>
                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-forge-500/10 border border-forge-500/20 text-forge-400 hover:bg-forge-500/20 transition-colors">
                  <Download className="w-3 h-3" /> Export Report
                </button>
              </div>
            </div>

            {/* Overall Score */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="#6172f3" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - analysis.overallScore / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${scoreToColor(analysis.overallScore)}`}>
                      {analysis.overallScore}
                    </span>
                    <span className="text-xs text-white/40">/ 100</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white mb-1">Resume Score</h2>
                  <p className="text-sm text-white/50 mb-4">
                    Your resume is {analysis.overallScore >= 80 ? "strong" : analysis.overallScore >= 60 ? "good" : "needs work"}.
                    Focus on the improvements below to reach 90+.
                  </p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {(["atsScore", "keywordScore", "readabilityScore", "impactScore"] as const).map((key) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xs text-white/40">{SCORE_LABELS[key]}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${scoreToGradient(analysis[key])}`}
                              style={{ width: `${analysis[key]}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${scoreToColor(analysis[key])}`}>{analysis[key]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 w-fit">
              {(["scores", "improvements", "keywords"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                    activeTab === tab
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/60"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "improvements" && (
              <div className="space-y-3">
                {analysis.improvements.map((imp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={cn("border rounded-xl p-5", PRIORITY_STYLES[imp.priority])}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-white/30">{imp.section}</span>
                        <span className={PRIORITY_BADGE[imp.priority]}>{imp.priority} priority</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-white mb-1">{imp.issue}</p>
                    <p className="text-sm text-white/60 leading-relaxed">{imp.suggestion}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "keywords" && (
              <div className="grid md:grid-cols-2 gap-5">
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" /> Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((kw) => (
                      <span key={kw} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Strengths
                  </h3>
                  <div className="space-y-2">
                    {analysis.strengths.map((s) => (
                      <div key={s} className="flex items-start gap-2 text-sm text-white/60">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "scores" && (
              <div className="grid md:grid-cols-2 gap-5">
                {Object.entries(SCORE_LABELS).map(([key, label]) => {
                  const score = analysis[key as keyof ResumeAnalysis] as number;
                  return (
                    <div key={key} className="glass-card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-white">{label}</span>
                        <span className={`text-2xl font-bold ${scoreToColor(score)}`}>{score}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full bg-gradient-to-r ${scoreToGradient(score)}`}
                        />
                      </div>
                      <div className="flex justify-between mt-1.5 text-xs text-white/30">
                        <span>0</span><span>100</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
