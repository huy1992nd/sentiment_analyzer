import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SentimentService } from '../sentiment/sentiment.service';
import { SentimentType } from '../common/types/sentiment.types';
import { AnalyzeReviewDto } from './dto/analyze-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { SentimentScoresDto } from './dto/sentiment-scores.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sentimentService: SentimentService,
  ) {}

  async analyzeAndSave(dto: AnalyzeReviewDto): Promise<ReviewResponseDto> {
    // Analyze sentiment
    const sentimentResult = await this.sentimentService.analyze(dto.text);

    // Save to database
    const review = await this.prisma.review.create({
      data: {
        text: dto.text,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence,
        positive: sentimentResult.scores.positive,
        negative: sentimentResult.scores.negative,
        neutral: sentimentResult.scores.neutral,
      },
    });

    return this.mapToResponseDto(review);
  }

  async findAll(): Promise<ReviewResponseDto[]> {
    const reviews = await this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((review) => this.mapToResponseDto(review));
  }

  async findById(id: number): Promise<ReviewResponseDto | null> {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return null;
    }

    return this.mapToResponseDto(review);
  }

  private mapToResponseDto(review: {
    id: number;
    text: string;
    sentiment: string;
    confidence: number;
    positive: number;
    negative: number;
    neutral: number;
    createdAt: Date;
  }): ReviewResponseDto {
    const scores: SentimentScoresDto = {
      positive: review.positive,
      negative: review.negative,
      neutral: review.neutral,
    };

    return {
      id: review.id,
      text: review.text,
      sentiment: review.sentiment as SentimentType,
      confidence: review.confidence,
      scores,
      createdAt: review.createdAt,
    };
  }
}
