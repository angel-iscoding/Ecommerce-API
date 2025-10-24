import { User } from '@/database/entities/user.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './users.repository';
import { UserBaseResponseDto } from '@/database/dto/response/user-base-response.dto';
import { CreateUserRequestDto } from '@/database/dto/request/create-user-request.dto';
import { RolesService } from '../roles/roles.service';
import { IUser } from '@/utils/logger/interfaces/user.interface';
import { UpdateUserRequestDto } from '@/database/dto/request/update-user-request.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesService: RolesService,
  ) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return await this.usersRepository.findAll();
  }
  
  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user
  }

  async findByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user
  }
  
  async findCompleteById(id: string): Promise<User | null> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user
  }
  
  async findCompleteByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user
  }
  
  async thisUserExist(email: string): Promise<boolean> {
    const user = await this.usersRepository.findByEmail(email);
    return !!user;
  }
  
  async validateCredentials(password: string, confirmPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, confirmPassword);
    
    if (isMatch) return true;
    return false;
  }
  
  async create(CreateUserRequestDto: CreateUserRequestDto): Promise<UserBaseResponseDto> {
    const existingUser = await this.thisUserExist(CreateUserRequestDto.email);
    
    if (existingUser) {
      throw new ConflictException('The user already exists');
    }
    
    if (CreateUserRequestDto.password !== CreateUserRequestDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    
    const hashedPassword = await bcrypt.hash(CreateUserRequestDto.password, 12);

    const role = await this.rolesService.getDefaultRole();
    
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    
    const userData: IUser = {
      name: CreateUserRequestDto.name,
      email: CreateUserRequestDto.email,
      password: hashedPassword,
      address: CreateUserRequestDto.address,
      phone: CreateUserRequestDto.phone,
      country: CreateUserRequestDto.country,
      city: CreateUserRequestDto.city,
      role: role
    };
    
    const user = await this.usersRepository.create(userData);
    return this.toUserResponse(user);
  }

  async update(
    id: string,
    updatedUser: UpdateUserRequestDto,
  ): Promise<Omit<User, 'password'> | null> {
    const user: User = await this.findCompleteById(id);
    
    const updateData: Partial<User> = {
      name: updatedUser.name,
      address: updatedUser.address,
      phone: updatedUser.phone,
      country: updatedUser.country,
      city: updatedUser.city,
    };
    
    return await this.usersRepository.update(user, updateData);
  }

  async assignRole(userId: string, roleId: string): Promise<UserBaseResponseDto> {
    const user = await this.findById(userId);
    const role = await this.rolesService.findById(roleId);
    
    user.role = role;
    const updatedUser = await this.update(user.id, user);

    return updatedUser; 
  }

  async remove(id: string): Promise<void> {
    const user: User = await this.findCompleteById(id);
    await this.usersRepository.delete(user);
  }
  
  private toUserResponse(user: User): UserBaseResponseDto {
    const { password, ...userResponse } = user;
    return userResponse as UserBaseResponseDto;
  }
}
