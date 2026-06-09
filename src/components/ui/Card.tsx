import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', glow = false, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border ${hover ? 'card-hover' : ''} ${glow ? 'glow-emerald' : ''} ${className}`}
      style={{
        background: 'hsl(222, 33%, 14%)',
        borderColor: 'hsl(222, 25%, 20%)',
      }}
    >
      {children}
    </div>
  );
}
