import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@/database/entities/role.entity';
import { RoleNames } from '@/config/role-names.enum';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async getAllRoles(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async getRoleById(id: number): Promise<Role | null> {
    return await this.rolesRepository.findOne({ where: { id } });
  }
  
  getRoleByName(roleName: RoleNames): Promise<Role> {
    return this.rolesRepository.findOne({ where: { name: roleName } });
  }

  createRole(roleName: RoleNames): Promise<Role> {
    const role = this.rolesRepository.create({ name: roleName });
    return this.rolesRepository.save(role);
  }

}
