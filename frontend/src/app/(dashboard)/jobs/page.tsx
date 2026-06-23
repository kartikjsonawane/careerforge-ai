"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Search, MapPin, Clock, DollarSign, ExternalLink,
  Bookmark, CheckCircle, XCircle, ChevronRight, Zap, Filter
} from "lucide-react";
import { cn, scoreToColor, scoreToGradient } from "@/lib/utils";

const JOB_MATCHES = [
  {
    id: "1",
    title: "Machine Learning Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$180K - $250K",
    matchScore: 84,
    matchedSkills: ["Python", "PyTorch", "FastAPI", "SQL", "Redis"],
    missingSkills: ["Kubernetes", "Spark", "AWS SageMaker"],
    postedAt: "2d ago",
    logo: "S",
    logoColor: "from-violet-600 to-indigo-600",
    isHot: true,
  },
  {
    id: "2",
    title: "AI/ML Engineer",
    company: "Scale AI",
    location: "Remote",
    type: "Full-time",
    salary: "$160K - $220K",
    matchScore: 77,
    matchedSkills: ["Python", "ML Pipelines", "Data Engineering"],
    missingSkills: ["LLM Fine-tuning", "RLHF", "Distributed Training"],
    postedAt: "1d ago",
    logo: "A",
    logoColor: "from-emerald-500 to-teal-500",
    isHot: false,
  },
  {
    id: "3",
    title: "Backend Engineer — ML Platform",
    company: "Anthropic",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$200K - $300K",
    matchScore: 68,
    matchedSkills: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    missingSkills: ["CUDA", "Distributed Systems", "Go", "Kubernetes"],
    postedAt: "4h ago",
    logo: "An",
    logoColor: "from-orange-500 to-rose-500",
    isHot: true,
  },
  {
    id: "4",
    title: "Data Scientist",
    company: "Airbnb",
    location: "New York, NY",
    type: "Full-time",
    salary: "$140K - $190K",
    matchScore: 91,
    matchedSkills: ["Python", "SQL", "Statistics", "ML", "A/B Testing", "Tableau"],
    missingSkills: ["Spark"],
    postedAt: "3d ago",
    logo: "Ab",
    logoColor: "from-rose-500 to-pink-500",
    isHot: false,
  },
];

const STATUSES = ["All", "Bookmarked", "Applied", "Screening", "Interview"] as const;
type Status = (typeof STATUSES)[number];

export default function JobMatchPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>("All");
  const [selected, setSelected] = useState<string | null>("1");
  const selectedJob = JOB_MATCHES.find((j) => j.id === selected);

  const filtered = JOB_MATCHES.filter(
    (j) => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Match Engine</h1>
          <p className="text-white/50 text-sm mt-1">AI-matched jobs based on your resume and skills</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-forge-500/10 border border-forge-500/20 text-forge-400 text-sm hover:bg-forge-500/20 transition-colors">
          <Zap className="w-4 h-4" /> Re-analyze Resume
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus-within:border-forge-500/30 transition-colors">
          <Search className="w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, companies..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/20 transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 w-fit">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              status === s ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Two-pane layout */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Job List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelected(job.id)}
              className={cn(
                "glass-card p-4 cursor-pointer transition-all",
                selected === job.id ? "border-forge-500/30 bg-forge-500/5" : ""
              )}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${job.logoColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-medium text-white truncate">{job.title}</h3>
                    {job.isHot && <span className="badge-danger text-[10px] py-0 flex-shrink-0">Hot</span>}
                  </div>
                  <p className="text-xs text-white/50">{job.company} · {job.location}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${scoreToGradient(job.matchScore)}`}
                          style={{ width: `${job.matchScore}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${scoreToColor(job.matchScore)}`}>{job.matchScore}%</span>
                    </div>
                    <span className="text-[10px] text-white/30">{job.postedAt}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Job Detail */}
        {selectedJob && (
          <div className="lg:col-span-3 glass-card p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedJob.logoColor} flex items-center justify-center text-white font-bold`}>
                  {selectedJob.logo}
                </div>
                <div>
                  <h2 className="font-semibold text-white">{selectedJob.title}</h2>
                  <p className="text-sm text-white/50">{selectedJob.company} · {selectedJob.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-forge-500 text-white text-sm font-medium hover:bg-forge-400 transition-colors">
                  Apply <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Match score */}
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Match Score</span>
                <span className={`text-2xl font-bold ${scoreToColor(selectedJob.matchScore)}`}>
                  {selectedJob.matchScore}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedJob.matchScore}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full bg-gradient-to-r ${scoreToGradient(selectedJob.matchScore)}`}
                />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { icon: DollarSign, label: selectedJob.salary },
                { icon: Clock, label: selectedJob.type },
                { icon: MapPin, label: selectedJob.location },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-white/50">
                  <Icon className="w-3.5 h-3.5 text-white/30" /> {label}
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Matched Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.matchedSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" /> Missing Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.missingSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-white/5">
              <button className="w-full py-2.5 rounded-xl border border-forge-500/20 bg-forge-500/5 text-forge-400 text-sm font-medium hover:bg-forge-500/10 transition-colors flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Generate Learning Plan to Close Gaps
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
