import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../_guards/jwt-auth.guard';
import { CurrentUser } from '../_decorator/current-user.decorator';
import { User } from '@prisma/client';
import { ResponseUserDto } from '../user/dto/response.user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registers user' })
  @ApiResponse({
    status: 201,
    description: 'Successfully registered',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() payload: RegisterDto): Promise<ResponseUserDto> {
    return this.authService.signup(payload);
  }

  @Post('login')
  @ApiOperation({ summary: 'Logs user in' })
  @ApiResponse({ status: 201, description: 'Successful Login', type: AuthDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async login(@Body() payload: LoginDto): Promise<AuthDto> {
    return this.authService.login(payload);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verifies user email with token' })
  async verifyMail(@Query('token') token: string): Promise<void> {
    await this.authService.verifyEmail(token);
  }

  @Post('resend-verify')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Resends email verification' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async resendVerify(@CurrentUser() user: User): Promise<void> {
    return this.authService.resendVerificationMail(user);
  }
}
