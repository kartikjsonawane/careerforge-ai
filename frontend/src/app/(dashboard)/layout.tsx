"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { Bell, Search, Command } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, fetchMe } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchMe().then(() => {
      if (!useAuthStore.getState().isAuthenticated) {
        router.push("/auth/login");
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#080b14] text-white flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <motion.main
        animate={{ marginLeft: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex-1 min-h-screen overflow-x-hidden"
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-white/5 bg-[#080b14]/95 backdrop-blur-xl flex items-center justify-between px-6">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 text-sm cursor-pointer hover:bg-white/8 transition-colors">
              <Search className="w-3.5 h-3.5" />
              <span className="flex-1 text-xs">Search anything...</span>
              <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-white/30 font-mono">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/notifications" className="relative w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-forge-500" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
