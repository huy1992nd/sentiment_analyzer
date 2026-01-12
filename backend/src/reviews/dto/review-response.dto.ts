import { ApiProperty } from '@nestjs/swagger';

export class SentimentScoresDto {
  @ApiProperty({
    description: 'Positive sentiment score',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  positive: number;

  @ApiProperty({
    description: 'Negative sentiment score',
    example: 0.05,
    minimum: 0,
    maximum: 1,
  })
  negative: number;

  @ApiProperty({
    description: 'Neutral sentiment score',
    example: 0.1,
    minimum: 0,
    maximum: 1,
  })
  neutral: number;
}

export class ReviewResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the review',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The original review text',
    example: 'Amazing pizza! Great service and fast delivery.',
  })
  text: string;

  @ApiProperty({
    description: 'The determined sentiment of the review',
    enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
    example: 'POSITIVE',
  })
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

  @ApiProperty({
    description: 'Confidence score of the sentiment analysis (0.0 to 1.0)',
    example: 0.89,
    minimum: 0,
    maximum: 1,
  })
  confidence: number;

  @ApiProperty({
    description: 'Detailed sentiment scores breakdown',
    type: SentimentScoresDto,
  })
  scores: SentimentScoresDto;

  @ApiProperty({
    description: 'Timestamp when the review was created',
    example: '2024-01-10T10:30:00.000Z',
  })
  createdAt: Date;
}

export class AnalyzeResponseDto {
  @ApiProperty({
    description: 'The analyzed review with sentiment results',
    type: ReviewResponseDto,
  })
  review: ReviewResponseDto;

  @ApiProperty({
    description: 'Response message',
    example: 'Review analyzed successfully',
  })
  message: string;
}

export class ReviewsListResponseDto {
  @ApiProperty({
    description: 'List of analyzed reviews',
    type: [ReviewResponseDto],
  })
  reviews: ReviewResponseDto[];

  @ApiProperty({
    description: 'Total number of reviews',
    example: 10,
  })
  total: number;
}
