'use client';

import React, { useState } from 'react';
import { analyzeReview } from '@/lib/api';
import { Review } from '@/types';

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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Analyze Sentiment</span>
          </>
        )}
      </button>
    </form>
  );
}
