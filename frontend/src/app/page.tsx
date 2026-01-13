'use client';

import React, { useState, useEffect } from 'react';
import { Review } from '@/types';
import { getReviews } from '@/lib/api';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewsList } from '@/components/ReviewsList';
import { LightningIcon } from '@/assets/icons/LightningIcon';
import { EditIcon } from '@/assets/icons/EditIcon';
import { ClipboardIcon } from '@/assets/icons/ClipboardIcon';
import { RefreshIcon } from '@/assets/icons/RefreshIcon';

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
            <LightningIcon />
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
                <EditIcon className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Submit a Review</h2>
                <p className="text-sm text-slate-400">Share a customer review for analysis</p>
              </div>
            </div>
            <ReviewForm onAnalyzeComplete={handleAnalyzeComplete} />
          </section>

          {/* Reviews section */}
          <section className="animate-slide-up animation-delay-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <ClipboardIcon className="text-white" />
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
                <RefreshIcon isSpinning={isLoading} />
              </button>
            </div>

            <ReviewsList reviews={reviews} isLoading={isLoading} />
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-500 text-sm">
          <p>AI-powered Sentiment Analysis</p>
        </footer>
      </div>
    </div>
  );
}
