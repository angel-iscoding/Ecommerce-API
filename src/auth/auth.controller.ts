import { CreateUserRequestDto } from '@/database/dto/request/create-user-request.dto';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponseDto } from '@/database/dto/response/api-base-response.dto';
import { LoginUserRequestDto } from '@/database/dto/request/login-user-request.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body() user: CreateUserRequestDto,
  ): Promise<ApiResponseDto> {
    try {
      const { user: userCreated, token } = await this.authService.register(user);
      
      return {
        status: 'success',
        message: 'User created successfully',
        data: {
          user: userCreated,
          token
        },
      };
    
    } catch (error) {
      throw new BadRequestException(
        'Warning: ' + error.message,
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserRequestDto,
  ): Promise<ApiResponseDto> {
    try {
      const token = await this.authService.login(loginUserDto);
    
      if (!token) {
      throw new BadRequestException('Email or password incorrect');
    }
    return {
      status: 'success',
      message: 'User logged in successfully',
      data: { access_token: token },
    };
    } catch (error) {
      throw new BadRequestException(
        'Warning: ' + error.message,
      );
    }
  }
}
