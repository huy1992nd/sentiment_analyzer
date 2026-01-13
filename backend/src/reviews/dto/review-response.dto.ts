import { ApiProperty } from '@nestjs/swagger';
import { SentimentType } from '../../common/types/sentiment.types';
import { SentimentScoresDto } from './sentiment-scores.dto';

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
  sentiment: SentimentType;

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
