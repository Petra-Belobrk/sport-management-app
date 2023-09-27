import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SportService } from './sport.service';
import { JwtAuthGuard } from '../_guards/jwt-auth.guard';
import { RolesGuard } from '../_guards/roles.guard';
import { Roles } from '../_decorator/roles.decorator';
import { RoleType } from '@prisma/client';
import { CreateSportDto, SportDto, UpdateSportDto } from './dto/sport.dto';
import { FilterDto } from './dto/filter.dto';

@Controller('sport')
@ApiTags('Sport')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([RoleType.ADMIN])
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 400, description: 'Bad Request' })
export class SportController {
  constructor(private sportService: SportService) {}

  @Get()
  @ApiOperation({ summary: 'Lists sports based on filter' })
  @ApiResponse({
    status: 200,
    description: 'Successfully queried',
    type: [SportDto],
  })
  async list(@Query() filter: FilterDto): Promise<SportDto[]> {
    return this.sportService.list(filter);
  }

  @Post()
  @ApiOperation({ summary: 'Creates sport' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created',
    type: SportDto,
  })
  async create(@Body() payload: CreateSportDto): Promise<SportDto> {
    return this.sportService.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updates sport' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated',
    type: SportDto,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateSportDto,
  ): Promise<SportDto> {
    return this.sportService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes sport' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted',
    type: Boolean,
  })
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.sportService.delete(id);
  }
}
