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
