"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Brain, User, Sparkles, BookOpen, Target, FileText, Mic, Plus, ChevronDown } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: { title: string; source: string }[];
  timestamp: Date;
}

const STARTER_PROMPTS = [
  { icon: FileText, text: "Review my resume and suggest improvements", color: "text-blue-400" },
  { icon: Target, text: "Am I ready for ML engineer internships?", color: "text-violet-400" },
  { icon: Brain, text: "What project should I build next for my portfolio?", color: "text-emerald-400" },
  { icon: Mic, text: "How do I crack system design interviews at FAANG?", color: "text-orange-400" },
];

const MOCK_RESPONSES: Record<string, string> = {
  default: `Based on your profile and learning history, here's my analysis:

**Current Strengths:**
- Strong Python and ML fundamentals
- Good understanding of supervised learning algorithms
- React experience adds full-stack credibility

**Key Gaps for ML Engineer roles:**
1. **MLOps & Deployment** — You need hands-on experience with model serving (FastAPI, TorchServe), Docker, and CI/CD for ML pipelines
2. **Scale & Infrastructure** — Cloud platforms (AWS SageMaker or GCP Vertex AI) are critical
3. **System Design for ML** — Feature stores, training pipelines, A/B testing at scale

**Recommendation:**
Build a end-to-end ML project this month — train a model, containerize it, deploy it on AWS, and set up monitoring. This single project will close 60% of your current gaps.

Want me to generate a detailed project blueprint?`,
};

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hey! I'm your AI career mentor — think of me as a senior engineer who knows your entire profile: your resume, skills, learning history, and career goals.\n\nI can help you with resume review, interview prep, career strategy, project ideas, and skill gap analysis. What's on your mind?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const send = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: MOCK_RESPONSES.default,
      citations: [
        { title: "Your Resume — Uploaded 2 days ago", source: "resume" },
        { title: "Learning Progress — 14 days streak", source: "learning" },
      ],
      timestamp: new Date(),
    };
    setMessages((m) => [...m, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Career Mentor</h1>
          <p className="text-white/50 text-sm mt-0.5">RAG-powered · Knows your profile · Always available</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Session
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-white/50 hover:text-white text-sm transition-colors">
            <BookOpen className="w-3.5 h-3.5" /> History
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-6 pr-2">
        {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {STARTER_PROMPTS.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.text}
                  onClick={() => send(p.text)}
                  className="flex items-center gap-3 p-4 rounded-xl glass-card-hover text-left text-sm text-white/70 hover:text-white transition-all"
                >
                  <Icon className={`w-4 h-4 ${p.color} flex-shrink-0`} />
                  {p.text}
                </button>
              );
            })}
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}
          >
            {/* Avatar */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
              msg.role === "assistant"
                ? "bg-gradient-to-br from-forge-500 to-violet-500"
                : "bg-white/10"
            )}>
              {msg.role === "assistant" ? <Sparkles className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white/60" />}
            </div>

            <div className={cn("flex-1 max-w-2xl", msg.role === "user" ? "flex flex-col items-end" : "")}>
              <div className={cn(
                "rounded-2xl px-5 py-4 text-sm leading-relaxed",
                msg.role === "assistant"
                  ? "bg-white/5 border border-white/5 text-white/85"
                  : "bg-forge-500/15 border border-forge-500/20 text-white"
              )}>
                {msg.role === "assistant" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-li:my-0.5"
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {msg.citations.map((c) => (
                    <span key={c.title} className="badge-forge text-[10px] py-0.5">
                      {c.title}
                    </span>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-white/20 mt-1.5 mx-1">
                {formatRelativeTime(msg.timestamp)}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forge-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl px-5 py-4 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 mt-4">
        <div className="flex items-end gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 focus-within:border-forge-500/30 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your career, resume, or tech skills..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none resize-none max-h-32 scrollbar-thin"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || isTyping}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0",
              input.trim() && !isTyping
                ? "bg-forge-500 hover:bg-forge-400 text-white"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-white/20 mt-2">
          AI Mentor has context of your resume, skills, and learning history
        </p>
      </div>
    </div>
  );
}
