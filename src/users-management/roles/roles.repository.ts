import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@/database/entities/role.entity';
import { RoleNames } from '@/config/role-names.enum';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async findById(id: string): Promise<Role | null> {
    return await this.rolesRepository.findOne({ where: { id } });
  }
  
  async findByName(roleName: RoleNames): Promise<Role> {
    return await this.rolesRepository.findOne({ where: { name: roleName } });
  }

  async create(roleName: RoleNames): Promise<Role> {
    const role = this.rolesRepository.create({ name: roleName });
    return await this.rolesRepository.save(role);
  }

}
