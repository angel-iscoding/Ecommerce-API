import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PayloadDto } from '@/database/dto/payload.dto';
import { UsersService } from '@/users-management/users/users.service';
import { CreateUserRequestDto } from '@/database/dto/request/create-user-request.dto';
import { RolesService } from '@/users-management/roles/roles.service';
import { UserBaseResponseDto } from '@/database/dto/response/user-base-response.dto';
import { LoginUserRequestDto } from '@/database/dto/request/login-user-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
  ) {}

  async register(userData: CreateUserRequestDto): Promise<{ user: UserBaseResponseDto; token: string }> {
    const createdUser: UserBaseResponseDto = await this.usersService.create(userData);

    const token = await this.login({
      email: createdUser.email,
      password: userData.password,
    })    

    return { user: createdUser, token };
  }

  async login(credentials: LoginUserRequestDto): Promise<string | null> {
    
    const user = await this.usersService.findCompleteByEmail(credentials.email);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!await bcrypt.compare(credentials.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const role = await this.rolesService.findById(user.role.id);

    const payload: PayloadDto = {
      email: user.email,
      id: user.id,
      role: role.name,
    };
    console.log(payload);
    return this.jwtService.sign(payload, {
      secret: `${process.env.JWT_SECRET}`,
    });
  }
}
