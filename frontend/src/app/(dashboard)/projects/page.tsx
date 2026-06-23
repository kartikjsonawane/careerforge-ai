"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderGit2, Sparkles, Code, Database, Globe, ArrowRight,
  Layers, Copy, ChevronDown, ChevronUp, Zap, Tag, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const SKILLS_OPTIONS = ["Python", "React", "Node.js", "FastAPI", "MongoDB", "PostgreSQL", "Redis", "Docker", "TypeScript", "PyTorch"];
const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

const MOCK_PROJECT = {
  title: "AI-Powered Code Review Assistant",
  description: "A GitHub-integrated tool that uses LLMs to automatically review pull requests, detect bugs, enforce style guidelines, and suggest improvements — with inline comments.",
  difficulty: "Advanced",
  estimatedDuration: "4-6 weeks",
  techStack: ["Python", "FastAPI", "React", "TypeScript", "OpenAI API", "GitHub API", "PostgreSQL", "Redis", "Docker"],
  features: [
    "GitHub webhook integration for PR events",
    "LLM-powered code analysis per diff chunk",
    "Inline comment generation via GitHub API",
    "Style guide enforcement (configurable)",
    "Security vulnerability detection",
    "Performance anti-pattern detection",
    "Historical review analytics dashboard",
  ],
  architecture: {
    overview: "Webhook-driven microservice architecture with async LLM processing queue",
    components: [
      { name: "Webhook Service", description: "Receives GitHub events, validates signatures", technology: "FastAPI" },
      { name: "Analysis Queue", description: "Manages LLM analysis tasks with rate limiting", technology: "Redis + Celery" },
      { name: "LLM Engine", description: "Orchestrates prompt construction and model calls", technology: "Python + LangChain" },
      { name: "GitHub Client", description: "Posts inline review comments via REST API", technology: "PyGithub" },
      { name: "Dashboard", description: "Analytics and configuration UI", technology: "React + TypeScript" },
      { name: "Database", description: "Stores reviews, configs, and analytics", technology: "PostgreSQL" },
    ],
  },
  apiDesign: [
    { method: "POST", path: "/webhooks/github", description: "Receive GitHub webhook events" },
    { method: "GET", path: "/api/reviews/{pr_id}", description: "Get review for specific PR" },
    { method: "POST", path: "/api/config", description: "Update review configuration" },
    { method: "GET", path: "/api/analytics", description: "Get review statistics" },
  ],
  resumeBulletPoints: [
    "Built AI-powered code review tool using LLMs, integrated with GitHub API via webhooks serving 50+ repos",
    "Designed async processing pipeline with Redis/Celery handling 200+ concurrent PR analyses",
    "Reduced average code review time by 65% across 10-engineer team through automated feedback generation",
    "Deployed production system on AWS with 99.9% uptime, monitoring via Grafana/Prometheus",
  ],
  learningOutcomes: [
    "LLM prompt engineering for technical tasks",
    "GitHub API and webhook architecture",
    "Async task queues with Redis/Celery",
    "Production ML system deployment",
  ],
};

