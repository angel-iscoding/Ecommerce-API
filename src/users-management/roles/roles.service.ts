// roles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { Role } from '@/database/entities/role.entity';
import { RoleNames } from '@/config/role-names.enum';

@Injectable()
export class RolesService {
  constructor(private RolesRepository: RolesRepository) {}

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

  async thisRoleExist(name: RoleNames): Promise<boolean> {
    const role = await this.RolesRepository.findByName(name);
    return !!role;
  }

  async getDefaultRole(): Promise<Role> {
    return this.RolesRepository.findByName(RoleNames.User);
  }

  async create(name: RoleNames): Promise<Role> {
    return this.RolesRepository.create(name);
  }
}
