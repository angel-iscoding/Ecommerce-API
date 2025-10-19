import { LoginDto } from '@/database/dto/login.dto';
import { RegisterDto } from '@/database/dto/register.dto';
import { User } from '@/database/entities/user.entity';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { CustomLogger } from '@/utils/logger/custom-logger.module';
import { AuthService } from './auth.service';
import { RoleService } from '@/user-management/roles/role.service';
import { ContectDto } from '@/database/dto/content.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new CustomLogger();

  constructor(
    private readonly authService: AuthService,
    private readonly rolesService: RoleService,
  ) {}

  @Post('register')
  async register(
    @Request() req,
    @Body() user: RegisterDto,
  ): Promise<ContectDto> {
    this.logger.logRequest(req);
    try {
      if (user.password !== user.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      const role = await this.rolesService.getRoleById(1);

      if (role === null) {
        throw new BadRequestException("Role does't exist");
      }

      const userCreated: User = await this.authService.register(user, role);
      
      return {
        status: 'success',
        message: 'User created successfully',
        data: {
          user: userCreated,
        },
      };
    
    } catch (error) {
      throw new BadRequestException(
        'No se pudo crear el usuario. Error: ' + error.message,
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req,
    @Body() loginUserDto: LoginDto,
  ): Promise<ContectDto> {
    this.logger.logRequest(req);
    const { email, password } = loginUserDto;
    const token = await this.authService.login({email, password});

    if (!token) {
      throw new BadRequestException('Email o contraseña incorrectos');
    }

    return {
      status: 'success',
      message: 'User logged in successfully',
      data: { access_token: token },
    };
  }
}
