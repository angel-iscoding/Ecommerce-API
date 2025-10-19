import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PayloadDto } from '@/database/dto/payload.dto';
import { User } from '@/database/entities/user.entity';
import { UsersService } from 'src/user-management/users/user.service';
import { RegisterDto } from '@/database/dto/register.dto';
import { Role } from '@/database/entities/role.entity';
import { LoginDto } from '@/database/dto/login.dto';
import { RoleService } from '@/user-management/roles/role.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RoleService,
  ) {}

  async register(user: RegisterDto, role: Role): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const createdUser: User = await this.usersService.createUser(
      {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        address: user.address,
        phone: Number(user.phone),
        country: user.country,
        city: user.city,
      },
      role,
    );

    return createdUser;
  }

  async login(loginDto: LoginDto): Promise<string | null> {
    
    const user: User = await this.usersService.searchCompleteUserByEmail(loginDto.email);

    console.log('====================================');
    console.log(user);
    console.log('====================================');
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!await bcrypt.compare(loginDto.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const role = await this.rolesService.getRoleById(Number(user.role.id));

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
