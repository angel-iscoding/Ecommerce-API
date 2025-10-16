import { AuthGuard } from '@/auth/auth.guard';
import { RolesGuard } from '@/auth/roles.guard';
import { RequestWithUser } from '@/config/request-with-user.interface';
import { Roles } from '@/config/role.decorator';
import { Role } from '@/config/role.enum';
import { idParamDto } from '@/database/idParamDto.dto';
import { PaginationQueryDto } from '@/database/pagination-query.dto';
import { UserDto } from '@/database/users/user.dto';
import { User } from '@/database/users/user.entity';
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
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  async getAllUsers(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Omit<User[], 'password'>[]> {
    try {
      const { page, limit } = paginationQuery;
      return await this.usersService.getAllUsers(page, limit);
    } catch (error) {
      throw new BadRequestException(
        'No se pudo obtener los usuarios: ' + error.message,
      );
    }
  }

  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserById(@Param() params: idParamDto): Promise<{ message: string }> {
    try {
      const user = await this.usersService.getUserById(params.id);
      if (!user) throw new NotFoundException('Usuario no encontrado');
      return { message: `Usuario: ${user}` };
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
    @Request() req: RequestWithUser,
    @Body() userDto: UserDto,
  ): Promise<{ message: string }> {
    try {
      const updatedUser: User = await this.usersService.updateUser(
        req.user.id,
        userDto,
      );
      return { message: updatedUser.id };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo actualizar el usuario: ' + error.message,
      );
    }
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(DateAdderInterceptor)
  @ApiBearerAuth()
  async deleteUser(
    @Request() req: RequestWithUser,
  ): Promise<{ message: string }> {
    try {
      await this.usersService.deleteUser(req.user.id);
      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo eliminar el usuario: ' + error.message,
      );
    }
  }
}
