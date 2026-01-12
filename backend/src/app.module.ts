import { Module } from '@nestjs/common';
import { ReviewsModule } from './reviews/reviews.module';
import { PrismaModule } from './prisma/prisma.module';
import { SentimentModule } from './sentiment/sentiment.module';

@Module({
  imports: [PrismaModule, SentimentModule, ReviewsModule],
})
export class AppModule {}
