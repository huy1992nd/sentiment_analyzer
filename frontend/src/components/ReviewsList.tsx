'use client';

import React from 'react';
import { Review } from '@/types';
import { ReviewCard } from './ReviewCard';
import { ChatIcon } from '@/assets/icons/ChatIcon';

interface ReviewsListProps {
  reviews: Review[];
  isLoading: boolean;
}

export function ReviewsList({ reviews, isLoading }: ReviewsListProps) {
  return (
    <>
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Loading reviews...</p>
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center">
            <ChatIcon className="text-slate-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-1">No reviews yet</h3>
            <p className="text-slate-500">Submit your first review to see the sentiment analysis!</p>
          </div>
        </div>
      )}

      {!isLoading && reviews.length > 0 && (
        <div className="grid gap-4">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
      )}
    </>
  );
}
