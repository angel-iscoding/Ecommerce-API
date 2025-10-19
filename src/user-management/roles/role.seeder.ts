// role.seeder.ts
import { Injectable } from '@nestjs/common';
import { RoleNames } from '@/config/role-names.enum';
import { RoleService } from './role.service';
import { Role } from '@/database/entities/role.entity';

@Injectable()
export class RoleSeeder {
  constructor(private readonly roleService: RoleService) {}

  async seed(): Promise<void> {
    const rolesToSeed = Object.values(RoleNames);
    
    for (const roleName of rolesToSeed) {
      const existingRole: Role | null = await this.roleService.getRoleByName(roleName)
      
      if (!existingRole) {
        await this.roleService.createRole(roleName);
      }
    }
  }
}