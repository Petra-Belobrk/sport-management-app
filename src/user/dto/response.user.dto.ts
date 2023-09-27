import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduleDto } from '../../class/dto/class.dto';

export class RoleDto {
  @ApiProperty({
    description: 'Id of role',
    example: 'f3ab83aa-56dd-45dd-8896-dea318a325c3',
  })
  id: string;

  @ApiProperty({ description: 'Role type', example: 'ADMIN' })
  type: string;
}

export class ResponseUserDto {
  @ApiProperty({
    description: 'Id of user',
    example: 'b6a997d5-c05c-4f63-8539-c25ae7e2d0bc',
  })
  id: string;
  roleId: string;

  @ApiProperty({ description: 'Email of user', example: 'user@email.com' })
  email: string;

  @ApiProperty({ description: 'User first name', example: 'User' })
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Testing' })
  lastName: string;

  @ApiProperty({ description: 'User verified email', example: 'true' })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Classes that user enrolled',
    type: [ScheduleDto],
  })
  @Expose({ name: 'classesSlots' })
  @Type(() => ScheduleDto)
  schedules: ScheduleDto[];

  @ApiProperty({ description: 'User age', example: '25' })
  age: number;

  @Exclude()
  password: string;

  @ApiProperty({ description: 'User role', type: RoleDto })
  role: RoleDto;
}
