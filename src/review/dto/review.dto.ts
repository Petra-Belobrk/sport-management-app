import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ClassDto } from '../../class/dto/class.dto';

export class CreateReviewDto {
  @ApiProperty()
  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment?: string;
}

export class ReviewDto {
  @ApiProperty({
    description: 'Id of Review',
    example: 'ed48675b-1c54-4992-a0eb-c7fb05221f15',
  })
  id: string;

  @ApiProperty({ description: 'Class Entity', type: ClassDto })
  class: ClassDto;

  @ApiProperty({ description: 'Rating number', example: 5 })
  rating: number;

  @ApiProperty({
    description: 'Comment left by user',
    example: 'Best class ever',
  })
  comment: string;
}
