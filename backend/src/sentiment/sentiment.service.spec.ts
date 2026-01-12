import { Test, TestingModule } from '@nestjs/testing';
import { SentimentService } from './sentiment.service';

describe('SentimentService', () => {
  let service: SentimentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentimentService],
    }).compile();

    service = module.get<SentimentService>(SentimentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyze', () => {
    // Test Case 1: Positive Review
    it('should return POSITIVE sentiment for positive review', async () => {
      const text = 'Amazing pizza! Great service and fast delivery. Highly recommend!';
      const result = await service.analyze(text);

      expect(result.sentiment).toBe('POSITIVE');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.scores.positive).toBeGreaterThan(result.scores.negative);
      expect(result.scores.positive).toBeGreaterThan(result.scores.neutral);
    });

    // Test Case 2: Negative Review
    it('should return NEGATIVE sentiment for negative review', async () => {
      const text = 'Terrible coffee, rude staff, and overpriced. Never going back.';
      const result = await service.analyze(text);

      expect(result.sentiment).toBe('NEGATIVE');
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.scores.negative).toBeGreaterThan(result.scores.positive);
    });

    // Test Case 3: Neutral Review
    it('should return NEUTRAL sentiment for neutral review', async () => {
      const text = 'Food was okay, nothing special. Service was average.';
      const result = await service.analyze(text);

      expect(result.sentiment).toBe('NEUTRAL');
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    // Additional test cases
    it('should handle very positive text', async () => {
      const text = 'Absolutely fantastic! The best experience I have ever had. Everything was perfect!';
      const result = await service.analyze(text);

      expect(result.sentiment).toBe('POSITIVE');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should handle very negative text', async () => {
      const text = 'Worst experience ever. Disgusting food, horrible service. Avoid at all costs!';
      const result = await service.analyze(text);

      expect(result.sentiment).toBe('NEGATIVE');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should handle text with no sentiment keywords', async () => {
      const text = 'I went to the restaurant yesterday.';
      const result = await service.analyze(text);

      expect(result.sentiment).toBe('NEUTRAL');
      expect(result.confidence).toBe(0.5);
    });

    it('should handle negation', async () => {
      const text = 'The food was not good at all.';
      const result = await service.analyze(text);

      expect(result.sentiment).toBe('NEGATIVE');
    });

    it('should handle intensifiers', async () => {
      const text = 'The food was very good!';
      const result = await service.analyze(text);

      expect(result.sentiment).toBe('POSITIVE');
      expect(result.scores.positive).toBeGreaterThan(0.5);
    });

    it('should return scores that sum to approximately 1', async () => {
      const text = 'Great food, but slow service.';
      const result = await service.analyze(text);

      const sum = result.scores.positive + result.scores.negative + result.scores.neutral;
      expect(sum).toBeCloseTo(1, 1);
    });

    it('should handle empty string gracefully', async () => {
      const text = '';
      const result = await service.analyze(text);

      expect(result.sentiment).toBe('NEUTRAL');
      expect(result.confidence).toBe(0.5);
    });

    it('should handle mixed sentiment review', async () => {
      const text = 'The food was great but the service was terrible.';
      const result = await service.analyze(text);

      // Mixed review should have both positive and negative scores
      expect(result.scores.positive).toBeGreaterThan(0);
      expect(result.scores.negative).toBeGreaterThan(0);
    });

    it('should return confidence between 0 and 1', async () => {
      const texts = [
        'Amazing!',
        'Terrible!',
        'Okay',
        'The best restaurant ever, highly recommended!',
        'Worst experience, never going back.',
      ];

      for (const text of texts) {
        const result = await service.analyze(text);
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      }
    });
  });
});
