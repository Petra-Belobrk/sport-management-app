import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AgeGroup, Days } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { SportDto } from '../../sport/dto/sport.dto';

export class Schedules {
  @ApiProperty({
    enum: [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ],
  })
  @IsEnum(Days)
  day: Days;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => {
    const [hrs, mins] = value.split(':');
    return hrs.length < 2 ? `0${hrs}:${mins}` : value;
  })
  slot: string;
}

export class CreateClassDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ['CHILDREN', 'YOUTH', 'YOUNG_ADULTS', 'ADULTS'] })
  @IsEnum(AgeGroup)
  age: AgeGroup;

  @ApiProperty({ type: [Schedules] })
  @ValidateNested({ each: true })
  @Type(() => Schedules)
  schedules: Schedules[];

  @ApiProperty()
  sportId: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsOptional()
  duration?: number;
}

export class UpdateClassDto extends PartialType(CreateClassDto) {}

export class ScheduleDto {
  @ApiProperty({ description: 'Day', example: 'MONDAY' })
  day: Days;

  @ApiProperty({ description: 'Time', example: '08:00' })
  slot: string;
}

export class ClassDto {
  @ApiProperty({
    description: 'Id of class',
    example: 'ed48675b-1c54-4992-a0eb-c7fb05221f15',
  })
  id: string;

  @ApiProperty({
    description: 'Name of class',
    example: 'Youth Football class',
  })
  name: string;

  @ApiProperty({ description: 'Age level of class', example: 'CHILDREN' })
  age: string;

  @ApiProperty({ description: 'Sport Entity', type: SportDto })
  sport: SportDto;

  @ApiProperty({ description: 'Time slots for the class', type: [ScheduleDto] })
  schedules: ScheduleDto[];
}
