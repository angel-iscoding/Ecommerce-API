import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/config/role.enum';
import { SignUpDto } from 'src/database/auth/sign-up.dto';
import { PayloadDto } from 'src/database/users/payload.dto';
import { User } from 'src/database/users/user.entity';
import { UsersService } from 'src/user-management/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<Omit<User, 'password'> | undefined> {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const isAdmin: boolean = signUpDto.role === Role.Admin;

    const user: User = await this.usersService.createUser({
      ...signUpDto,
      password: hashedPassword,
      admin: isAdmin,
    });

    return user;
  }

  async signIn(email: string, password: string): Promise<string | null> {
    const user: User = await this.usersService.comparePassword(email, password);

    const payload: PayloadDto = {
      email: user.email,
      id: user.id,
      roles: user.roles,
    };
    return this.jwtService.sign(payload, {
      secret: `${process.env.JWT_SECRET}`,
    });
  }
}
