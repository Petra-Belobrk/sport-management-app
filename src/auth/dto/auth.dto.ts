import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    description: 'Bearer access token',
    example: 'ey...',
  })
  accessToken: string;
}
