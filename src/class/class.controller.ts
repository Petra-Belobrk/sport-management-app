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
import { ClassService } from './class.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterDto } from './dto/filter.dto';
import { ClassDto, CreateClassDto, UpdateClassDto } from './dto/class.dto';
import { JwtAuthGuard } from '../_guards/jwt-auth.guard';
import { RolesGuard } from '../_guards/roles.guard';
import { Roles } from '../_decorator/roles.decorator';
import { RoleType } from '@prisma/client';
import { CurrentUser } from '../_decorator/current-user.decorator';
import { ResponseUserDto } from '../user/dto/response.user.dto';

@Controller('class')
@ApiTags('Class')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 400, description: 'Bad Request' })
export class ClassController {
  constructor(private classService: ClassService) {}

  @Get()
  @ApiOperation({ summary: 'List classes depending of filter' })
  @ApiResponse({
    status: 200,
    description: 'Successfully queried',
    type: [ClassDto],
  })
  async list(@Query() filter: FilterDto): Promise<ClassDto[]> {
    return this.classService.list(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets details of class' })
  @ApiResponse({
    status: 200,
    description: 'Successfully queried',
    type: ClassDto,
  })
  async details(@Param('id') id: string): Promise<ClassDto> {
    return this.classService.details(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles([RoleType.ADMIN])
  @ApiOperation({ summary: 'Creates a class' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created',
    type: ClassDto,
  })
  async create(@Body() payload: CreateClassDto): Promise<ClassDto> {
    return this.classService.create(payload);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleType.ADMIN])
  @ApiOperation({ summary: 'Updates a class' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated',
    type: ClassDto,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateClassDto,
  ): Promise<ClassDto> {
    return this.classService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([RoleType.ADMIN])
  @ApiOperation({ summary: 'Deletes a class' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted',
    type: Boolean,
  })
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.classService.delete(id);
  }

  @Post('/slot/:id/enroll')
  @ApiOperation({ summary: 'Logged in user enrolls for a time slot' })
  @ApiResponse({
    status: 201,
    description: 'Successfully enrolled',
    type: Boolean,
  })
  @ApiResponse({
    status: 422,
    description: "Can't enroll",
  })
  async enroll(
    @Param('id') id: string,
    @CurrentUser() user: ResponseUserDto,
  ): Promise<boolean> {
    return this.classService.enroll(id, user.id);
  }

  @Post('/slot/:id/withdraw')
  @ApiOperation({ summary: 'Logged in user withdraws from a time slot' })
  @ApiResponse({
    status: 201,
    description: 'Successfully withdrawed',
    type: Boolean,
  })
  async withdraw(
    @Param('id') id: string,
    @CurrentUser() user: ResponseUserDto,
  ): Promise<boolean> {
    return this.classService.withdraw(id, user.id);
  }
}
