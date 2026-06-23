"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import {
  ArrowRight, Sparkles, Brain, FileText, Target, Mic, FolderGit2,
  Briefcase, BarChart3, CheckCircle, Zap, Shield, Globe,
  ChevronRight, Star, Users, TrendingUp
} from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "AI Resume Studio",
    description: "ATS scoring, keyword extraction, gap detection, and improvement roadmaps — all AI-powered.",
    color: "from-blue-500 to-indigo-600",
    accent: "blue",
  },
  {
    icon: Target,
    title: "Skill Gap Analyzer",
    description: "Compare your skills against real industry requirements for any target role.",
    color: "from-violet-500 to-purple-600",
    accent: "violet",
  },
  {
    icon: Brain,
    title: "AI Career Mentor",
    description: "A RAG-powered mentor that knows your resume, history, and goals — available 24/7.",
    color: "from-emerald-500 to-teal-600",
    accent: "emerald",
  },
  {
    icon: Mic,
    title: "Mock Interview Arena",
    description: "Technical, behavioral, and system design interviews with real-time AI coaching.",
    color: "from-orange-500 to-amber-600",
    accent: "orange",
  },
  {
    icon: FolderGit2,
    title: "AI Project Lab",
    description: "Generate full project blueprints with architecture, schema, API design and bullet points.",
    color: "from-rose-500 to-pink-600",
    accent: "rose",
  },
  {
    icon: Briefcase,
    title: "Job Match Engine",
    description: "AI matches your resume to jobs, explains score, and highlights what you're missing.",
    color: "from-cyan-500 to-sky-600",
    accent: "cyan",
  },
];

const STATS = [
  { label: "Students Accelerated", value: "12,000+", icon: Users },
  { label: "Resume Scores Improved", value: "94%", icon: TrendingUp },
  { label: "Interview Success Rate", value: "3.2×", icon: Star },
  { label: "Skills Mapped", value: "500+", icon: Zap },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Now: ML Engineer @ Google",
    avatar: "PS",
    text: "CareerForge identified the exact skills I was missing for ML roles. Within 3 months of following the roadmap, I landed at Google.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Now: Backend Engineer @ Stripe",
    avatar: "MJ",
    text: "The mock interview arena is insane. It gave me feedback on my system design that no YouTube course ever would. Stripe offer followed.",
    rating: 5,
  },
  {
    name: "Ana Rodrigues",
    role: "Now: Full Stack @ Vercel",
    avatar: "AR",
    text: "My resume went from 42% ATS score to 91% in one session. The AI mentor helped me prep every single question.",
    rating: 5,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Upload Your Resume",
    description: "Drop your resume and let AI extract your skills, experience, and gaps in seconds.",
  },
  {
    step: "02",
    title: "Choose Your Target Role",
    description: "Select from 100+ career paths. AI maps your current skills to industry requirements.",
  },
  {
    step: "03",
    title: "Get Your Roadmap",
    description: "Receive a week-by-week personalized learning plan, project ideas, and resources.",
  },
  {
    step: "04",
    title: "Practice & Track",
    description: "Mock interviews, real mentoring, and live analytics — all adapting as you grow.",
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#080b14]/80 backdrop-blur-xl">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forge-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm tracking-wide">CareerForge AI</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {["Features", "How It Works", "Pricing", "Blog"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="text-sm px-4 py-2 rounded-lg bg-forge-500 hover:bg-forge-400 text-white font-medium transition-all hover:shadow-lg hover:shadow-forge-500/25"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-forge-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px]" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative section-container text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-forge-500/30 bg-forge-500/10 text-forge-300 text-xs font-medium mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Groq AI · RAG · Multi-Agent System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
          >
            Your AI-Powered
            <br />
            <span className="gradient-text">Career Operating System</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Analyze resumes, close skill gaps, practice interviews, and get AI mentoring —
            all in one intelligent platform built for the next generation of engineers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/auth/register"
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-forge-500 hover:bg-forge-400 text-white font-semibold transition-all hover:shadow-2xl hover:shadow-forge-500/30 hover:scale-105"
            >
              Start Building Your Career
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 text-white/80 hover:text-white hover:border-white/20 font-medium transition-all"
            >
              See All Features
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 flex items-center justify-center gap-8 text-sm text-white/40"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Free tier available
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Setup in 2 minutes
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-white/5">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs mb-5">
              <Zap className="w-3.5 h-3.5" />
              6 AI-Powered Modules
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything you need to land
              <br />
              <span className="gradient-text">your dream role</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Each module is powered by Gemini AI and trained on real industry data.
              Together, they form a complete career operating system.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group glass-card-hover p-6 cursor-pointer"
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-forge-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore module <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 bg-white/[0.01]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Up and running in <span className="gradient-text">minutes</span>
            </h2>
            <p className="text-white/50">
              No complex setup. Start improving your career trajectory right away.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-forge-500/30 to-transparent z-0" />
                )}
                <div className="relative glass-card p-6">
                  <div className="text-5xl font-bold text-white/5 absolute top-4 right-4">
                    {step.step}
                  </div>
                  <div className="text-xs font-mono text-forge-400 mb-3">{step.step}</div>
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Loved by ambitious <span className="gradient-text">engineers</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-forge-500 to-violet-500 flex items-center justify-center text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-emerald-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forge-600 via-violet-600 to-forge-800 p-12 text-center"
          >
            <div className="absolute inset-0 bg-dot-grid opacity-20" />
            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Start building your future today.
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Join 12,000+ students who are using AI to accelerate their careers.
                Free tier. No credit card needed.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-forge-700 font-bold hover:bg-white/90 transition-all hover:scale-105 hover:shadow-2xl"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-forge-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">CareerForge AI</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/40">
              <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
              <Link href="/security" className="hover:text-white/60 transition-colors">Security</Link>
              <span>© 2025 CareerForge AI. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
