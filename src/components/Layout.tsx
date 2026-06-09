import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, Bell, Shield } from "lucide-react";
import { LiveDot } from "./ui/LiveDot";

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const Layout: React.FC<Props> = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "hsl(222,47%,6%)" }}>
      <Sidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        {/* Topbar */}
        <header
          className="h-14 flex items-center gap-4 px-4 border-b flex-shrink-0 z-10"
          style={{ background: "hsl(222,42%,7%)", borderColor: "hsl(222,25%,15%)" }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-slate-100 truncate">{title}</h1>
            {subtitle && <p className="text-[11px] text-slate-500 truncate">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}>
              <LiveDot size="sm" />
              <span className="text-emerald-400">Monitoring Active</span>
            </div>
            <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-400" />
            </button>
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Shield size={13} className="text-emerald-400" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
