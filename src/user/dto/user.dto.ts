import { RoleType } from '@prisma/client';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  password?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  token?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roleId: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
