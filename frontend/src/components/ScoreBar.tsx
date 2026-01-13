'use client';

import React from 'react';

interface ScoreBarProps {
  label: string;
  percentage: number;
  color: string;
  delay?: number;
}

export function ScoreBar({ label, percentage, color, delay = 0 }: ScoreBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-sm font-semibold text-white">{percentage}%</span>
      </div>
      <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{
            width: `${percentage}%`,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
