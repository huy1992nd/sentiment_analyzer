export interface SentimentScores {
  positive: number;
  negative: number;
  neutral: number;
}

export interface Review {
  id: number;
  text: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  scores: SentimentScores;
  createdAt: string;
}

export interface AnalyzeResponse {
  review: Review;
  message: string;
}

export interface ReviewsListResponse {
  reviews: Review[];
  total: number;
}
