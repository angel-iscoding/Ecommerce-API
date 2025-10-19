// role.seeder.ts
import { Injectable } from '@nestjs/common';
import { RoleNames } from '@/config/role-names.enum';
import { RolesService } from './roles.service';
import { Role } from '@/database/entities/role.entity';

@Injectable()
export class RolesSeeder {
  constructor(private readonly RolesService: RolesService) {}

  async seed(): Promise<void> {
    const rolesToSeed = Object.values(RoleNames);
    
    for (const roleName of rolesToSeed) {
      const existingRole: Role | null = await this.RolesService.findByName(roleName)
      
      if (!existingRole) {
        await this.RolesService.create(roleName);
      }
    }
  }
}