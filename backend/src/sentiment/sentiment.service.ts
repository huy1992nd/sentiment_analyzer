import { Injectable } from '@nestjs/common';

export interface SentimentResult {
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

@Injectable()
export class SentimentService {
  // Positive keywords với weights
  private readonly positiveKeywords: Record<string, number> = {
    amazing: 0.9,
    excellent: 0.9,
    fantastic: 0.85,
    wonderful: 0.85,
    great: 0.8,
    good: 0.6,
    love: 0.8,
    loved: 0.8,
    best: 0.85,
    perfect: 0.9,
    recommend: 0.75,
    recommended: 0.75,
    highly: 0.4,
    delicious: 0.8,
    tasty: 0.75,
    awesome: 0.85,
    outstanding: 0.9,
    superb: 0.85,
    friendly: 0.7,
    helpful: 0.7,
    fast: 0.6,
    quick: 0.6,
    fresh: 0.65,
    clean: 0.6,
    nice: 0.6,
    happy: 0.75,
    satisfied: 0.7,
    impressed: 0.8,
    beautiful: 0.75,
    pleasant: 0.7,
    enjoyable: 0.75,
    incredible: 0.85,
    exceptional: 0.85,
  };

  // Negative keywords với weights
  private readonly negativeKeywords: Record<string, number> = {
    terrible: 0.9,
    awful: 0.9,
    horrible: 0.9,
    bad: 0.75,
    worst: 0.9,
    poor: 0.7,
    disappointing: 0.8,
    disappointed: 0.8,
    rude: 0.85,
    slow: 0.6,
    cold: 0.5,
    overpriced: 0.75,
    expensive: 0.5,
    never: 0.4,
    disgusting: 0.9,
    dirty: 0.8,
    hate: 0.85,
    hated: 0.85,
    avoid: 0.8,
    waste: 0.75,
    mediocre: 0.55,
    bland: 0.6,
    stale: 0.7,
    undercooked: 0.7,
    overcooked: 0.65,
    unfriendly: 0.75,
    unprofessional: 0.8,
    tasteless: 0.75,
    gross: 0.85,
    inedible: 0.9,
  };

  // Neutral/modifier keywords
  private readonly neutralKeywords: Record<string, number> = {
    okay: 0.5,
    ok: 0.5,
    average: 0.6,
    nothing: 0.4,
    special: 0.3,
    decent: 0.5,
    fine: 0.5,
    normal: 0.5,
    standard: 0.5,
    ordinary: 0.5,
    typical: 0.5,
    moderate: 0.5,
  };

  // Negation words that flip sentiment
  private readonly negationWords = [
    'not',
    'no',
    "n't",
    'never',
    'neither',
    'nobody',
    'nothing',
    'nowhere',
    'hardly',
    'barely',
    'scarcely',
  ];

  // Intensifiers
  private readonly intensifiers: Record<string, number> = {
    very: 1.3,
    really: 1.25,
    extremely: 1.4,
    absolutely: 1.35,
    highly: 1.3,
    so: 1.2,
    too: 1.15,
    quite: 1.1,
    super: 1.3,
    incredibly: 1.35,
    totally: 1.25,
  };

  async analyze(text: string): Promise<SentimentResult> {
    const normalizedText = text.toLowerCase();
    const words = normalizedText.match(/\b[\w']+\b/g) || [];

    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;

    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const prevWord = i > 0 ? words[i - 1] : '';
      const prevPrevWord = i > 1 ? words[i - 2] : '';

      // Check for negation in the previous 2 words
      const isNegated =
        this.negationWords.includes(prevWord) ||
        this.negationWords.includes(prevPrevWord) ||
        prevWord.endsWith("n't");

      // Check for intensifier
      let intensifier = 1;
      if (this.intensifiers[prevWord]) {
        intensifier = this.intensifiers[prevWord];
      }

      if (this.positiveKeywords[word]) {
        const score = this.positiveKeywords[word] * intensifier;
        if (isNegated) {
          negativeScore += score * 0.8;
          negativeCount++;
        } else {
          positiveScore += score;
          positiveCount++;
        }
      } else if (this.negativeKeywords[word]) {
        const score = this.negativeKeywords[word] * intensifier;
        if (isNegated) {
          positiveScore += score * 0.6;
          positiveCount++;
        } else {
          negativeScore += score;
          negativeCount++;
        }
      } else if (this.neutralKeywords[word]) {
        neutralScore += this.neutralKeywords[word] * intensifier;
        neutralCount++;
      }
    }

    // Calculate raw scores
    const totalKeywords = positiveCount + negativeCount + neutralCount;

    // If no sentiment keywords found, return neutral with low confidence
    if (totalKeywords === 0) {
      return {
        sentiment: 'NEUTRAL',
        confidence: 0.5,
        scores: {
          positive: 0.33,
          negative: 0.33,
          neutral: 0.34,
        },
      };
    }

    // Normalize scores
    const totalScore = positiveScore + negativeScore + neutralScore || 1;

    let normalizedPositive = positiveScore / totalScore;
    let normalizedNegative = negativeScore / totalScore;
    let normalizedNeutral = neutralScore / totalScore;

    // Boost neutral if scores are close
    const diff = Math.abs(normalizedPositive - normalizedNegative);
    if (diff < 0.15 && neutralScore > 0) {
      normalizedNeutral = Math.min(normalizedNeutral * 1.5, 0.6);
      const remaining = 1 - normalizedNeutral;
      const posNegSum = normalizedPositive + normalizedNegative;
      if (posNegSum > 0) {
        normalizedPositive = (normalizedPositive / posNegSum) * remaining;
        normalizedNegative = remaining - normalizedPositive;
      } else {
        normalizedPositive = remaining / 2;
        normalizedNegative = remaining / 2;
      }
    }

    // Ensure scores sum to 1
    const sum = normalizedPositive + normalizedNegative + normalizedNeutral;
    if (sum > 0) {
      normalizedPositive /= sum;
      normalizedNegative /= sum;
      normalizedNeutral /= sum;
    } else {
      normalizedPositive = 0.33;
      normalizedNegative = 0.33;
      normalizedNeutral = 0.34;
    }

    // Determine sentiment
    let sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    let confidence: number;

    if (
      normalizedNeutral > normalizedPositive &&
      normalizedNeutral > normalizedNegative
    ) {
      sentiment = 'NEUTRAL';
      confidence = normalizedNeutral;
    } else if (normalizedPositive > normalizedNegative) {
      sentiment = 'POSITIVE';
      confidence = normalizedPositive;
    } else if (normalizedNegative > normalizedPositive) {
      sentiment = 'NEGATIVE';
      confidence = normalizedNegative;
    } else {
      sentiment = 'NEUTRAL';
      confidence = Math.max(normalizedNeutral, 0.5);
    }

    // Adjust confidence based on keyword density
    const textLength = words.length;
    const keywordDensity = totalKeywords / textLength;
    confidence = Math.min(confidence * (1 + keywordDensity * 0.5), 0.99);
    confidence = Math.max(confidence, 0.5);

    return {
      sentiment,
      confidence: Math.round(confidence * 100) / 100,
      scores: {
        positive: Math.round(normalizedPositive * 100) / 100,
        negative: Math.round(normalizedNegative * 100) / 100,
        neutral: Math.round(normalizedNeutral * 100) / 100,
      },
    };
  }
}
