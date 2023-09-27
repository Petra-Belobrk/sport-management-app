import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterDto {
  @ApiProperty({
    example: '08716805-4d00-4e0d-bf69-583f99fff4ad',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.toString().split(','))
  ids?: string[];
}
