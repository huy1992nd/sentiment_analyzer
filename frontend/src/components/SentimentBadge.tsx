'use client';

import React from 'react';

interface SentimentBadgeProps {
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
}

export function SentimentBadge({ sentiment, confidence, size = 'md' }: SentimentBadgeProps) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const sentimentClass = `sentiment-${sentiment.toLowerCase()}`;

  const icons = {
    POSITIVE: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    NEGATIVE: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    NEUTRAL: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full font-semibold text-white ${sizeClasses[size]} ${sentimentClass}`}>
      {icons[sentiment]}
      <span>{sentiment}</span>
      <span className="opacity-80">({Math.round(confidence * 100)}%)</span>
    </span>
  );
}
