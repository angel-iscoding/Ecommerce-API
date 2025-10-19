import { AuthGuard } from '@/auth/auth.guard';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/config/role.decorator';
import { idParamDto } from '@/database/idParamDto.dto';
import { UserDto } from '@/database/dto/user.dto';
import { User } from '@/database/entities/user.entity';
import { UsersService } from '@/user-management/users/user.service';
import { DateAdderInterceptor } from '@/utils/interceptors/date-adder.interceptor';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleService } from '../roles/role.service';
import { RoleNames } from '@/config/role-names.enum';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly RoleService: RoleService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleNames.Admin)
  @ApiBearerAuth()
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    try {
      return await this.usersService.getAllUsers();
    } catch (error) {
      throw new BadRequestException("Can't get users: " + error.message);
    }
  }

  @Get(':id')
  @Roles(RoleNames.Admin)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserById(
    @Param() params: idParamDto,
  ): Promise<Omit<User, 'password'> | null> {
    try {
      const user: Omit<User, 'password'> | null =
        await this.usersService.getUserById(params.id);
      if (!user) throw new NotFoundException('Usuario no encontrado');
      return user;
    } catch (error) {
      throw new BadRequestException(
        'No se pudo obtener el usuario: ' + error.message,
      );
    }
  }

  @Put('put/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async updateUser(
    @Param() params: idParamDto,
    @Body() userDto: UserDto,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.searchCompleteUserById(params.id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    return await this.usersService.updateUser(user, userDto);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(DateAdderInterceptor)
  @ApiBearerAuth()
  async deleteUser(@Param() params: idParamDto): Promise<{ message: string }> {
    try {
      await this.usersService.deleteUser(params.id);
      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo eliminar el usuario: ' + error.message,
      );
    }
  }
}
