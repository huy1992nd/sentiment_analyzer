'use client';

import React, { useState } from 'react';
import { analyzeReview } from '@/lib/api';
import { Review } from '@/types';
import { ErrorIcon } from '@/assets/icons/ErrorIcon';
import { LightbulbIcon } from '@/assets/icons/LightbulbIcon';
import { SpinnerIcon } from '@/assets/icons/SpinnerIcon';

interface ReviewFormProps {
  onAnalyzeComplete: (review: Review) => void;
}

export function ReviewForm({ onAnalyzeComplete }: ReviewFormProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxChars = 500;
  const remainingChars = maxChars - text.length;
  const isOverLimit = remainingChars < 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || isOverLimit) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeReview(text.trim());
      onAnalyzeComplete(response.review);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze review');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience... How was the food? The service? Would you recommend it to others?"
          className={`w-full h-40 px-5 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none ${
            isOverLimit ? 'border-red-500' : 'border-slate-600/50'
          }`}
          disabled={isLoading}
        />
        
        {/* Character counter */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className={`text-sm ${isOverLimit ? 'text-red-400' : remainingChars < 50 ? 'text-amber-400' : 'text-slate-500'}`}>
            {remainingChars} characters left
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
          <ErrorIcon />
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!text.trim() || isOverLimit || isLoading}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 btn-shine flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <SpinnerIcon />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <LightbulbIcon />
            <span>Analyze Sentiment</span>
          </>
        )}
      </button>
    </form>
  );
}