export default function ProjectLabPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Python", "React", "FastAPI"]);
  const [difficulty, setDifficulty] = useState("Advanced");
  const [generating, setGenerating] = useState(false);
  const [project, setProject] = useState<typeof MOCK_PROJECT | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("features");

  const toggleSkill = (s: string) =>
    setSelectedSkills((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const generate = async () => {
    setGenerating(true);
    setProject(null);
    await new Promise((r) => setTimeout(r, 2500));
    setProject(MOCK_PROJECT);
    setGenerating(false);
  };

  const toggleSection = (s: string) => setExpandedSection((prev) => prev === s ? null : s);

  const SECTIONS = [
    { id: "features", label: "Features", icon: Zap },
    { id: "architecture", label: "Architecture", icon: Layers },
    { id: "api", label: "API Design", icon: Globe },
    { id: "database", label: "Tech Stack", icon: Database },
    { id: "resume", label: "Resume Bullets", icon: Tag },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Project Lab</h1>
        <p className="text-white/50 text-sm mt-1">Enter your skills — AI generates full project blueprints</p>
      </div>

      {/* Config Panel */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Your Skills</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {SKILLS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSkill(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                selectedSkills.includes(s)
                  ? "bg-forge-500/15 border-forge-500/30 text-forge-300"
                  : "bg-white/3 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <h2 className="text-sm font-semibold text-white mb-3">Difficulty</h2>
        <div className="flex gap-2 mb-5">
          {DIFFICULTY_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-medium border transition-all",
                difficulty === d
                  ? "bg-forge-500/15 border-forge-500/30 text-forge-300"
                  : "bg-white/3 border-white/10 text-white/50 hover:border-white/20"
              )}
            >
              {d}
            </button>
          ))}
        </div>

        <button
          onClick={generate}
          disabled={generating || selectedSkills.length === 0}
          className={cn(
            "flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all",
            generating || selectedSkills.length === 0
              ? "bg-white/5 text-white/20 cursor-not-allowed"
              : "bg-gradient-to-r from-forge-500 to-violet-500 text-white hover:opacity-90 hover:scale-[1.01]"
          )}
        >
          {generating ? (
            <><Sparkles className="w-4 h-4 animate-pulse" /> Generating Project Blueprint...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate Project Blueprint</>
          )}
        </button>
      </div>

      {/* Project Output */}
      <AnimatePresence>
        {project && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Header */}
            <div className="glass-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-forge-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                    <FolderGit2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white text-lg">{project.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge-forge">{project.difficulty}</span>
                      <span className="flex items-center gap-1 text-xs text-white/40"><Clock className="w-3 h-3" />{project.estimatedDuration}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mt-4">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {project.techStack.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 text-xs">{t}</span>
                ))}
              </div>
            </div>

            {/* Accordion Sections */}
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <div key={id} className="glass-card overflow-hidden">
                <button
                  onClick={() => toggleSection(id)}
                  className="w-full p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-forge-400" />
                    <span className="text-sm font-medium text-white">{label}</span>
                  </div>
                  {expandedSection === id ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                </button>

                {expandedSection === id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-white/5 p-5"
                  >
                    {id === "features" && (
                      <ul className="space-y-2">
                        {project.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                            <span className="text-forge-400 mt-0.5">→</span> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    {id === "architecture" && (
                      <div>
                        <p className="text-sm text-white/60 mb-4">{project.architecture.overview}</p>
                        <div className="grid md:grid-cols-2 gap-3">
                          {project.architecture.components.map((c) => (
                            <div key={c.name} className="p-3 rounded-xl bg-white/3 border border-white/5">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-white">{c.name}</span>
                                <span className="text-xs text-forge-400 font-mono">{c.technology}</span>
                              </div>
                              <p className="text-xs text-white/50">{c.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {id === "api" && (
                      <div className="space-y-2">
                        {project.apiDesign.map((e) => (
                          <div key={e.path} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 font-mono text-xs">
                            <span className={cn("px-2 py-0.5 rounded font-bold",
                              e.method === "GET" ? "bg-emerald-500/20 text-emerald-300" : "bg-blue-500/20 text-blue-300"
                            )}>{e.method}</span>
                            <span className="text-forge-300">{e.path}</span>
                            <span className="text-white/40 font-sans ml-auto">{e.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {id === "database" && (
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((t) => (
                          <span key={t} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm">{t}</span>
                        ))}
                      </div>
                    )}
                    {id === "resume" && (
                      <div className="space-y-3">
                        {project.resumeBulletPoints.map((b, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/3 group">
                            <span className="text-white/30 text-sm mt-0.5">•</span>
                            <p className="text-sm text-white/70 flex-1">{b}</p>
                            <button className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/60 transition-all flex-shrink-0">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
