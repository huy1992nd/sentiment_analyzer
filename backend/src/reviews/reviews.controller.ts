import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { AnalyzeReviewDto } from './dto/analyze-review.dto';
import { AnalyzeResponseDto } from './dto/analyze-response.dto';
import { ReviewsListResponseDto } from './dto/reviews-list-response.dto';

@ApiTags('reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('analyze')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Analyze review sentiment',
    description:
      'Submit a customer review text and receive sentiment analysis results including sentiment type (POSITIVE/NEGATIVE/NEUTRAL), confidence score, and detailed score breakdown.',
  })
  @ApiBody({
    type: AnalyzeReviewDto,
    description: 'The review text to analyze',
    examples: {
      positive: {
        summary: 'Positive Review',
        value: {
          text: 'Amazing pizza! Great service and fast delivery. Highly recommend!',
        },
      },
      negative: {
        summary: 'Negative Review',
        value: {
          text: 'Terrible coffee, rude staff, and overpriced. Never going back.',
        },
      },
      neutral: {
        summary: 'Neutral Review',
        value: {
          text: 'Food was okay, nothing special. Service was average.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Review analyzed successfully',
    type: AnalyzeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input (empty text or exceeds 500 characters)',
  })
  async analyze(@Body() dto: AnalyzeReviewDto): Promise<AnalyzeResponseDto> {
    const review = await this.reviewsService.analyzeAndSave(dto);
    return {
      review,
      message: 'Review analyzed successfully',
    };
  }

  @Get('reviews')
  @ApiOperation({
    summary: 'Get all analyzed reviews',
    description:
      'Retrieve a list of all previously analyzed reviews, sorted by creation date (newest first).',
  })
  @ApiResponse({
    status: 200,
    description: 'List of analyzed reviews retrieved successfully',
    type: ReviewsListResponseDto,
  })
  async getReviews(): Promise<ReviewsListResponseDto> {
    const reviews = await this.reviewsService.findAll();
    return {
      reviews,
      total: reviews.length,
    };
  }
}
