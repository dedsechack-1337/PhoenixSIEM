import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label: string };
  accentColor?: string;
  delay?: number;
}

export const StatCard: React.FC<Props> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-emerald-400",
  iconBg = "bg-emerald-500/10 border-emerald-500/20",
  trend,
  accentColor = "from-emerald-500/8 to-transparent",
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative overflow-hidden rounded-xl p-5 transition-all duration-200 hover:translate-y-[-2px]"
      style={{ background: "hsl(222,35%,11%)", border: "1px solid hsl(222,25%,18%)" }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} pointer-events-none`} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-100 font-mono leading-none mb-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="text-xs text-slate-600 mt-1.5">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-mono ${trend.value >= 0 ? "text-red-400" : "text-emerald-400"}`}>
              <span>{trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}%</span>
              <span className="text-slate-600">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`flex-shrink-0 p-2.5 rounded-xl border ${iconBg} ${iconColor}`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
      </div>
    </motion.div>
  );
};
