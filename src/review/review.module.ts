import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ClassModule } from '../class/class.module';

@Module({
  imports: [ClassModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
