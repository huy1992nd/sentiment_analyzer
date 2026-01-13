import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SentimentResult, SentimentType } from '../common/types/sentiment.types';

interface KeywordMap {
  [key: string]: number;
}

interface ScoreCounts {
  positive: number;
  negative: number;
  neutral: number;
}

interface RawScores {
  positive: number;
  negative: number;
  neutral: number;
}

@Injectable()
export class SentimentService implements OnModuleInit {
  private positiveKeywords: KeywordMap = {};
  private negativeKeywords: KeywordMap = {};
  private neutralKeywords: KeywordMap = {};
  private negationWords: string[] = [];
  private intensifiers: KeywordMap = {};

  // Default keywords as fallback
  private readonly defaultPositiveKeywords: KeywordMap = {
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

  private readonly defaultNegativeKeywords: KeywordMap = {
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

  private readonly defaultNeutralKeywords: KeywordMap = {
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

  private readonly defaultNegationWords = [
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

  private readonly defaultIntensifiers: KeywordMap = {
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

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.loadKeywordsFromDatabase();
  }

  private async loadKeywordsFromDatabase() {
    try {
      const keywords = await this.prisma.sentimentKeyword.findMany();
      
      if (keywords.length === 0) {
        // Use default keywords if database is empty
        this.positiveKeywords = { ...this.defaultPositiveKeywords };
        this.negativeKeywords = { ...this.defaultNegativeKeywords };
        this.neutralKeywords = { ...this.defaultNeutralKeywords };
        this.negationWords = [...this.defaultNegationWords];
        this.intensifiers = { ...this.defaultIntensifiers };
        return;
      }

      // Load keywords from database
      keywords.forEach((keyword) => {
        const map = keyword.type === 'POSITIVE' ? this.positiveKeywords :
                   keyword.type === 'NEGATIVE' ? this.negativeKeywords :
                   keyword.type === 'NEUTRAL' ? this.neutralKeywords :
                   keyword.type === 'INTENSIFIER' ? this.intensifiers : null;

        if (map) {
          map[keyword.word] = keyword.weight;
        } else if (keyword.type === 'NEGATION') {
          this.negationWords.push(keyword.word);
        }
      });

      // Merge with defaults for any missing keywords
      this.positiveKeywords = { ...this.defaultPositiveKeywords, ...this.positiveKeywords };
      this.negativeKeywords = { ...this.defaultNegativeKeywords, ...this.negativeKeywords };
      this.neutralKeywords = { ...this.defaultNeutralKeywords, ...this.neutralKeywords };
      this.negationWords = [...new Set([...this.defaultNegationWords, ...this.negationWords])];
      this.intensifiers = { ...this.defaultIntensifiers, ...this.intensifiers };
    } catch (error) {
      // Fallback to default keywords on error
      console.warn('Failed to load keywords from database, using defaults:', error);
      this.positiveKeywords = { ...this.defaultPositiveKeywords };
      this.negativeKeywords = { ...this.defaultNegativeKeywords };
      this.neutralKeywords = { ...this.defaultNeutralKeywords };
      this.negationWords = [...this.defaultNegationWords];
      this.intensifiers = { ...this.defaultIntensifiers };
    }
  }

  async analyze(text: string): Promise<SentimentResult> {
    const words = this.tokenizeText(text);
    const { scores, counts } = this.calculateRawScores(words);
    
    if (this.hasNoKeywords(counts)) {
      return this.createNeutralResult();
    }

    const normalizedScores = this.normalizeScores(scores, counts);
    const adjustedScores = this.adjustNeutralBoost(normalizedScores, scores);
    const finalScores = this.ensureScoreSum(adjustedScores);
    const { sentiment, confidence } = this.determineSentiment(finalScores, counts, words.length);

    return {
      sentiment,
      confidence: this.roundToTwoDecimals(confidence),
      scores: {
        positive: this.roundToTwoDecimals(finalScores.positive),
        negative: this.roundToTwoDecimals(finalScores.negative),
        neutral: this.roundToTwoDecimals(finalScores.neutral),
      },
    };
  }

  private tokenizeText(text: string): string[] {
    const normalizedText = text.toLowerCase();
    return normalizedText.match(/\b[\w']+\b/g) || [];
  }

  private calculateRawScores(words: string[]): { scores: RawScores; counts: ScoreCounts } {
    const scores: RawScores = { positive: 0, negative: 0, neutral: 0 };
    const counts: ScoreCounts = { positive: 0, negative: 0, neutral: 0 };

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const prevWord = i > 0 ? words[i - 1] : '';
      const prevPrevWord = i > 1 ? words[i - 2] : '';

      const isNegated = this.checkNegation(prevWord, prevPrevWord);
      const intensifier = this.getIntensifier(prevWord);

      this.processWord(word, isNegated, intensifier, scores, counts);
    }

    return { scores, counts };
  }

  private checkNegation(prevWord: string, prevPrevWord: string): boolean {
    return (
      this.negationWords.includes(prevWord) ||
      this.negationWords.includes(prevPrevWord) ||
      prevWord.endsWith("n't")
    );
  }

  private getIntensifier(prevWord: string): number {
    return this.intensifiers[prevWord] || 1;
  }

  private processWord(
    word: string,
    isNegated: boolean,
    intensifier: number,
    scores: RawScores,
    counts: ScoreCounts,
  ): void {
    if (this.positiveKeywords[word]) {
      const score = this.positiveKeywords[word] * intensifier;
      if (isNegated) {
        scores.negative += score * 0.8;
        counts.negative++;
      } else {
        scores.positive += score;
        counts.positive++;
      }
    } else if (this.negativeKeywords[word]) {
      const score = this.negativeKeywords[word] * intensifier;
      if (isNegated) {
        scores.positive += score * 0.6;
        counts.positive++;
      } else {
        scores.negative += score;
        counts.negative++;
      }
    } else if (this.neutralKeywords[word]) {
      scores.neutral += this.neutralKeywords[word] * intensifier;
      counts.neutral++;
    }
  }

  private hasNoKeywords(counts: ScoreCounts): boolean {
    return counts.positive + counts.negative + counts.neutral === 0;
  }

  private createNeutralResult(): SentimentResult {
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

  private normalizeScores(scores: RawScores, counts: ScoreCounts): RawScores {
    const totalScore = scores.positive + scores.negative + scores.neutral || 1;
    return {
      positive: scores.positive / totalScore,
      negative: scores.negative / totalScore,
      neutral: scores.neutral / totalScore,
    };
  }

  private adjustNeutralBoost(normalizedScores: RawScores, rawScores: RawScores): RawScores {
    const diff = Math.abs(normalizedScores.positive - normalizedScores.negative);
    
    if (diff < 0.15 && rawScores.neutral > 0) {
      const boostedNeutral = Math.min(normalizedScores.neutral * 1.5, 0.6);
      const remaining = 1 - boostedNeutral;
      const posNegSum = normalizedScores.positive + normalizedScores.negative;
      
      if (posNegSum > 0) {
        return {
          positive: (normalizedScores.positive / posNegSum) * remaining,
          negative: remaining - (normalizedScores.positive / posNegSum) * remaining,
          neutral: boostedNeutral,
        };
      } else {
        return {
          positive: remaining / 2,
          negative: remaining / 2,
          neutral: boostedNeutral,
        };
      }
    }
    
    return normalizedScores;
  }

  private ensureScoreSum(scores: RawScores): RawScores {
    const sum = scores.positive + scores.negative + scores.neutral;
    
    if (sum > 0) {
      return {
        positive: scores.positive / sum,
        negative: scores.negative / sum,
        neutral: scores.neutral / sum,
      };
    }
    
    return {
      positive: 0.33,
      negative: 0.33,
      neutral: 0.34,
    };
  }

  private determineSentiment(
    scores: RawScores,
    counts: ScoreCounts,
    textLength: number,
  ): { sentiment: SentimentType; confidence: number } {
    let sentiment: SentimentType;
    let confidence: number;

    if (scores.neutral > scores.positive && scores.neutral > scores.negative) {
      sentiment = 'NEUTRAL';
      confidence = scores.neutral;
    } else if (scores.positive > scores.negative) {
      sentiment = 'POSITIVE';
      confidence = scores.positive;
    } else if (scores.negative > scores.positive) {
      sentiment = 'NEGATIVE';
      confidence = scores.negative;
    } else {
      sentiment = 'NEUTRAL';
      confidence = Math.max(scores.neutral, 0.5);
    }

    // Adjust confidence based on keyword density
    const totalKeywords = counts.positive + counts.negative + counts.neutral;
    const keywordDensity = totalKeywords / textLength;
    confidence = Math.min(confidence * (1 + keywordDensity * 0.5), 0.99);
    confidence = Math.max(confidence, 0.5);

    return { sentiment, confidence };
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
