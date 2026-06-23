"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Lock, Bell, Palette, Shield, Trash2,
  Camera, Save, Eye, EyeOff, Check,
  Moon, Sun, Monitor, Globe, Zap, Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

type Tab = "profile" | "account" | "notifications" | "appearance";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile",       label: "Profile",       icon: User    },
  { id: "account",       label: "Account",       icon: Lock    },
  { id: "notifications", label: "Notifications", icon: Bell    },
  { id: "appearance",    label: "Appearance",    icon: Palette },
];

const JOB_ROLES = [
  "Software Engineer", "Frontend Engineer", "Backend Engineer",
  "Full-Stack Engineer", "ML Engineer", "Data Scientist",
  "DevOps Engineer", "Product Manager", "Data Engineer",
];

const SKILLS_LIST = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "Go",
  "Java", "Rust", "SQL", "PostgreSQL", "MongoDB", "Redis",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "System Design",
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>("profile");

  // Profile state
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [targetRole, setTargetRole] = useState(user?.targetRole || "");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user?.currentSkills || []);
  const [experience, setExperience] = useState("0-1 years");

  // Account state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState({
    jobMatches: true,
    resumeAnalysis: true,
    interviewReminders: true,
    mentorInsights: true,
    weeklyDigest: true,
    productUpdates: false,
    emailNotifs: true,
  });

  // Appearance
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [accentColor, setAccentColor] = useState("forge");
  const [compactMode, setCompactMode] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const saveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const changePassword = () => {
    if (newPw !== confirmPw) { toast.error("Passwords don't match."); return; }
    if (newPw.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    toast.success("Password changed successfully!");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  const toggleNotif = (key: keyof typeof notifPrefs) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Preference saved.");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all text-left",
                  tab === id
                    ? "bg-forge-500/15 text-forge-300 border border-forge-500/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── PROFILE ── */}
            {tab === "profile" && (
              <div className="space-y-5">
                {/* Avatar */}
                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-white mb-4">Profile Photo</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forge-500 to-violet-500 flex items-center justify-center text-2xl font-bold text-white">
                        {name.charAt(0).toUpperCase() || "U"}
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-forge-500 flex items-center justify-center hover:bg-forge-400 transition-colors">
                        <Camera className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{name || "Your Name"}</p>
                      <p className="text-xs text-white/40">{user?.email}</p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-forge-500/15 text-forge-300 border border-forge-500/20">
                        <Zap className="w-2.5 h-2.5" /> Free Plan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Basic info */}
                <div className="bg-white/3 border border-white/8 rounded-xl p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-white">Basic Information</h2>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Full Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0f1322] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-forge-500/40 transition-colors" style={{ colorScheme: "dark" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="A short bio about you..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-forge-500/40 transition-colors resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Target Role</label>
                      <select
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full bg-[#0f1322] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-forge-500/40 transition-colors" style={{ colorScheme: "dark" }}
                      >
                        <option value="">Select role</option>
                        {JOB_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Experience</label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full bg-[#0f1322] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-forge-500/40 transition-colors" style={{ colorScheme: "dark" }}
                      >
                        {["0-1 years", "1-2 years", "2-4 years", "4-6 years", "6+ years"].map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-white mb-1">Current Skills</h2>
                  <p className="text-xs text-white/40 mb-3">Select skills you already have</p>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_LIST.map((skill) => {
                      const active = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                            active
                              ? "bg-forge-500/20 border-forge-500/40 text-forge-300"
                              : "bg-white/3 border-white/8 text-white/50 hover:text-white hover:border-white/20"
                          )}
                        >
                          {active && <Check className="w-3 h-3" />}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={saveProfile}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forge-500 hover:bg-forge-400 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-forge-500/25"
                >
                  <Save className="w-4 h-4" />
                  Save Profile
                </button>
              </div>
            )}

            {/* ── ACCOUNT ── */}
            {tab === "account" && (
              <div className="space-y-5">
                <div className="bg-white/3 border border-white/8 rounded-xl p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-white">Email Address</h2>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/8">
                    <Mail className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white/70">{user?.email}</span>
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Verified</span>
                  </div>
                </div>

                <div className="bg-white/3 border border-white/8 rounded-xl p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-white">Change Password</h2>
                  {[
                    { label: "Current Password", val: currentPw, set: setCurrentPw },
                    { label: "New Password", val: newPw, set: setNewPw },
                    { label: "Confirm New Password", val: confirmPw, set: setConfirmPw },
                  ].map(({ label, val, set }) => (
                    <div key={label}>
                      <label className="block text-xs text-white/50 mb-1.5">{label}</label>
                      <div className="relative">
                        <input
                          type={showPw ? "text" : "password"}
                          value={val}
                          onChange={(e) => set(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-forge-500/40 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setShowPw(!showPw)} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors">
                      {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showPw ? "Hide" : "Show"} passwords
                    </button>
                  </div>
                  <button
                    onClick={changePassword}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-forge-500 hover:bg-forge-400 text-white text-sm font-medium transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Update Password
                  </button>
                </div>

                {/* Danger zone */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-red-400" />
                    <h2 className="text-sm font-semibold text-red-400">Danger Zone</h2>
                  </div>
                  <p className="text-xs text-white/40 mb-4">These actions are permanent and cannot be undone.</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-all">
                      Export My Data
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {tab === "notifications" && (
              <div className="space-y-4">
                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-white mb-4">Notification Preferences</h2>
                  <div className="space-y-0">
                    {(Object.entries({
                      jobMatches:           { label: "Job Matches",           desc: "New jobs that match your profile" },
                      resumeAnalysis:       { label: "Resume Analysis",       desc: "When AI completes resume scoring" },
                      interviewReminders:   { label: "Interview Reminders",   desc: "Practice streaks and upcoming prep" },
                      mentorInsights:       { label: "Mentor Insights",       desc: "Personalized AI recommendations" },
                      weeklyDigest:         { label: "Weekly Digest",         desc: "Your progress summary every Monday" },
                      productUpdates:       { label: "Product Updates",       desc: "New features and improvements" },
                    }) as [keyof typeof notifPrefs, { label: string; desc: string }][]).map(([key, { label, desc }]) => (
                      <div key={key} className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm text-white">{label}</p>
                          <p className="text-xs text-white/40">{desc}</p>
                        </div>
                        <button
                          onClick={() => toggleNotif(key)}
                          className={cn(
                            "relative w-10 h-5.5 rounded-full transition-all flex-shrink-0",
                            notifPrefs[key] ? "bg-forge-500" : "bg-white/10"
                          )}
                          style={{ height: "22px", width: "40px" }}
                        >
                          <span className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all",
                            notifPrefs[key] ? "left-5" : "left-0.5"
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Email Notifications</p>
                      <p className="text-xs text-white/40">Receive notifications via email at {user?.email}</p>
                    </div>
                    <button
                      onClick={() => toggleNotif("emailNotifs")}
                      className={cn(
                        "relative rounded-full transition-all flex-shrink-0",
                        notifPrefs.emailNotifs ? "bg-forge-500" : "bg-white/10"
                      )}
                      style={{ height: "22px", width: "40px" }}
                    >
                      <span className={cn(
                        "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all",
                        notifPrefs.emailNotifs ? "left-5" : "left-0.5"
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── APPEARANCE ── */}
            {tab === "appearance" && (
              <div className="space-y-5">
                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-white mb-4">Theme</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { id: "dark",   label: "Dark",   icon: Moon    },
                      { id: "light",  label: "Light",  icon: Sun     },
                      { id: "system", label: "System", icon: Monitor },
                    ] as const).map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => { setTheme(id); toast.success(`Theme set to ${label}`); }}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                          theme === id
                            ? "bg-forge-500/15 border-forge-500/40 text-forge-300"
                            : "bg-white/3 border-white/8 text-white/50 hover:text-white hover:border-white/20"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{label}</span>
                        {theme === id && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-white mb-1">Accent Color</h2>
                  <p className="text-xs text-white/40 mb-4">Choose your interface accent color</p>
                  <div className="flex gap-3">
                    {[
                      { id: "forge",  color: "bg-indigo-500", label: "Indigo" },
                      { id: "violet", color: "bg-violet-500", label: "Violet" },
                      { id: "emerald",color: "bg-emerald-500",label: "Emerald"},
                      { id: "rose",   color: "bg-rose-500",   label: "Rose"   },
                      { id: "amber",  color: "bg-amber-500",  label: "Amber"  },
                    ].map(({ id, color, label }) => (
                      <button
                        key={id}
                        onClick={() => { setAccentColor(id); toast.success(`Accent color set to ${label}`); }}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all ring-offset-2 ring-offset-[#080b14]",
                          color,
                          accentColor === id ? "ring-2 ring-white scale-110" : "hover:scale-105"
                        )}
                        title={label}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Compact Mode</p>
                      <p className="text-xs text-white/40">Reduce spacing for a denser layout</p>
                    </div>
                    <button
                      onClick={() => { setCompactMode(!compactMode); toast.success(`Compact mode ${!compactMode ? "enabled" : "disabled"}`); }}
                      className={cn(
                        "relative rounded-full transition-all",
                        compactMode ? "bg-forge-500" : "bg-white/10"
                      )}
                      style={{ height: "22px", width: "40px" }}
                    >
                      <span className={cn(
                        "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all",
                        compactMode ? "left-5" : "left-0.5"
                      )} />
                    </button>
                  </div>
                </div>

                <div className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h2 className="text-sm font-semibold text-white mb-1">Language & Region</h2>
                  <p className="text-xs text-white/40 mb-3">Set your preferred language</p>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-white/40" />
                    <select className="flex-1 bg-[#0f1322] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-forge-500/40 transition-colors" style={{ colorScheme: "dark" }}>
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
