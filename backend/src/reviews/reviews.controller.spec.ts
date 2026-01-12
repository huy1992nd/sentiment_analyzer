import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { AnalyzeReviewDto } from './dto/analyze-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: ReviewsService;

  const mockReview: ReviewResponseDto = {
    id: 1,
    text: 'Great product!',
    sentiment: 'POSITIVE',
    confidence: 0.85,
    scores: {
      positive: 0.85,
      negative: 0.05,
      neutral: 0.1,
    },
    createdAt: new Date('2024-01-01'),
  };

  const mockReviewsService = {
    analyzeAndSave: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: mockReviewsService,
        },
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get<ReviewsService>(ReviewsService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /analyze', () => {
    it('should analyze a review and return result', async () => {
      const dto: AnalyzeReviewDto = { text: 'Great product!' };
      mockReviewsService.analyzeAndSave.mockResolvedValue(mockReview);

      const result = await controller.analyze(dto);

      expect(result).toEqual({
        review: mockReview,
        message: 'Review analyzed successfully',
      });
      expect(service.analyzeAndSave).toHaveBeenCalledWith(dto);
      expect(service.analyzeAndSave).toHaveBeenCalledTimes(1);
    });

    it('should handle valid positive review', async () => {
      const dto: AnalyzeReviewDto = {
        text: 'Amazing pizza! Great service and fast delivery. Highly recommend!',
      };
      const positiveReview: ReviewResponseDto = {
        ...mockReview,
        text: dto.text,
        sentiment: 'POSITIVE',
        confidence: 0.9,
      };
      mockReviewsService.analyzeAndSave.mockResolvedValue(positiveReview);

      const result = await controller.analyze(dto);

      expect(result.review.sentiment).toBe('POSITIVE');
      expect(result.review.confidence).toBeGreaterThan(0.8);
    });

    it('should handle valid negative review', async () => {
      const dto: AnalyzeReviewDto = {
        text: 'Terrible coffee, rude staff, and overpriced.',
      };
      const negativeReview: ReviewResponseDto = {
        ...mockReview,
        text: dto.text,
        sentiment: 'NEGATIVE',
        confidence: 0.85,
      };
      mockReviewsService.analyzeAndSave.mockResolvedValue(negativeReview);

      const result = await controller.analyze(dto);

      expect(result.review.sentiment).toBe('NEGATIVE');
    });

    it('should handle valid neutral review', async () => {
      const dto: AnalyzeReviewDto = {
        text: 'Food was okay, nothing special.',
      };
      const neutralReview: ReviewResponseDto = {
        ...mockReview,
        text: dto.text,
        sentiment: 'NEUTRAL',
        confidence: 0.65,
      };
      mockReviewsService.analyzeAndSave.mockResolvedValue(neutralReview);

      const result = await controller.analyze(dto);

      expect(result.review.sentiment).toBe('NEUTRAL');
    });

    it('should call service with correct parameters', async () => {
      const dto: AnalyzeReviewDto = { text: 'Test review text' };
      mockReviewsService.analyzeAndSave.mockResolvedValue(mockReview);

      await controller.analyze(dto);

      expect(service.analyzeAndSave).toHaveBeenCalledWith({ text: 'Test review text' });
    });
  });

  describe('GET /reviews', () => {
    it('should return all reviews', async () => {
      const reviews = [mockReview, { ...mockReview, id: 2 }];
      mockReviewsService.findAll.mockResolvedValue(reviews);

      const result = await controller.getReviews();

      expect(result).toEqual({
        reviews,
        total: 2,
      });
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no reviews exist', async () => {
      mockReviewsService.findAll.mockResolvedValue([]);

      const result = await controller.getReviews();

      expect(result).toEqual({
        reviews: [],
        total: 0,
      });
    });

    it('should return reviews in correct format', async () => {
      mockReviewsService.findAll.mockResolvedValue([mockReview]);

      const result = await controller.getReviews();

      expect(result.reviews[0]).toHaveProperty('id');
      expect(result.reviews[0]).toHaveProperty('text');
      expect(result.reviews[0]).toHaveProperty('sentiment');
      expect(result.reviews[0]).toHaveProperty('confidence');
      expect(result.reviews[0]).toHaveProperty('scores');
      expect(result.reviews[0]).toHaveProperty('createdAt');
    });
  });
});
