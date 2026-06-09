import React from 'react';
import Card from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  delta?: string;
  deltaUp?: boolean;
  subtitle?: string;
}

export default function StatCard({ title, value, icon, color, delta, deltaUp, subtitle }: StatCardProps) {
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'hsl(215,15%,45%)' }}>
            {title}
          </p>
          <p className="text-3xl font-bold font-mono" style={{ color: '#f1f5f9' }}>
            {value}
          </p>
          {(delta || subtitle) && (
            <p className="text-xs mt-1" style={{ color: delta ? (deltaUp ? '#10b981' : '#ef4444') : 'hsl(215,15%,45%)' }}>
              {delta ? `${deltaUp ? '↑' : '↓'} ${delta}` : subtitle}
            </p>
          )}
        </div>
        <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
    </Card>
  );
}
