'use client';

import React from 'react';
import { Review } from '@/types';
import { SentimentBadge } from './SentimentBadge';
import { ScoreBar } from './ScoreBar';

interface ReviewCardProps {
  review: Review;
  index?: number;
}

export function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="glass-card rounded-2xl p-6 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <SentimentBadge
            sentiment={review.sentiment}
            confidence={review.confidence}
            size="sm"
          />
          <span className="text-xs text-slate-500">
            {formatDate(review.createdAt)}
          </span>
        </div>

        {/* Review Text */}
        <p className="text-slate-200 leading-relaxed">&ldquo;{review.text}&rdquo;</p>

        {/* Score Bars */}
        <div className="space-y-3 pt-2">
          {[
            { label: 'Positive', score: review.scores.positive, color: 'bg-gradient-to-r from-emerald-500 to-emerald-400', delay: 0 },
            { label: 'Negative', score: review.scores.negative, color: 'bg-gradient-to-r from-red-500 to-red-400', delay: 100 },
            { label: 'Neutral', score: review.scores.neutral, color: 'bg-gradient-to-r from-amber-500 to-amber-400', delay: 200 },
          ].map((config) => (
            <ScoreBar
              key={config.label}
              label={config.label}
              percentage={Math.round(config.score * 100)}
              color={config.color}
              delay={config.delay}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
