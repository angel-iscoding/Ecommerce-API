// roles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { Role } from '@/database/entities/role.entity';
import { RoleNames } from '@/config/role-names.enum';
import { UsersService } from '@/users-management/users/users.service';
import { UserBaseResponseDto } from '@/database/dto/response/user-base-response.dto';

@Injectable()
export class RolesService {
  constructor(
    private RolesRepository: RolesRepository,
    private UsersService: UsersService,
  ) {}
  
  async findAll(): Promise<Role[]> {
    return await this.RolesRepository.findAll();
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.RolesRepository.findById(id);

    if (!role) throw new NotFoundException('Role not found');
  
    return role;
  }
  
  async findByName(name: RoleNames): Promise<Role | null> {
    const role = await this.RolesRepository.findByName(name);
    
    if (!role) throw new NotFoundException('Role not found');
    
    return role;
  }
  
  async create(name: RoleNames): Promise<Role> {
    return this.RolesRepository.create(name);
  }
  
  async thisRoleExist(name: RoleNames): Promise<boolean> {
    const role = await this.RolesRepository.findByName(name);
    return !!role;
  }
  
  async assignRole(userId: string, roleId: string): Promise<UserBaseResponseDto> {
    const user = await this.UsersService.findById(userId);
    const role = await this.findById(roleId);
    
    user.role = role;
    const updatedUser = await this.UsersService.update(user.id, user);
  
    return updatedUser;
  }
  
  async getDefaultRole(): Promise<Role> {
    return this.RolesRepository.findByName(RoleNames.User);
  }


}
