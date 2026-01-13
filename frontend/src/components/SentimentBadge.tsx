'use client';

import React from 'react';
import { SentimentType } from '@/types';
import { PositiveIcon, NegativeIcon, NeutralIcon } from '@/assets/icons/SentimentIcons';

interface SentimentBadgeProps {
  sentiment: SentimentType;
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const iconMap = {
  POSITIVE: PositiveIcon,
  NEGATIVE: NegativeIcon,
  NEUTRAL: NeutralIcon,
};

export function SentimentBadge({ sentiment, confidence, size = 'md' }: SentimentBadgeProps) {
  const sentimentClass = `sentiment-${sentiment.toLowerCase()}`;
  const IconComponent = iconMap[sentiment];

  return (
    <span className={`inline-flex items-center gap-2 rounded-full font-semibold text-white ${sizeClasses[size]} ${sentimentClass}`}>
      <IconComponent />
      <span>{sentiment}</span>
      <span className="opacity-80">({Math.round(confidence * 100)}%)</span>
    </span>
  );
}
