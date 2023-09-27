import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../_database/prisma.service';
import { CreateSportDto, SportDto, UpdateSportDto } from './dto/sport.dto';
import { plainToInstance } from 'class-transformer';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class SportService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateSportDto): Promise<SportDto> {
    return this.prismaService.sport
      .create({ data: { ...data } })
      .then((res) => plainToInstance(SportDto, res));
  }

  async list(filter: FilterDto): Promise<SportDto[]> {
    const where = {};
    if (filter.ids && filter.ids.length > 0)
      Object.assign(where, { id: { in: filter.ids } });

    return this.prismaService.sport
      .findMany({ where })
      .then((res) => plainToInstance(SportDto, res));
  }

  async update(id: string, data: UpdateSportDto): Promise<SportDto> {
    return this.prismaService.sport
      .update({
        where: { id },
        data: { ...data },
      })
      .then((res) => plainToInstance(SportDto, res))
      .catch(() => {
        throw new BadRequestException();
      });
  }

  async delete(id: string): Promise<boolean> {
    return this.prismaService.sport
      .delete({ where: { id } })
      .then(() => true)
      .catch(() => false);
  }

  async findByNames(names: string[]): Promise<SportDto[]> {
    return this.prismaService.sport
      .findMany({ where: { name: { in: names, mode: 'insensitive' } } })
      .then((res) => plainToInstance(SportDto, res));
  }
}
