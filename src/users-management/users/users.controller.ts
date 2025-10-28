import { AuthGuard } from '@/auth/auth.guard';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/config/role.decorator';
import { ParamIdRequestDto } from '@/database/dto/request/param-id-request.dto';
import { UsersService } from '@/users-management/users/users.service';
import { DateAdderInterceptor } from '@/utils/interceptors/date-adder.interceptor';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleNames } from '@/config/role-names.enum';
import { ApiResponseDto } from '@/database/dto/response/api-base-response.dto';
import { UpdateUserRequestDto } from '@/database/dto/request/update-user-request.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleNames.Admin)
  @ApiBearerAuth()
  async findAll(): Promise<ApiResponseDto> {
    try {
      const users = await this.usersService.findAll();
      return {
        status: 'success',
        message: 'Users found successfully',
        data: users
      }
    } catch (error) {
      throw new BadRequestException(
        "Warning: " + error.message
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async findById(
    @Param() params: ParamIdRequestDto,
  ): Promise<ApiResponseDto> {
    try {
      const user = await this.usersService.findById(params.id);
      
      return {
        status: 'success',
        message: 'User found successfully',
        data: user
      };
    } catch (error) {
      throw new BadRequestException(
        'Warning: ' + error.message,
      );
    }
  }

  @Put('put/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async update(
    @Param() params: ParamIdRequestDto,
    @Body() userDto: UpdateUserRequestDto,
  ): Promise<ApiResponseDto> {
    try {
      const updatedUser = await this.usersService.update(params.id, userDto);
      return {
        status: 'success',
        message: 'User updated successfully',
        data: updatedUser
      };
    } catch (error) {
      throw new BadRequestException(
        'Warning: ' + error.message,
      );
    }
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(DateAdderInterceptor)
  @ApiBearerAuth()
  async remove(@Param() params: ParamIdRequestDto): Promise<ApiResponseDto> {
    try {
      await this.usersService.remove(params.id);
      return {
        status: 'success',
        message: 'User deleted successfully',
        data: null
      };
    } catch (error) {
      throw new BadRequestException(
        'Warning: ' + error.message,
      );
    }
  }

  @Post('role-assignment/:userId')
  @UseGuards(AuthGuard)
  @Roles(RoleNames.Admin)
  async assignRole(
    @Param('userId') userId: string,
    @Body() body: ParamIdRequestDto
  ) {
    try {
      const assignedRole = this.usersService.assignRole(userId, body.id);

      return {
        status: 'success',
        message: 'Role assigned successfully',
        data: assignedRole
      };
    } catch (error) {
      throw new BadRequestException(
        'Warning: ' + error.message
      );
    }
  }
}
