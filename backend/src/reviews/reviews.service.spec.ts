import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { SentimentService } from '../sentiment/sentiment.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prismaService: PrismaService;
  let sentimentService: SentimentService;

  const mockSentimentResult = {
    sentiment: 'POSITIVE' as const,
    confidence: 0.85,
    scores: {
      positive: 0.85,
      negative: 0.05,
      neutral: 0.1,
    },
  };

  const mockReviewFromDb = {
    id: 1,
    text: 'Great product!',
    sentiment: 'POSITIVE',
    confidence: 0.85,
    positive: 0.85,
    negative: 0.05,
    neutral: 0.1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockPrismaService = {
    review: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockSentimentService = {
    analyze: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: SentimentService,
          useValue: mockSentimentService,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prismaService = module.get<PrismaService>(PrismaService);
    sentimentService = module.get<SentimentService>(SentimentService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyzeAndSave', () => {
    it('should analyze text and save review to database', async () => {
      mockSentimentService.analyze.mockResolvedValue(mockSentimentResult);
      mockPrismaService.review.create.mockResolvedValue(mockReviewFromDb);

      const result = await service.analyzeAndSave({ text: 'Great product!' });

      expect(sentimentService.analyze).toHaveBeenCalledWith('Great product!');
      expect(prismaService.review.create).toHaveBeenCalledWith({
        data: {
          text: 'Great product!',
          sentiment: 'POSITIVE',
          confidence: 0.85,
          positive: 0.85,
          negative: 0.05,
          neutral: 0.1,
        },
      });
      expect(result).toEqual({
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
      });
    });

    it('should handle negative sentiment', async () => {
      const negativeResult = {
        sentiment: 'NEGATIVE' as const,
        confidence: 0.9,
        scores: { positive: 0.05, negative: 0.9, neutral: 0.05 },
      };
      const negativeReview = {
        ...mockReviewFromDb,
        sentiment: 'NEGATIVE',
        confidence: 0.9,
        positive: 0.05,
        negative: 0.9,
        neutral: 0.05,
      };

      mockSentimentService.analyze.mockResolvedValue(negativeResult);
      mockPrismaService.review.create.mockResolvedValue(negativeReview);

      const result = await service.analyzeAndSave({ text: 'Terrible experience!' });

      expect(result.sentiment).toBe('NEGATIVE');
      expect(result.confidence).toBe(0.9);
    });

    it('should handle neutral sentiment', async () => {
      const neutralResult = {
        sentiment: 'NEUTRAL' as const,
        confidence: 0.65,
        scores: { positive: 0.2, negative: 0.15, neutral: 0.65 },
      };
      const neutralReview = {
        ...mockReviewFromDb,
        sentiment: 'NEUTRAL',
        confidence: 0.65,
        positive: 0.2,
        negative: 0.15,
        neutral: 0.65,
      };

      mockSentimentService.analyze.mockResolvedValue(neutralResult);
      mockPrismaService.review.create.mockResolvedValue(neutralReview);

      const result = await service.analyzeAndSave({ text: 'It was okay.' });

      expect(result.sentiment).toBe('NEUTRAL');
    });

    it('should pass correct data to prisma create', async () => {
      mockSentimentService.analyze.mockResolvedValue(mockSentimentResult);
      mockPrismaService.review.create.mockResolvedValue(mockReviewFromDb);

      await service.analyzeAndSave({ text: 'Test review' });

      expect(prismaService.review.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          text: 'Test review',
          sentiment: expect.any(String),
          confidence: expect.any(Number),
          positive: expect.any(Number),
          negative: expect.any(Number),
          neutral: expect.any(Number),
        }),
      });
    });
  });

  describe('findAll', () => {
    it('should return all reviews sorted by createdAt desc', async () => {
      const reviews = [
        mockReviewFromDb,
        { ...mockReviewFromDb, id: 2 },
      ];
      mockPrismaService.review.findMany.mockResolvedValue(reviews);

      const result = await service.findAll();

      expect(prismaService.review.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('scores');
    });

    it('should return empty array when no reviews exist', async () => {
      mockPrismaService.review.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should map database fields to response dto correctly', async () => {
      mockPrismaService.review.findMany.mockResolvedValue([mockReviewFromDb]);

      const result = await service.findAll();

      expect(result[0]).toEqual({
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
      });
    });
  });

  describe('findById', () => {
    it('should return review by id', async () => {
      mockPrismaService.review.findUnique.mockResolvedValue(mockReviewFromDb);

      const result = await service.findById(1);

      expect(prismaService.review.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
    });

    it('should return null when review not found', async () => {
      mockPrismaService.review.findUnique.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });
});
