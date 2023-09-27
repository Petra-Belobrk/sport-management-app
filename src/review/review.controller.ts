import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto, ReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../_guards/jwt-auth.guard';
import { Roles } from '../_decorator/roles.decorator';
import { RoleType } from '@prisma/client';

@Controller('review')
@ApiTags('Reviews')
@ApiResponse({ status: 400, description: 'Bad Request' })
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get('class/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles([RoleType.ADMIN])
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'Successfully queried',
    type: [ReviewDto],
  })
  async list(@Param('id') id: string): Promise<ReviewDto[]> {
    return this.reviewService.listForClass(id);
  }

  @Post('class/:id')
  @ApiOperation({ summary: 'Creates a review' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created',
    type: ReviewDto,
  })
  async create(
    @Param('id') id: string,
    @Body() payload: CreateReviewDto,
  ): Promise<ReviewDto> {
    return this.reviewService.create(id, payload);
  }
}
