import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateSportDto extends PartialType(CreateSportDto) {}

export class SportDto {
  @ApiProperty({
    description: 'Id of Sport object',
    example: 'fb28a56a-bb88-40e2-8897-76f381e674cf',
  })
  id: string;

  @ApiProperty({ description: 'Name of Sport', example: 'Football' })
  name: string;
}
