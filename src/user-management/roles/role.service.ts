// roles.service.ts
import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { Role } from '@/database/entities/role.entity';
import { RoleNames } from '@/config/role-names.enum';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async getAllRoles(): Promise<Role[]> {
    return await this.roleRepository.getAllRoles();
  }

  async getRoleById(id: number): Promise<Role | null> {
    return await this.roleRepository.getRoleById(id);
  }

  getRoleByName(roleName: RoleNames): Promise<Role | null> {
    return this.roleRepository.getRoleByName(roleName);
  }

  createRole(roleName: RoleNames): Promise<Role> {
    return this.roleRepository.createRole(roleName);
  }
}
