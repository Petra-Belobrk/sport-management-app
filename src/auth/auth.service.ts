import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { RoleType, User } from '@prisma/client';
import { EncryptionUtils } from '../_utils/encryption.utils';
import { RegisterDto } from './dto/register.dto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../_database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ResponseUserDto } from '../user/dto/response.user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async login(data: LoginDto): Promise<AuthDto> {
    const user = await this.userService.getByEmail(data.email);
    if (!user) throw new NotFoundException('Incorrect user or password');
    const passMatch = await EncryptionUtils.validatePassword(
      data.password,
      user.password,
    );
    if (!passMatch) throw new NotFoundException('Incorrect user or password');

    return plainToInstance(AuthDto, this.generateTokens({ userId: user.id }));
  }

  private generateTokens(payload: { userId: User['id'] }): AuthDto {
    return {
      accessToken: this.generateAccessToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: User['id'] }): string {
    return this.jwtService.sign(payload);
  }

  async signup(registerDto: RegisterDto): Promise<ResponseUserDto> {
    const token = EncryptionUtils.tokenGenerator();
    const user = await this.userService.getByEmail(registerDto.email);
    if (user) throw new BadRequestException('User already exist');
    const role = await this.prismaService.role.findUnique({
      where: { type: RoleType.USER },
    });
    return this.userService
      .create({
        ...registerDto,
        token,
        password: await EncryptionUtils.hashPassword(registerDto.password),
        roleId: role.id,
      })
      .then((res) => {
        this.sendVerifyEmail(res, token);
        return res;
      })
      .catch((e) => {
        console.log(e);
        throw new BadRequestException('Something went wrong');
      });
  }

  async resendVerificationMail(user: User): Promise<void> {
    // delete old email verification tokens if exist
    const deletePrev = this.prismaService.emailVerification.deleteMany({
      where: { userId: user.id },
    });

    const token = EncryptionUtils.tokenGenerator();

    const createEmailVerification = this.prismaService.emailVerification.create(
      {
        data: {
          userId: user.id,
          token,
        },
        select: null,
      },
    );

    await this.prismaService.$transaction([
      deletePrev,
      createEmailVerification,
    ]);

    this.sendVerifyEmail(user, token);
  }

  async sendVerifyEmail(
    user: User | ResponseUserDto,
    token: string,
  ): Promise<void> {
    this.mailService.sendVerifyEmail({
      firstName: user.firstName,
      link: `${this.configService.get<string>(
        'APP_URL',
      )}/auth/verify-email?token=${token}`,
      toEmail: user.email,
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const emailVerification =
      await this.prismaService.emailVerification.findUnique({
        where: { token },
      });

    if (!emailVerification || emailVerification.validUntil < new Date()) {
      throw new NotFoundException('Invalid token or expired. Try again');
    }

    await this.userService.emailVerified(emailVerification.userId);
    await this.prismaService.emailVerification.delete({
      where: { token },
    });
  }
}
