import { Injectable } from '@nestjs/common';
import { PrismaService } from '../_database/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from './dto/response.user.dto';
import { EncryptionUtils } from '../_utils/encryption.utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async validate(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async getByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(payload: CreateUserDto): Promise<ResponseUserDto> {
    return this.prisma.user
      .create({
        data: {
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          password:
            payload.password ??
            (await EncryptionUtils.hashPassword(
              EncryptionUtils.tokenGenerator(),
            )),
          emailVerification: {
            create: {
              token: payload.token ?? EncryptionUtils.tokenGenerator(),
            },
          },
          role: { connect: { id: payload.roleId } },
        },
      })
      .then((res) => plainToInstance(ResponseUserDto, res));
  }

  async emailVerified(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { emailVerified: true },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<ResponseUserDto> {
    return this.prisma.user
      .update({
        where: { id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          roleId: data.roleId,
        },
      })
      .then((res) => plainToInstance(ResponseUserDto, res));
  }

  async details(id: string): Promise<ResponseUserDto> {
    return this.prisma.user
      .findUnique({
        where: { id },
        include: { classesSlots: { include: { class: true } } },
      })
      .then((res) => plainToInstance(ResponseUserDto, res));
  }

  async delete(id: string): Promise<boolean> {
    return this.prisma.user
      .delete({ where: { id } })
      .then(() => true)
      .catch(() => false);
  }
}
