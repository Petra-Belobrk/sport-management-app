import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../_database/prisma.service';
import {
  ClassDto,
  CreateClassDto,
  ScheduleDto,
  Schedules,
  UpdateClassDto,
} from './dto/class.dto';
import { plainToInstance } from 'class-transformer';
import { FilterDto } from './dto/filter.dto';
import { SportService } from '../sport/sport.service';

@Injectable()
export class ClassService {
  constructor(
    private prismaService: PrismaService,
    private sportService: SportService,
  ) {}

  async create(data: CreateClassDto): Promise<ClassDto> {
    return this.prismaService.class
      .create({
        data: {
          name: data.name,
          age: data.age,
          sportId: data.sportId,
          description: data.description,
          duration: data.duration,
          schedules: {
            createMany: {
              data: this.formatSchedule(data.schedules),
            },
          },
        },
        include: { sport: true, schedules: true },
      })
      .then((res) => plainToInstance(ClassDto, res))
      .catch(() => {
        throw new UnprocessableEntityException();
      });
  }

  async list(filter: FilterDto): Promise<ClassDto[]> {
    const where = {};

    if (filter.age && filter.age.length > 0)
      Object.assign(where, { age: { in: filter.age } });

    if (filter.sports && filter.sports.length > 0) {
      const ids = await this.sportService
        .findByNames(filter.sports)
        .then((res) => res.map((sport) => sport.id));

      Object.assign(where, { sportId: { in: ids } });
    }

    return this.prismaService.class
      .findMany({ where, include: { schedules: true } })
      .then((res) => plainToInstance(ClassDto, res));
  }

  async details(id: string): Promise<ClassDto> {
    return this.prismaService.class
      .findUnique({
        where: { id },
        include: { schedules: true, sport: true },
      })
      .then((res) => plainToInstance(ClassDto, res));
  }

  async update(id: string, data: UpdateClassDto): Promise<ClassDto> {
    return this.prismaService.class
      .update({
        where: { id },
        data: {
          ...data,
          schedules: {
            deleteMany: { classId: id },
            createMany: { data: this.formatSchedule(data.schedules) },
          },
        },
        include: { schedules: true },
      })
      .then((res) => plainToInstance(ClassDto, res))
      .catch(() => {
        throw new UnprocessableEntityException();
      });
  }

  async delete(id: string): Promise<boolean> {
    return this.prismaService.class.delete({ where: { id } }).then(() => true);
  }

  async enroll(scheduleId: string, userId: string): Promise<boolean> {
    if (!(await this.canUserApply(scheduleId, userId))) {
      throw new UnprocessableEntityException('Cannot apply to that time slot');
    }

    return this.prismaService.schedule
      .update({
        where: { id: scheduleId },
        data: { users: { connect: { id: userId } } },
      })
      .then(() => true)
      .catch(() => false);
  }

  async withdraw(scheduleId: string, userId: string): Promise<boolean> {
    return this.prismaService.schedule
      .update({
        where: { id: scheduleId },
        data: { users: { disconnect: { id: userId } } },
      })
      .then(() => true)
      .catch(() => false);
  }

  formatSchedule(data: Schedules[]): ScheduleDto[] {
    return data.map((schedule) => {
      return { day: schedule.day, slot: schedule.slot };
    });
  }

  async canUserApply(slotId: string, userId: string): Promise<boolean> {
    const schedule = await this.prismaService.schedule.findUnique({
      where: { id: slotId },
      include: {
        users: true,
      },
    });

    const userSchedulesCount = await this.prismaService.schedule.count({
      where: { users: { some: { id: userId } } },
    });

    return !(schedule.users.length >= 10 || userSchedulesCount >= 2);
  }

  async updateRating(classId: string, rating: number): Promise<ClassDto> {
    return this.prismaService.class
      .update({
        where: { id: classId },
        data: { avgRating: rating },
      })
      .then((res) => plainToInstance(ClassDto, res));
  }
}
