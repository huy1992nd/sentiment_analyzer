import { ApiProperty } from '@nestjs/swagger';
import { ReviewResponseDto } from './review-response.dto';

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
