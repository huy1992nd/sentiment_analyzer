import { AnalyzeResponse, ReviewsListResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function analyzeReview(text: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to analyze review';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // If JSON parsing fails, use default message
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getReviews(): Promise<ReviewsListResponse> {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch reviews';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // If JSON parsing fails, use default message
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
