import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterDto {
  @ApiProperty({
    example: 'Football',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.toString().split(','))
  sports?: string[];

  @ApiProperty({
    example: 'youth',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.toString().toUpperCase().split(','))
  age?: string[];
}
