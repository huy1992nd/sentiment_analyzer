import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeReviewDto {
  @ApiProperty({
    description: 'The customer review text to analyze',
    example: 'Amazing pizza! Great service and fast delivery. Highly recommend!',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'Review text is required' })
  @MinLength(1, { message: 'Review text cannot be empty' })
  @MaxLength(500, { message: 'Review text cannot exceed 500 characters' })
  text: string;
}
