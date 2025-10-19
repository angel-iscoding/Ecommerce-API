import { UserDto } from '@/database/dto/user.dto';
import { User } from '@/database/entities/user.entity';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './user.repository';
import { Role } from '@/database/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return await this.usersRepository.getAllUsers();
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    return await this.usersRepository.getUserById(id);
  }

  async findByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    return await this.usersRepository.findOneByEmail(email);
  }

  async searchCompleteUserById(id: string): Promise<User | null> {
    return await this.usersRepository.searchCompleteUserById(id);
  }

  async searchCompleteUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.searchCompleteUserByEmail(email);
  }

  async comparePassword(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.searchCompleteUserById(email);

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    return user;
  }

  async createUser(user: UserDto, role: Role): Promise<User> {
    const createdUser: User = await this.usersRepository.create(user, role);

    return createdUser;
  }

  async updateUser(
    user: User,
    updatedUser: UserDto,
  ): Promise<Omit<User, 'password'> | null> {
    const updateData: Partial<User> = {
      name: updatedUser.name,
      address: updatedUser.address,
      phone: updatedUser.phone,
      country: updatedUser.country,
      city: updatedUser.city,
    };

    return await this.usersRepository.updateUser(user, updateData);
  }

  async deleteUser(id: string): Promise<void> {
    await await this.usersRepository.deleteUser(id);
  }
}
