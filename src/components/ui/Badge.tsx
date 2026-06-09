import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  className?: string;
}

export default function Badge({ children, color = '#10b981', bg, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}
      style={{ color, background: bg || `${color}20`, border: `1px solid ${color}30` }}
    >
      {children}
    </span>
  );
}
