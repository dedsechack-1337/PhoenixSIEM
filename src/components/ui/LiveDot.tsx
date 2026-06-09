import React from "react";

interface Props {
  color?: string;
  size?: "sm" | "md";
}

export const LiveDot: React.FC<Props> = ({ color = "bg-emerald-400", size = "md" }) => {
  const sz = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";
  return (
    <span className="relative flex items-center">
      <span className={`absolute inline-flex ${sz} rounded-full ${color} opacity-75 animate-ping`} />
      <span className={`relative inline-flex ${sz} rounded-full ${color}`} />
    </span>
  );
};
