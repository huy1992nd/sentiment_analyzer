'use client';

import React, { useState, useEffect } from 'react';
import { Review } from '@/types';
import { getReviews } from '@/lib/api';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewsList } from '@/components/ReviewsList';

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await getReviews();
      setReviews(response.reviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeComplete = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background pattern */}
      <div className="bg-pattern" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI-Powered Analysis
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Customer Review
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Sentiment Analyzer
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Understand how your customers feel. Submit a review and our AI will analyze the sentiment,
            providing detailed insights into positive, negative, and neutral expressions.
          </p>
        </header>

        {/* Main content */}
        <main className="space-y-8">
          {/* Submit section */}
          <section className="glass-card rounded-2xl p-6 md:p-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Submit a Review</h2>
                <p className="text-sm text-slate-400">Share a customer review for analysis</p>
              </div>
            </div>
            <ReviewForm onAnalyzeComplete={handleAnalyzeComplete} />
          </section>

          {/* Reviews section */}
          <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Analyzed Reviews</h2>
                  <p className="text-sm text-slate-400">
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''} analyzed
                  </p>
                </div>
              </div>
              
              {/* Refresh button */}
              <button
                onClick={loadReviews}
                disabled={isLoading}
                className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors disabled:opacity-50"
                title="Refresh reviews"
              >
                <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <ReviewsList reviews={reviews} isLoading={isLoading} />
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-500 text-sm">
          <p>Built with Next.js, NestJS & AI-powered Sentiment Analysis</p>
        </footer>
      </div>
    </div>
  );
}
