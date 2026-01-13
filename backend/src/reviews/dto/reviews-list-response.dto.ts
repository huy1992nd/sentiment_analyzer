import { ApiProperty } from '@nestjs/swagger';
import { ReviewResponseDto } from './review-response.dto';

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
