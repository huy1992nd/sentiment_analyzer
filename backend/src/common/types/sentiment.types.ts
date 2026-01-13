export type SentimentType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

export interface SentimentScores {
  positive: number;
  negative: number;
  neutral: number;
}

export interface SentimentResult {
  sentiment: SentimentType;
  confidence: number;
  scores: SentimentScores;
}
