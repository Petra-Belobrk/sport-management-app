import { Injectable } from '@nestjs/common';
import { PrismaService } from '../_database/prisma.service';
import { CreateReviewDto, ReviewDto } from './dto/review.dto';
import { ClassService } from '../class/class.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ReviewService {
  constructor(
    private prismaService: PrismaService,
    private classService: ClassService,
  ) {}

  async listForClass(classId: string): Promise<ReviewDto[]> {
    return this.prismaService.review
      .findMany({
        where: { classId },
      })
      .then((res) => plainToInstance(ReviewDto, res));
  }

  async create(classId: string, data: CreateReviewDto): Promise<ReviewDto> {
    return this.prismaService.review
      .create({
        data: {
          classId,
          ...data,
        },
      })
      .then((res) => {
        this.calculateClassRating(classId);
        return plainToInstance(ReviewDto, res);
      });
  }

  async calculateClassRating(classId: string): Promise<void> {
    const avg = await this.prismaService.review
      .aggregate({
        _avg: { rating: true },
        where: { classId },
      })
      .then((res) => res._avg.rating);
    this.classService.updateRating(classId, avg);
  }
}
