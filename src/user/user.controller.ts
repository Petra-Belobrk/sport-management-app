import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../_guards/jwt-auth.guard';
import { RolesGuard } from '../_guards/roles.guard';
import { Roles } from '../_decorator/roles.decorator';
import { RoleType } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { CurrentUser } from '../_decorator/current-user.decorator';
import { ResponseUserDto } from './dto/response.user.dto';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 400, description: 'Bad Request' })
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Creates user' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created',
    type: ResponseUserDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RoleType.ADMIN])
  async createUser(@Body() payload: CreateUserDto): Promise<ResponseUserDto> {
    return this.userService.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updates user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated',
    type: ResponseUserDto,
  })
  @Roles([RoleType.ADMIN])
  async updateUser(
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    return this.userService.update(id, payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  @ApiResponse({
    status: 200,
    description: 'Successfully queried',
    type: ResponseUserDto,
  })
  async details(
    @Param('id') id: string,
    @CurrentUser() user: ResponseUserDto,
  ): Promise<ResponseUserDto> {
    if (id !== user.id && user.role.type === RoleType.USER) {
      throw new UnauthorizedException();
    }
    return this.userService.details(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted',
    type: Boolean,
  })
  @Roles([RoleType.ADMIN])
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.userService.delete(id);
  }
}
